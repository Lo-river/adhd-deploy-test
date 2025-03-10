document.addEventListener('DOMContentLoaded', function () {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || {}; 
  let currentTaskId = null;
  let isEditing = false; 
  let newTaskCreated = false;
  let categories = new Set(); 

  setupFilterMenu();
  setupSorting();
  loadCategories();
  
  updateTaskList();
/* Hantera Popup */
function openToDoModal(isEditingMode = false, taskId = null) {
  let todoNode = document.querySelector("#todo");
  if (!todoNode) return;

  todoNode.classList.add("todo-active");
  todoNode.style.display = 'block';
  
  isEditing = isEditingMode;
  currentTaskId = taskId !== null ? taskId : tasks.length;

  const title = todoNode.querySelector(".todo-title");
  const category = todoNode.querySelector(".category-select");
  const description = todoNode.querySelector(".todo-description");
  // const timeEstimateSection = document.querySelector("#time-estimate-section"); 
  // const timeEstimateIconContainer = document.getElementById("time-estimate-icon-container"); 
  // const timeEstimateInput = document.getElementById("time-estimate"); 
  // const timeEstimateText = document.querySelector("#time-estimate-text"); 
  // const timeEstimateIconElement = document.querySelector(".time-estimate-icon"); 
  const saveBtn = document.querySelector(".save-btn");
  const editIcon = document.querySelector(".edit-btn");
  
  
  todoNode.classList.remove("edit-task", "view-task");

  if (isEditingMode) {
      saveBtn.style.display = "block"; 
      editIcon.style.display = "none"; 
      // timeEstimateSection.style.display = "block"; 
      // timeEstimateIconContainer.style.display = "none"; 
      todoNode.classList.add("edit-task");
  } else {
      saveBtn.style.display = "none"; 
      editIcon.style.display = "block"; 
      // timeEstimateSection.style.display = "none"; 
      // timeEstimateIconContainer.style.display = "block"; 
      todoNode.classList.add("view-task");
  }
  
  if (tasks[taskId]) {
      title.textContent = tasks[taskId].title;
      // category.textContent = tasks[taskId].category;
      description.textContent = tasks[taskId].description;
      
      // Load and display the correct time estimate
      // const timeEstimate = tasks[taskId].timeEstimate || "Not set";
      
      // if (isEditingMode) {
      //     timeEstimateInput.value = tasks[taskId].timeEstimate || ""; 
      // } else {
      //     timeEstimateText.textContent = timeEstimate; 
      //     timeEstimateIconElement.src = "/images/clock-nine-svgrepo-com.svg"; 
      // }
  } else {
      title.textContent = "New Task";
      // category.textContent = "No Category";
      description.textContent = "Enter task description...";
      categorySelect.value = "";     
      // timeEstimateInput.value = ''; 
      // timeEstimateText.textContent = "Not set"; 
  }

  // contenteditable
  title.setAttribute("contenteditable", isEditing ? "true" : "false");
  // category.setAttribute("contenteditable", isEditingMode ? "true" : "false");
  description.setAttribute("contenteditable", isEditing ? "true" : "false");

  populateCategoryDropdown();
}

function loadCategories() {
  const categorySelect = document.getElementById("category-select");
  const categories = JSON.parse(localStorage.getItem("categories")) || ["Work", "Personal"];

  categorySelect.innerHTML = '<option value="">Select Category</option>';
  categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
  });
}

document.getElementById("add-category-btn").addEventListener("click", function () {
  const newCategoryInput = document.getElementById("new-category-input");
  const newCategory = newCategoryInput.value.trim();

  if (newCategory === "") {
      alert("Please enter a category name.");
      return;
  }

  let categories = JSON.parse(localStorage.getItem("categories")) || [];
  if (!categories.includes(newCategory)) {
      categories.push(newCategory);
      localStorage.setItem("categories", JSON.stringify(categories));
      loadCategories(); // Refresh dropdown
  }

  newCategoryInput.value = ""; // Clear input
});

