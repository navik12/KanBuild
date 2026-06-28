# KanBuild — User Guide (SDLC: Document / Train Phase)

> **Skill:** The JD includes "training co-workers" and writing
> documentation. This guide is that deliverable — a plain how-to.

## What is KanBuild?
A small app that tracks highway construction **projects** and the
**bids** contractors submit to build them. It's a learning clone of
**AASHTOWare Project**, the software Kansas DOT actually uses.

## What's inside
| Folder | What it holds |
|--------|---------------|
| `database/` | SQL files: tables, sample data, 20 reports, build script |
| `analysis/` | Python script that analyzes the data and exports a CSV |
| `web/` | A web page: project list + bid form |
| `docs/` | Requirements, test cases, this guide |

## How to run everything (3 steps)

### Step 1 — Build the database & see the reports
```bash
cd KanBuild
bash database/build.sh
```
This creates `database/kanbuild.db` and prints all 20 reports.

### Step 2 — Run the data analysis
```bash
python3 analysis/analyze.py
```
Prints a summary and writes `analysis/project_report.csv`.

### Step 3 — Open the web page
Double-click `web/index.html`, **or** run a local server:
```bash
python3 -m http.server 8000
# then open http://localhost:8000/web/ in your browser
```

## How to explore the data yourself
```bash
sqlite3 database/kanbuild.db      # opens the database
.tables                            # list all tables
.headers on
.mode column
SELECT * FROM projects;            # try your own queries!
.quit                              # exit
```

## Build a BI dashboard (free)
1. Open **Google Looker Studio** (free, web-based).
2. Create a data source → upload `analysis/project_report.csv`.
3. Add charts: budget by county, winning bid vs. budget, projects by status.
4. That's your "Crystal Reports / BI" deliverable from the JD.
