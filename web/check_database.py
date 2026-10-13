"""Read-only connection and schema check; never imports or modifies records."""
from app import db
import pymysql

required = {'company','drugs','expiry','history_sales','inbox','login','message_history','purchase','sales','users'}
try:
    connection = db()
    try:
        with connection.cursor() as cur:
            cur.execute('SELECT VERSION() AS version, @@port AS port, DATABASE() AS db')
            info = cur.fetchone()
            print(f"Connected: {info['version']} on port {info['port']}, database {info['db']}")
            cur.execute('SHOW TABLES')
            found = {next(iter(row.values())) for row in cur.fetchall()}
            missing = required - found
            if missing:
                print('Missing tables: '+', '.join(sorted(missing)))
                raise SystemExit(1)
            for name in sorted(required):
                cur.execute('SELECT COUNT(*) AS total FROM `'+name+'`')
                print(f"{name}: {cur.fetchone()['total']} rows")
        print('PASS: connection and all 10 required tables verified. Connection is ready for the pharmacy web app.')
    finally:
        connection.close()
except pymysql.MySQLError as error:
    code = error.args[0] if error.args else 'unknown'
    print(f'Database check failed (code {code}). Check your MySQL Windows service, web/.env, credentials, and imported database.')
    raise SystemExit(1)
