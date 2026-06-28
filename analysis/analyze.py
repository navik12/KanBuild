#!/usr/bin/env python3
"""
============================================================
KanBuild — analysis/analyze.py
PURPOSE: Pull data from the SQLite database with Python +
         pandas, analyze it, and export a CSV for the dashboard.
SKILL DEMONSTRATED: Data analysis, pandas, connecting code to
                    a database (exactly the JD's "data analysis"
                    and "BI reporting" duties).
USAGE:   python3 analysis/analyze.py
============================================================
"""
import os
import sqlite3
import pandas as pd

# ---- locate the database (works no matter where you run from) ----
HERE = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(HERE, "..", "database", "kanbuild.db")

if not os.path.exists(DB_PATH):
    raise SystemExit(
        "Database not found. Build it first:\n   bash database/build.sh"
    )

# ---- connect ----
conn = sqlite3.connect(DB_PATH)

print("=" * 60)
print("KanBuild — Data Analysis Report")
print("=" * 60)

# ------------------------------------------------------------
# 1. Load tables straight into pandas DataFrames
# ------------------------------------------------------------
projects    = pd.read_sql_query("SELECT * FROM projects", conn)
bids        = pd.read_sql_query("SELECT * FROM bids", conn)
contractors = pd.read_sql_query("SELECT * FROM contractors", conn)

# ------------------------------------------------------------
# 2. Quick portfolio stats
# ------------------------------------------------------------
print(f"\nTotal projects        : {len(projects)}")
print(f"Total budget          : ${projects['budget'].sum():,.0f}")
print(f"Average budget        : ${projects['budget'].mean():,.0f}")
print(f"Total bids received   : {len(bids)}")
print(f"Certified contractors : {int(contractors['certified'].sum())} of {len(contractors)}")

# ------------------------------------------------------------
# 3. Projects per status (group-by, like SQL GROUP BY)
# ------------------------------------------------------------
print("\nProjects by status:")
print(projects.groupby("status").size().sort_values(ascending=False).to_string())

# ------------------------------------------------------------
# 4. Winning (lowest) bid per project + savings vs budget
#    This is the key "report" a manager wants.
# ------------------------------------------------------------
winning = (
    bids.groupby("project_id")["bid_amount"].min().reset_index()
    .rename(columns={"bid_amount": "winning_bid"})
)
report = projects.merge(winning, on="project_id", how="left")
report["savings"] = report["budget"] - report["winning_bid"]
report["budget_status"] = report["savings"].apply(
    lambda s: "No bids yet" if pd.isna(s)
    else ("Under budget" if s >= 0 else "OVER budget")
)

print("\nWinning bid vs. budget:")
view = report[["name", "budget", "winning_bid", "savings", "budget_status"]]
print(view.to_string(index=False))

# ------------------------------------------------------------
# 5. DATA VALIDATION (the JD's "data validation" duty)
# ------------------------------------------------------------
print("\nData-quality audit:")
missing_dates = projects[
    projects["start_date"].notna() & projects["end_date"].isna()
]
print(f"  - Projects missing an end_date : {len(missing_dates)}")
over_budget = report[report["budget_status"] == "OVER budget"]
print(f"  - Projects over budget         : {len(over_budget)}")

# ------------------------------------------------------------
# 6. Export a CSV — this feeds the BI dashboard (Looker Studio,
#    Excel, Google Sheets, etc.)
# ------------------------------------------------------------
out_path = os.path.join(HERE, "project_report.csv")
report.to_csv(out_path, index=False)
print(f"\nExported dashboard data -> {out_path}")

conn.close()
print("=" * 60)
print("Done.")
