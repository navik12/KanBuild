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
Double-click `web/index.html`, or run a local server:
```bash
python3 -m http.server 8000
# then open http://localhost:8000/web/ in your browser
```

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
