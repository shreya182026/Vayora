// VAYORA: a small destination discovery and trip-planning website.

// Each destination is one object. All destination objects are stored in this array.
const destinations = [
  {id:1,name:"Kashmir",country:"India",region:"India",type:"Nature",budget:3500,image:"images/kashmir.jpg",description:"Glide across peaceful lakes, admire snow-capped mountains and discover the quiet beauty of Kashmir."},
  {id:2,name:"Jaipur",country:"India",region:"India",type:"Culture",budget:2800,image:"images/jaipur.jpg",description:"Explore pink sandstone palaces, colourful markets and the rich heritage of Rajasthan."},
  {id:3,name:"Kerala",country:"India",region:"India",type:"Nature",budget:3200,image:"images/kerala.jpg",description:"Slow down among palm-lined backwaters, green landscapes and peaceful houseboat journeys."},
  {id:4,name:"Ladakh",country:"India",region:"India",type:"Nature",budget:4200,image:"images/ladakh.jpg",description:"Discover dramatic mountain roads, high-altitude lakes and wide open Himalayan landscapes."},
  {id:5,name:"Udaipur",country:"India",region:"India",type:"Culture",budget:3000,image:"images/udaipur.jpg",description:"Enjoy lakeside views, royal architecture and the warm charm of Rajasthan."},
  {id:6,name:"Rishikesh",country:"India",region:"India",type:"Nature",budget:2400,image:"images/rishikesh.jpg",description:"Find riverside calm, forest trails and adventure in the foothills of the Himalayas."},
  {id:7,name:"Goa",country:"India",region:"India",type:"Nature",budget:3300,image:"images/goa.jpg",description:"Spend your days by the sea, explore old streets and enjoy a relaxed coastal escape."},
  {id:8,name:"Agra",country:"India",region:"India",type:"Culture",budget:2200,image:"images/agra.jpg",description:"Visit world-famous Mughal architecture and experience a city full of history."},
  {id:9,name:"Darjeeling",country:"India",region:"India",type:"Nature",budget:2900,image:"images/darjeeling.jpg",description:"Wake up to mountain views, tea gardens and the charm of the eastern Himalayas."},
  {id:10,name:"Jaisalmer",country:"India",region:"India",type:"Culture",budget:2700,image:"images/jaisalmer.jpg",description:"Discover golden sandstone lanes, desert sunsets and traditional Rajasthani culture."},
  {id:11,name:"Kyoto",country:"Japan",region:"International",type:"Culture",budget:8500,image:"images/kyoto.jpg",description:"Wander through traditional streets, peaceful temples and beautiful seasonal gardens."},
  {id:12,name:"Santorini",country:"Greece",region:"International",type:"Nature",budget:12000,image:"images/santorini.jpg",description:"Take in whitewashed villages, blue domes and unforgettable views over the Aegean Sea."},
  {id:13,name:"Bali",country:"Indonesia",region:"International",type:"Nature",budget:7000,image:"images/bali.jpg",description:"Explore tropical beaches, green rice terraces and beautiful island culture."},
  {id:14,name:"Paris",country:"France",region:"International",type:"Culture",budget:14000,image:"images/paris.jpg",description:"Enjoy art, architecture, cafés and the timeless atmosphere of the French capital."},
  {id:15,name:"London",country:"United Kingdom",region:"International",type:"Culture",budget:15000,image:"images/london.jpg",description:"Discover famous landmarks, museums, markets and neighbourhoods full of character."},
  {id:16,name:"Dubai",country:"United Arab Emirates",region:"International",type:"Culture",budget:11000,image:"images/dubai.jpg",description:"Experience striking architecture, desert landscapes and a lively modern city."},
  {id:17,name:"Singapore",country:"Singapore",region:"International",type:"Culture",budget:10500,image:"images/singapore.jpg",description:"Explore waterfront gardens, diverse food and a vibrant modern city."},
  {id:18,name:"Swiss Alps",country:"Switzerland",region:"International",type:"Nature",budget:16000,image:"images/swiss-alps.jpg",description:"Enjoy mountain villages, clear lakes and spectacular alpine scenery."},
  {id:19,name:"Istanbul",country:"Türkiye",region:"International",type:"Culture",budget:9000,image:"images/istanbul.jpg",description:"Discover a city where historic landmarks, lively bazaars and cultures meet."},
  {id:20,name:"Maldives",country:"Maldives",region:"International",type:"Nature",budget:18000,image:"images/maldives.jpg",description:"Relax beside clear turquoise water and beautiful tropical island views."}
];

