document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("tasks") || !localStorage.getItem("habits") || !localStorage.getItem("events")) {
        console.warn("⚠️ Warning: No tasks, habits, or events found in localStorage!");
    }
    loadHomeData();
});

function loadHomeData() {
    loadRecentTasks();
    loadTopHabits();
    loadUpcomingEvents();
}

// Hämta de 3 senaste ej utförda Tasks
function loadRecentTasks() {
    let tasks = localStorage.getItem("tasks");

    if (!tasks) {
        console.warn("No tasks found in LocalStorage!");
        return;
    }

    try {
        tasks = JSON.parse(tasks);
    } catch (error) {
        console.error("Failed to parse tasks from LocalStorage:", error);
        return;
    }

    // Omvandlar objektet till en array - va problem med just tasks
    if (typeof tasks === "object" && !Array.isArray(tasks)) {
        tasks = Object.values(tasks);
    }

    if (!Array.isArray(tasks)) {
        console.error("Tasks data is still not an array:", tasks);
        return;
    }

    const undoneTasks = tasks.filter(task => !task.checked);

    undoneTasks.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const recent = undoneTasks.slice(0, 3);

    const listEl = document.getElementById("recent-tasks-list");
    listEl.innerHTML = "";

    recent.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.title + " - " + (task.createdAt ? formatEventDateTime(task.createdAt) : "No date");
        listEl.appendChild(li);
    });
}

// Hämta de 3 Habits med högst repetitioner
function loadTopHabits() {
    let habits = JSON.parse(localStorage.getItem("habits")) || [];

    habits.sort((a, b) => b.repetitions - a.repetitions);

    const top = habits.slice(0, 3);

    const listEl = document.getElementById("top-habits-list");
    listEl.innerHTML = "";

    top.forEach(habit => {
        const li = document.createElement("li");
        li.textContent = `${habit.title} (${habit.repetitions}x)`;
        listEl.appendChild(li);
    });
}

// Hämta de 3 närmsta Events
function loadUpcomingEvents() {
    let events = JSON.parse(localStorage.getItem("events")) || [];

    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    const upcoming = events.slice(0, 3);

    const listEl = document.getElementById("upcoming-events-list");
    listEl.innerHTML = "";

    upcoming.forEach(event => {
        const li = document.createElement("li");
        li.textContent = `${event.title} - ${formatEventDateTime(event.date)}`;
        listEl.appendChild(li);
    });
}

// Funktion för att formatera datum och tid
function formatEventDateTime(datetimeString) {
    const dateObj = new Date(datetimeString);

    const options = { day: "2-digit", month: "long", year: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-GB", options);

    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");

    return `${formattedDate} | ${hours}:${minutes}`;
}
