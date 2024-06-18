let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

export function loadTasks(filter = '', status = 'all', categoryFilter = '', tagFilter = '', taskList, initDragAndDrop) {
    if (!taskList) return; // 确保taskList存在
    taskList.innerHTML = '';
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task !== null && task !== undefined); // 过滤掉无效任务
    const now = new Date();

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
            
            // 检查任务是否即将到期并发送通知
            const taskDeadline = new Date(task.deadline);
            const timeDiff = taskDeadline - now;
            const oneDay = 24 * 60 * 60 * 1000;
            if (timeDiff <= oneDay && timeDiff > 0 && !task.notified) {
                sendNotification(task.title, task.description, taskDeadline);
                task.notified = true;
                saveTasks();
            }

            taskItem.innerHTML = `
                <div>
                    <strong>${task.title}</strong>
                    <p>${task.description}</p>
                    <small>截止日期: ${task.deadline}</small>
                    <small>分类: ${task.category}</small>
                    <small>标签: ${tags.join(', ')}</small>
                    <div class="progress-container">
                        <label>进度: <span class="progress-value">${task.progress}%</span></label>
                        <input type="range" min="0" max="100" value="${task.progress}" class="task-progress" data-index="${index}">
                    </div>
                </div>
                <div class="actions">
                    <button class="toggle-status" data-index="${index}"><i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i></button>
                    <button class="edit" data-index="${index}"><i class="fas fa-edit"></i></button>
                    <button class="delete" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
                    <button class="view-details" data-index="${index}" style="background-color: #17a2b8; color: white;"><i class="fas fa-info-circle"></i></button>
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

// 发送通知
function sendNotification(title, description, deadline) {
    if (Notification.permission === 'granted') {
        new Notification('任务提醒', {
            body: `任务"${title}"即将到期！\n描述: ${description}\n截止日期: ${deadline}`,
            icon: 'icon.png' // 可以替换为您的图标路径
        });
    }
}
