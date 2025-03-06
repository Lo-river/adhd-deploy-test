


// KODEN NEDAN OKEJ - INNAN FILTER/SORT

document.addEventListener("DOMContentLoaded", function () {
    // Hämtar element
    const habitPopup = document.getElementById("habit-popup");
    const ctaButton = document.querySelector(".cta-button");
    const cancelButton = document.getElementById("cancel-btn");
    const saveButton = document.getElementById("save-btn");
    const habitList = document.getElementById("habit-list");
    


    //Habit filter & sort
    const titleInput = document.getElementById("habit-title");
    const repetitionDisplay = document.getElementById("habit-repetition-display");
    const habitPriorityBtn = document.getElementById("habit-priority-btn");
    const habitCategoryBtn = document.getElementById("habit-category-btn");
    const popupEditBtn = document.getElementById("popup-edit-btn");
    

    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    let currentEditingHabitId = null;
    let currentHabit = null; // den aktuella habit
    let currentFilterPriority = "all";
    let repetitionsSortAscending = true;
    let prioritySortAscending = true;



    function openPopup(habit = null, isEdible = true) {
      document.body.classList.add("editing-mode");
      habitPopup.style.display = "flex";

      if (isEdible) {
        titleInput.removeAttribute("disabled");
        habitPriorityBtn.removeAttribute("disabled");
        habitCategoryBtn.removeAttribute("disabled");
      } else {
        titleInput.setAttribute("disabled", "true");
        habitPriorityBtn.setAttribute("disabled", "true");
        habitCategoryBtn.setAttribute("disabled", "true");
      }
  
      if (habit) {
        // Redigerings/visningsläge
        titleInput.value = habit.title;
        const priorityOptions = document.getElementsByName("habit-priority");
        priorityOptions.forEach(opt => {
          opt.checked = (opt.value === habit.priority);
          if (opt.checked) {
            habitPriorityBtn.querySelector("span").textContent = opt.parentElement.textContent.trim();
          }
        });
        // Sätt repetitionsvärde i displayen
        repetitionDisplay.textContent = habit.repetitions;
        const categoryOptions = document.getElementsByName("habit-category");
        categoryOptions.forEach(opt => {
          opt.checked = (opt.value === habit.category);
          if (opt.checked) {
            habitCategoryBtn.querySelector("span").textContent = opt.parentElement.textContent.trim();
          }
        });
        currentEditingHabitId = habit.id;
        currentHabit = habit;
      } else {
        // Ny vana
        titleInput.value = "";
        habitPriorityBtn.querySelector("span").textContent = "Choose priority";
        habitCategoryBtn.querySelector("span").textContent = "Choose category";
        document.getElementsByName("habit-priority").forEach(opt => opt.checked = false);
        document.getElementsByName("habit-category").forEach(opt => opt.checked = false);
        repetitionDisplay.textContent = "0";
        currentEditingHabitId = null;
        currentHabit = { repetitions: 0 };
      }
    }
    
    function closePopupFunc() {
      document.body.classList.remove("editing-mode");
      habitPopup.style.display = "none";
    }
  
    function saveHabit() {
      const title = titleInput.value.trim();
      const priorityOptions = document.getElementsByName("habit-priority");
      let selectedPriority = "";
      priorityOptions.forEach(opt => {
        if (opt.checked) selectedPriority = opt.value;
      });
      // Hämta repetitionsvärde från displayen
      const repetitions = parseInt(repetitionDisplay.textContent) || 0;
      const categoryOptions = document.getElementsByName("habit-category");
      let selectedCategory = "";
      categoryOptions.forEach(opt => {
        if (opt.checked) selectedCategory = opt.value;
      });
  
      if (title === "") {
        alert("Please enter a habit title!");
        return;
      }
  
      if (currentEditingHabitId !== null) {
        const habitIndex = habits.findIndex(h => h.id === currentEditingHabitId);
        if (habitIndex !== -1) {
          habits[habitIndex] = { 
            id: currentEditingHabitId, 
            title, 
            priority: selectedPriority,
            repetitions, 
            category: selectedCategory
          };
        }
      } else {
        const newHabit = {
          id: Date.now(),
          title,
          priority: selectedPriority,
          repetitions: repetitions,
          category: selectedCategory
        };
        habits.push(newHabit);
      }
  
      localStorage.setItem("habits", JSON.stringify(habits));
      renderHabits();
      closePopupFunc();
    }
  
    function renderHabits() {
      habitList.innerHTML = "";
      habits.forEach(habit => {
        const habitCard = document.createElement("div");
        habitCard.classList.add("habit-card");

        habitCard.innerHTML = ` 
          <div class="habit-card-inner">
              <div class="habit-card-header" id="habit-trash-edit">
                <button class="delete-btn" data-id="${habit.id}"></button>
                <h2 class="habit-category">${habit.category}</h2>
                <button class="edit-btn" data-id="${habit.id}"></button>
              </div>
              <hr class="habit-divider">
              <div class="habit-card-body">
                <div class="habit-icon" id="habit-icon-${habit.id}"></div>
              </div>
              <div class="habit-card-footer">
                <span class="habit-repetitions">Rep. ${habit.repetitions} </span>
              </div>
          </div>
        `;
        habitList.appendChild(habitCard);

        const habitIcon = document.getElementById(`habit-icon-${habit.id}`);
        if (habit.category === "Workout") {
          habitIcon.innerHTML = `<img src="/images/habits/habits-workout.svg" alt="Workout icon" data-id="${habit.id}">`;
        } else if (habit.category === "Study") {
          habitIcon.innerHTML = `<img src="/images/habits/habits-study.svg" alt="Study icon" data-id="${habit.id}">`;
        } else if (habit.category === "Clean") {
          habitIcon.innerHTML = `<img src="/images/habits/habits-clean.svg" alt="Cleaning icon" data-id="${habit.id}">`;
        } else {
          habitIcon.innerHTML = `<img src="/images/habit-no-category.svg" alt="Default icon" data-id="${habit.id}">`;
        }
    
        habitIcon.addEventListener("click", function(){
          openPopup(habit, false);
        });
      });
      
      document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          const habitId = parseInt(this.getAttribute("data-id"));
          const habit = habits.find(h => h.id === habitId);
          if (habit) {
            openPopup(habit, true);
          }
        });
      });
  
      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          const habitId = parseInt(this.getAttribute("data-id"));
          habits = habits.filter(habit => habit.id !== habitId);
          localStorage.setItem("habits", JSON.stringify(habits));
          renderHabits();
        });
      });
    }
  
    // Eventlistners för repetitionsknapparna
    const increaseButton = document.getElementById("add-repetition");
    const decreaseButton = document.getElementById("sub-repetition");
    const resetButton = document.getElementById("reset-repetition");

    increaseButton.addEventListener("click", function() {
      let count = parseInt(repetitionDisplay.textContent) || 0;
      count++;
      repetitionDisplay.textContent = count;
      if (currentHabit && currentHabit.id) {
        currentHabit.repetitions = count;
        updateHabit(currentHabit);
      } else if (currentHabit) {
        currentHabit.repetitions = count;
      }
    });

    decreaseButton.addEventListener("click", function() {
      let count = parseInt(repetitionDisplay.textContent) || 0;
      if (count > 0) {
        count--;
        repetitionDisplay.textContent = count;
        if (currentHabit && currentHabit.id) {
          currentHabit.repetitions = count;
          updateHabit(currentHabit);
        } else if (currentHabit) {
          currentHabit.repetitions = count;
        }
      }
    });
    
    resetButton.addEventListener("click", function() {
      let count = 0;
      repetitionDisplay.textContent = count;
      if (currentHabit && currentHabit.id) {
        currentHabit.repetitions = count;
        updateHabit(currentHabit);
      } else if (currentHabit) {
        currentHabit.repetitions = count;
      }
    });

    function updateHabit(updatedHabit) {
      const habitIndex = habits.findIndex(h => h.id === updatedHabit.id);
      if (habitIndex !== -1) {
        habits[habitIndex] = updatedHabit;
        localStorage.setItem("habits", JSON.stringify(habits));
        renderHabits();
        openPopup(updatedHabit, false);
      }
    }
  
    // Eventlistner för popup edit-knappen ( class="edit-btn" )
    popupEditBtn.addEventListener("click", function() {
      if (currentHabit) {
        openPopup(currentHabit, true);
      }
    });
  
    ctaButton.addEventListener("click", () => openPopup(null));
    cancelButton.addEventListener("click", closePopupFunc);
    saveButton.addEventListener("click", saveHabit);
  
    //Priority
    const habitPrioritySelect = document.getElementById("habit-priority-select");
    const habitPriorityMenu = document.getElementById("habit-priority-menu");
    habitPriorityBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      habitPrioritySelect.classList.toggle("active");
    });
    const priorityCheckboxes = habitPriorityMenu.querySelectorAll('input[type="checkbox"]');
    priorityCheckboxes.forEach(option => {
      option.addEventListener("change", function () {
        priorityCheckboxes.forEach(opt => {
          if (opt !== option) opt.checked = false;
        });
        if (option.checked) {
          habitPriorityBtn.querySelector("span").textContent = option.parentElement.textContent.trim();
        } else {
          habitPriorityBtn.querySelector("span").textContent = "";
        }
        habitPrioritySelect.classList.remove("active");
      });
    });
  
    //Categoriy
    const habitCategorySelect = document.getElementById("habit-category-select");
    const habitCategoryMenu = document.getElementById("habit-category-menu");
    habitCategoryBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      habitCategorySelect.classList.toggle("active");
    });
    const categoryCheckboxes = habitCategoryMenu.querySelectorAll('input[type="checkbox"]');
    categoryCheckboxes.forEach(option => {
      option.addEventListener("change", function () {
        categoryCheckboxes.forEach(opt => {
          if (opt !== option) opt.checked = false;
        });
        if (option.checked) {
          habitCategoryBtn.querySelector("span").textContent = option.parentElement.textContent.trim();
        } else {
          habitCategoryBtn.querySelector("span").textContent = "Choose category";
        }
        habitCategorySelect.classList.remove("active");
      });
    });
  
    document.addEventListener("click", function() {
      habitPrioritySelect.classList.remove("active");
      habitCategorySelect.classList.remove("active");
    });
  
    renderHabits();
});




