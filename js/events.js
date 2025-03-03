document.addEventListener("DOMContentLoaded", () => {
    setupFilterMenu();
    setupSorting();
    setupEventPopup();
    setupSaveEvent();
    loadEventsFromLocalStorage(); // Hämta eventen från localStorage vid sidladdning
});

let editingEvent = null; // Håller koll på vilket event som redigeras

// Funktionerna för filter-menyn
function setupFilterMenu() {
    const filterBtn = document.getElementById("filter-btn");
    const filterMenu = document.getElementById("filter-menu");
    const filterFinished = document.getElementById("filter-finished");
    const filterUpcoming = document.getElementById("filter-upcoming");
    const upcomingSection = document.getElementById("upcoming-section");
    const finishedSection = document.getElementById("finished-section");

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
            finishedSection.style.display = this.checked ? "block" : "none";
        });

        filterUpcoming.addEventListener("change", function () {
            upcomingSection.style.display = this.checked ? "block" : "none";
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

// Funktion för att hantera popup-fönstret
function setupEventPopup() {
    const eventPopup = document.getElementById("event-popup");
    const openPopupBtn = document.querySelector(".cta-button");
    const closePopupBtn = document.querySelector(".event-close-popup");

    openPopupBtn.addEventListener("click", () => {
        editingEvent = null;
        clearEventForm();
        eventPopup.style.display = "flex";
    });

    closePopupBtn.addEventListener("click", () => {
        eventPopup.style.display = "none";
        clearEventForm();
    });

    window.addEventListener("click", (event) => {
        if (event.target === eventPopup) {
            eventPopup.style.display = "none";
            clearEventForm();
        }
    });
}

// Funktion för att spara/redigera event och lagra i `localStorage`
function setupSaveEvent() {
    const saveEventBtn = document.getElementById("save-event-btn");
    const eventTitle = document.getElementById("event-title");
    const eventDescription = document.getElementById("event-description");
    const eventDate = document.getElementById("due-date");

    saveEventBtn.addEventListener("click", () => {
        const title = eventTitle.value.trim();
        const description = eventDescription.value.trim();
        const date = eventDate.value.trim();

        if (title === "" || date === "") {
            alert("Please enter a title and date for the event!");
            return;
        }

        let events = JSON.parse(localStorage.getItem("events")) || [];

        if (editingEvent) {
            const eventIndex = events.findIndex(e => e.id === editingEvent.id);
            if (eventIndex !== -1) {
                events[eventIndex].title = title;
                events[eventIndex].description = description;
                events[eventIndex].date = date;
            }
            editingEvent = null;
        } else {
            const newEvent = {
                id: Date.now(),
                title,
                description,
                date
            };
            events.push(newEvent);
        }

        localStorage.setItem("events", JSON.stringify(events));
        loadEventsFromLocalStorage();
        clearEventForm();
        document.getElementById("event-popup").style.display = "none";
    });
}

function loadEventsFromLocalStorage() {
    const upcomingEventsList = document.getElementById("upcoming-events");
    const finishedEventsList = document.getElementById("finished-events");
    const eventTemplate = document.getElementById("event-template");

    upcomingEventsList.innerHTML = "";
    finishedEventsList.innerHTML = "";

    let events = JSON.parse(localStorage.getItem("events")) || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    events.forEach(event => {
        const eventDateObj = new Date(event.date);
        const eventCard = eventTemplate.content.cloneNode(true);
        eventCard.querySelector(".event-title").textContent = event.title;
        eventCard.querySelector(".event-date").textContent = event.date;

const editButton = eventCard.querySelector(".edit-btn");
const deleteButton = eventCard.querySelector(".delete-btn");

        editButton.addEventListener("click", () => openEditEvent(event));
        deleteButton.addEventListener("click", () => deleteEvent(event.id));

        if (eventDateObj < today) {
            eventCard.querySelector(".event-card").classList.add("finished-event");
            eventCard.querySelector(".event-title").style.textDecoration = "line-through";
            eventCard.querySelector(".event-title").style.color = "#7D7D7D";
            finishedEventsList.appendChild(eventCard);
        } else {
            upcomingEventsList.appendChild(eventCard);
        }
    });
}

// Funktion för att öppna popup och redigera ett event
function openEditEvent(event) {
    editingEvent = event;

    document.getElementById("event-title").value = event.title;
    document.getElementById("event-description").value = event.description;
    document.getElementById("due-date").value = event.date;

    document.getElementById("event-popup").style.display = "flex";
}

// Funktion för att ta bort ett event och uppdatera `localStorage`
function deleteEvent(eventId) {
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events = events.filter(event => event.id !== eventId);
    localStorage.setItem("events", JSON.stringify(events));
    loadEventsFromLocalStorage();
}

// Funktion för att rensa fälten i event-formuläret
function clearEventForm() {
    document.getElementById("event-title").value = "";
    document.getElementById("event-description").value = "";
    document.getElementById("due-date").value = "";
    editingEvent = null;
}
