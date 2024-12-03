class EmployeeManagementApp {
    constructor() {
        this.initEventListeners();
        this.loadInitialView();
    }

    initEventListeners() {
        document.getElementById('nav-register').addEventListener('click', () => this.loadRegisterForm());
        document.getElementById('nav-list').addEventListener('click', () => this.loadEmployeeList());
        document.getElementById('hamburger-menu').addEventListener('click', this.toggleMobileMenu);
        document.getElementById('search-bar').addEventListener('input', this.searchEmployees.bind(this));
    }

    toggleMobileMenu() {
        document.getElementById('main-nav').classList.toggle('active');
    }

    loadInitialView() {
        this.loadEmployeeList();
    }

    loadRegisterForm() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="form-container">
                <form id="employee-registration-form">
                    <input type="text" name="name" placeholder="Employee Name" required>
                    <input type="text" name="position" placeholder="Position" required>
                    <textarea name="about" placeholder="About Employee" required></textarea>
                    <input type="date" name="joining_date" required>
                    <button type="submit">Register Employee</button>
                </form>
            </div>
        `;

        document.getElementById('employee-registration-form').addEventListener('submit', this.registerEmployee.bind(this));
    }

    registerEmployee(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const employee = {
            id: Date.now(),
            name: formData.get('name'),
            position: formData.get('position'),
            about: formData.get('about'),
            joining_date: formData.get('joining_date')
        };

        let employees = JSON.parse(localStorage.getItem('employees') || '[]');
        employees.push(employee);
        localStorage.setItem('employees', JSON.stringify(employees));

        this.loadEmployeeList();
    }

    loadEmployeeList() {
        const mainContent = document.getElementById('main-content');
        let employees = JSON.parse(localStorage.getItem('employees') || '[]');
        
        // Pagination setup
        const itemsPerPage = 5;
        const currentPage = 1;
        const totalPages = Math.ceil(employees.length / itemsPerPage);

        const paginatedEmployees = employees.slice(
            (currentPage - 1) * itemsPerPage, 
            currentPage * itemsPerPage
        );

        mainContent.innerHTML = `
            <table id="employee-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>About</th>
                        <th>Joining Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedEmployees.map(emp => `
                        <tr data-id="${emp.id}">
                            <td>${emp.name}</td>
                            <td>${emp.position}</td>
                            <td>${emp.about}</td>
                            <td>${emp.joining_date}</td>
                            <td>
                                <button onclick="app.deleteEmployee(${emp.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div id="pagination">
                ${this.createPaginationButtons(currentPage, totalPages)}
            </div>
        `;
    }

    createPaginationButtons(currentPage, totalPages) {
        let buttons = '';
        if (currentPage > 1) {
            buttons += `<button onclick="app.changePage(${currentPage - 1})">Previous</button>`;
        }
        if (currentPage < totalPages) {
            buttons += `<button onclick="app.changePage(${currentPage + 1})">Next</button>`;
        }
        return buttons;
    }

    changePage(page) {
        // Implement pagination logic
    }

    deleteEmployee(id) {
        let employees = JSON.parse(localStorage.getItem('employees') || '[]');
        employees = employees.filter(emp => emp.id !== id);
        localStorage.setItem('employees', JSON.stringify(employees));
        this.loadEmployeeList();
    }

    searchEmployees(event) {
        const searchTerm = event.target.value.toLowerCase();
        let employees = JSON.parse(localStorage.getItem('employees') || '[]');
        
        const filteredEmployees = employees.filter(emp => 
            emp.name.toLowerCase().includes(searchTerm)
        );

        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <table id="employee-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>About</th>
                        <th>Joining Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredEmployees.map(emp => `
                        <tr data-id="${emp.id}">
                            <td>${emp.name}</td>
                            <td>${emp.position}</td>
                            <td>${emp.about}</td>
                            <td>${emp.joining_date}</td>
                            <td>
                                <button onclick="app.deleteEmployee(${emp.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
}

// Initialize the application
const app = new EmployeeManagementApp();