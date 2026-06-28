-- ============================================================
-- KanBuild — Highway Construction Project & Bidding System
-- FILE: 01_schema.sql
-- PURPOSE: Create all database tables (the "data model")
-- SKILL DEMONSTRATED: Database design, SQL DDL, keys & relationships
-- ------------------------------------------------------------
-- This is a mini-clone of "AASHTOWare Project" — the software
-- real state DOTs (like Kansas DOT) use to manage road projects.
-- ============================================================

-- Make SQLite enforce foreign keys (off by default)
PRAGMA foreign_keys = ON;

-- Drop old tables so this script can be re-run cleanly
DROP TABLE IF EXISTS project_materials;
DROP TABLE IF EXISTS bids;
DROP TABLE IF EXISTS materials;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS contractors;

-- ------------------------------------------------------------
-- CONTRACTORS: the companies that bid on building roads
-- ------------------------------------------------------------
CREATE TABLE contractors (
    contractor_id   INTEGER PRIMARY KEY,            -- unique ID (primary key)
    company_name    TEXT    NOT NULL,
    city            TEXT    NOT NULL,
    state           TEXT    NOT NULL DEFAULT 'KS',
    certified       INTEGER NOT NULL DEFAULT 0,     -- 0 = no, 1 = yes (SQLite has no BOOLEAN)
    contact_email   TEXT
);

-- ------------------------------------------------------------
-- PROJECTS: the highway/road construction jobs KDOT runs
-- ------------------------------------------------------------
CREATE TABLE projects (
    project_id      INTEGER PRIMARY KEY,
    name            TEXT    NOT NULL,
    county          TEXT    NOT NULL,               -- Kansas county
    budget          REAL    NOT NULL,               -- estimated cost in dollars
    start_date      TEXT,                           -- ISO date 'YYYY-MM-DD'
    end_date        TEXT,
    status          TEXT    NOT NULL DEFAULT 'Planned'
                    CHECK (status IN ('Planned','Bidding','Awarded','In Progress','Complete'))
);

-- ------------------------------------------------------------
-- BIDS: a contractor's price offer to build a project
-- Links PROJECTS <-> CONTRACTORS (many bids per project)
-- ------------------------------------------------------------
CREATE TABLE bids (
    bid_id          INTEGER PRIMARY KEY,
    project_id      INTEGER NOT NULL,
    contractor_id   INTEGER NOT NULL,
    bid_amount      REAL    NOT NULL,               -- dollars the contractor will charge
    bid_date        TEXT    NOT NULL,
    -- FOREIGN KEYS: enforce that bids point to real projects/contractors
    FOREIGN KEY (project_id)    REFERENCES projects(project_id),
    FOREIGN KEY (contractor_id) REFERENCES contractors(contractor_id)
);

-- ------------------------------------------------------------
-- MATERIALS: things used to build roads (asphalt, concrete...)
-- ------------------------------------------------------------
CREATE TABLE materials (
    material_id     INTEGER PRIMARY KEY,
    name            TEXT    NOT NULL,
    unit            TEXT    NOT NULL,               -- e.g. 'ton', 'cubic yard'
    unit_cost       REAL    NOT NULL                -- cost per unit in dollars
);

-- ------------------------------------------------------------
-- PROJECT_MATERIALS: how much of each material a project uses
-- This is a "junction table" linking PROJECTS <-> MATERIALS
-- (many-to-many relationship)
-- ------------------------------------------------------------
CREATE TABLE project_materials (
    project_id      INTEGER NOT NULL,
    material_id     INTEGER NOT NULL,
    quantity        REAL    NOT NULL,
    PRIMARY KEY (project_id, material_id),          -- composite key
    FOREIGN KEY (project_id)  REFERENCES projects(project_id),
    FOREIGN KEY (material_id) REFERENCES materials(material_id)
);

-- Indexes speed up common lookups (a database-admin best practice)
CREATE INDEX idx_bids_project    ON bids(project_id);
CREATE INDEX idx_bids_contractor ON bids(contractor_id);
CREATE INDEX idx_projects_status ON projects(status);
