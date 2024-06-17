(function () {
    // 获取DOM元素
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-desc');
    const taskDeadlineInput = document.getElementById('task-deadline');
    const taskPriorityInput = document.getElementById('task-priority');
    const taskCategoryInput = document.getElementById('task-category'); // 新增
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const categoryFilter = document.getElementById('category-filter'); // 新增
    const tagFilter = document.getElementById('tag-filter'); // 新增

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // 请求通知权限
    if (Notification.permission === 'default' || Notification.permission === 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            } else {
                console.log('Notification permission denied.');
            }
        });
    } else {
        console.log(`Notification permission already ${Notification.permission}.`);
    }

    // 加载任务列表
    function loadTasks(filter = '', status = 'all', categoryFilter = '', tagFilter = '') {
        taskList.innerHTML = '';
        const now = new Date();
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
                taskItem.draggable = true; // 使任务项可拖动
                taskItem.dataset.index = index; // 保存任务索引
                
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
    
        initDragAndDrop(); // 初始化拖拽排序功能
    }
    function initDragAndDrop() {
        let draggingEl;
    
        taskList.addEventListener('dragstart', (e) => {
            draggingEl = e.target;
            e.target.classList.add('dragging');
        });
    
        taskList.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
            
            const draggable = document.querySelector('.dragging');
            const afterElement = getDragAfterElement(taskList, e.clientY);
            
            if (afterElement == null) {
                taskList.appendChild(draggable);
            } else {
                taskList.insertBefore(draggable, afterElement);
            }
            
            // 获取新位置
            const newIndex = [...taskList.children].indexOf(draggable);
            const oldIndex = parseInt(draggingEl.dataset.index, 10);
            
            // 更新tasks数组
            if (newIndex >= 0 && newIndex < tasks.length) {
                const [movedTask] = tasks.splice(oldIndex, 1);
                tasks.splice(newIndex, 0, movedTask);
            }
            
            // 更新索引值
            updateTaskIndices();
            
            saveTasks();
            loadTasks();
        });
    
        taskList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(taskList, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                taskList.appendChild(draggable);
            } else {
                taskList.insertBefore(draggable, afterElement);
            }
        });
    }
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    // 更新任务的索引
    function updateTaskIndices() {
        const taskItems = taskList.children;
        for (let i = 0; i < taskItems.length; i++) {
            taskItems[i].dataset.index = i;
        }
    }
    
    // 保存任务到本地存储
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // 显示错误消息
    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }

    // 隐藏错误消息
    function hideError(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    }

    // 验证表单字段
    function validateForm() {
        let isValid = true;

        if (taskTitleInput.value.trim() === '') {
            showError(taskTitleInput, '任务标题不能为空');
            isValid = false;
        } else {
            hideError(taskTitleInput);
        }

        if (taskDescInput.value.trim() === '') {
            showError(taskDescInput, '任务描述不能为空');
            isValid = false;
        } else {
            hideError(taskDescInput);
        }

        if (taskDeadlineInput.value.trim() === '') {
            showError(taskDeadlineInput, '截止日期不能为空');
            isValid = false;
        } else {
            hideError(taskDeadlineInput);
        }

        if (taskPriorityInput.value.trim() === '') {
            showError(taskPriorityInput, '优先级不能为空');
            isValid = false;
        } else {
            hideError(taskPriorityInput);
        }

        if (taskCategoryInput.value.trim() === '') {
            showError(taskCategoryInput, '分类不能为空');
            isValid = false;
        } else {
            hideError(taskCategoryInput);
        }

        return isValid;
    }

    // 添加或编辑任务
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if (validateForm()) {
            const title = taskTitleInput.value.trim();
            const description = taskDescInput.value.trim();
            const deadline = taskDeadlineInput.value.trim();
            const priority = taskPriorityInput.value;
            const category = taskCategoryInput.value.trim();
            const tags = Array.from(document.querySelectorAll('input[name="task-tags"]:checked')).map(tag => tag.value);

            const task = {
                title,
                description,
                deadline,
                priority,
                category,
                tags,
                completed: false,
                notified: false
            };

            const editingIndex = taskForm.dataset.editingIndex;

            if (editingIndex !== undefined) {
                tasks[editingIndex] = task;
                delete taskForm.dataset.editingIndex;
            } else {
                tasks.push(task);
            }

            saveTasks();
            loadTasks();
            taskForm.reset();
        }
    });

    // 编辑任务
    function editTask(index) {
        const task = tasks[index];
        taskTitleInput.value = task.title;
        taskDescInput.value = task.description;
        taskDeadlineInput.value = task.deadline;
        taskPriorityInput.value = task.priority;
        taskCategoryInput.value = task.category;

        // 回填标签
        document.querySelectorAll('input[name="task-tags"]').forEach(tag => {
            tag.checked = task.tags.includes(tag.value);
        });

        taskForm.dataset.editingIndex = index;
    }


    // 删除任务
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        loadTasks();
    }

    // 切换任务状态
    function toggleStatus(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        loadTasks();
    }

    // 事件代理
    taskList.addEventListener('click', function(event) {
        const target = event.target.closest('button');
        if (!target) return;
        const index = target.dataset.index;
        
        if (target.classList.contains('edit')) {
            editTask(index);
        } else if (target.classList.contains('delete')) {
            deleteTask(index);
        } else if (target.classList.contains('toggle-status')) {
            toggleStatus(index);
        }
    });
    // 任务搜索功能
    searchInput.addEventListener('input', function(event) {
        const filter = event.target.value.trim();
        loadTasks(filter, statusFilter.value, categoryFilter.value, tagFilter.value);
    });

    // 任务过滤功能
    statusFilter.addEventListener('change', function(event) {
        const status = event.target.value;
        loadTasks(searchInput.value.trim(), status, categoryFilter.value, tagFilter.value);
    });

    // 任务分类筛选功能
    categoryFilter.addEventListener('change', function(event) {
        const category = event.target.value;
        loadTasks(searchInput.value.trim(), statusFilter.value, category, tagFilter.value);
    });

    // 任务标签筛选功能
    tagFilter.addEventListener('change', function(event) {
        const tag = event.target.value;
        loadTasks(searchInput.value.trim(), statusFilter.value, categoryFilter.value, tag);
    });


    // 初始加载任务
    loadTasks();
})();
