const form = document.getElementById('todo-form');
const taskList = document.getElementById('task-list');
const emptyMsg = document.getElementById('empty-msg');

let tasks = [];

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newTask = {
        id: Date.now(),
        name: document.getElementById('task-name').value,
        date: document.getElementById('task-date').value,
        completed: false
    };

    tasks.push(newTask);
    renderTasks();
    form.reset();
});

function renderTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        emptyMsg.classList.remove('hidden');
        return;
    } 
    
    emptyMsg.classList.add('hidden');

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        
        li.innerHTML = `
            <div>
                <strong>${task.name}</strong><br>
                <small>${task.date}</small>
            </div>
            <div>
                <button onclick="toggleTask(${task.id})">ok</button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">excluir</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

document.getElementById('sort-date').addEventListener('click', () => {
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    renderTasks();
});