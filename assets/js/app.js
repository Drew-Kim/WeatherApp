"use strict";

import { fetchData, url } from "./api.js";
import * as module from "./module.js";

/**
 * event listener on multiple elements
 * @param {NodeList} elements Elements node array
 * @param {string} eventType Event type ex "click", "mouserover"
 * @param {Function} callback Call back function
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (const element of elements) element.addEventListener(eventType, callback);
};

/**
 * Toggle search in mobile devices
 */
const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");
const toggleSearch = () => {
  searchView.classList.toggle("active");
};

addEventOnElements(searchTogglers, "click", toggleSearch);

/**
 * Search Functionality
 */

const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener("input", function () {
  searchTimeout ?? clearTimeout(searchTimeout);

  if (!searchField.value) {
    searchResult.classList.remove("active");
    searchResult.innerHTML = "";
    searchField.classList.remove("searching");
  } else {
    searchField.classList.add("searching");
  }

  if (searchField.value) {
    searchTimeout = setTimeout(() => {
      fetchData(url.geo(searchField.value), function (locations) {
        searchField.classList.remove("searching");
        searchResult.classList.add("active");
        searchResult.innerHTML = `
          <ul class="view-list" data-search-list></ul>`;

        const /** NodeList | [] */ items = [];

        for (const { name, lat, lon, state, country } of locations) {
          const searchItem = document.createElement("li");
          searchItem.classList.add("view-item");

          searchItem.innerHTML = `
              <span class="fa-solid fa-location-dot"></span>
              <div>
                <p class="item-title">${name}</p>
                <p class="label-2 item-subtitle">${state || ""}, ${country}</p>
              </div>
              <a href="#/weather?lat=${lat}&long=${lon}" class="item-link 
              has-state" aria=label="${name} weather" data-search-toggler></a>
            `;

          searchResult
            .querySelector("[data-search-list]")
            .appendChild(searchItem);
          items.push(searchItem.querySelector("[data-search-toggler]"));
        }
      });
    }, searchTimeoutDuration);
  }
});

const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]");
/**
 * Load the weather data on page
 * @param {number} lat 
 * @param {number} lon
 */

// Update weather function
export const updateWeather = function (lat, lon) {
  loading.style.display = "grid";

  container.style.overflowY = "hidden";
  container.classList.contains("fade-in") ?? container.classList.remove("fade-in");
  errorContent.style.display = "none";

  const currentWeatherSection = document.querySelector("[data-current-weather]");
  const highlightSection = document.querySelector("[data-highlights]");
  const hourlySection = document.querySelector("[data-hourly-forecast]");
  const forecastSection = document.querySelector("[data-5-day-forecast]");

  currentWeatherSection.innerHTML = "";
  highlightSection.innerHTML = "";
  hourlySection.innerHTML = "";
  forecastSection.innerHTML = "";

  if (window.location.hash === "#/current-lcoation"){
    currentLocationBtn.setAttribute("disabled", "");
  } else {
    currentLocationBtn.removeAttribute("disabled");
  }
  // Current Weather
  fetchData(url.currentWeather(lat, lon), function (currentWeather) {

    const {
      weather,
      dt: dateUnix,
      sys: {sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC},
      main: {temp, feels_like, pressure, humidity},
      visibility,
      timezone
    } = currentWeather
    const [{description, icon}] = weather;

    const card = document.createElement("div");
    card.classList.add("card", "card-lg", "current-weather-card");

    card.innerHTML = `
      <h2 class="title-2 card-title">Now</h2>
        <!-- wrapper for degrees -->
        <div class="weapper">
          <p class="heading">${parseInt(temp)}<sup>&deg;F</sup></p>
          <img
            src="./assets/images/weather_icons/${icon}.png"
            width="64"
            height="64"
            alt="${description}"
            class="weather-icon"
          />
        </div>
        <p class="body-3">${description}</p>
        <ul class="meta-list">
          <!-- Date -->
          <li class="meta-item">
            <span class="fa-regular fa-calendar"></span>
            <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
          </li>
          <!-- Location -->
          <li class="meta-item">
            <span class="fa-solid fa-location-dot"></span>
            <p class="title-3 meta-text" data-location></p>
          </li>
        </ul>
    `;

    fetchData(url.reverseGeo(lat, lon), function([{ name, country}]){
      card.querySelector("[data-location]").innerHTML= `${name}, ${country}`;

    });
    currentWeatherSection.appendChild(card);

  });
  
}
// Error 404 function
export const error404 = function(){}
