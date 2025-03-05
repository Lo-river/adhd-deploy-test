document.addEventListener('DOMContentLoaded', function () {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
  let currentTaskId = null;
  let isEditing = false; // Track if the task is being edited
  let newTaskCreated = false; 

  setupFilterMenu();
  setupSorting();
  
  /* Hantera Popup */
  function openToDoModal(taskId, isEditingMode = false) {
      let todoNode = document.querySelector("#todo");
      if (!todoNode) return;
      
      todoNode.classList.add("todo-active");
      todoNode.style.display = 'block'; 
      currentTaskId = taskId;

      const title = todoNode.querySelector(".todo-title");
      const category = todoNode.querySelector(".category-title");
      const description = todoNode.querySelector(".todo-description");
      const timeEstimateIcon = document.querySelector("#time-estimate-icon-container");
      const saveBtn = document.querySelector(".save-btn");
      const editIcon = document.querySelector(".edit-btn");
      
    // Clear previous modal state
    todoNode.classList.remove("edit-task", "view-task");

    if (isEditingMode) {
        saveBtn.style.display = "block"; // visa save-knappen i redigeringsläge
        editIcon.style.display = "none"; // göm redigeringsikonen
        todoNode.classList.add("edit-task");
    } else {
        saveBtn.style.display = "none"; // göm save-knappen i view-läge
        editIcon.style.display = "block"; // visa redigeringsikonen
        todoNode.classList.add("view-task");
    }
    
    if (tasks[taskId]) {
        title.textContent = tasks[taskId].title;
        category.textContent = tasks[taskId].category;
        description.textContent = tasks[taskId].description;
        
        // In view mode, display the time estimate using the image icon
        const timeEstimate = tasks[taskId].timeEstimate || "Not set";
        
        const timeEstimateIconElement = document.querySelector(".time-estimate-icon");
        const timeEstimateText = document.querySelector("#time-estimate-text");
        if (timeEstimate === "Not set") {
          timeEstimateIconElement.src = "/images/clock-nine-svgrepo-com.svg"; // Default icon for no time estimate
          timeEstimateText.textContent = "Not set";
      } else {
          timeEstimateIconElement.src = "/images/clock-nine-svgrepo-com.svg"; // Change icon based on time estimate
          timeEstimateText.textContent = timeEstimate; // Optional, in case you still want to show text in tooltip
      }
    } else {
        title.textContent = "New Task";
        category.textContent = "No Category";
        description.textContent = "Enter task description...";
        
    }
      // Set contenteditable based on mode
      title.setAttribute("contenteditable", isEditingMode ? "true" : "false");
      category.setAttribute("contenteditable", isEditingMode ? "true" : "false");
      description.setAttribute("contenteditable", isEditingMode ? "true" : "false");
      timeEstimateInput.value = ''; // Empty time estimate for new task
  } 
  // Close modal function
  function closeToDo() {
      let todoNode = document.querySelector("#todo");
      if (!todoNode) return;
      
      newTaskCreated = false;
      isEditing = false;
      todoNode.style.display = 'none'; // Hide the modal

    //   if (newTaskCreated && currentTaskId && !isEditing) { 
    //   delete tasks[currentTaskId]; 
    //   localStorage.setItem("tasks", JSON.stringify(tasks));
    // }
  }
  // Enable editing when "Edit" icon is clicked
  function enableEditing() {
      if (!isEditing) {
          const title = document.querySelector(".todo-title");
          const category = document.querySelector(".category-title");
          const description = document.querySelector(".todo-description");

          // fråga kattis varför listan försvinner när jag lägger in denna kod
          // if (!isEditing) {
          //   // Switch to edit mode
          //   todoNode.classList.remove("view-task"); // Remove view mode class
          //   todoNode.classList.add("edit-task"); // Add edit mode class
          title.setAttribute("contenteditable", "true");
          category.setAttribute("contenteditable", "true");
          description.setAttribute("contenteditable", "true");

          saveBtn.style.display = "block"; // Show save button
          editIcon.style.display = "none"; // Hide edit button
          isEditing = true;
      }
  }
  // Save task function
  function saveTask() {
      if (currentTaskId) {
          const title = document.querySelector(".todo-title").textContent;
          const category = document.querySelector(".category-title").textContent;
          const description = document.querySelector(".todo-description").textContent;
          const timeEstimate = document.querySelector("#time-estimate").value; // Get time estimate value

          tasks[currentTaskId] = { title, category, description, timeEstimate }; // Add time estimate to the task object 
          localStorage.setItem("tasks", JSON.stringify(tasks));
         
          updateTaskList();
          closeToDo();
      }
  }
// Update the task list in the UI
  function updateTaskList(filter = 'all') {
      const taskList = document.getElementById("todo-list");
      taskList.innerHTML = "";
      
      Object.keys(tasks).forEach(taskId => {
          const task = tasks[taskId];
          
          // Filter tasks based on the filter
      if (filter === 'finished' && !task.checked) return;
      if (filter === 'upcoming' && task.checked) return;

          
          const li = document.createElement("li");
          const showTaskBtn = document.createElement("button");
          showTaskBtn.textContent = task.title;
          showTaskBtn.classList.add("show-task-btn");
          showTaskBtn.setAttribute("data-task", taskId);
          showTaskBtn.addEventListener("click", function () {
              openToDoModal(taskId, false); // Open modal in view mode (not editable)
          });

          if (task.checked) {
          li.classList.add("completed"); 
          }

      const checkboxLabel = document.createElement("label");
      checkboxLabel.classList.add("custom-checkbox");
      const checkboxInput = document.createElement("input");
      checkboxInput.type = "checkbox";
      checkboxInput.classList.add("checkbox-input");
      checkboxInput.id = taskId;
      checkboxInput.checked = task.checked || false;
      const checkboxIcon = document.createElement("span");
      checkboxIcon.classList.add("checkbox-icon");
      
      const customIcon = document.createElement("img");
      customIcon.src = task.checked ? "/images/iconchecked.svg" : "/images/iconunchecked.svg";
      checkboxIcon.appendChild(customIcon);
      
      checkboxInput.style.display = "none";
      checkboxLabel.appendChild(checkboxInput);
      checkboxLabel.appendChild(checkboxIcon);
      
      checkboxInput.addEventListener("change", function() {
          task.checked = checkboxInput.checked; 
          localStorage.setItem("tasks", JSON.stringify(tasks)); 
          updateTaskList(filter); 
      
          if (task.checked) {
            showTaskBtn.classList.add("completed")
          }

  // Confetti 
  if (checkboxInput.checked) {
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }
});

          const deleteBtn = document.createElement("button");
          deleteBtn.classList.add("delete-btn");
          deleteBtn.setAttribute("data-task", taskId);
          deleteBtn.addEventListener("click", function () {
              deleteTask(taskId);
          });
    
          li.appendChild(checkboxLabel);
          // li.appendChild(taskTitle);
          li.appendChild(showTaskBtn);
          li.appendChild(deleteBtn);
          taskList.appendChild(li);
      });
  }
  // Add new task function
  function addNewTask() {
      const taskId = "task" + Date.now() + Math.floor(Math.random() * 1000);       
      tasks[taskId] = { title: "New Task", category: "No Category", description: "Enter task details...", checked: false };
      localStorage.setItem("tasks", JSON.stringify(tasks));
      newTaskCreated = true;
  
      updateTaskList();
      currentTaskId = taskId;  
      openToDoModal(taskId, true); // Open in editing mode for a new task
      enableEditing();
  } 
  // Delete task function
  function deleteTask(taskId) {
      delete tasks[taskId];
      localStorage.setItem("tasks", JSON.stringify(tasks));
      updateTaskList();
  }

  // Funktionerna för filter-menyn
function setupFilterMenu() {
  const filterBtn = document.getElementById("filter-btn");
  const filterMenu = document.getElementById("filter-menu");
  const filterFinished = document.getElementById("filter-finished");
  const filterUpcoming = document.getElementById("filter-upcoming");
  // const upcomingSection = document.getElementById("upcoming-section");
  // const finishedSection = document.getElementById("finished-section");

  filterBtn.style.position = "relative";

  // Toggla filter-menyn
  filterBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      filterMenu.classList.toggle("show");
      filterBtn.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
      if (!filterMenu.contains(event.target) && !filterBtn.contains(event.target)) {
          filterMenu.classList.remove("show");
          filterBtn.classList.remove("active");
      }
  });

  if (filterFinished && filterUpcoming) {
      filterFinished.addEventListener("change", function () {
        if (this.checked) {
          updateTaskList('finished'); // Filter only completed tasks
      } else {
          updateTaskList(); // Show all tasks if filter is unchecked
      }
      });

      filterUpcoming.addEventListener("change", function () {
        if (this.checked) {
          updateTaskList('upcoming'); // Filter only upcoming tasks (not checked)
      } else {
          updateTaskList(); // Show all tasks if filter is unchecked
      }

      });
  }
}

