# KanBuild — Requirements (SDLC: Plan Phase)

> **SDLC skill:** This document is the "Plan" phase of the System
> Development Life Cycle — you write down *what* the system must do
> **before** building it. (The JD lists "SDLC testing".)

## 1. Purpose
A small system to manage Kansas DOT highway construction projects and
the bids contractors submit — a teaching clone of **AASHTOWare Project**.

## 2. Users
| User | What they need |
|------|----------------|
| KDOT manager | See projects, budgets, and winning bids in a report |
| Bidding admin | Review bids; confirm the lowest qualified bidder |
| Contractor | View open projects and submit a bid |
| Data analyst (this role) | Pull data, validate it, build reports |

## 3. Functional requirements
- **R1** Store projects (name, county, budget, dates, status).
- **R2** Store contractors and whether they are certified.
- **R3** Record bids that link a contractor to a project.
- **R4** Track materials and quantities used per project.
- **R5** Report the lowest (winning) bid per project.
- **R6** Compare winning bid vs. budget (over/under).
- **R7** Run data-validation audits (missing dates, bids over budget).
- **R8** Show projects and a bid form on a web page.

## 4. Business rules
- A bid must reference an existing project and contractor.
- Project status is one of: Planned, Bidding, Awarded, In Progress, Complete.
- A bid over the project budget is flagged (not blocked) for review.

## 5. Out of scope (for this demo)
- Login / user accounts
- Live database connection from the web page
- Payments / invoicing