// Read saved information from the browser, or start with empty lists.
let wishlist = JSON.parse(localStorage.getItem("roamlyWishlist")) || [];
let journey = JSON.parse(localStorage.getItem("roamlyJourney")) || [];
let activeFilter = "All";
let searchText = "";
let showAll = false;
let selectedDestination = null;

// Short helper: find one destination by its ID.
function findDestination(id) {
  return destinations.find(function(place) {
    return place.id === Number(id);
  });
}

// Build and display the destination cards.
function renderDestinations() {
  let matchingPlaces = destinations.filter(function(place) {
    let matchesSearch = place.name.toLowerCase().includes(searchText) ||
      place.country.toLowerCase().includes(searchText);
    let matchesFilter = activeFilter === "All" ||
      place.region === activeFilter || place.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  let visiblePlaces = showAll || searchText !== "" || activeFilter !== "All"
    ? matchingPlaces : matchingPlaces.slice(0, 4);

  document.getElementById("resultsCount").textContent =
    showAll || searchText !== "" || activeFilter !== "All"
      ? matchingPlaces.length + " destinations"
      : "Featured destinations";

  document.getElementById("loadMoreButton").classList.toggle("hidden",
    showAll || matchingPlaces.length <= 4);
  document.getElementById("emptyState").classList.toggle("hidden", matchingPlaces.length > 0);

  let cards = "";
  visiblePlaces.forEach(function(place) {
    let saved = wishlist.includes(place.id);
    cards += `
      <article class="destination-card" data-id="${place.id}" role="button" tabindex="0" aria-label="Explore ${place.name}">
        <div class="card-photo">
          <img src="${place.image}" alt="${place.name}" loading="lazy" onerror="this.onerror=null;this.src='images/kashmir.jpg'">
          <span class="card-tag">${place.region}</span>
          <button class="heart-button ${saved ? "saved" : ""}" data-heart="${place.id}" aria-label="Save ${place.name}">${saved ? "♥" : "♡"}</button>
        </div>
        <div class="card-info">
          <h3>${place.name}</h3>
          <span class="card-country">${place.country}</span>
          <div class="card-bottom"><span class="card-type">${place.type}</span><span class="card-details">View details ↗</span></div>
        </div>
      </article>`;
  });
  document.getElementById("destinationGrid").innerHTML = cards;
}

// Save both lists in the browser.
function saveData() {
  localStorage.setItem("roamlyWishlist", JSON.stringify(wishlist));
  localStorage.setItem("roamlyJourney", JSON.stringify(journey));
}

// Add or remove a place from the wishlist.
function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(function(savedId) { return savedId !== id; });
  } else {
    wishlist.push(id);
  }
  saveData();
  renderDestinations();
  renderSavedLists();
}

// Add a place to My Journey.
function addToJourney(id) {
  if (!journey.includes(id)) {
    journey.push(id);
  }
  saveData();
  renderSavedLists();
  renderDestinations();
}

// Remove a place from a saved list.
function removeSavedItem(listName, id) {
  if (listName === "journey") {
    journey = journey.filter(function(savedId) { return savedId !== id; });
  } else {
    wishlist = wishlist.filter(function(savedId) { return savedId !== id; });
  }
  saveData();
  renderSavedLists();
  renderDestinations();
}

// Display the saved journey and wishlist.
function renderSavedLists() {
  showSavedItems("journeyList", journey, "journey");
  showSavedItems("wishlistList", wishlist, "wishlist");
  document.getElementById("journeyCount").textContent = journey.length + " places added";
  document.getElementById("wishlistCount").textContent = wishlist.length + " favourites";
}

function showSavedItems(elementId, savedIds, listName) {
  let container = document.getElementById(elementId);
  if (savedIds.length === 0) {
    container.innerHTML = '<p class="muted-message">Nothing saved here yet. Explore and add a place.</p>';
    return;
  }
  let html = "";
  savedIds.forEach(function(id) {
    let place = findDestination(id);
    if (place) {
      html += `<div class="saved-item"><span>${place.name}, ${place.country}</span>
        <button data-remove="${id}" data-list="${listName}" aria-label="Remove ${place.name}">×</button></div>`;
    }
  });
  container.innerHTML = html;
}

