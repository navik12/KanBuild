#!/usr/bin/env bash
# ============================================================
# KanBuild — update_dashboard.sh
# PURPOSE: One command to refresh the dashboard data.
#          It re-builds the analysis CSV from the database and
#          pushes it to GitHub. The Google Sheet then pulls the
#          new CSV automatically, and Looker Studio refreshes
#          from the Sheet — so you don't touch either by hand.
#
# RUN IT WITH:   bash update_dashboard.sh
# ============================================================
set -e
cd "$(dirname "$0")"   # move to the project folder

echo "1/3  Rebuilding the analysis CSV from the database..."
python3 analysis/analyze.py

echo "2/3  Saving the new data to git..."
git add analysis/project_report.csv
if git diff --cached --quiet; then
  echo "     (no data changes — nothing new to push)"
else
  git commit -m "Update dashboard data"
  echo "3/3  Pushing to GitHub..."
  git push
fi

echo ""
echo "✅ Done!"
echo "   • Your Google Sheet pulls this CSV from GitHub automatically (about hourly)."
echo "   • Looker Studio refreshes from the Sheet automatically (about every 15 min)."
echo "   • To see it now, open the Sheet and Looker and click their Refresh buttons."