// NY SISTA INNNAN SOV: (använd den över) + den undra för filter/sortering

document.addEventListener("DOMContentLoaded", function () {
  // Hämta element
  const habitPopup = document.getElementById("habit-popup");
  const ctaButton = document.querySelector(".cta-button");
  const cancelButton = document.getElementById("cancel-btn");
  const saveButton = document.getElementById("save-btn");
  const habitList = document.getElementById("habit-list");
  
  const titleInput = document.getElementById("habit-title");
  // Använd display istället för ett inputfält för repetition
  const repetitionDisplay = document.getElementById("habit-repetition-display");
  
  const habitPriorityBtn = document.getElementById("habit-priority-btn");
  const habitCategoryBtn = document.getElementById("habit-category-btn");
  
  // Popup edit-knapp (används som en riktig knapp med klassen "edit-btn")
  const popupEditBtn = document.getElementById("popup-edit-btn");
  
  let habits = JSON.parse(localStorage.getItem("habits")) || [];
  let currentEditingHabitId = null;
  let currentHabit = null; // Variabel för aktuell vana

  function openPopup(habit = null, isEdible = true) {
    document.body.classList.add("editing-mode");
    habitPopup.style.display = "flex";

    if (isEdible) {
      titleInput.removeAttribute("disabled");
      habitPriorityBtn.removeAttribute("disabled");
      habitCategoryBtn.removeAttribute("disabled");
    } else {
      titleInput.setAttribute("disabled", "true");
      habitPriorityBtn.setAttribute("disabled", "true");
      habitCategoryBtn.setAttribute("disabled", "true");
    }

    if (habit) {
      // Redigerings- eller visningsläge
      titleInput.value = habit.title;
      const priorityOptions = document.getElementsByName("habit-priority");
      priorityOptions.forEach(opt => {
        opt.checked = (opt.value === habit.priority);
        if (opt.checked) {
          habitPriorityBtn.querySelector("span").textContent = opt.parentElement.textContent.trim();
        }
      });
      // Sätt repetitionsvärde 
      repetitionDisplay.textContent = habit.repetitions;
      const categoryOptions = document.getElementsByName("habit-category");
      categoryOptions.forEach(opt => {
        opt.checked = (opt.value === habit.category);
        if (opt.checked) {
          habitCategoryBtn.querySelector("span").textContent = opt.parentElement.textContent.trim();
        }
      });
      currentEditingHabitId = habit.id;
      currentHabit = habit;
    } else {
      // Ny vana
      titleInput.value = "";
      habitPriorityBtn.querySelector("span").textContent = "Choose priority";
      habitCategoryBtn.querySelector("span").textContent = "Choose category";
      document.getElementsByName("habit-priority").forEach(opt => opt.checked = false);
      document.getElementsByName("habit-category").forEach(opt => opt.checked = false);
      repetitionDisplay.textContent = "0";
      currentEditingHabitId = null;
      currentHabit = { repetitions: 0 };
    }
  }
  
  function closePopupFunc() {
    document.body.classList.remove("editing-mode");
    habitPopup.style.display = "none";
  }

  function saveHabit() {
    const title = titleInput.value.trim() || "Titel"; // Sätt "Titel" som standard om inputfältet är tomt
    const priorityOptions = document.getElementsByName("habit-priority");
    let selectedPriority = "";
    priorityOptions.forEach(opt => {
      if (opt.checked) selectedPriority = opt.value;
    });
    // Hämta repetitionsvärde 
    const repetitions = parseInt(repetitionDisplay.textContent) || 0;
    const categoryOptions = document.getElementsByName("habit-category");
    let selectedCategory = "";
    categoryOptions.forEach(opt => {
      if (opt.checked) selectedCategory = opt.value;
    });

    if (title === "Titel") {
      alert("Please enter a habit title!");
      return;
    }

    if (currentEditingHabitId !== null) {
      const habitIndex = habits.findIndex(h => h.id === currentEditingHabitId);
      if (habitIndex !== -1) {
        habits[habitIndex] = { 
          id: currentEditingHabitId, 
          title, 
          priority: selectedPriority,
          repetitions, 
          category: selectedCategory
        };
      }
    } else {
      const newHabit = {
        id: Date.now(),
        title,
        priority: selectedPriority,
        repetitions: repetitions,
        category: selectedCategory
      };
      habits.push(newHabit);
    }

    localStorage.setItem("habits", JSON.stringify(habits));
    renderHabits();
    closePopupFunc();
  }

  function renderHabits() {
    habitList.innerHTML = "";
    habits.forEach(habit => {
      const habitCard = document.createElement("div");
      habitCard.classList.add("habit-card");

      habitCard.innerHTML = ` 
        <div class="habit-card-inner">
            <div class="habit-card-header" id="habit-trash-edit">
              <button class="delete-btn" data-id="${habit.id}"></button>
              <h2 class="habit-category">${habit.category}</h2>
              <button class="edit-btn" data-id="${habit.id}"></button>
            </div>
            <hr class="habit-divider">
            <div class="habit-card-body">
              <div class="habit-icon" id="habit-icon-${habit.id}"></div>
            </div>
            <div class="habit-card-footer">
              <span class="habit-repetitions">Rep. ${habit.repetitions} </span>
            </div>
        </div>
      `;
      habitList.appendChild(habitCard);

      const habitIcon = document.getElementById(`habit-icon-${habit.id}`);
      if (habit.category === "Workout") {
        habitIcon.innerHTML = `<img src="/images/habits/habits-workout.svg" alt="Workout icon" data-id="${habit.id}">`;
      } else if (habit.category === "Study") {
        habitIcon.innerHTML = `<img src="/images/habits/habits-study.svg" alt="Study icon" data-id="${habit.id}">`;
      } else if (habit.category === "Clean") {
        habitIcon.innerHTML = `<img src="/images/habits/habits-clean.svg" alt="Cleaning icon" data-id="${habit.id}">`;
      } else {
        habitIcon.innerHTML = `<img src="/images/habit-no-category.svg" alt="Default icon" data-id="${habit.id}">`;
      }
  
      habitIcon.addEventListener("click", function(){
        openPopup(habit, false);
      });
    });
    
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        const habitId = this.dataset.id;
        const habit = habits.find(h => h.id === parseInt(habitId));
        openPopup(habit);
      });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        const habitId = this.dataset.id;
        habits = habits.filter(h => h.id !== parseInt(habitId));
        localStorage.setItem("habits", JSON.stringify(habits));
        renderHabits();
      });
    });
  }
  
  ctaButton.addEventListener("click", () => openPopup());
  cancelButton.addEventListener("click", closePopupFunc);
  saveButton.addEventListener("click", saveHabit);

  renderHabits();
});

