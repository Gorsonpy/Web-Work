import langEn from './lang-en.js';
import langZh from './lang-zh.js';

export function initLanguageSwitch() {
    const langSwitch = document.getElementById('language-switch');
    const lang = localStorage.getItem('language') || 'zh';
    let translations = lang === 'zh' ? langZh : langEn;

    function applyTranslations() {
        const pageTitleElement = document.getElementById('page-title');
        const titleElement = document.getElementById('title');
        const addTaskElement = document.getElementById('add-task');
        const taskTitleElement = document.querySelector('label[for="task-title"]');
        const taskDescElement = document.querySelector('label[for="task-desc"]');
        const deadlineElement = document.querySelector('label[for="task-deadline"]');
        const categoryElement = document.querySelector('label[for="task-category"]');
        const tagsElement = document.querySelector('#task-tags').previousElementSibling;
        const priorityElement = document.querySelector('label[for="task-priority"]');
        const taskProgressElement = document.querySelector('label[for="task-progress"]');
        const commentsElement = document.querySelector('label[for="task-comments"]');
        const attachmentsElement = document.querySelector('label[for="task-attachments"]');
        const saveTaskElement = document.getElementById('save-task');
        const exportTasksButtonElement = document.getElementById('export-tasks');
        const importTasksButtonElement = document.getElementById('import-tasks-button');
        const toggleDarkModeButtonElement = document.getElementById('toggle-dark-mode');
        const taskListElement = document.querySelector('#task-list-section h2');
        const searchTasksElement = document.getElementById('search-input');
        const categoryFilterElement = document.querySelector('select[id="category-filter"] option[value=""]');
        const tagFilterElement = document.querySelector('select[id="tag-filter"] option[value=""]');
        const statusFilterAllElement = document.querySelector('select[id="status-filter"] option[value="all"]');
        const statusFilterCompletedElement = document.querySelector('select[id="status-filter"] option[value="completed"]');
        const statusFilterIncompleteElement = document.querySelector('select[id="status-filter"] option[value="incomplete"]');

        // 添加更多需要翻译的元素
        const categoryOptions = document.querySelectorAll('#task-category option');
        const categoryFilterOptions = document.querySelectorAll('#category-filter option');
        const tagLabels = document.querySelectorAll('#task-tags label');
        const tagFilterOptions = document.querySelectorAll('#tag-filter option');
        const priorityOptions = document.querySelectorAll('#task-priority option');

        if (pageTitleElement) pageTitleElement.textContent = translations.title;
        if (titleElement) titleElement.textContent = translations.title;
        if (addTaskElement) addTaskElement.textContent = translations.addTask;
        if (taskTitleElement) taskTitleElement.textContent = translations.taskTitle;
        if (taskDescElement) taskDescElement.textContent = translations.taskDescription;
        if (deadlineElement) deadlineElement.textContent = translations.deadline;
        if (categoryElement) categoryElement.textContent = translations.category;
        if (tagsElement) tagsElement.textContent = translations.tags;
        if (priorityElement) priorityElement.textContent = translations.priority;
        if (taskProgressElement) taskProgressElement.textContent = translations.taskProgress;
        if (commentsElement) commentsElement.textContent = translations.comments;
        if (attachmentsElement) attachmentsElement.textContent = translations.attachments;
        if (saveTaskElement) saveTaskElement.textContent = translations.saveTask;
        if (exportTasksButtonElement) exportTasksButtonElement.textContent = translations.exportTasks;
        if (importTasksButtonElement) importTasksButtonElement.textContent = translations.importTasks;
        if (toggleDarkModeButtonElement) toggleDarkModeButtonElement.textContent = translations.toggleDarkMode;
        if (taskListElement) taskListElement.textContent = translations.taskList;
        if (searchTasksElement) searchTasksElement.placeholder = translations.searchTasks;
        if (categoryFilterElement) categoryFilterElement.textContent = translations.allCategories;
        if (tagFilterElement) tagFilterElement.textContent = translations.allTags;
        if (statusFilterAllElement) statusFilterAllElement.textContent = translations.allTasks;
        if (statusFilterCompletedElement) statusFilterCompletedElement.textContent = translations.completed;
        if (statusFilterIncompleteElement) statusFilterIncompleteElement.textContent = translations.incomplete;

        // 应用翻译到任务分类选项
        categoryOptions.forEach(option => {
            if (translations[option.value]) {
                option.textContent = translations[option.value];
            }
        });

        // 应用翻译到分类过滤选项
        categoryFilterOptions.forEach(option => {
            if (translations[option.value] || option.value === '') {
                option.textContent = option.value === '' ? translations.allCategories : translations[option.value];
            }
        });

        // 应用翻译到任务标签选项
        tagLabels.forEach(label => {
            const input = label.querySelector('input');
            if (translations[input.value]) {
                const text = translations[input.value];
                label.innerHTML = `<input type="checkbox" name="task-tags" value="${input.value}"> ${text}`;
            }
        });

        // 应用翻译到标签过滤选项
        tagFilterOptions.forEach(option => {
            if (translations[option.value] || option.value === '') {
                option.textContent = option.value === '' ? translations.allTags : translations[option.value];
            }
        });

        // 应用翻译到优先级选项
        priorityOptions.forEach(option => {
            if (translations[option.value]) {
                option.textContent = translations[option.value];
            }
        });

        // 设置文件输入的翻译
        const fileInputLabel = document.getElementById('file-label');
        if (fileInputLabel) {
            fileInputLabel.textContent = translations.attachments;
        }

        // 重新创建文件输入控件以应用翻译
        const fileInputElement = document.getElementById('task-attachments');
        if (fileInputElement) {
            const fileInputParent = fileInputElement.parentElement;
            const newFileInputElement = fileInputElement.cloneNode(true);
            fileInputParent.replaceChild(newFileInputElement, fileInputElement);
        }
    }

    langSwitch.value = lang; // 设置下拉菜单的值为当前语言
    langSwitch.addEventListener('change', function () {
        const selectedLang = langSwitch.value;
        localStorage.setItem('language', selectedLang);
        translations = selectedLang === 'zh' ? langZh : langEn;
        applyTranslations();
    });

    applyTranslations();
}
