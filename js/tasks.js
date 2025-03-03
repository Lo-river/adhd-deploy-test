document.addEventListener('DOMContentLoaded', function () {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
  let currentTaskId = null;
  let isEditing = false;
  let newTaskCreated = false; 
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
      const saveBtn = document.querySelector(".save-btn");
    //   const editIcon = document.querySelector(".edit-icon");
      const editIcon = document.querySelector(".edit-btn");
      
    
    if (isEditingMode) {
        saveBtn.style.display = "block";
        editIcon.style.display = "none";
    } else {
        saveBtn.style.display = "none";
        editIcon.style.display = "block";
    }
    
    if (tasks[taskId]) {
        title.textContent = tasks[taskId].title;
        category.textContent = tasks[taskId].category;
        description.textContent = tasks[taskId].description;
    } else {
        title.textContent = "New Task";
        category.textContent = "No Category";
        description.textContent = "Enter task description...";
    }
  
      
      title.setAttribute("contenteditable", isEditingMode ? "true" : "false");
      category.setAttribute("contenteditable", isEditingMode ? "true" : "false");
      description.setAttribute("contenteditable", isEditingMode ? "true" : "false");
  } 
  function closeToDo() {
      let todoNode = document.querySelector("#todo");
      if (!todoNode) return;
      
      newTaskCreated = false;
      isEditing = false;
      todoNode.style.display = 'none'; 

      if (newTaskCreated && currentTaskId && !isEditing) { 
      delete tasks[currentTaskId]; 
      localStorage.setItem("tasks", JSON.stringify(tasks));
}
    }
  function enableEditing() {
      if (!isEditing) {
          document.querySelector(".todo-title").setAttribute("contenteditable", "true");
          document.querySelector(".category-title").setAttribute("contenteditable", "true");
          document.querySelector(".todo-description").setAttribute("contenteditable", "true");
          isEditing = true;
      }
  }
  function saveTask() {
      if (currentTaskId) {
         
                  // TA BORT KOD //
          // let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
         
          const title = document.querySelector(".todo-title").textContent;
          const category = document.querySelector(".category-title").textContent;
          const description = document.querySelector(".todo-description").textContent;

          tasks[currentTaskId] = { title, category, description }; 
          localStorage.setItem("tasks", JSON.stringify(tasks));
         
          console.log(tasks);
          
          updateTaskList();

          closeToDo();
      }
  }
  function updateTaskList() {
      console.log("Updating Task List", tasks);
      const taskList = document.getElementById("todo-list");
      taskList.innerHTML = "";
      Object.keys(tasks).forEach(taskId => {
          const task = tasks[taskId];
          const li = document.createElement("li");
          
          if (task.checked) {
          li.classList.add("completed"); 
          }

      const taskTitle = document.createElement("span");
      taskTitle.textContent = task.title;
      taskTitle.classList.add("task-title");
      
      
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
          updateTaskList(); 

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

          const showTaskBtn = document.createElement("button");
          showTaskBtn.textContent = task.title;
          showTaskBtn.classList.add("show-task-btn");
          showTaskBtn.setAttribute("data-task", taskId);
          showTaskBtn.addEventListener("click", function () {
              openToDoModal(taskId, false);
          });

          const deleteBtn = document.createElement("button");
          deleteBtn.classList.add("delete-btn");
          deleteBtn.setAttribute("data-task", taskId);
          deleteBtn.addEventListener("click", function () {
              deleteTask(taskId);
          });
    

          li.appendChild(checkboxLabel);
          li.appendChild(taskTitle);
          li.appendChild(showTaskBtn);
          li.appendChild(deleteBtn);
          taskList.appendChild(li);
      });
  }
  function addNewTask() {
      const taskId = "task" + Date.now() + Math.floor(Math.random() * 1000);
      console.log("Current tasks in localStorage:", localStorage.getItem("tasks"));
       
      // TA BORT KOD //
      // if (tasks[taskId]) {
      //   return;   
      // }
      
      tasks[taskId] = { title: "New Task", category: "No Category", description: "Enter task details...", checked: false };
      localStorage.setItem("tasks", JSON.stringify(tasks));
      newTaskCreated = true;
  
      updateTaskList();

      currentTaskId = taskId;  
      openToDoModal(taskId, true);
      enableEditing();
  } 
  function deleteTask(taskId) {
      delete tasks[taskId];
      localStorage.setItem("tasks", JSON.stringify(tasks));
      updateTaskList();
  }
                    // TA BORT KOD //
  //  document.getElementById("todo-list").addEventListener("click", function(event) {
  //      if (event.target && event.target.matches(".checkbox-input")) {
         
  //      }
  //      if (event.target && event.target.matches(".show-task-btn")) {
         
  //      }
  //    });

  document.getElementById("add-task-btn").addEventListener("click", addNewTask);
  document.querySelector(".save-btn").addEventListener("click", saveTask);
  document.querySelector(".close-icon").addEventListener("click", closeToDo);
//   document.querySelector(".edit-icon").addEventListener("click", enableEditing);
  document.querySelector(".edit-btn").addEventListener("click", enableEditing);
  
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

// Förlåt jag hade en commit i task vilket var den här nedanför men vet inte om jag har råkat lägga till den eller om den ska vara där? /Lo :/
function enableEditing() {
  if (!isEditing) {
      document.querySelector(".todo-title").setAttribute("contenteditable", "true");
      document.querySelector(".category-title").setAttribute("contenteditable", "true");
      document.querySelector(".todo-description").setAttribute("contenteditable", "true");
      isEditing = true;
  }
}

// document.querySelector(".edit-icon").addEventListener("click", enableEditing);
document.querySelector(".edit-btn").addEventListener("click", enableEditing);
