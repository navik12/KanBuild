#!/bin/bash
# ============================================================
# KanBuild — build.sh
# Builds the SQLite database from scratch and runs all reports.
# Usage:  bash database/build.sh
# ============================================================
set -e
cd "$(dirname "$0")"          # move into the database/ folder

DB="kanbuild.db"

echo "==> Removing old database (if any)..."
rm -f "$DB"

echo "==> Creating tables (01_schema.sql)..."
sqlite3 "$DB" < 01_schema.sql

echo "==> Loading sample data (02_sample_data.sql)..."
sqlite3 "$DB" < 02_sample_data.sql

echo "==> Database built: database/$DB"
echo ""
echo "==> Running all reports (03_queries.sql):"
echo "------------------------------------------------------------"
sqlite3 "$DB" < 03_queries.sql

echo ""
echo "==> Done. Open it yourself with:   sqlite3 database/$DB"
