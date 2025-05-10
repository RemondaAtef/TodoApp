document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const todoTableBody = document.getElementById('todoTableBody');
    const addTodoForm = document.getElementById('addTodoForm');
    const editTodoForm = document.getElementById('editTodoForm');
    const saveTodoBtn = document.getElementById('saveTodoBtn');
    const updateTodoBtn = document.getElementById('updateTodoBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const todoCount = document.getElementById('todoCount');
    const pagination = document.getElementById('pagination');

    // Global variables
    let todos = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let todoToDeleteId = null;

    // Initialize the app
    init();

    function init() {
        loadTodos();
        setupEventListeners();
    }

    function setupEventListeners() {
        // Add todo
        saveTodoBtn.addEventListener('click', addTodo);

        // Update todo
        updateTodoBtn.addEventListener('click', updateTodo);

        // Delete todo
        confirmDeleteBtn.addEventListener('click', deleteTodo);

        // Search and filter
        searchInput.addEventListener('input', debounce(loadTodos, 300));
        statusFilter.addEventListener('change', loadTodos);
        priorityFilter.addEventListener('change', loadTodos);

        // Pagination
        pagination.addEventListener('click', function (e) {
            if (e.target.classList.contains('page-link')) {
                e.preventDefault();
                currentPage = parseInt(e.target.getAttribute('data-page'));
                loadTodos();
            }
        });
    }

    // API Functions
    async function loadTodos() {
        try {
            const searchTerm = searchInput.value.trim();
            const status = statusFilter.value;
            const priority = priorityFilter.value;

            // If no filters are applied, use the getAll endpoint
            if (!searchTerm && !status && !priority) {
                // const response = await fetch('/api/todos/all');
                const response = await fetch('/api/app/todo');
                if (!response.ok) throw new Error('Failed to fetch todos');

                todos = await response.json();
                renderTodos();
                todoCount.textContent = `Showing all ${todos.length} todos`;
                return;
            }

            // Otherwise use the filtered endpoint
            const params = new URLSearchParams();
            if (status) params.append('status', status);
            //if (priority) params.append('priority', priority);
            //if (searchTerm) params.append('search', searchTerm);

            const response = await fetch(`/api/app/todo/todos-by-status?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch todos');

            todos = await response.json();
            renderTodos();
            todoCount.textContent = `Showing ${todos.length} todos`;
        } catch (error) {
            showAlert('danger', `Error loading todos: ${error.message}`);
            console.error('Error loading todos:', error);
        }
    }

    async function addTodo() {
        const addTodoForm = document.getElementById('addTodoForm');

        if (!validateForm(addTodoForm)) return;

        try {
            const todo = {
                title: document.getElementById('title').value.trim(),
                description: document.getElementById('description').value.trim(),
                status: document.getElementById('status').value, // Ensure matches enum (e.g., "Pending")
                priority: document.getElementById('priority').value, // Ensure matches enum (e.g., "Medium")
                dueDate: document.getElementById('dueDate').value || null
            };

            const headers = {
                'Content-Type': 'application/json'
                // Remove RequestVerificationToken unless explicitly required
            };

            console.log('Sending:', JSON.stringify(todo));
            const response = await fetch('/api/app/todo', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(todo)
            });
            console.log(response.json())
            if (!response.ok) {
                let errorMessage = 'Failed to add todo';
                try {
                    const errorData = await response.json();
                    console.log('Error response:', errorData);
                    errorMessage = errorData.error?.message || errorMessage;
                } catch (e) {
                    console.error('Error parsing response:', e);
                }
                throw new Error(errorMessage);
            }

            const newTodo = await response.json();
            showAlert('success', 'Todo added successfully!');
            const addTodoModal = bootstrap.Modal.getInstance(document.getElementById('addTodoModal'));
            if (addTodoModal) addTodoModal.hide();
            addTodoForm.reset();
            loadTodos();
        } catch (error) {
            showAlert('danger', `Error adding todo: ${error.message}`);
            console.error('Error adding todo:', error);
        }
    }

    async function updateTodo() {
        if (!validateForm(editTodoForm)) return;

        try {
            const id = document.getElementById('editId').value;
            const todo = {
                title: document.getElementById('editTitle').value.trim(),
                description: document.getElementById('editDescription').value.trim(),
                status: document.getElementById('editStatus').value,
                priority: document.getElementById('editPriority').value,
                dueDate: document.getElementById('editDueDate').value || null
            };

            const response = await fetch(`/api/app/todo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': document.getElementsByName('__RequestVerificationToken')[0].value
                },
                body: JSON.stringify(todo)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to update todo');
            }

            showAlert('success', 'Todo updated successfully!');
            $('#editTodoModal').modal('hide');
            loadTodos();
        } catch (error) {
            showAlert('danger', `Error updating todo: ${error.message}`);
            console.error('Error updating todo:', error);
        }
    }

    async function deleteTodo() {
        if (!todoToDeleteId) return;

        try {
            const response = await fetch(`/api/app/todo/${todoToDeleteId}`, {
                method: 'DELETE',
                headers: {
                    'RequestVerificationToken': document.getElementsByName('__RequestVerificationToken')[0].value
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to delete todo');
            }

            showAlert('success', 'Todo deleted successfully!');
            $('#deleteTodoModal').modal('hide');
            todoToDeleteId = null;
            loadTodos();
        } catch (error) {
            showAlert('danger', `Error deleting todo: ${error.message}`);
            console.error('Error deleting todo:', error);
        }
    }

    async function markAsComplete(id) {
        try {
            const response = await fetch(`/api/app/todo/${id}/mark-as-complete`, {
                method: 'PUT',
                headers: {
                    'RequestVerificationToken': document.getElementsByName('__RequestVerificationToken')[0].value
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to mark todo as complete');
            }

            showAlert('success', 'Todo marked as completed!');
            loadTodos();
        } catch (error) {
            showAlert('danger', `Error completing todo: ${error.message}`);
            console.error('Error completing todo:', error);
        }
    }

    // UI Functions (remain the same as before)
    function renderTodos() {
        todoTableBody.innerHTML = '';

        if (todos.length === 0) {
            todoTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-muted">
                        No todos found. Try adjusting your search or filters.
                    </td>
                </tr>
            `;
            return;
        }

        todos.forEach(todo => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${todo.title}</td>
                <td>${todo.description || '-'}</td>
                <td>
                    <span class="badge ${getStatusBadgeClass(todo.status)}">
                        ${todo.status}
                    </span>
                </td>
                <td>
                    <span class="badge ${getPriorityBadgeClass(todo.priority)}">
                        ${todo.priority}
                    </span>
                </td>
                <td>${todo.dueDate ? formatDate(todo.dueDate) : '-'}</td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${todo.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${todo.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                        ${todo.status !== 'Completed' ? `
                            <button class="btn btn-sm btn-outline-success complete-btn" data-id="${todo.id}">
                                <i class="bi bi-check"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            `;
            todoTableBody.appendChild(row);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.getAttribute('data-id')));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => openDeleteModal(btn.getAttribute('data-id')));
        });

        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', () => markAsComplete(btn.getAttribute('data-id')));
        });
    }

    function updatePagination(totalCount) {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(totalCount / itemsPerPage);

        if (totalPages <= 1) return;

        // Previous button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `
            <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        `;
        pagination.appendChild(prevLi);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            pagination.appendChild(li);
        }

        // Next button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        `;
        pagination.appendChild(nextLi);
    }

    function openEditModal(id) {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        document.getElementById('editId').value = todo.id;
        document.getElementById('editTitle').value = todo.title;
        document.getElementById('editDescription').value = todo.description || '';
        document.getElementById('editStatus').value = todo.status;
        document.getElementById('editPriority').value = todo.priority;
        document.getElementById('editDueDate').value = todo.dueDate ? todo.dueDate.split('T')[0] : '';

        $('#editTodoModal').modal('show');
    }

    function openDeleteModal(id) {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        todoToDeleteId = id;
        document.getElementById('todoToDeleteTitle').textContent = todo.title;
        $('#deleteTodoModal').modal('show');
    }

    function showAlert(type, message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        const container = document.querySelector('.container');
        container.prepend(alertDiv);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = bootstrap.Alert.getOrCreateInstance(alertDiv);
            alert.close();
        }, 5000);
    }

    // Helper Functions
    function validateForm(form) {
        let isValid = true;
        const requiredInputs = form.querySelectorAll('[required]');

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });

        return isValid;
    }

    function getStatusBadgeClass(status) {
        switch (status) {
            case 'Pending': return 'bg-warning text-dark';
            case 'InProgress': return 'bg-info text-white';
            case 'Completed': return 'bg-success text-white';
            default: return 'bg-secondary text-white';
        }
    }

    function getPriorityBadgeClass(priority) {
        switch (priority) {
            case 'Low': return 'bg-success text-white';
            case 'Medium': return 'bg-warning text-dark';
            case 'High': return 'bg-danger text-white';
            default: return 'bg-secondary text-white';
        }
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
});