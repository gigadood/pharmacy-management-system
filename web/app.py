import os
import secrets
import hmac
from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from functools import wraps

import pymysql
from flask import Flask, jsonify, request, session
from flask.json.provider import DefaultJSONProvider
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).with_name('.env'))


class PharmacyJSON(DefaultJSONProvider):
    def default(self, value):
        if isinstance(value, (date, datetime)):
            return value.isoformat()
        if isinstance(value, Decimal):
            return float(value)
        return super().default(value)

app = Flask(__name__, static_folder='static', static_url_path='/static')
app.json = PharmacyJSON(app)
app.secret_key = os.environ.get('PHARMACY_SESSION_SECRET') or secrets.token_hex(32)
app.config.update(SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SAMESITE='Strict', MAX_CONTENT_LENGTH=100_000)


def db():
    return pymysql.connect(host=os.environ.get('PHARMACY_DB_HOST', '127.0.0.1'),
        port=int(os.environ.get('PHARMACY_DB_PORT', '3306')),
        user=os.environ.get('PHARMACY_DB_USER', 'root'),
        password=os.environ.get('PHARMACY_DB_PASSWORD', ''),
        database=os.environ.get('PHARMACY_DB_NAME', 'pharmacy_demo'),
        charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor,
        connect_timeout=5, read_timeout=10, write_timeout=10)


def rows(sql, args=()):
    c = db()
    try:
        with c.cursor() as cur:
            cur.execute(sql, args or None)
            return cur.fetchall()
    finally:
        c.close()


def payload():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        raise ValueError('Send a valid JSON object.')
    return data


def text(data, key, limit, optional=False):
    value = str(data.get(key, '')).strip()
    if (not value and not optional) or len(value) > limit:
        raise ValueError(f'{key.replace("_", " ").title()} is required and must fit within {limit} characters.')
    return value


def number(data, key, integer=False, positive=False):
    try:
        value = Decimal(str(data.get(key, '')))
        if not value.is_finite() or value < 0 or value > 1_000_000_000:
            raise InvalidOperation
        if positive and value <= 0:
            raise InvalidOperation
        if integer and value != value.to_integral_value():
            raise InvalidOperation
        return int(value) if integer else value.quantize(Decimal('.01'))
    except (InvalidOperation, ValueError):
        raise ValueError(f'{key.replace("_", " ").title()} must be a valid {"positive " if positive else "non-negative "}{"whole number" if integer else "amount"}.')


def protected(admin=False):
    def decorator(fn):
        @wraps(fn)
        def wrapped(*args, **kwargs):
            if not session.get('user'):
                return jsonify(error='Please sign in.'), 401
            if admin and session['user']['id'] != 1:
                return jsonify(error='Administrator access required.'), 403
            return fn(*args, **kwargs)
        return wrapped
    return decorator


@app.before_request
def csrf_check():
    if request.path.startswith('/api/') and request.method != 'GET':
        expected = session.get('csrf', '')
        actual = request.headers.get('X-CSRF-Token', '')
        if not expected or not hmac.compare_digest(expected, actual):
            return jsonify(error='Session expired. Refresh the page and try again.'), 403


@app.errorhandler(ValueError)
def invalid(e):
    return jsonify(error=str(e)), 400


@app.errorhandler(pymysql.MySQLError)
def database_error(e):
    app.logger.warning('Database error: %s', e)
    if isinstance(e, pymysql.IntegrityError):
        return jsonify(error='This record already exists or conflicts with a related record.'), 409
    return jsonify(error='Database unavailable. Check that your MySQL service is running and that web/.env has the correct host, port, user, password, and database.'), 503


@app.get('/')
def index():
    return app.send_static_file('index.html')


@app.get('/api/session')
def whoami():
    session.setdefault('csrf', secrets.token_hex(32))
    return jsonify(user=session.get('user'), csrf=session['csrf'])


@app.post('/api/login')
def login():
    data = payload()
    user_id = number(data, 'id', integer=True, positive=True)
    password = text(data, 'password', 20)
    found = rows('SELECT ID, NAME, PASSWORD FROM users WHERE ID=%s', (user_id,))
    if not found or not hmac.compare_digest(found[0]['PASSWORD'].encode(), password.encode()):
        return jsonify(error='Incorrect ID or password.'), 401
    session.clear()
    session['user'] = {'id': found[0]['ID'], 'name': found[0]['NAME']}
    session['csrf'] = secrets.token_hex(32)
    return jsonify(user=session['user'], csrf=session['csrf'])


