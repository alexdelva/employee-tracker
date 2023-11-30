const inquirer = require("inquirer")
const mysql = require("mysql2")
const { printTable } = require("console-table-printer")
require("dotenv").config()


const db = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
})

db.connect(() => {
    mainMenu()

})
function mainMenu() {
    inquirer.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "Selection",
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]
    })
        .then(answer => {

            if (answer.Selection === "view all employees") {
                viewEmployees()
            }
            else if (answer.Selection === "add an employee") {
                addEmployee()
            } else if (answer.Selection === "update an employee role") {
                updateEmployeeRole()
            }
            else if (answer.Selection === "view All the departments") {
                viewDepartments()
            }
            else if (answer.Selection === "add a department") {
                addDepartment()
            }
            else if (answer.Selection === "add a role") {
                viewRoles()
            }
            else if (answer.Selection === "add a role") {
                addRole()
            }
        })
}

function viewEmployees() {
    db.query(`SELECT employee.id , employee.first_name, employee.last_name,title, name AS department, salary, CONCAT(bosses.first_name,' ', bosses.last_name) AS Manager FROM employee
LEFT JOIN ON employee.role_id.= role.id
LEFT JOIN department ON department_id = role.department_id
LEFT JOIN employee AS bosses ON employee.manager_id = bosses.id;
`, (err, data) => {
        printTable(data)
        mainMenu();
    });
}

function addEmployee() {
    db.query("SELECT id as value,title as name from role", (err, roleData) => {
        db.query("SELECT id as value, CONCAT(first_name,' ',last_name) as name FROM employee WHERE manager_is NULL", (err, managerData) => {
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the first name?",
                    name: "first_name"
                },
                {
                    type: "input",
                    message: "What is the last name?",
                    name: "last_name"
                },
                {
                    type: "list",
                    message: "Choose the following title:",
                    name: "role_id",
                    choices:roleData
                },
                {
                    type: "list",
                    message: "Choose the following manager:",
                    name: "manager_id",
                    choices:managerData
                },

            ]).then(answer=>{
               db.query("INSERT INTO employee (first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)",[answer.first_name,answer.last_name,answer.role_id,answer.manager_id],err=>{
                viewEmployees()
               }) 
            })
        })
    })
}

function updateEmployeeRole() {
    db.query("SELECT id as value, title as name FROM role", (err, roleData) => {
        db.query("SELECT id as value, CONCAT(first_name,' ',last_name) as name FROM employee WHERE manager_id is null", (err, employeeData) => {
            inquirer.prompt([
                {
                    type: "list",
                    message: "Choose the following title:",
                    name: "role_id",
                    choices: roleData
                },
                {
                    type: "list",
                    message: "Choose the following employee:",
                    name: "employee_id", 
                    choices: employeeData
                },

            ]).then(answer => {
                db.query("UPDATE employee SET role_id = ? WHERE id = ?", [answer.role_id, answer.id], (err) => { 
                    viewEmployees();
                });
            });
        });
    });
}

function viewDepartments() {
    db.query(`SELECT employee.id , employee.first_name, employee.last_name,title, name AS department, salary, CONCAT(bosses.first_name,' ', bosses.last_name) AS Manager FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON department_id =role.department_id
LEFT JOIN employee AS bosses ON employee.manager_id=bosses.id;
`, (err, data) => {
        printTable(data);
        mainMenu();
    });
}
function addDepartment() {
    db.query("SELECT * FROM department", (err, departmentData) => {
        db.query("SELECT id as value, CONCAT(department_id) as name FROM department WHERE department_is NULL", (err, managerData) => {
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the name of the Department?",
                    name: "department_id"
                },
            

            ]).then(answer=>{
               db.query("INSERT INTO department (name) VALUES(?)",[answer.department],err=>{
                viewDepartments();
               });
            })
        })
    })
}

function viewRoles() {
    db.query(`SELECT employee.id , employee.first_name, employee.last_name,title, name as department, salary, CONCAT(bosses.first_name,' ', bosses.last_name) AS Manager FROM employee
    LEFT JOIN on employee.role_id.= role.id
    LEFT JOIN department on department_id = role.department_id
    LEFT JOIN employee AS bosses ON employee.manager_id =bosses.id;`, (err, data) => {
            printTable(data);
            mainMenu();
        });
}

function addRole () {
    db.query("INSERT into role_id as value from role", (err, roleData) => {
       
            inquirer.prompt([
                {
                    type: "list",
                    message: "choose the following title",
                    name: "role_id",
                    choices: roleData
                },
            

            ]).then(answer=>{
               db.query("UPDATE employee SET role_id=?",(answer.role_id),err=>{
                viewEmployees()
               }) 
            })
        })
    }
