function saveTasks() {
  const activeTasks = Array.from(
    document.getElementById("task-list").children
  ).map((task) => {
    return {
      text: task.querySelector("span").textContent,
      completed: false,
    };
  });

  const completedTasks = Array.from(
    document.getElementById("completed-tasks").children
  ).map((task) => {
    return {
      text: task.querySelector("span").textContent,
      completed: true,
    };
  });

  const allTasks = [...activeTasks, ...completedTasks];
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  tasks.forEach((task) => {
    // ایجاد آیتم جدید وظیفه
    const li = document.createElement("li");
    li.className =
      "flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200";

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.className = "flex-grow";
    li.appendChild(taskText);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "flex space-x-2 rtl:space-x-reverse";

    const doneBtn = document.createElement("button");
    doneBtn.innerHTML = task.completed ? "↩" : "✓";
    doneBtn.className = task.completed
      ? "bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition duration-200"
      : "bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition duration-200";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "حذف";
    deleteBtn.className =
      "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200";
    deleteBtn.addEventListener("click", () => {
      li.remove();
      saveTasks();
    });

    buttonContainer.appendChild(doneBtn);
    buttonContainer.appendChild(deleteBtn);
    li.appendChild(buttonContainer);

    if (task.completed) {
      li.classList.add("bg-green-100");
      taskText.classList.add("line-through", "text-gray-500");

      doneBtn.addEventListener("click", () => {
        moveTaskToActive(li);
        saveTasks();
      });

      document.getElementById("completed-tasks").appendChild(li);
    } else {
      doneBtn.addEventListener("click", () => {
        moveTaskToCompleted(li);
        saveTasks();
      });

      document.getElementById("task-list").appendChild(li);
    }
  });
}

document.getElementById("task-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  const li = document.createElement("li");
  li.className =
    "flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200";

  const taskText = document.createElement("span");
  taskText.textContent = taskInput.value;
  taskText.className = "flex-grow";
  li.appendChild(taskText);

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "flex space-x-2 rtl:space-x-reverse";

  const doneBtn = document.createElement("button");
  doneBtn.innerHTML = "✓";
  doneBtn.className =
    "bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition duration-200";
  doneBtn.addEventListener("click", () => {
    moveTaskToCompleted(li);
    saveTasks();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "حذف";
  deleteBtn.className =
    "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200";
  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  buttonContainer.appendChild(doneBtn);
  buttonContainer.appendChild(deleteBtn);
  li.appendChild(buttonContainer);

  taskList.appendChild(li);
  taskInput.value = "";

  saveTasks();
});

function moveTaskToCompleted(taskElement) {
  const completedTasksList = document.getElementById("completed-tasks");

  taskElement.classList.add("bg-green-100");
  const taskText = taskElement.querySelector("span");
  taskText.classList.add("line-through", "text-gray-500");

  const doneBtn = taskElement.querySelector("button:first-child");
  doneBtn.innerHTML = "↩";
  doneBtn.className =
    "bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition duration-200";

  doneBtn.replaceWith(doneBtn.cloneNode(true));
  taskElement
    .querySelector("button:first-child")
    .addEventListener("click", () => {
      moveTaskToActive(taskElement);
      saveTasks();
    });

  completedTasksList.appendChild(taskElement);

  saveTasks();
}

function moveTaskToActive(taskElement) {
  const activeTasksList = document.getElementById("task-list");

  taskElement.classList.remove("bg-green-100");
  const taskText = taskElement.querySelector("span");
  taskText.classList.remove("line-through", "text-gray-500");

  const returnBtn = taskElement.querySelector("button:first-child");
  returnBtn.innerHTML = "✓";
  returnBtn.className =
    "bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition duration-200";

  returnBtn.replaceWith(returnBtn.cloneNode(true));
  taskElement
    .querySelector("button:first-child")
    .addEventListener("click", () => {
      moveTaskToCompleted(taskElement);
      saveTasks();
    });

  activeTasksList.appendChild(taskElement);

  saveTasks();
}

document
  .getElementById("clear-completed")
  .addEventListener("click", function () {
    const completedTasks = document.getElementById("completed-tasks");
    completedTasks.innerHTML = "";
    saveTasks();
  });

document.addEventListener("DOMContentLoaded", loadTasks);
