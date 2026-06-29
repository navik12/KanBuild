# KanBuild — Requirements

This is where I wrote down what the project needs to do before building
it — the planning step. Doing this first made the rest much easier.

## Purpose
A small system to manage highway construction projects and the bids that
contractors submit to build them — a simple version of AASHTOWare Project.

## Who would use it
| User | What they need |
|------|----------------|
| Manager | See projects, budgets, and winning bids in a report |
| Bidding admin | Review bids and confirm the lowest qualified bidder |
| Contractor | View open projects and submit a bid |
| Analyst | Pull the data, check it, and build reports |

## What it needs to do
- **R1** Store projects (name, county, budget, dates, status).
- **R2** Store contractors and whether they are certified.
- **R3** Record bids that link a contractor to a project.
- **R4** Track materials and quantities used per project.
- **R5** Report the lowest (winning) bid per project.
- **R6** Compare the winning bid against the budget (over or under).
- **R7** Run data checks (missing dates, bids over budget).
- **R8** Show the projects and a bid form on a web page.

## Business rules
- A bid must point to a project and contractor that actually exist.
- Project status is one of: Planned, Bidding, Awarded, In Progress, Complete.
- A bid that's over the project budget is flagged for review (not blocked).

## Not included (to keep it simple)
- Logins or user accounts
- Saving bids from the web page into the live database
- Payments or invoicing
