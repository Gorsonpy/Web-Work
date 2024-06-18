// main.js

import { requestNotificationPermission } from './notifications.js';
import { loadTasks, saveTasks, getTasks, setTasks } from './tasks.js';
import { validateForm, handleFormSubmit, handleEditTask, handleDeleteTask, handleToggleStatus } from './form.js';
import { handleSearchInput, handleStatusFilterChange, handleCategoryFilterChange, handleTagFilterChange } from './filters.js';
import { initDragAndDrop } from './dragAndDrop.js';

(function () {
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

    // 请求通知权限
    requestNotificationPermission();

    // 初始加载任务
    loadTasks('', 'all', '', '', taskList, () => initDragAndDrop(taskList, loadTasks));

    // 表单提交事件
    taskForm.addEventListener('submit', (event) => handleFormSubmit(
        event, taskForm, taskTitleInput, taskDescInput, taskDeadlineInput, taskPriorityInput, taskCategoryInput, taskList, () => initDragAndDrop(taskList, loadTasks)
    ));

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

    // 定时检查任务
    setInterval(() => {
        loadTasks('', 'all', '', '', taskList, () => initDragAndDrop(taskList, loadTasks));
    }, 60 * 60 * 1000); // 每小时检查一次
})();