// Open a popup with the selected destination's information.
function openDetails(id) {
  selectedDestination = findDestination(id);
  if (!selectedDestination) return;
  document.getElementById("modalImage").src = selectedDestination.image;
  document.getElementById("modalImage").alt = selectedDestination.name;
  document.getElementById("modalCountry").textContent = selectedDestination.country;
  document.getElementById("modalTitle").textContent = selectedDestination.name;
  document.getElementById("modalDescription").textContent = selectedDestination.description;
  document.getElementById("modalType").textContent = selectedDestination.type;
  document.getElementById("modalBudget").textContent = "Approx. ₹" + selectedDestination.budget + " / day";
  document.getElementById("destinationModal").classList.remove("hidden");
}

function closeDetails() {
  document.getElementById("destinationModal").classList.add("hidden");
}

// Filter buttons and search field.
document.getElementById("filters").addEventListener("click", function(event) {
  let button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  showAll = true;
  document.querySelectorAll(".filter").forEach(function(item) { item.classList.remove("active"); });
  button.classList.add("active");
  renderDestinations();
});

document.getElementById("searchInput").addEventListener("input", function(event) {
  searchText = event.target.value.toLowerCase().trim();
  renderDestinations();
});

// Use event delegation: one click handler works for all destination cards.
document.getElementById("destinationGrid").addEventListener("click", function(event) {
  let heart = event.target.closest("[data-heart]");
  if (heart) {
    event.stopPropagation();
    toggleWishlist(Number(heart.dataset.heart));
    return;
  }
  let card = event.target.closest("[data-id]");
  if (card) openDetails(card.dataset.id);
});

// One click handler removes items from either saved list.
document.addEventListener("click", function(event) {
  let removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    removeSavedItem(removeButton.dataset.list, Number(removeButton.dataset.remove));
  }
});

document.getElementById("loadMoreButton").addEventListener("click", function() {
  showAll = true;
  renderDestinations();
});
document.getElementById("showAllLink").addEventListener("click", function() {
  showAll = true;
  renderDestinations();
});
document.getElementById("exploreNav").addEventListener("click", function() {
  document.getElementById("exploreMenu").classList.toggle("open");
});
document.querySelectorAll("[data-menu-filter]").forEach(function(button) {
  button.addEventListener("click", function() {
    activeFilter = button.dataset.menuFilter;
    showAll = true;
    document.getElementById("exploreMenu").classList.remove("open");
    document.querySelectorAll(".filter").forEach(function(item) {
      item.classList.toggle("active", item.dataset.filter === activeFilter);
    });
    renderDestinations();
    document.getElementById("explore").scrollIntoView({behavior:"smooth"});
  });
});
document.getElementById("mobileMenu").addEventListener("click", function() {
  const menu = document.getElementById("exploreMenu");
  menu.classList.toggle("open");
  this.setAttribute("aria-expanded", menu.classList.contains("open") ? "true" : "false");
});

// Keyboard support for destination cards and a quick Escape-to-close interaction.
document.getElementById("destinationGrid").addEventListener("keydown", function(event) {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".destination-card")) {
    event.preventDefault();
    openDetails(event.target.dataset.id);
  }
});
document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    closeDetails();
    document.getElementById("exploreMenu").classList.remove("open");
  }
});

// Popup buttons.
document.getElementById("modalClose").addEventListener("click", closeDetails);
document.getElementById("modalBackdrop").addEventListener("click", closeDetails);
document.getElementById("modalAddJourney").addEventListener("click", function() {
  if (selectedDestination) addToJourney(selectedDestination.id);
  closeDetails();
});
document.getElementById("modalAddWishlist").addEventListener("click", function() {
  if (selectedDestination) toggleWishlist(selectedDestination.id);
  closeDetails();
});

// Calculate an approximate trip budget using the saved journey.
function calculateBudget() {
  let travellers = Number(document.getElementById("travellersInput").value);
  let days = Number(document.getElementById("daysInput").value);
  if (travellers < 1 || days < 1) {
    document.getElementById("budgetResult").textContent = "Enter valid values";
    return;
  }
  let dailyCost = 0;
  journey.forEach(function(id) {
    let place = findDestination(id);
    if (place) dailyCost += place.budget;
  });
  let total = dailyCost * travellers * days;
  document.getElementById("budgetResult").textContent =
    "₹" + total.toLocaleString("en-IN");
}
document.getElementById("calculateButton").addEventListener("click", calculateBudget);

// First display when the page opens.
renderDestinations();
renderSavedLists();
calculateBudget();
