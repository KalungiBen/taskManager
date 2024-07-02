document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.getElementById('addTaskForm');
    const taskList = document.getElementById('taskList');
    const filterBtn = document.getElementById('filterBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const taskTemplate = document.getElementById('taskTemplate');
    const searchTaskInput = document.getElementById('searchTask');
    const applyFilterBtn = document.getElementById('applyFilter');
    const showAddTaskBtn = document.getElementById('showAddTaskBtn');
    const taskAddBoxContainer = document.getElementById('taskAddBoxContainer');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(tasksToRender = tasks) {
        taskList.innerHTML = '';
        tasksToRender.forEach((task, index) => {
            const taskElement = document.importNode(taskTemplate.content, true);
            
            const listItem = taskElement.querySelector('.task-item');
            listItem.classList.add(`priority-${task.priority}`, `category-${task.category}`);
            
            taskElement.querySelector('.task-title').textContent = task.title;
            taskElement.querySelector('.task-description').textContent = task.description;
            taskElement.querySelector('.task-date').textContent = new Date(task.dateTime).toLocaleString();
            
            if (task.completed) {
                listItem.classList.add('completed');
            }

            const completeBtn = taskElement.querySelector('.complete-btn');
            completeBtn.addEventListener('click', () => toggleComplete(index));

            const deleteBtn = taskElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(index));

            taskList.appendChild(taskElement);
        });
    }

    function addTask(event) {
        event.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dateTime = document.getElementById('taskDateTime').value;
        const category = document.getElementById('taskCategory').value;
        const priority = document.getElementById('taskPriority').value;

        tasks.push({ title, description, dateTime, category, priority, completed: false });
        saveTasks();
        renderTasks();
        addTaskForm.reset();

        // Hide the add task form on small devices after adding a task
        if (window.innerWidth < 992) {
            taskAddBoxContainer.classList.remove('show');
        }
    }

    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function clearAllTasks() {
        if (confirm('Are you sure you want to clear all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    }

    function searchTasks(searchTerm) {
        const filteredTasks = tasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderTasks(filteredTasks);
    }

    function applyFilter() {
        const categoryFilter = document.getElementById('filterCategory').value;
        const priorityFilter = document.getElementById('filterPriority').value;
        const statusFilter = document.getElementById('filterStatus').value;

        const filteredTasks = tasks.filter(task => 
            (categoryFilter === '' || task.category === categoryFilter) &&
            (priorityFilter === '' || task.priority === priorityFilter) &&
            (statusFilter === '' || 
                (statusFilter === 'active' && !task.completed) || 
                (statusFilter === 'completed' && task.completed))
        );

        renderTasks(filteredTasks);
        const filterModal = bootstrap.Modal.getInstance(document.getElementById('filterModal'));
        filterModal.hide();
    }

    addTaskForm.addEventListener('submit', addTask);
    clearAllBtn.addEventListener('click', clearAllTasks);
    filterBtn.addEventListener('click', () => {
        const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
        filterModal.show();
    });
    searchTaskInput.addEventListener('input', (e) => searchTasks(e.target.value));
    applyFilterBtn.addEventListener('click', applyFilter);

    // Add event listener for the show add task button
    showAddTaskBtn.addEventListener('click', () => {
        taskAddBoxContainer.classList.add('show');
    });

    // Add event listener for window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
            taskAddBoxContainer.classList.remove('show');
        }
    });

    renderTasks();
});