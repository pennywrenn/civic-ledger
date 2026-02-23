// Storage key used to persist task data in the browser.
const STORAGE_KEY = "civicLedgerTasks";

// Cache references to form fields and list container.
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

/**
 * Retrieve saved tasks from localStorage.
 * Falls back to an empty array if no data exists yet.
 */
function loadTasks() {
  const rawTasks = localStorage.getItem(STORAGE_KEY);
  return rawTasks ? JSON.parse(rawTasks) : [];
}

/**
 * Save the task array back to localStorage so tasks persist on reload.
 * @param {Array<Object>} tasks
 */
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Render all tasks into the list UI.
 * @param {Array<Object>} tasks
 */
function renderTasks(tasks) {
  taskList.innerHTML = "";

  // Show a friendly empty state when there are no tasks yet.
  if (tasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No tasks yet. Add your first civic action above.";
    taskList.appendChild(emptyItem);
    return;
  }

  // Build one list item for each task.
  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const title = document.createElement("h3");
    title.textContent = task.title;

    const why = document.createElement("p");
    why.className = "task-meta";
    why.textContent = `Why It Matters: ${task.why}`;

    const domain = document.createElement("p");
    domain.className = "task-meta";
    domain.textContent = `Domain: ${task.domain}`;

    const startDate = document.createElement("p");
    startDate.className = "task-meta";
    startDate.textContent = `Start Date: ${task.startDate}`;

    // Checkbox allows users to mark a task as complete.
    const completeToggleLabel = document.createElement("label");
    completeToggleLabel.className = "complete-toggle";

    const completeToggle = document.createElement("input");
    completeToggle.type = "checkbox";
    completeToggle.checked = task.completed;
    completeToggle.addEventListener("change", () => toggleTaskComplete(task.id));

    completeToggleLabel.append(completeToggle, " Mark complete");

    item.append(title, why, domain, startDate, completeToggleLabel);
    taskList.appendChild(item);
  });
}

/**
 * Toggle completion state for a task and refresh persisted data/UI.
 * @param {string} taskId
 */
function toggleTaskComplete(taskId) {
  const tasks = loadTasks();
  const updatedTasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task,
  );

  saveTasks(updatedTasks);
  renderTasks(updatedTasks);
}

/**
 * Handle form submission to create a new task.
 */
function handleAddTask(event) {
  event.preventDefault();

  const formData = new FormData(taskForm);
  const newTask = {
    id: crypto.randomUUID(),
    title: formData.get("title").toString().trim(),
    why: formData.get("why").toString().trim(),
    domain: formData.get("domain").toString().trim(),
    startDate: formData.get("startDate").toString(),
    completed: false,
  };

  const tasks = loadTasks();
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks(tasks);

  // Reset the form for the next entry.
  taskForm.reset();
}

// Wire up interactions and render any previously saved tasks on initial load.
taskForm.addEventListener("submit", handleAddTask);
renderTasks(loadTasks());
