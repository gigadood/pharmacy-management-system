# Pharmacy Management System

A local pharmacy workspace with a browser frontend, a Flask backend, and a MySQL database. Developed by Arnav Shukla as a student DBMS project.

## Features

- **Today** page that sums up the day in a sentence (takings, expired, low and soon-to-expire stock, each linking to a filtered list), a 14-day sales chart, a "needs attention" list and the latest sales.
- **Shelf wall**: every drawer (A-01, B-04, …) drawn as a cabinet, filled by how much stock is left and marked by status. Select a drawer to open the product.
- **Counter** with a bill: scan or type a barcode and press Enter, or search and pick with the arrow keys; adjust quantities; dispense the whole bill and get a printable receipt.
- Product panel with stock level, margin, units sold in the last 30 days and a scannable Code 39 barcode.
- Inventory search with status filters (in stock, low or out, expiring within 30 days, expired), sortable columns and a shelves view.
- Administrator forms to add or edit products, receive stock (with a live "new stock level" preview) and add suppliers.
- Sales history grouped by day, supplier directory with each supplier's products, and a staff directory with 30-day sales.
- Command palette (Ctrl K / ⌘K) to jump to any product, page or action; light and dark themes; works on phones.
- Session-based login and logout, parameterized SQL, CSRF protection, and backend input validation.

## Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML, CSS and JavaScript |
| Backend | Python and Flask |
| Database | MySQL 8 / compatible MariaDB |
| Database driver | PyMySQL |
| Development | VS Code and MySQL Workbench |

XAMPP, Apache and PHP are not required. MySQL Server must run separately; Workbench and VS Code are clients/development tools.

## Setup on Windows

Install Python 3.11 or later and MySQL Server. MySQL Workbench and VS Code are optional conveniences.

### 1. Create the demo database

In MySQL Workbench, open `database/Pharmacy-Demo-Data.sql` and execute the script once. It creates a new schema named `pharmacy_demo`. If that schema already exists, stop instead of running the script again. No existing databases are dropped.

The synthetic dataset contains 70 products on seven shelves, 8 suppliers, 5 staff accounts, 70 accumulated purchase records, and 183 historical sales across 30 days. Shelves A to D hold 40 medicines; shelves E to G hold 30 everyday pharmacy items (emergency contraceptive pills, condoms, lubricants, pregnancy tests, sanitary pads, antiseptics, soap, sanitiser, deodorants, toothpaste, wipes and first-aid supplies), which have stock but no sales history yet. It includes low stock, zero stock, expired medicines and near-expiry stock. Dates are calculated relative to the import day, and stock quantities reconcile with purchase and sales records. Prices, identities and transactions are demo examples, not real business data. The everyday items use common retail brand names with approximate prices, not live MRPs.

### 2. Configure the connection

Copy `web/.env.example` to `web/.env` and set your database password:

```ini
PHARMACY_DB_HOST=127.0.0.1
PHARMACY_DB_PORT=3306
PHARMACY_DB_NAME=pharmacy_demo
PHARMACY_DB_USER=root
PHARMACY_DB_PASSWORD="your_local_mysql_password"
PHARMACY_WEB_PORT=5000
```

Your actual `.env` file is ignored by Git. Keep it on your computer; do not upload it. The MySQL password differs from the app login password.

### 3. Run from the project root

Open a terminal in the folder containing `web`:

```powershell
py -3 -m venv web/.venv
web/.venv/Scripts/python.exe -m pip install -r web/requirements.txt
web/.venv/Scripts/python.exe web/check_database.py
web/.venv/Scripts/python.exe web/app.py
```

Open **http://127.0.0.1:5000** and keep the terminal open while using the app.

Alternatively, double-click `start-mysql-web.bat`. On the first run it creates `.env` from the example for you to edit, then starts the project on the next run.

**Demo login:** staff ID `1`, password `admin`. Staff IDs `2`–`5` use the demo password `demo123`.

### VS Code

Open this repository folder, install the recommended Microsoft Python extensions, and select `web/.venv/Scripts/python.exe` through **Python: Select Interpreter**. Press F5 and select **Run Pharmacy (Flask + MySQL)** to debug.

For Linux/macOS, create and activate a Python virtual environment, install `web/requirements.txt`, configure `web/.env`, and run `python web/app.py`.

## Project files

| Path | Purpose |
| --- | --- |
| `web/app.py` | Flask routes, sessions and database operations |
| `web/static/` | Browser interface |
| `web/check_database.py` | Read-only connection and table-count check |
| `web/.env.example` | Connection settings template |
| `database/Pharmacy-Demo-Data.sql` | Schema and synthetic demo data |
| `.vscode/` | Windows interpreter and debugger configuration |

## Database design and limitations

The app preserves the original ten-table schema. A barcode identifies one medicine record and one expiry date; there is no separate batch model. Purchases accumulate per barcode because `purchase.BARCODE` is a primary key. Sales save into `sales` and `history_sales`, reducing inventory in the same transaction.

This is a local student application. The original plaintext-password format is retained for schema compatibility. Flask runs on loopback using its development server. Public deployment would require password hashing, a production server and further security work. The counter's bill saves each product as its own sale, because the sales API accepts one barcode per request; if one line fails, the others are still recorded and the failed line stays on the bill with the reason. Tax invoices, staff editing, password changes, messaging, and batch tracking are not implemented. Receipts are transaction receipts, not GST tax invoices. Amounts are displayed in INR.

## Verification

The backend and demo SQL were tested against a disposable MariaDB instance: login, CSRF, permissions, read APIs, medicine editing, duplicate handling, sale amounts, quantity checks, expired-stock rejection and transactional restocking. Demo data was checked for table counts and stock reconciliation. The project has also connected to standalone MySQL 8.0.46 on the developer's Windows machine. The browser interface was walked through in headless Chrome at desktop and phone widths, in light and dark themes, as both the administrator and a regular staff member: sign-in, every page, the shelf wall, product panel, command palette, forms, the bill and receipt (with sale responses simulated so the database was not changed). It has not been exhaustively tested across browsers.

## Acknowledgment

The database schema originated from [syedibrahim/Pharmacy-Management-System](https://github.com/syedibrahim/Pharmacy-Management-System). The Flask backend, browser interface and synthetic demo dataset were created for this version with AI assistance. Original authorship of the schema is retained; this repository does not claim the original Java project as new work.
