import { saveTasks, updateTaskIndices, getTasks, setTasks } from './tasks.js';

export function initDragAndDrop(taskList, loadTasks) {
    let draggingEl;

    taskList.addEventListener('dragstart', (e) => {
        draggingEl = e.target;
        e.target.classList.add('dragging');
    });

    taskList.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
        
        const draggable = draggingEl;
        const afterElement = getDragAfterElement(taskList, e.clientY);

        if (draggable) {
            if (afterElement == null) {
                taskList.appendChild(draggable);
            } else {
                taskList.insertBefore(draggable, afterElement);
            }
        
            // 获取新位置
            const newIndex = [...taskList.children].indexOf(draggable);
            const oldIndex = parseInt(draggingEl.dataset.index, 10);
            let tasks = getTasks();
        
            // 更新tasks数组
            if (newIndex >= 0 && newIndex < tasks.length) {
                const [movedTask] = tasks.splice(oldIndex, 1);
                tasks.splice(newIndex, 0, movedTask);
            }
        
            // 更新索引值
            updateTaskIndices(taskList);
            setTasks(tasks);
            saveTasks();
            loadTasks('', 'all', '', '', taskList, initDragAndDrop); // 确保传递正确的taskList
        }
    });

    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (draggable && afterElement) {
            taskList.insertBefore(draggable, afterElement);
        } else if (draggable) {
            taskList.appendChild(draggable);
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
