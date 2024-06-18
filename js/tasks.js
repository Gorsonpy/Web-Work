let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

export function loadTasks(filter = '', status = 'all', categoryFilter = '', tagFilter = '', taskList, initDragAndDrop) {
    if (!taskList) return; // 确保taskList存在
    taskList.innerHTML = '';
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task !== null && task !== undefined); // 过滤掉无效任务
    tasks
        .filter(task => task.title.includes(filter) && (categoryFilter === '' || task.category.includes(categoryFilter)) && (tagFilter === '' || task.tags.includes(tagFilter)))
        .filter(task => {
            if (status === 'completed') return task.completed;
            if (status === 'incomplete') return !task.completed;
            return true;
        })
        .forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = `${task.completed ? 'completed' : ''} ${task.priority}`;
            taskItem.draggable = true;
            taskItem.dataset.index = index;

            const tags = task.tags ? task.tags : [];

            taskItem.innerHTML = `
                <div>
                    <strong>${task.title}</strong>
                    <p>${task.description}</p>
                    <small>截止日期: ${task.deadline}</small>
                    <small>分类: ${task.category}</small>
                    <small>标签: ${tags.join(', ')}</small>
                </div>
                <div class="actions">
                    <button class="toggle-status" data-index="${index}"><i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i></button>
                    <button class="edit" data-index="${index}"><i class="fas fa-edit"></i></button>
                    <button class="delete" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            
            taskList.appendChild(taskItem);
        });

    if (typeof initDragAndDrop === 'function') {
        initDragAndDrop(taskList, loadTasks);
    }
}

export function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function updateTaskIndices(taskList) {
    const taskItems = taskList.children;
    for (let i = 0; i < taskItems.length; i++) {
        taskItems[i].dataset.index = i;
    }
}

export function getTasks() {
    return tasks;
}

export function setTasks(newTasks) {
    tasks = newTasks;
}