document.addEventListener("DOMContentLoaded", () => {
  setupFilterMenu();
  setupSorting();
  loadHabitsFromLocalStorage();
});

// Håller koll på de lagrade vanorna
let habits = [];

// Funktion för att ladda vanor från Local Storage
function loadHabitsFromLocalStorage() {
  const habitContainer = document.getElementById("habit-container");
  habitContainer.innerHTML = "";

  // Ladda vanorna från localStorage
  habits = JSON.parse(localStorage.getItem("habits")) || [];

  // Filtrera och visa vanorna
  habits.forEach(habit => renderHabit(habit));
}

// Funktion för att visa varje habit
function renderHabit(habit) {
  const habitContainer = document.getElementById("habit-container");
  const habitCard = document.createElement("div");
  habitCard.classList.add("habit-card");

  habitCard.innerHTML = `
      <h3>${habit.name}</h3>
      <p>Repetitioner: <span class="repetitions">${habit.repetitions}</span></p>
      <p>Prioritet: <span class="priority">${habit.priority}</span></p>
      <button class="increase-btn" data-id="${habit.id}">Öka</button>
      <button class="decrease-btn" data-id="${habit.id}">Minska</button>
      <button class="reset-btn" data-id="${habit.id}">Nollställ</button>
  `;

  // Lägg till eventlistners för öka, minska och nollställ
  habitCard.querySelector(".increase-btn").addEventListener("click", () => updateRepetitions(habit.id, 1));
  habitCard.querySelector(".decrease-btn").addEventListener("click", () => updateRepetitions(habit.id, -1));
  habitCard.querySelector(".reset-btn").addEventListener("click", () => resetRepetitions(habit.id));

  habitContainer.appendChild(habitCard);
}

// Funktion för att uppdatera repetitioner för en habit
function updateRepetitions(id, change) {
  habits = habits.map(habit => {
      if (habit.id === id) {
          habit.repetitions += change;
      }
      return habit;
  });
  localStorage.setItem("habits", JSON.stringify(habits));
  loadHabitsFromLocalStorage(); // Ladda om vanorna för att uppdatera visningen
}

// Funktion för att nollställa repetitioner för en habit
function resetRepetitions(id) {
  habits = habits.map(habit => {
      if (habit.id === id) {
          habit.repetitions = 0;
      }
      return habit;
  });
  localStorage.setItem("habits", JSON.stringify(habits));
  loadHabitsFromLocalStorage(); // Ladda om vanorna för att uppdatera visningen
}

// Funktion för att hantera filtermenyn
function setupFilterMenu() {
  const filterBtn = document.getElementById("filter-btn");
  const filterMenu = document.getElementById("filter-menu");
  const filterPriority = document.getElementById("filter-priority");

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

  if (filterPriority) {
      filterPriority.addEventListener("change", function () {
          const selectedPriority = this.value;
          filterHabits(selectedPriority);
      });
  }
}

// Funktion för att filtrera habits på prioritet
function filterHabits(priority) {
  const filteredHabits = habits.filter(habit => {
      return priority === "all" || habit.priority === priority;
  });

  // Visa endast de filtrerade vanorna
  const habitContainer = document.getElementById("habit-container");
  habitContainer.innerHTML = "";
  filteredHabits.forEach(habit => renderHabit(habit));
}

// Funktion för att hantera sortering
function setupSorting() {
  const sortBtn = document.getElementById("sort-btn");
  let isSortedAscending = true;

  sortBtn.addEventListener("click", () => {
      if (isSortedAscending) {
          habits.sort((a, b) => a.repetitions - b.repetitions); // Sortera på repetitioner, stigande
      } else {
          habits.sort((a, b) => b.repetitions - a.repetitions); // Sortera på repetitioner, fallande
      }

      isSortedAscending = !isSortedAscending;
      localStorage.setItem("habits", JSON.stringify(habits));
      loadHabitsFromLocalStorage(); // Ladda om vanorna efter sortering
  });

  const prioritySortBtn = document.getElementById("priority-sort-btn");
  let isPrioritySortedAscending = true;

  prioritySortBtn.addEventListener("click", () => {
      if (isPrioritySortedAscending) {
          habits.sort((a, b) => a.priority.localeCompare(b.priority)); // Sortera på prioritet, stigande
      } else {
          habits.sort((a, b) => b.priority.localeCompare(a.priority)); // Sortera på prioritet, fallande
      }

      isPrioritySortedAscending = !isPrioritySortedAscending;
      localStorage.setItem("habits", JSON.stringify(habits));
      loadHabitsFromLocalStorage(); // Ladda om vanorna efter sortering
  });
}






// KODEN ÖVER OKEJ OCH SOM SKA ANVÄNDAS- INNAN FILTER/SORT
