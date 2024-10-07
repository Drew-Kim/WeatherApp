"use strict";

document.addEventListener("DOMContentLoaded", () => {
  

  /**
   * event listener on multiple elements
   * @param {NodeList} elements Elements node array
   * @param {string} eventType Event type ex "click", "mouserover"
   * @param {Function} callback Call back function
   */
  const addEventOnElements = function (elements, eventType, callback) {
    for (const element of elements) {
      console.log(`Adding event listener to:`, element); // Debugging line
      element.addEventListener(eventType, callback);
    }
  };

  /**
   * Toggle search in mobile devices
   */
  const searchView = document.querySelector("[data-search-view]");
  const searchTogglers = document.querySelectorAll("[data-search-toggler]");

  console.log(`Search View:`, searchView); // Debugging line
  console.log(`Search Togglers:`, searchTogglers); // Debugging line

  const toggleSearch = () => {
    console.log(`Toggling search view`); // Debugging line
    searchView.classList.toggle("active");
  };

  addEventOnElements(searchTogglers, "click", toggleSearch);
});
