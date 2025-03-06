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

//Skapar ett kort för varje sektion (tasks, habits, events)
function createHomeCard(title, subtitle) {
    const card = document.createElement("div");
    card.classList.add("home-card");

    const titleEl = document.createElement("h3");
    titleEl.textContent = title;
    titleEl.classList.add("home-card-title");

    const subtitleEl = document.createElement("p");
    subtitleEl.classList.add("home-card-subtitle");
    subtitleEl.textContent = subtitle;

    card.appendChild(titleEl);
    card.appendChild(subtitleEl);

    return card;
}

// Hämta och visa de tre senaste ej utförda uppgifterna (tasks)
function loadRecentTasks() {
    let tasks = localStorage.getItem("tasks");

    if (!tasks) {
        console.warn("⚠️ No tasks found in LocalStorage!");
        return;
    }

    try {
        tasks = JSON.parse(tasks);
    } catch (error) {
        console.error("Failed to parse tasks from LocalStorage:", error);
        return;
    }

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
        const card = createHomeCard(
            task.title,
            task.createdAt ? formatEventDateTime(task.createdAt) : "No date"
        );
        listEl.appendChild(card);
    });
}

// Hämta och visa de tre habits med högst repetitioner
function loadTopHabits() {
    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    habits.sort((a, b) => b.repetitions - a.repetitions);
    const top = habits.slice(0, 3);
    const listEl = document.getElementById("top-habits-list");
    listEl.innerHTML = "";

    top.forEach(habit => {
        const card = createHomeCard(
            habit.title,
            `${habit.repetitions} repetitions`
        );
        listEl.appendChild(card);
    });
}

// Hämta och visa de tre nästkommande events
function loadUpcomingEvents() {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    const upcoming = events.slice(0, 3);
    const listEl = document.getElementById("upcoming-events-list");
    listEl.innerHTML = "";

    upcoming.forEach(event => {
        const card = createHomeCard(
            event.title,
            formatEventDateTime(event.date)
        );
        listEl.appendChild(card);
    });
}

// Funktion för att formatera datum och tid
function formatEventDateTime(datetimeString) {
    const dateObj = new Date(datetimeString);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return dateObj.toLocaleDateString("en-GB", options); // Ex: 10 March 2025
}
