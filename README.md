# DB Lab 3: Foreign Keys, SQL & Library Management System

By Abdelrahman Adel and Omae Elsayed Aly · Introduction to Database Systems · Alexandria National University · Fall 2026

Our project implements relational database schema design, referential integrity constraints, foreign key cascades, and direct SQL operations via Node.js/Express and React. It features Problem 1 (The COMPANY Database) and Problem 2 (The Library Management System).

## 1. Team

| Name | ID | Group |
|---|---|---|
| Abdelrahman Adel | 2304028 | Gp 2 sec 4 |
| Omar Elsayed Aly | 2304273 | Gp 2 sec 4 |

### Who did what

*Abdelrahman Adel: Problem 2 Library Dashboard & Database Integration*
- problem2_DDL.sql: wrote the DDL for the tables users, AUTHOR, and BOOK, with primary keys, foreign keys (`user_id`, `author_id`), and `ON DELETE CASCADE`.
- problem2_DML.sql: created initial seed data with at least 3 authors and 6 books.
- backend/server.js: implemented the library CRUD endpoints (fetching, adding, editing, and deleting authors and books) with strict `user_id` record isolation and parameterized queries.
- frontend/src/App.jsx: built the React dark/light mode dashboard, custom input validations (preventing numeric-only names/titles/countries and negative prices), and clean UI error/success transitions.
- problem1_Answers.txt: answered the foreign key integrity questions Q1.1–Q1.3.

*Omar Elsayed Aly: Problem 1 COMPANY DB & Authentication Integration*
- problem1_DDL.sql: implemented the schema for EMPLOYEE, DEPARTMENT, and PROJECT tables with appropriate foreign key references.
- problem1_DML.sql: inserted seed data (at least 3 records in each table).
- backend/server.js: integrated user authentication, bcrypt password hashing, session onboarding, and `user_id` query params.
- Testing & Verification: collaborated on testing application logic and constraints against lab guidelines.

*Shared:* database configuration scripts, environment templates, package configurations, screenshots, and this README. We both verified the application workflows.

## 2. Technology

| Part | What we used |
|---|---|
| Back end | Node.js, Express, cors, mysql2, dotenv |
| Front end | React, Tailwind CSS |
| Database | MySQL, plain SQL with parameters (no ORM) |

## 3. How to run it

1. Install *Node.js* and *MySQL* (with MySQL Workbench).
2. Download the project and open a terminal in its folder.
3. Navigate to the backend folder and install the libraries:

bash
cd backend
npm install

4. In MySQL Workbench, open and run `problem1_DDL.sql` and `problem1_DML.sql` to setup the COMPANY database.
5. Open and run `problem2_DDL.sql` and `problem2_DML.sql` to setup the `library` database and its seed data.
6. Copy `.env.example` to a new file named `.env`, and write your own MySQL password after `DB_PASSWORD=`.
7. Start the backend server:


bash
node server.js

8. In a separate terminal, navigate to the frontend folder, install dependencies (`npm install`), and run the React application:


bash
cd frontend
npm run dev

9. Open `http://localhost:5173` in a browser.

## 4. Features

| Requirement | What the application does |
| --- | --- |
| P1 DDL & DML | Company database schema implemented with foreign key constraints and seed data (3+ records each). |
| P1 Answers | Detailed analysis and output logs for integrity constraints Q1.1–Q1.3 documented in `problem1_Answers.txt`. |
| P2 DDL & DML | Library schema (`users`, `AUTHOR`, `BOOK`) with CASCADE deletes and test seed data (3+ authors, 6+ books). |
| F2.1 Show Tables | Interactive UI tables showing authors and books belonging strictly to the logged-in user. |
| F2.2 Add Data | Add new authors (Name, Country) and books (Title, Price, Author selection). |
| F2.3 Edit Data | Edit existing author details and book information seamlessly. |
| F2.4 Remove Book | Delete specific books securely using parameterized SQL. |
| F2.5 Remove Author | Deleting an author automatically cascades and removes all related books (`ON DELETE CASCADE`). |
| Validation | Client and server checks preventing numeric-only textual inputs and negative book prices. |

## 5. Screenshots

*Register and Login page with security validation*

*Library Dashboard showing Authors and Books tables*

*Adding, editing, and deleting records with success/error alerts*

*Responsive layout on phone-sized window*

## 6. Problem 1 Answers & Concepts

*(a) What happens when you try to delete a referenced row in DEPARTMENT after inserting a row that references an EMPLOYEE (Q1.1)?*
MySQL rejects the deletion and throws a Foreign Key constraint violation error (`ER_ROW_IS_REFERENCED_2`) because a child record depends on that parent key.

*(b) What happens if you insert a project referencing a department that does not exist (Q1.2)?*
MySQL throws a `ER_NO_REFERENCED_ROW_2` error because referential integrity requires the parent key to exist before a child foreign key can link to it.

*(c) Why do UPDATE and DELETE queries in multi-user database systems isolate records using user identifiers?*
To ensure complete data privacy and security so that each user can only manage and modify their own database entries, preventing unauthorized cross-user modifications.

*(d) Why are foreign key cascades like `ON DELETE CASCADE` useful in relational models?*
They automatically maintain referential integrity by deleting all dependent child records (such as a user's books when an author is removed) without leaving orphan records in the database.