// filters.js

import { loadTasks } from './tasks.js';

export function handleSearchInput(event, taskList, initDragAndDrop, statusFilter, categoryFilter, tagFilter) {
    const filter = event.target.value.trim();
    loadTasks(filter, statusFilter.value, categoryFilter.value, tagFilter.value, taskList, initDragAndDrop);
}

export function handleStatusFilterChange(event, taskList, initDragAndDrop, searchInput, categoryFilter, tagFilter) {
    const status = event.target.value;
    loadTasks(searchInput.value.trim(), status, categoryFilter.value, tagFilter.value, taskList, initDragAndDrop);
}

export function handleCategoryFilterChange(event, taskList, initDragAndDrop, searchInput, statusFilter, tagFilter) {
    const category = event.target.value;
    loadTasks(searchInput.value.trim(), statusFilter.value, category, tagFilter.value, taskList, initDragAndDrop);
}

export function handleTagFilterChange(event, taskList, initDragAndDrop, searchInput, statusFilter, categoryFilter) {
    const tag = event.target.value;
    loadTasks(searchInput.value.trim(), statusFilter.value, categoryFilter.value, tag, taskList, initDragAndDrop);
}