@app.post('/api/logout')
def logout():
    session.clear()
    return jsonify(ok=True)


@app.get('/api/overview')
@protected()
def overview():
    stock = rows('SELECT COUNT(*) products, COALESCE(SUM(QUANTITY),0) units, COALESCE(SUM(QUANTITY*COST_PRICE),0) value, SUM(QUANTITY<=10) low_stock, SUM(EXPIRATION_DATE<CURDATE()) expired FROM drugs')[0]
    stock['sales_today'] = rows('SELECT COALESCE(SUM(AMOUNT),0) amount FROM history_sales WHERE DATE=%s', (date.today().strftime('%d-%m-%Y'),))[0]['amount']
    return jsonify(stats=stock, recent=rows('SELECT * FROM history_sales ORDER BY STR_TO_DATE(DATE,\'%d-%m-%Y\') DESC, TIME DESC LIMIT 6'), alerts=rows('SELECT NAME, BARCODE, QUANTITY, EXPIRATION_DATE FROM drugs WHERE QUANTITY<=10 OR EXPIRATION_DATE<=DATE_ADD(CURDATE(),INTERVAL 30 DAY) ORDER BY EXPIRATION_DATE LIMIT 12'))


@app.get('/api/drugs')
@protected()
def drugs():
    return jsonify(rows('SELECT * FROM drugs ORDER BY NAME'))


@app.post('/api/drugs')
@protected(admin=True)
def save_drug():
    d = payload()
    fields = {'NAME':50,'TYPE':20,'BARCODE':20,'DOSE':10,'CODE':10,'COMPANY_NAME':50,'PLACE':20}
    vals = {key:text(d,key,limit) for key,limit in fields.items()}
    vals['COST_PRICE'] = number(d,'COST_PRICE')
    vals['SELLING_PRICE'] = number(d,'SELLING_PRICE')
    vals['QUANTITY'] = number(d,'QUANTITY',integer=True)
    try:
        vals['PRODUCTION_DATE'] = date.fromisoformat(d['PRODUCTION_DATE'])
        vals['EXPIRATION_DATE'] = date.fromisoformat(d['EXPIRATION_DATE'])
    except (ValueError, KeyError, TypeError):
        raise ValueError('Enter valid production and expiry dates.')
    if vals['EXPIRATION_DATE'] <= vals['PRODUCTION_DATE']:
        raise ValueError('Expiry date must be after production date.')
    vals['EXPIRY'] = 'Expired' if vals['EXPIRATION_DATE'] < date.today() else 'Available for use'
    c = db()
    try:
        with c.cursor() as cur:
            cur.execute('SELECT NAME FROM company WHERE NAME=%s', (vals['COMPANY_NAME'],))
            if not cur.fetchone():
                raise ValueError('Select an existing company, or add it first.')
            original = d.get('original_barcode')
            if original:
                if original != vals['BARCODE']:
                    raise ValueError('Barcode cannot be changed on an existing medicine.')
                cur.execute('SELECT BARCODE FROM drugs WHERE BARCODE=%s FOR UPDATE', (original,))
                if not cur.fetchone():
                    raise ValueError('Medicine no longer exists.')
                keys = [k for k in vals if k != 'BARCODE']
                cur.execute('UPDATE drugs SET '+','.join(k+'=%s' for k in keys)+' WHERE BARCODE=%s', [vals[k] for k in keys]+[original])
            else:
                keys = list(vals)
                cur.execute('INSERT INTO drugs ('+','.join(keys)+') VALUES ('+','.join(['%s']*len(keys))+')',[vals[k] for k in keys])
        c.commit()
    except Exception:
        c.rollback()
        raise
    finally:
        c.close()
    return jsonify(ok=True)


@app.get('/api/companies')
@protected()
def companies():
    return jsonify(rows('SELECT * FROM company ORDER BY NAME'))


@app.post('/api/companies')
@protected(admin=True)
def save_company():
    d = payload()
    values = [text(d,'NAME',50),text(d,'ADDRESS',50),text(d,'PHONE',20)]
    c = db()
    try:
        with c.cursor() as cur:
            cur.execute('INSERT INTO company (NAME,ADDRESS,PHONE) VALUES (%s,%s,%s)',values)
        c.commit()
    finally:
        c.close()
    return jsonify(ok=True)


