document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.getElementById('addTaskForm');
    const taskList = document.getElementById('taskList');
    const filterBtn = document.getElementById('filterBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const taskTemplate = document.getElementById('taskTemplate');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskElement = document.importNode(taskTemplate.content, true);
            
            taskElement.querySelector('.task-title').textContent = task.title;
            taskElement.querySelector('.task-description').textContent = task.description;
            taskElement.querySelector('.task-date').textContent = new Date(task.dateTime).toLocaleString();
            
            const listItem = taskElement.querySelector('.task-item');
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

        tasks.push({ title, description, dateTime, completed: false });
        saveTasks();
        renderTasks();
        addTaskForm.reset();
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

    function filterTasks() {
        const filterOption = prompt('Enter filter option (all/active/completed):');
        switch (filterOption.toLowerCase()) {
            case 'active':
                tasks = tasks.filter(task => !task.completed);
                break;
            case 'completed':
                tasks = tasks.filter(task => task.completed);
                break;
            case 'all':
            default:
                // Do nothing, show all tasks
                break;
        }
        renderTasks();
    }

    addTaskForm.addEventListener('submit', addTask);
    clearAllBtn.addEventListener('click', clearAllTasks);
    filterBtn.addEventListener('click', filterTasks);

    renderTasks();
});