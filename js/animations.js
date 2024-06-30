// 添加任务动画
export function addTaskAnimation(taskItem) {
    taskItem.classList.add('adding');
    setTimeout(() => taskItem.classList.remove('adding'), 300);
}

// 删除任务动画
export function removeTaskAnimation(taskItem, callback) {
    taskItem.classList.add('removing');
    setTimeout(() => {
        taskItem.remove();
        if (callback) callback();
    }, 300);
}

// 更新任务动画
export function updateTaskAnimation(taskItem) {
    taskItem.classList.add('updating');
    setTimeout(() => taskItem.classList.remove('updating'), 300);
}
