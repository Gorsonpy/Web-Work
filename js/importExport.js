// importExport.js

import { getTasks, setTasks, saveTasks, loadTasks } from './tasks.js';
import { initDragAndDrop } from './dragAndDrop.js';

// 导出任务数据为 JSON 文件
export function exportTasks() {
    const tasks = getTasks();
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'tasks.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// 导入任务数据
export function importTasks(file, taskList) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const jsonStr = event.target.result;
        try {
            const importedTasks = JSON.parse(jsonStr);
            const existingTasks = getTasks();
            const mergedTasks = existingTasks.concat(importedTasks);
            setTasks(mergedTasks);
            saveTasks();
            loadTasks('', 'all', '', '', taskList, initDragAndDrop);
        } catch (error) {
            console.error('导入任务数据失败: ', error);
        }
    };
    reader.readAsText(file);
}
