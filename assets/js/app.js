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
              <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link 
              has-state" aria=label="${name} weather" data-search-toggler></a>
            `;

          searchResult
            .querySelector("[data-search-list]")
            .appendChild(searchItem);
          items.push(searchItem.querySelector("[data-search-toggler]"));
        }

        addEventOnElements(items, "click", function () {
          toggleSearch();
          searchResult.classList.remove("active");
        });
      });
    }, searchTimeoutDuration);
  }
});

const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector(
  "[data-current-location-btn]"
);
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
  container.classList.remove("fade-in");
  errorContent.style.display = "none";

  const currentWeatherSection = document.querySelector(
    "[data-current-weather]"
  );
  const highlightSection = document.querySelector("[data-highlights]");
  const hourlySection = document.querySelector("[data-hourly-forecast]");
  const forecastSection = document.querySelector("[data-5-day-forecast]");

  currentWeatherSection.innerHTML = "";
  highlightSection.innerHTML = "";
  hourlySection.innerHTML = "";
  forecastSection.innerHTML = "";

  if (window.location.hash === "#/current-location") {
    currentLocationBtn.setAttribute("disabled", "");
  } else {
    currentLocationBtn.removeAttribute("disabled");
  }
  // Current Weather
  fetchData(url.currentWeather(lat, lon), function (currentWeather) {
    const {
      weather,
      dt: dateUnix,
      sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
      main: { temp, feels_like, pressure, humidity },
      visibility,
      timezone,
    } = currentWeather;
    const [{ description, icon }] = weather;

    const card = document.createElement("div");
    card.classList.add("card", "card-lg", "current-weather-card");

    card.innerHTML = `
      <h2 class="title-2 card-title">Now</h2>
      <div class="wrapper">
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
        <li class="meta-item">
          <span class="fa-regular fa-calendar"></span>
          <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
        </li>
        <li class="meta-item">
          <span class="fa-solid fa-location-dot"></span>
          <p class="title-3 meta-text" data-location></p>
        </li>
      </ul>
    `;

    fetchData(url.reverseGeo(lat, lon), function ([{ name, country }]) {
      card.querySelector("[data-location]").innerHTML = `${name}, ${country}`;
    });
    currentWeatherSection.appendChild(card);

    /**
     * Highlights Section
     */
    fetchData(url.airPollution(lat, lon), function (airPollution) {
      const [
        {
          main: { aqi },
          components: { no2, o3, so2, pm2_5 },
        },
      ] = airPollution.list;

      const card = document.createElement("div");
      card.classList.add("card", "card-lg");

      card.innerHTML = `
      <h2 class="title-2" id="highlights-label">Today's Highlights</h2>
      <div class="highlight-list">
        <!-- Air Quality -->
        <div class="card card-sm highlight-card one">
          <h3 class="title-3">Air Quality Index</h3>
          <div class="wrapper"> 
            <img
              src="./assets/images/weather_icons/air-quality.png"
              width="32"
              height="32"
              alt="air-quality-img"
            />
            <ul class="card-list">
              <li class="card-item">
                <p class="title-1">${pm2_5.toPrecision(3)}</p>
                <p class="label-1">PM<sub>2.5</sub></p>
              </li>

              <li class="card-item">
                <p class="title-1">${so2.toPrecision(3)}</p>
                <p class="label-1">SO<sub>2</sub></p>
              </li>

              <li class="card-item">
                <p class="title-1">${no2.toPrecision(3)}</p>
                <p class="label-1">NO<sub>2</sub></p>
              </li>

              <li class="card-item">
                <p class="title-1">${o3.toPrecision(3)}</p>
                <p class="label-1">O<sub>3</sub></p>
              </li>
            </ul>
          </div>

          <span
            class="badge aqi-${aqi} label-${aqi}"
            title="${module.apiText[aqi].message}"
          >
          ${module.apiText[aqi].level}
          </span>
        </div>
        <!-- Sunrise & Sunset -->
        <div class="card card-sm highlight-card two">
          <h3 class="title-3">Sunrise &amp Sunset</h3>
          <div class="card-list">
            <!-- Sunrise -->
            <div class="card-item">
              <span class="fa-solid fa-sun"></span>
              <div>
                <p class="label-1">Sunrise</p>

                <p class="title-1">${module.getTime(
                  sunriseUnixUTC,
                  timezone
                )}</p>
              </div>
            </div>
            <!-- Sunset -->
            <div class="card-item">
              <span class="fa-solid fa-moon"></span>
              <div>
                <p class="label-1">Sunset</p>

                <p class="title-1">${module.getTime(
                  sunsetUnixUTC,
                  timezone
                )}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Humidity -->
        <div class="card card-sm highlight-card">
          <h3 class="title-3">Humidity</h3>

          <div class="wrapper">
            <span class="fa-solid fa-droplet"></span>
            <p class="title-1">${humidity}%</p>
          </div>
        </div>
        <!-- Air Pressure -->
        <div class="card card-sm highlight-card">
          <h3 class="title-3">Air Pressure</h3>

          <div class="wrapper">
            <span class="fa-solid fa-smog"></span>
            <p class="title-1">${pressure}<sub>hPa</sub></p>
          </div>
        </div>
        <!-- Visibility -->
        <div class="card card-sm highlight-card">
          <h3 class="title-3">Visibility</h3>

          <div class="wrapper">
            <span class="fa-solid fa-eye"></span>
            <p class="title-1">${visibility / 1000}<sub>km</sub></p>
          </div>
        </div>
        <!-- Feels Like -->
        <div class="card card-sm highlight-card">
          <h3 class="title-3">Visibility</h3>

          <div class="wrapper">
            <span class="fa-solid fa-temperature-half"></span>
            <p class="title-1">${parseInt(feels_like)}&deg;C</p>
          </div>
        </div>
      </div>
      `;

      highlightSection.appendChild(card);
    });

    /**
     * Forecast Section
     */
    fetchData(url.forecast(lat, lon), function (forecast) {
      const {
        list: forecastList,
        city: { timezone },
      } = forecast;

      hourlySection.innerHTML = `
        <h2 class="title-2">Today at</h2>
        <div class="slider-container">
          <!-- Hourly Temp Forecast -->
          <ul class="slider-list" data-temp></ul>

          <!-- Hourly Wind Forecast -->
          <ul class="slider-list" data-wind></ul>
        </div>
      `;

      for (const [index, data] of forecastList.entries()) {
        if (index > 7) break;

        const {
          dt: dateTimeUnix,
          main: { temp },
          weather,
          wind: { deg: windDirection, speed: windSpeed },
        } = data;
        const [{ icon, description }] = weather;

        const tempLi = document.createElement("li");
        tempLi.classList.add("slider-item");

        tempLi.innerHTML = `
          <div class="card card-sm slider-card">
            <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>
            <img
              src="./assets/images/weather_icons/${icon}.png"
              width="48"
              height="48"
              loading="lazy"
              alt="${description}"
              class="weather-icon"
              title="${description}"
            />
            <p class="body-3">${parseInt(temp)}&deg;</p>
          </div>
        `;
        hourlySection.querySelector("[data-temp]").appendChild(tempLi);

        const windLi = document.createElement("li");
        windLi.classList.add("slider-item");
        windLi.innerHTML = `
        <div class="card card-sm slider-card">
          <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>
          <span
            class="fa-solid fa-wind weather-icon"
            loading="lazy"
            alt="direction"
          ></span>
          <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))}<sub>km/h</sub></p>
        </div>
        `;
        hourlySection.querySelector("[data-wind]").appendChild(windLi);
      }
      /**
       *  5 Day Forecast
       */

      forecastSection.innerHTML = `
        <h2 class="title-2" id="forecast-label">5 Day Forecast</h2>
        <div class="card card-lg forecast-card">
          <ul data-forecast-list></ul>
        </div>
      `;

      for (let i = 7, len = forecastList.length; i< len; i += 8) {

        const {
          main: { temp_max },
          weather,
          dt_txt
        } = forecastList[i];
        const [{icon, description}] = weather;
        const date = new Date(dt_txt);

        const li = document.createElement("li");
        li.classList.add("card-item");

        li.innerHTML= `
        <div class="icon-wrapper">
          <img
            src="./assets/images/weather_icons/${icon}.png"
            width="36"
            height="36"
            alt="${description}"
            class="weather-icon"
            title = "${description}"
          />
          <span class="span">
            <p class="title-1">${parseInt(temp_max)}<sup>&deg;F</sup></p>
          </span>
        </div>

        <p class="label-1">${date.getDate()} ${module.monthNames[date.getMonth()]}</p>
        <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
        `;

        forecastSection.querySelector("[data-forecast-list]").appendChild(li);
      }

      loading.style.display = "none";
      container.style.overflowY = "overlay";
      container.classList.remove("fade-in");


    });
  });
};

// Error 404 function
export const error404 = function () {};
