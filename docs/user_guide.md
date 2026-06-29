# KanBuild — User Guide

A short guide to what's in this project and how to run it.

## What KanBuild is
A small app that tracks highway construction projects and the bids
contractors submit to build them. It's a simple version of AASHTOWare
Project, the software state transportation departments use.

## What's inside
| Folder | What it holds |
|--------|---------------|
| `database/` | SQL files: tables, sample data, 20 reports, and a build script |
| `analysis/` | A Python script that analyzes the data and exports a CSV |
| `web/` | A web page with the project list and a bid form |
| `docs/` | Requirements, test cases, and this guide |

## How to run it (3 steps)

### Step 1 — Build the database and see the reports
```bash
cd KanBuild
bash database/build.sh
```
This creates `database/kanbuild.db` and prints all 20 reports.

### Step 2 — Run the data analysis
```bash
python3 analysis/analyze.py
```
This prints a summary and writes `analysis/project_report.csv`.

### Step 3 — Open the web page

**Option A — Save bids permanently (database mode):**
```bash
python3 web/server.py
# then open http://localhost:8000 in your browser
```
This runs a small Python backend that saves any project, company, or bid
you add straight into `database/kanbuild.db`, so it lasts after you close
the page. The page shows a green "Database mode" banner when it's working.

**Option B — Just look at it (demo mode):**
Double-click `web/index.html`. It works with the built-in sample data, but
anything you add resets when you refresh (a yellow "Demo mode" banner shows).

> After adding bids in database mode, you can re-run the SQL reports
> (`bash database/build.sh` shows them) or the Python analysis
> (`python3 analysis/analyze.py`) and they'll include your new bids.

## Exploring the data yourself
```bash
sqlite3 database/kanbuild.db      # open the database
.tables                            # list the tables
.headers on
.mode column
SELECT * FROM projects;            # try your own queries
.quit                              # exit
```

## Building the dashboard
1. Open Google Looker Studio.
2. Connect the data (upload `analysis/project_report.csv`, or import it into Google Sheets first and connect that).
3. Add charts: budget by project, projects by status, and savings per project.

A finished version of this dashboard is shown in the main README.
