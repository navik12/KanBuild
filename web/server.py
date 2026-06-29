#!/usr/bin/env python3
# ============================================================
# KanBuild — web/server.py
# PURPOSE: A small backend that serves the web page AND saves
#          projects, companies, and bids into the real SQLite
#          database (database/kanbuild.db) so they last forever.
# SKILL DEMONSTRATED: Full-stack — a Python backend + REST API
#                     connected to a database.
# USES ONLY THE PYTHON STANDARD LIBRARY (no pip install needed).
#
# HOW TO RUN:
#   1. Build the database first (one time):  bash database/build.sh
#   2. Start the server:                      python3 web/server.py
#   3. Open in your browser:                  http://localhost:8000
# ============================================================

import json
import sqlite3
from datetime import date
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

# Folders: this file lives in web/, the database is in database/
BASE = Path(__file__).resolve().parent
DB = BASE.parent / "database" / "kanbuild.db"
PORT = 8000


# ---- Database helpers ----

def db():
    """Open a connection with foreign keys on and row access by name."""
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def get_data():
    """Read everything the web page needs, as plain dictionaries."""
    conn = db()
    projects = [
        {"id": r["project_id"], "name": r["name"], "county": r["county"],
         "budget": r["budget"], "status": r["status"]}
        for r in conn.execute("SELECT * FROM projects ORDER BY project_id")
    ]
    contractors = [
        {"id": r["contractor_id"], "name": r["company_name"]}
        for r in conn.execute("SELECT * FROM contractors ORDER BY company_name")
    ]
    # Join bids to contractors so each bid carries the company name
    bids = [
        {"projectId": r["project_id"], "company": r["company_name"], "amount": r["bid_amount"]}
        for r in conn.execute(
            "SELECT b.project_id, b.bid_amount, c.company_name "
            "FROM bids b JOIN contractors c ON b.contractor_id = c.contractor_id "
            "ORDER BY b.bid_id"
        )
    ]
    conn.close()
    return {"projects": projects, "contractors": contractors, "bids": bids}


def find_or_create_contractor(conn, name):
    """Return the contractor_id for a company name, creating it if new."""
    name = name.strip()
    row = conn.execute(
        "SELECT contractor_id FROM contractors WHERE lower(company_name) = lower(?)",
        (name,),
    ).fetchone()
    if row:
        return row["contractor_id"]
    cur = conn.execute(
        "INSERT INTO contractors (company_name, city, state, certified) "
        "VALUES (?, 'Unknown', 'KS', 0)",
        (name,),
    )
    return cur.lastrowid


def add_bid(payload):
    conn = db()
    contractor_id = find_or_create_contractor(conn, payload["company"])
    conn.execute(
        "INSERT INTO bids (project_id, contractor_id, bid_amount, bid_date) "
        "VALUES (?, ?, ?, ?)",
        (int(payload["projectId"]), contractor_id,
         float(payload["amount"]), date.today().isoformat()),
    )
    conn.commit()
    conn.close()


def add_project(payload):
    conn = db()
    conn.execute(
        "INSERT INTO projects (name, county, budget, status) VALUES (?, ?, ?, ?)",
        (payload["name"].strip(), payload["county"].strip(),
         float(payload["budget"]), payload["status"]),
    )
    conn.commit()
    conn.close()


def add_contractor(payload):
    conn = db()
    find_or_create_contractor(conn, payload["name"])  # skips if it already exists
    conn.commit()
    conn.close()


# ---- The web server ----

class Handler(BaseHTTPRequestHandler):
    def _json(self, obj, code=200):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _file(self, filename, content_type):
        path = BASE / filename
        if not path.exists():
            self.send_error(404)
            return
        data = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path == "/api/data":
            try:
                self._json(get_data())
            except Exception as e:
                self._json({"error": str(e)}, 500)
        elif self.path in ("/", "/index.html"):
            self._file("index.html", "text/html; charset=utf-8")
        elif self.path == "/app.js":
            self._file("app.js", "application/javascript; charset=utf-8")
        else:
            self.send_error(404)

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b"{}"
        try:
            payload = json.loads(raw or b"{}")
        except json.JSONDecodeError:
            self._json({"error": "Invalid JSON"}, 400)
            return
        try:
            if self.path == "/api/bids":
                add_bid(payload)
            elif self.path == "/api/projects":
                add_project(payload)
            elif self.path == "/api/contractors":
                add_contractor(payload)
            else:
                self.send_error(404)
                return
            self._json({"ok": True})
        except Exception as e:
            self._json({"error": str(e)}, 400)

    def log_message(self, *args):
        pass  # keep the terminal quiet


def main():
    if not DB.exists():
        print("⚠ Database not found at", DB)
        print("  Build it first by running:  bash database/build.sh")
        return
    server = HTTPServer(("localhost", PORT), Handler)
    print("✅ KanBuild server is running!")
    print(f"   Open this in your browser:  http://localhost:{PORT}")
    print("   Bids you add are saved into database/kanbuild.db")
    print("   Press Ctrl+C to stop.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped.")


if __name__ == "__main__":
    main()
