document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const themeToggle = document.getElementById('theme-toggle');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const prioritySelect = document.getElementById('priority-select');
    const searchInput = document.getElementById('search-input');
    let editMode = false;
    let editTask = null;

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;

        if (taskText !== '') {
            if (editMode) {
                updateTask(taskText, priority);
            } else {
                addTask(taskText, priority);
            }
            taskInput.value = '';
            prioritySelect.value = 'rendah';
        }
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            button.classList.add('active');
            filterTasks(button.id);
        });
    });

    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        filterTasks(document.querySelector('.filter-btn.active').id, searchText);
    });

    function addTask(text, priority) {
        const li = document.createElement('li');
        li.textContent = text;
        li.classList.add(`priority-${priority}`, 'fade-in');

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Selesai';
        completeButton.addEventListener('click', () => {
            li.classList.toggle('completed');
            filterTasks(document.querySelector('.filter-btn.active').id);
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            editMode = true;
            editTask = li;
            taskInput.value = text;
            prioritySelect.value = priority;
            li.classList.add('edit-mode');
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hapus';
        deleteButton.addEventListener('click', () => {
            li.style.opacity = '0';
            setTimeout(() => {
                taskList.removeChild(li);
                saveTasks();
            }, 300);
        });

        li.appendChild(completeButton);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
        saveTasks();
    }

    function updateTask(text, priority) {
        editTask.textContent = text;
        editTask.className = '';
        editTask.classList.add(`priority-${priority}`, 'fade-in');
        
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Selesai';
        completeButton.addEventListener('click', () => {
            editTask.classList.toggle('completed');
            filterTasks(document.querySelector('.filter-btn.active').id);
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            editMode = true;
            editTask = editTask;
            taskInput.value = text;
            prioritySelect.value = priority;
            editTask.classList.add('edit-mode');
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hapus';
        deleteButton.addEventListener('click', () => {
            editTask.style.opacity = '0';
            setTimeout(() => {
                taskList.removeChild(editTask);
                saveTasks();
            }, 300);
        });

        editTask.appendChild(completeButton);
        editTask.appendChild(editButton);
        editTask.appendChild(deleteButton);
        editMode = false;
        editTask = null;
        saveTasks();
    }

    function filterTasks(filter, searchText = '') {
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(task => {
            const matchesSearch = task.textContent.toLowerCase().includes(searchText);
            switch (filter) {
                case 'all':
                    task.style.display = matchesSearch ? 'flex' : 'none';
                    break;
                case 'completed':
                    task.style.display = task.classList.contains('completed') && matchesSearch ? 'flex' : 'none';
                    break;
                case 'uncompleted':
                    task.style.display = !task.classList.contains('completed') && matchesSearch ? 'flex' : 'none';
                    break;
            }
        });
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(task => {
            tasks.push({
                text: task.firstChild.nodeValue,
                priority: task.classList[0].split('-')[1],
                completed: task.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => {
                addTask(task.text, task.priority);
                if (task.completed) {
                    const taskElement = taskList.lastChild;
                    taskElement.classList.add('completed');
                }
            });
        }
    }

    loadTasks();
});
