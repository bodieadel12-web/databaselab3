USE company;

INSERT INTO DEPARTMENT (Dnumber, Dname, mgr_ssn, mgr_start_date) VALUES 
(1, 'Research', NULL, '2025-01-01'),
(2, 'Administration', NULL, '2025-02-15'),
(3, 'IT', NULL, '2025-03-10');

INSERT INTO EMPLOYEE (ssn, fname, lname, bdate, address, gender, salary, Dno) VALUES 
(101, 'Abdelrahman', 'Adel', '2004-05-12', 'Alexandria', 'M', 15000.00, 3),
(102, 'Ahmed', 'Hassan', '1998-08-20', 'Cairo', 'M', 12000.00, 1),
(103, 'Sara', 'Ali', '2001-11-05', 'Alexandria', 'F', 11500.00, 2);

UPDATE DEPARTMENT SET mgr_ssn = 101 WHERE Dnumber = 3;
UPDATE DEPARTMENT SET mgr_ssn = 102 WHERE Dnumber = 1;
UPDATE DEPARTMENT SET mgr_ssn = 103 WHERE Dnumber = 2;

INSERT INTO PROJECT (Pnumber, Pname, Plocation, Dno) VALUES 
(10, 'System', 'Alexandria', 3),
(20, 'Warehouse', 'Cairo', 1),
(30, 'Portal', 'Alexandria', 2);