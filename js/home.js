document.addEventListener("DOMContentLoaded", () => {
    loadHomeData();
  });
  
  function loadHomeData() {
    loadRecentTasks();
    loadTopHabits();
    loadUpcomingEvents();
  }
  
  // 3 senaste EJ UTFÖRDA Tasks
  function loadRecentTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const undoneTasks = tasks.filter(task => !task.done);
    undoneTasks.sort((a, b) => b.id - a.id); // Sortera senaste först
    const recent = undoneTasks.slice(0, 3);
  
    const listEl = document.getElementById("recent-tasks-list");
    listEl.innerHTML = "";
    recent.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task.title;
      listEl.appendChild(li);
    });
  }
  
  // 3 Habits med högst repetitioner
  function loadTopHabits() {
    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    habits.sort((a, b) => b.repetitions - a.repetitions);
    const top = habits.slice(0, 3);
  
    const listEl = document.getElementById("top-habits-list");
    listEl.innerHTML = "";
    top.forEach(habit => {
      const li = document.createElement("li");
      li.textContent = `${habit.title} (${habit.repetitions})`;
      listEl.appendChild(li);
    });
  }
  
  // 3 nästkommande Events
  function loadUpcomingEvents() {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    const upcoming = events.slice(0, 3);
  
    const listEl = document.getElementById("upcoming-events-list");
    listEl.innerHTML = "";
    upcoming.forEach(ev => {
      const li = document.createElement("li");
      li.textContent = `${ev.title} - ${ev.date}`;
      listEl.appendChild(li);
    });
  }
  