function populateCategoryDropdown() {
  const categorySelect = document.getElementById("category-select");
  categorySelect.innerHTML = `<option value="">Select Category</option>`; 

  categories.forEach(category => {
      let option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
  });
}

  
  function closeToDo() {
      let todoNode = document.querySelector("#todo");
      if (!todoNode) return;
      
      if (newTaskCreated && currentTaskId && !isEditing) { 
        newTaskCreated = false;
      } else if (isEditing && !newTaskCreated) {
      // Only delete if the task doesn't exist in tasks anymore (meaning it wasn't saved)
      if (!tasks[currentTaskId]) {
        delete tasks[currentTaskId]; 
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }
    }

     isEditing = false;
     todoNode.style.display = 'none'; 
     updateTaskList(); 
  }
  // Enable editing when "Edit" icon is clicked
  function enableEditing() {
      if (!isEditing) {
          const title = document.querySelector(".todo-title");
          const category = document.querySelector(".category-title");
          const description = document.querySelector(".todo-description");

          title.setAttribute("contenteditable", "true");
          category.setAttribute("contenteditable", "true");
          description.setAttribute("contenteditable", "true");

          const saveBtn = document.querySelector(".save-btn");
          const editIcon = document.querySelector(".edit-btn");

          saveBtn.style.display = "block"; 
          editIcon.style.display = "none"; 
          isEditing = true;
      }
  }
  
  function saveTask() {
      if (currentTaskId) {
          const title = document.querySelector(".todo-title").textContent;
          const category = document.querySelector(".category-select").value || "Uncategorized";
          const description = document.querySelector(".todo-description").textContent;
          // const timeEstimate = document.querySelector("#time-estimate").value; 

          if (currentTaskId === tasks.length) {
            tasks.push({ title, category, description });
        } else {
            tasks[currentTaskId] = { title, category, description };
        }
    
        categories.add(category); 
        populateCategoryDropdown();
        closeToDo();
    }
  }

    function addNewTask() {
      const taskId = "task" + Date.now() + Math.floor(Math.random() * 1000);       
      tasks[taskId] = { title: "New Task", category: "No Category", description: "Enter task details...", checked: false };
      // localStorage.setItem("tasks", JSON.stringify(tasks));
      newTaskCreated = true;
  
      updateTaskList();
      // currentTaskId = taskId;  
      openToDoModal(taskId, true); 
      enableEditing();
  } 
  // Delete task function
  function deleteTask(taskId) {
    // Remove task from localStorage
      delete tasks[taskId];
      localStorage.setItem("tasks", JSON.stringify(tasks));
      // Remove the task from the UI by updating the task list
      updateTaskList();
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
  // // Add new task function
  // function addNewTask() {
  //     const taskId = "task" + Date.now() + Math.floor(Math.random() * 1000);       
  //     tasks[taskId] = { title: "New Task", category: "No Category", description: "Enter task details...", checked: false };
  //     // localStorage.setItem("tasks", JSON.stringify(tasks));
  //     newTaskCreated = true;
  
  //     updateTaskList();
  //     // currentTaskId = taskId;  
  //     openToDoModal(taskId, true); // Open in editing mode for a new task
  //     enableEditing();
  // } 
   // Delete task function
  // function deleteTask(taskId) {
  //     delete tasks[taskId];
  //     localStorage.setItem("tasks", JSON.stringify(tasks));
  //     updateTaskList();
  // }

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

// Function to update the filter checkboxes icon based on checked state
function updateCheckboxIcon(checkbox) {
  const icon = checkbox.parentElement.querySelector(".checkbox-img");
  if (checkbox.checked) {
    icon.src = "/images/iconchecked.svg"; // Use the checked icon
  } else {
    icon.src = "/images/iconunchecked.svg"; // Use the unchecked icon
  }
}

// Add event listeners to each checkbox
const checkboxes = document.querySelectorAll("#filter-menu input[type='checkbox']");
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function() {
    updateCheckboxIcon(checkbox);
  });
});

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
  document.getElementById("add-task-btn").addEventListener("click", () => openToDoModal(true)); 
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
