/**
 * API for OpenWeather (https://openweathermap.org/)
 */
"use strict";

const api_key = config.MY_KEY;

/**
 * Fetch data from server
 * @param {string} URL API url
 * @param {function} callback callback
 */

export const fetchData = function (URL, callback) {
  fetch("${URL}&appid=${api_key")
    .then((res) => res.json())
    .then((data) => callback(data));
};

export const url = {
  currentWeather(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=imperial`;
  },
  forecast(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=imperial`;
  },
  airPollution(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`;
  },
  reverseGeo(lat, lon) {
    return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`;
  },

  /**
   * @param {string} query Search query e.g.: "Torrance", "New York"
   * @returns
   */
  geo(query) {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
  },
};
