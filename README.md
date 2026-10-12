# DB Lab 2: Login & To-Do App

By Abdelrahman Adel and Omar elsayed Ali · Introduction to Database Systems · Alexandria National University · Fall 2026

Our app lets people sign up, log in and keep their own to-do list. The server is Node.js with Express, and the data lives in MySQL.

## 1. Team

| Name | ID | Group |
|---|---|---|
| Abdelrahman Adel | 2304028 | Gp 2 sec 4 |
| Omar elsayed Ali | 2304273 | Gp 2 sec 4 |

### Who did what

*Abdelrahman Adel: dashboard and database*
- database/schema.sql: wrote the DDL for the tables users and todos, with primary keys, UNIQUE (email), NOT NULL columns, the default values and the foreign key from todos.user_id to users.user_id.
- app.js, to-do routes: the list page (GET /todos), adding, editing, marking done and deleting a to-do. Each query uses ? parameters and takes user_id from the session.
- Bonus 1, open-task counter: the loop in showList that counts the to-dos that are not done, and the "Open tasks" line on the page.
- views/todos.ejs: the dashboard page with the add form, the editable rows, the done state, the delete confirmation and the empty-list text.
- views/error.ejs: the styled error page.

*Omar elsayed Ali: authentication, onboarding and filters*
- app.js, authentication routes: register, login and logout, the session setup and the route protection (checkLogin).
- Password security: bcrypt hashing at registration, comparing the hash at login, and the same Invalid email or password message for a wrong e-mail or password.
- views/login.ejs and views/register.ejs: the login and register pages, with the error boxes and the exact messages.
- Bonus 2, filters: the code in showList that reads ?filter= from the address and keeps only the matching to-dos, and the All / Open / Done links on the list page.

*Shared:* db.js, public/style.css, public/validate.js, .env.example, .gitignore, package.json, the screenshots and this README. We both tested the application with the lab's "Check yourself" table.

## 2. Technology

| Part | What we used |
|---|---|
| Back end | Node.js, Express, express-session, bcryptjs, mysql2, dotenv |
| Front end | EJS templates, HTML, CSS, JavaScript |
| Database | MySQL, database registration, plain SQL with parameters (no ORM) |

## 3. How to run it

1. Install *Node.js* and *MySQL* (with MySQL Workbench).
2. Download the project and open a terminal in its folder.
3. Install the libraries:
   ```bash
   npm install

```

4. In MySQL Workbench, open `database/schema.sql` and run it (lightning bolt). It creates the registration database and the tables users and todos.
5. Copy `.env.example` to a new file named `.env`, and write your own MySQL password after `DB_PASSWORD=`.
6. Start the server:
```bash
node app.js

```


7. Open http://localhost:5173 in a browser.

## 4. Features

| Requirement | What the application does |
| --- | --- |
| R1 Register | Name, e-mail, password and confirm password. A duplicate e-mail shows Email Already Exists. After registering, the user is logged in and sees the list. |
| R2 Login | E-mail and password. A wrong e-mail and a wrong password show the same message, Invalid email or password. Logout ends the session. |
| R3 Private list | A visitor who is not logged in is sent to the login page. Each user sees only their own to-dos, newest first. |
| R4 Add | Add a to-do with a title. |
| R5 Edit | Change the title of a to-do. |
| R6 Done | Mark a to-do as done or not done. |
| R7 Delete | Delete a to-do, after an "are you sure?" question. |
| R8 Checks | The same rules in the browser and on the server, with the exact messages. When the server finds an error, it shows the same page again and does not touch the database. |
| R9 Safety | Passwords stored as bcrypt hashes, only the given queries with parameters, and user_id taken from the session. |
| R10 Interface | One consistent style, works at phone size (about 360 px), clear messages near the form, a visible state for done to-dos, a friendly text when the list is empty, the user's name and a Log out button, and a styled error page. |
| Bonus 1 | The list shows how many to-dos are still open ("Open tasks: 2 of 3"). |
| Bonus 2 | Filter links: All, Open and Done. |

## 5. Screenshots

*Register page with error messages*

*Login page*

*List with to-dos (one done), open-task count and filters*

*Phone-sized window (360 px)*

## 6. Answers

*(a) Why do UPDATE and DELETE contain AND user_id = ?, and what changes if you remove it?*

They contain AND user_id = ? to make sure a user can only edit or delete their own tasks. If you remove it, any logged-in user could change or delete other users' to-dos just by guessing their task ID in the URL, which breaks privacy and security.

*(b) What happens if you insert a to-do for a user_id that does not exist, and which constraint of the lecture is that?*

The database will reject the insert and throw an error because of a Foreign Key constraint. This constraint ensures referential integrity by making sure a child record (todos.user_id) must always point to a valid parent record that actually exists in the users table.

*(c) Why do you store a hash and not the password?*

For security. If the database is ever hacked or leaked, storing raw passwords would expose every user. Storing a secure bcrypt hash means we only store a one-way mathematical scramble, so even we cannot see the user's actual password.

*(d) The name column is NOT NULL: why did you still need your own check for an empty name?*

NOT NULL only refuses a missing value (NULL). An empty text '' is still a value, so MySQL accepts it. Only our own check, in the browser and on the server, can refuse an empty or space-only name.
