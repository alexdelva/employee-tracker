USE employees_db;

SELECT * FROM department;

SELECT role.id, title, salary, name AS department
FROM role
LEFT JOIN department ON role.department_id = department.id;

SELECT 
    employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    department.name AS department,
    role.salary,
    CONCAT(bosses.first_name, ' ', bosses.last_name) AS Manager
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee AS bosses ON employee.manager_id = bosses.id;

  