// Funktion för att hantera sortering av events
function setupSorting() {
  const sortBtn = document.getElementById("sort-btn");
  const eventsContainer = document.getElementById("events-container");
  const upcomingSection = document.getElementById("upcoming-section");
  const finishedSection = document.getElementById("finished-section");

  let isSortedAscending = true;
  sortBtn.addEventListener("click", () => {
      if (isSortedAscending) {
          eventsContainer.insertBefore(finishedSection, upcomingSection);
      } else {
          eventsContainer.insertBefore(upcomingSection, finishedSection);
      }
      isSortedAscending = !isSortedAscending;
  });
}

  // Event listeners  
  document.getElementById("add-task-btn").addEventListener("click", addNewTask); 
  document.querySelector(".save-btn").addEventListener("click", saveTask); // Save task on save button click
  document.querySelector(".close-icon").addEventListener("click", closeToDo); // Close modal when close icon is clicked
  // document.querySelector(".edit-icon").addEventListener("click", enableEditing);
  document.querySelector(".edit-btn").addEventListener("click", enableEditing); // Enable editing on pen icon click
  
// Fire confetti function
const count = 400,
defaults = {
    origin: { y: 0.91 },
};

function fire(particleRatio, opts) {
confetti(
    Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
    })
);
}

updateTaskList(); 
});

document.querySelector(".edit-btn").addEventListener("click", enableEditing);
