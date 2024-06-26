import { requestNotificationPermission } from './notifications.js';
import { loadTasks, saveTasks, getTasks, setTasks } from './tasks.js';
import { addTaskAnimation, removeTaskAnimation, updateTaskAnimation } from './animations.js';
import { validateForm, handleFormSubmit, handleEditTask, handleDeleteTask, handleToggleStatus } from './form.js';
import { handleSearchInput, handleStatusFilterChange, handleCategoryFilterChange, handleTagFilterChange } from './filters.js';
import { initDragAndDrop } from './dragAndDrop.js';
import { exportTasks, importTasks } from './importExport.js';
import { toggleDarkMode, loadDarkModePreference } from './darkMode.js';
import { initLanguageSwitch } from './langSwitch.js';


(function () {
    // 初始化语言切换功能
    initLanguageSwitch();

    // 获取DOM元素
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescInput = document.getElementById('task-desc');
    const taskDeadlineInput = document.getElementById('task-deadline');
    const taskPriorityInput = document.getElementById('task-priority');
    const taskCategoryInput = document.getElementById('task-category');
    const taskProgressInput = document.getElementById('task-progress');
    const taskProgressValue = taskForm.querySelector('.progress-value'); // 获取进度值显示元素
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const categoryFilter = document.getElementById('category-filter');
    const tagFilter = document.getElementById('tag-filter');
    const taskDetailsModal = document.getElementById('task-details-modal');
    const modalContent = document.querySelector('.modal-content');
    const closeModal = document.querySelector('.close');
    const taskDetailsTitle = document.getElementById('task-details-title');
    const taskDetailsDescription = document.getElementById('task-details-description');
    const taskDetailsDeadline = document.getElementById('task-details-deadline');
    const taskDetailsCategory = document.getElementById('task-details-category');
    const taskDetailsTags = document.getElementById('task-details-tags');
    const commentsList = document.getElementById('comments-list');
    const newCommentInput = document.getElementById('new-comment');
    const addCommentButton = document.getElementById('add-comment');
    const attachmentsList = document.getElementById('attachments-list');
    const newAttachmentInput = document.getElementById('new-attachment');
    const addAttachmentButton = document.getElementById('add-attachment');
    const exportButton = document.getElementById('export-tasks');
    const importInput = document.getElementById('import-tasks');
    const importTasksButton = document.getElementById('import-tasks-button');
    const toggleDarkModeButton = document.getElementById('toggle-dark-mode'); 

    // 确保这些元素在页面中存在
    if (!exportButton) {
        console.error("Element with ID 'export-tasks' not found");
    }
    if (!importTasksButton) {
        console.error("Element with ID 'import-tasks-button' not found");
    }
    if (!toggleDarkModeButton) {
        console.error("Element with ID 'toggle-dark-mode' not found");
    }
    
    // 请求通知权限
    requestNotificationPermission();

    // 初始加载任务
    loadTasks('', 'all', '', '', taskList, () => initDragAndDrop(taskList, loadTasks));

    // 加载夜间模式偏好设置
    loadDarkModePreference(); 

    // 表单提交事件
    taskForm.addEventListener('submit', (event) => handleFormSubmit(
        event, taskForm, taskTitleInput, taskDescInput, taskDeadlineInput, taskPriorityInput, taskCategoryInput, taskList, () => initDragAndDrop(taskList, loadTasks)
    ));
    // 导出任务
    exportButton.addEventListener('click', exportTasks); 

    // 导入任务按钮点击事件
    importTasksButton.addEventListener('click', () => {
        importInput.click();
    });

    // 导入任务
    importInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            importTasks(file, taskList);
            importInput.value = ''; // 重置文件输入，以便可以重复导入相同文件
        }
    }); 

    // 切换夜间模式
    toggleDarkModeButton.addEventListener('click', toggleDarkMode);

    // 事件代理
    taskList.addEventListener('click', function(event) {
        const target = event.target.closest('button');
        if (!target) return;
        const index = target.dataset.index;

        if (target.classList.contains('edit')) {
            handleEditTask(index, taskTitleInput, taskDescInput, taskDeadlineInput, taskPriorityInput, taskCategoryInput, taskForm);
        } else if (target.classList.contains('delete')) {
            handleDeleteTask(index, taskList, () => initDragAndDrop(taskList, loadTasks));
        } else if (target.classList.contains('toggle-status')) {
            handleToggleStatus(index, taskList, () => initDragAndDrop(taskList, loadTasks));
        } else if (target.classList.contains('view-details')) {
            viewTaskDetails(index);
        }
    });

    // 任务搜索功能
    searchInput.addEventListener('input', (event) => handleSearchInput(event, taskList, () => initDragAndDrop(taskList, loadTasks), statusFilter, categoryFilter, tagFilter));

    // 任务过滤功能
    statusFilter.addEventListener('change', (event) => handleStatusFilterChange(event, taskList, () => initDragAndDrop(taskList, loadTasks), searchInput, categoryFilter, tagFilter));
    categoryFilter.addEventListener('change', (event) => handleCategoryFilterChange(event, taskList, () => initDragAndDrop(taskList, loadTasks), searchInput, statusFilter, tagFilter));
    tagFilter.addEventListener('change', (event) => handleTagFilterChange(event, taskList, () => initDragAndDrop(taskList, loadTasks), searchInput, statusFilter, categoryFilter));

    // 表单中的任务进度条更新事件
    taskProgressInput.addEventListener('input', function(event) {
        taskProgressValue.textContent = `${event.target.value}%`;
    });

    // 任务进度条更新事件
    taskList.addEventListener('input', function(event) {
        if (event.target.classList.contains('task-progress')) {
            const index = event.target.dataset.index;
            const value = event.target.value;
            updateTaskProgress(index, value);
        }
    });

    // 更新任务进度函数
    function updateTaskProgress(index, value) {
        let tasks = getTasks();
        tasks[index].progress = value;
        setTasks(tasks);
        saveTasks();
        loadTasks('', 'all', '', '', taskList, initDragAndDrop);
        updateProgressValue(index, value);
    }

    // 更新进度条百分比显示
    function updateProgressValue(index, value) {
        const progressValueElements = taskList.querySelectorAll('.progress-value');
        progressValueElements.forEach((element, idx) => {
            if (idx == index) {
                element.textContent = `${value}%`;
            }
        });
    }

    // 查看任务详情
    function viewTaskDetails(index) {
        const tasks = getTasks();
        const task = tasks[index];

        // 确保comments和attachments已定义
        task.comments = task.comments || [];
        task.attachments = task.attachments || [];

        // 将任务索引存储在modal中以便后续使用
        taskDetailsTitle.dataset.index = index;

        taskDetailsTitle.textContent = task.title;
        taskDetailsDescription.textContent = task.description;
        taskDetailsDeadline.textContent = `截止日期: ${task.deadline}`;
        taskDetailsCategory.textContent = `分类: ${task.category}`;
        taskDetailsTags.textContent = `标签: ${task.tags.join(', ')}`;
        commentsList.innerHTML = task.comments.map(comment => `<p>${comment}</p>`).join('');
        attachmentsList.innerHTML = task.attachments.map(file => `<a href="${file.url}" target="_blank">${file.name}</a>`).join('<br>');
        taskDetailsModal.style.display = 'block';
    }

    // 关闭任务详情模态框
    closeModal.onclick = function() {
        taskDetailsModal.style.display = 'none';
    };

    // 添加评论
    addCommentButton.onclick = function() {
        const tasks = getTasks();
        const index = taskDetailsTitle.dataset.index;
        const task = tasks[index];
        const newComment = newCommentInput.value.trim();
        if (newComment) {
            task.comments.push(newComment);
            setTasks(tasks);
            saveTasks();
            viewTaskDetails(index); // 重新加载详情页面
            newCommentInput.value = '';
        }
    };

    // 添加附件
    addAttachmentButton.onclick = function() {
        const tasks = getTasks();
        const index = taskDetailsTitle.dataset.index;
        const task = tasks[index];
        const newAttachments = Array.from(newAttachmentInput.files).map(file => {
            return {
                name: file.name,
                url: URL.createObjectURL(file)
            };
        });
        task.attachments.push(...newAttachments);
        setTasks(tasks);
        saveTasks();
        viewTaskDetails(index); // 重新加载详情页面
        newAttachmentInput.value = '';
    };

    // 定时检查任务
    setInterval(() => {
        loadTasks('', 'all', '', '', taskList, () => initDragAndDrop(taskList, loadTasks));
    }, 60 * 60 * 1000); // 每小时检查一次
})();