@app.get('/api/sales')
@protected()
def sales():
    return jsonify(rows('SELECT * FROM history_sales ORDER BY STR_TO_DATE(DATE,\'%d-%m-%Y\') DESC, TIME DESC LIMIT 1000'))


@app.post('/api/sales')
@protected()
def create_sale():
    d = payload()
    barcode = text(d,'BARCODE',20)
    qty = number(d,'QUANTITY',integer=True,positive=True)
    c = db()
    try:
        with c.cursor() as cur:
            cur.execute('SELECT * FROM drugs WHERE BARCODE=%s FOR UPDATE',(barcode,))
            drug = cur.fetchone()
            if not drug: raise ValueError('Medicine not found.')
            if drug['EXPIRATION_DATE'] < date.today(): raise ValueError('Expired medicine cannot be sold.')
            if drug['QUANTITY'] < qty: raise ValueError('Insufficient stock.')
            if len(drug['TYPE']) > 10: raise ValueError('This database limits sales medicine types to 10 characters. Shorten the medicine type before selling.')
            price = Decimal(str(drug['SELLING_PRICE'])).quantize(Decimal('.01'))
            amount = price*qty
            today = date.today().strftime('%d-%m-%Y')
            values = (barcode,drug['NAME'],drug['TYPE'],drug['DOSE'],qty,price,amount,today)
            cur.execute('INSERT INTO sales (BARCODE,NAME,TYPE,DOSE,QUANTITY,PRICE,AMOUNT,DATE) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)',values)
            cur.execute('INSERT INTO history_sales (USER_NAME,BARCODE,NAME,TYPE,DOSE,QUANTITY,PRICE,AMOUNT,DATE,TIME) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)',(session['user']['name'],)+values+(datetime.now().strftime('%H:%M:%S'),))
            cur.execute('UPDATE drugs SET QUANTITY=QUANTITY-%s WHERE BARCODE=%s',(qty,barcode))
        c.commit()
        return jsonify(ok=True, receipt={'name':drug['NAME'],'quantity':qty,'price':str(price),'amount':str(amount),'date':today,'staff':session['user']['name']})
    except Exception:
        c.rollback()
        raise
    finally:
        c.close()


@app.get('/api/purchases')
@protected()
def purchases():
    return jsonify(rows('SELECT * FROM purchase ORDER BY NAME'))


@app.post('/api/purchases')
@protected(admin=True)
def restock():
    d = payload()
    barcode = text(d,'BARCODE',20)
    qty = number(d,'QUANTITY',integer=True,positive=True)
    price = number(d,'PRICE')
    c = db()
    try:
        with c.cursor() as cur:
            cur.execute('SELECT * FROM drugs WHERE BARCODE=%s FOR UPDATE',(barcode,))
            drug = cur.fetchone()
            if not drug: raise ValueError('Add this medicine to inventory first.')
            if drug['EXPIRATION_DATE'] < date.today(): raise ValueError('This medicine record has expired. Update its batch dates before adding current stock.')
            if len(drug['COMPANY_NAME'])>20: raise ValueError('This database limits purchase company names to 20 characters.')
            cur.execute('INSERT INTO purchase (BARCODE,NAME,TYPE,COMPANY_NAME,QUANTITY,PRICE,AMOUNT) VALUES (%s,%s,%s,%s,%s,%s,%s) ON DUPLICATE KEY UPDATE QUANTITY=QUANTITY+VALUES(QUANTITY), PRICE=VALUES(PRICE), AMOUNT=AMOUNT+VALUES(AMOUNT)',(barcode,drug['NAME'],drug['TYPE'],drug['COMPANY_NAME'],qty,price,price*qty))
            cur.execute('UPDATE drugs SET QUANTITY=QUANTITY+%s,COST_PRICE=%s WHERE BARCODE=%s',(qty,price,barcode))
        c.commit()
    except Exception:
        c.rollback()
        raise
    finally:
        c.close()
    return jsonify(ok=True)


@app.get('/api/users')
@protected(admin=True)
def users():
    return jsonify(rows('SELECT ID,NAME,DOB,ADDRESS,PHONE,SALARY FROM users ORDER BY ID'))


if __name__ == '__main__':
    print('Pharmacy web app: http://127.0.0.1:5000 — database port '+os.environ.get('PHARMACY_DB_PORT','3306'))
    app.run(host='127.0.0.1', port=int(os.environ.get('PHARMACY_WEB_PORT','5000')), debug=False)
