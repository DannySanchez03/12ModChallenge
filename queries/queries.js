const db = require('../config/connection.js');
const inquirer = require('inquirer');

function viewAllDepartments(callback) {
    db.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;

        if (results.length === 0) {
            console.log('No departments found');
            return;
        }

        console.table(results);
        callback();
    });
}

function viewAllRoles(callback) {
    db.query('SELECT r.id, r.title, d.name AS department, r.salary FROM role r INNER JOIN department d ON r.department_id = d.id;', function (err, results) {
        if (err) throw err;

        if (results.length === 0) {
            console.log('No roles found');
            return;
        }

        console.table(results);
        callback();
    });
}

function viewAllEmployees(callback) {
    db.query('SELECT e.id, e.first_name, e.last_name, r.title AS title, d.name AS department, r.salary, CONCAT(m.first_name, \' \', m.last_name) AS manager FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id ORDER BY e.id ASC;', function (err, results) {
        if (err) throw err;

        if (results.length === 0) {
            console.log('No employees found');
            return;
        }

        console.table(results);
        callback();
    });
}

function addDepartment(callback) {
    inquirer.prompt({
        type: 'input',
        name: 'addDepartment',
        message: 'What is the name of the department?'
    })
        .then((answers) => {
            const newDepartmentName = answers.addDepartment
            const sql = `INSERT INTO department (name) VALUES (?)`;
            db.query(sql, [newDepartmentName], (err, results) => {
                if (err) throw err;
                console.log(`Added ${newDepartmentName} to the department database`);
                callback();
            });
        })
        .catch((err) => console.error(err));
}

function addRole(callback) {
    const roleQuestions = [
        {
            type: 'input',
            name: 'roleTitle',
            message: 'What is the title of the new role?',
        },
        {
            type: 'number',
            name: 'roleSalary',
            message: 'What is the salary for the new role?',
            validate: (value) => {
                if (isNaN(value) || value <= 0) {
                    return 'Please enter a valid positive number for salary.';
                }
                return true;
            },
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Which department does this role belong to?',
            choices() {
                return new Promise((resolve, reject) => {
                    db.query('SELECT id, name FROM department', (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(results.map((department) => ({
                            name: department.name,
                            value: department.id,
                        })));
                    });
                });
            },
        },
    ];
    inquirer.prompt(roleQuestions)
        .then((answers) => {
            const newRoleTitle = answers.roleTitle;
            const newRoleSalary = answers.roleSalary;
            const newRoleDepartmentId = answers.departmentId;
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            db.query(sql, [newRoleTitle, newRoleSalary, newRoleDepartmentId], (err, results) => {
                if (err) throw err;
                console.log(`Added ${newRoleTitle} to the role database`);
                callback();
            });
        })
        .catch((err) => console.error(err));
}

function addEmployee(callback) {
    const employeeQuestions = [
        {
            type: 'input',
            name: 'firstName',
            message: `What is the employee's first name?`
        },
        {
            type: 'input',
            name: 'lastName',
            message: `What is the employee's last name?`
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: `What is the employee's role?`,
            choices() {
                return new Promise((resolve, reject) => {
                    db.query('SELECT id, title FROM role', (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(results.map((role) => ({
                            name: role.title,
                            value: role.id,
                        })));
                    });
                });
            },
        },
        {
            type: 'list',
            name: 'managerName',
            message: `Who is the employee's manager?`,
            choices() {
                return new Promise((resolve, reject) => {
                    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        const managerChoices = results.map((employee) => ({
                            name: employee.name,
                            value: employee.id,
                        }));
                        managerChoices.unshift({ name: 'None', value: null });
                        resolve(managerChoices);
                    });
                });
            },
        },
    ];
    inquirer.prompt(employeeQuestions)
        .then((answers) => {
            const newFirstName = answers.firstName;
            const newLastName = answers.lastName;
            const newEmployeeRole = answers.employeeRole;
            const newManagerName = answers.managerName;
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
            db.query(sql, [newFirstName, newLastName, newEmployeeRole, newManagerName], (err, results) => {
                if (err) throw err;
                console.log(`Added ${newFirstName} ${newLastName} to the employees database`);
                callback();
            });
        })
        .catch((err) => console.error(err));
}

function updateRole(callback) {
    const updateQuestions = [
        {
            type: 'list',
            name: 'employeeName',
            message: `Which employee's role do you want to update?`,
            choices() {
                return new Promise((resolve, reject) => {
                    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(results.map((employee) => ({
                            name: employee.name,
                            value: employee.id,
                        })));
                    });
                });
            },
        },
        {
            type: 'list',
            name: 'newRole',
            message: 'Which role do you want to assign to the employee?',
            choices() {
                return new Promise((resolve, reject) => {
                    db.query('SELECT id, title FROM role', (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(results.map((role) => ({
                            name: role.title,
                            value: role.id,
                        })));
                    });
                });
            },
        },
    ];
    inquirer.prompt(updateQuestions)
        .then((answers) => {
            const chosenEmployee = answers.employeeName;
            const updatedRole = answers.newRole;
            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
            db.query(sql, [updatedRole, chosenEmployee], (err, results) => {
                if (err) throw err;
                console.log('Employee role updated successfully!');
                callback();
            });
        })
        .catch((err) => console.error(err));
}

module.exports = { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateRole };