document.addEventListener("DOMContentLoaded", function () {
    // Hämta element
    const habitPopup = document.getElementById("habit-popup");
    const ctaButton = document.querySelector(".cta-button");
    const closePopup = document.querySelector(".close-icon");
    const cancelButton = document.getElementById("cancel-btn");
    const saveButton = document.getElementById("save-btn");
    const habitList = document.getElementById("habit-list");
    
    const titleInput = document.getElementById("habit-title");
    const repetitionsInput = document.getElementById("habit-repetition");
    
    // Nya knappar för habit priority och category select
    const habitPriorityBtn = document.getElementById("habit-priority-btn");
    const habitCategoryBtn = document.getElementById("habit-category-btn");
    
    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    let currentEditingHabitId = null;
  
    function openPopup(habit = null) {
      document.body.classList.add("editing-mode");
      habitPopup.style.display = "flex";
  
      // Aktivera inputs- och select-knappar
      titleInput.removeAttribute("disabled");
      habitPriorityBtn.removeAttribute("disabled");
      repetitionsInput.removeAttribute("disabled");
      habitCategoryBtn.removeAttribute("disabled");
  
      if (habit) {
        // formuläret redigering
        titleInput.value = habit.title;
        // priority-select lagrat värde
        const priorityOptions = document.getElementsByName("habit-priority");
        priorityOptions.forEach(opt => {
          opt.checked = (opt.value === habit.priority);
          if (opt.checked) {
            habitPriorityBtn.querySelector("span").textContent = opt.parentElement.textContent.trim();
          }
        });
        repetitionsInput.value = habit.repetitions;
        //  category-select  lagrat värde
        const categoryOptions = document.getElementsByName("habit-category");
        categoryOptions.forEach(opt => {
          opt.checked = (opt.value === habit.category);
          if (opt.checked) {
            habitCategoryBtn.querySelector("span").textContent = opt.parentElement.textContent.trim();
          }
        });
        currentEditingHabitId = habit.id;
      } else {
        // Töm fälten för en ny vana
        titleInput.value = "";
        habitPriorityBtn.querySelector("span").textContent = "Choose priority";
        habitCategoryBtn.querySelector("span").textContent = "Choose category";
        document.getElementsByName("habit-priority").forEach(opt => opt.checked = false);
        document.getElementsByName("habit-category").forEach(opt => opt.checked = false);
        repetitionsInput.value = "";
        currentEditingHabitId = null;
      }
    }
  
    function closePopupFunc() {
      document.body.classList.remove("editing-mode");
      habitPopup.style.display = "none";
    }
  
    function saveHabit() {
      const title = titleInput.value.trim();
      // Hämtar priority-värde
      const priorityOptions = document.getElementsByName("habit-priority");
      let selectedPriority = "";
      priorityOptions.forEach(opt => {
        if (opt.checked) selectedPriority = opt.value;
      });
      const repetitions = repetitionsInput.value;
      // Hämtar category-värde
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
          repetitions,
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
            <div class="habit-actions">        
            <button class="delete-btn" data-id="${habit.id}"></button>
            <button class="edit-btn" data-id="${habit.id}"></button>
          </div>
          <div class"habit-info">
          <h3>${habit.title}</h3>
          <p><strong>Priority:</strong> ${habit.priority}</p>
          <p><strong>Repetitions:</strong> ${habit.repetitions}</p>
          <p><strong>Category:</strong> ${habit.category}</p>
          </div>
  
        `;
        habitList.appendChild(habitCard);
      });
  
      document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          const habitId = parseInt(this.getAttribute("data-id"));
          const habit = habits.find(h => h.id === habitId);
          if (habit) {
            openPopup(habit);
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
  
    // Öppna popup för ny vana
    ctaButton.addEventListener("click", () => openPopup(null));
    closePopup.addEventListener("click", closePopupFunc);
    cancelButton.addEventListener("click", closePopupFunc);
    saveButton.addEventListener("click", saveHabit);
  
    // Hantera Habit Priority Select
    const habitPrioritySelect = document.getElementById("habit-priority-select");
    const habitPriorityMenu = document.getElementById("habit-priority-menu");
    habitPriorityBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      habitPrioritySelect.classList.toggle("active");
    });
    const priorityCheckboxes = habitPriorityMenu.querySelectorAll('input[type="checkbox"]');
    priorityCheckboxes.forEach(option => {
      option.addEventListener("change", function () {
        // Endast ett alternativ får väljas
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
  
    // Hantera Habit Category Select
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
  
    // Stäng select-menyer om man klickar utanför
    document.addEventListener("click", function() {
      habitPrioritySelect.classList.remove("active");
      habitCategorySelect.classList.remove("active");
    });
  
    renderHabits();
  });
  