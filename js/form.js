// form.js

import { saveTasks, loadTasks, getTasks, setTasks } from './tasks.js';

export function validateForm(taskTitleInput, taskDescInput, taskDeadlineInput, taskPriorityInput, taskCategoryInput) {
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

export function handleFormSubmit(event, taskForm, taskTitleInput, taskDescInput, taskDeadlineInput, taskPriorityInput, taskCategoryInput, taskList, initDragAndDrop) {
    event.preventDefault();

    if (validateForm(taskTitleInput, taskDescInput, taskDeadlineInput, taskPriorityInput, taskCategoryInput)) {
        const title = taskTitleInput.value.trim();
        const description = taskDescInput.value.trim();
        const deadline = taskDeadlineInput.value.trim();
        const priority = taskPriorityInput.value;
        const category = taskCategoryInput.value.trim();
        const tags = Array.from(document.querySelectorAll('input[name="task-tags"]:checked')).map(tag => tag.value);
        const progress = document.getElementById('task-progress').value; // 获取进度值
        const comments = document.getElementById('task-comments').value.trim().split('\n'); // 获取评论
        const attachmentsInput = document.getElementById('task-attachments');
        const attachments = Array.from(attachmentsInput.files).map(file => {
            return {
                name: file.name,
                url: URL.createObjectURL(file)
            };
        });

        const task = {
            title,
            description,
            deadline,
            priority,
            category,
            tags,
            completed: false,
            notified: false,
            progress: progress, // 设置进度值
            comments: comments, // 设置评论
            attachments: attachments // 设置附件
        };

        const editingIndex = taskForm.dataset.editingIndex;
        let tasks = getTasks();

        if (editingIndex !== undefined) {
            tasks[editingIndex] = task;
            delete taskForm.dataset.editingIndex;
        } else {
            tasks.push(task);
        }

        setTasks(tasks);
        saveTasks();
        loadTasks('', 'all', '', '', taskList, initDragAndDrop);
        taskForm.reset();
        document.querySelector('.progress-value').textContent = '0%'; // 重置进度显示
    }
}

function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
}

function hideError(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = '';
    }
}

export function handleEditTask(index, taskTitleInput, taskDescInput, taskDeadlineInput, taskPriorityInput, taskCategoryInput, taskForm) {
    let tasks = getTasks();
    const task = tasks[index];
    taskTitleInput.value = task.title;
    taskDescInput.value = task.description;
    taskDeadlineInput.value = task.deadline;
    taskPriorityInput.value = task.priority;
    taskCategoryInput.value = task.category;
    document.getElementById('task-progress').value = task.progress; // 设置进度值
    document.querySelector('.progress-value').textContent = `${task.progress}%`; // 更新进度显示
    document.getElementById('task-comments').value = task.comments.join('\n'); // 设置评论

    // 回填标签
    document.querySelectorAll('input[name="task-tags"]').forEach(tag => {
        tag.checked = task.tags.includes(tag.value);
    });

    taskForm.dataset.editingIndex = index;
}

export function handleDeleteTask(index, taskList, initDragAndDrop) {
    let tasks = getTasks();
    tasks.splice(index, 1);
    setTasks(tasks);
    saveTasks();
    loadTasks('', 'all', '', '', taskList, initDragAndDrop);
}

export function handleToggleStatus(index, taskList, initDragAndDrop) {
    let tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    setTasks(tasks);
    saveTasks();
    loadTasks('', 'all', '', '', taskList, initDragAndDrop);
}
