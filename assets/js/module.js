/**
 * All module functions
 */
"use strict";

export const weekDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Friday",
  "Saturday",
];

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 *
 * @param {number} dateUnix Unix date in secs
 * @param {number} timezone Timezone shift from UTC in secs
 * @returns {string} returns the date as a string (format): "Tuesday, 1, Sep"
 */

export const getDate = function (dateUnix, timezone) {
  const date = new Date((dateUnix + timezone) * 1000);
  const weekDayNames = weekDayNames[date.getUTCDay()];
  const monthName = monthNames[date.getUTCMonth()];

  return `${weekDayNames} ${date.getUTCDate}, ${monthName}`;
};

/**
 *
 * @param {number} timeUnix Date in secs
 * @param {number} timezone Timezone shift from UTC in secs
 * @returns {string} Returns time as a string (format): HH MM AM/PM
 */

export const getTime = function (timeUnix, timezone) {
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  return `${hours % 12 || 12}:${minutes} ${period}`;
};

/**
 *
 * @param {number} timeUnix Date in secs
 * @param {number} timezone Timezone shift from UTC in secs
 * @returns {string} Returns time as a string (format): HH AM/PM
 */

export const getHours = function (timeUnix, timezone) {
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = date.getUTCHours();
  const period = hours >= 12 ? "PM" : "AM";

  return `${hours % 12 || 12} ${period}`;
};

/**
 *
 * @param {number} mps meter per sec
 * @returns {number} Returns Kilometer per hour
 */

export const mps_to_kmh = (mps) => {
  const mph = mps * 3600;
  return mph / 1000;
};

export const apiText = {
  1: {
    level: "Good",
    message:
      "Air quality is considered satisfactory, and air pollution posese little or no risk",
  },
  2: {
    level: "Fair",
    message:
      "Air quality is acceptable; however for some pollutants there may be a moderate health \
        concern for a very small number of people who are unusually sensitive to air pollution.",
  },
  3: {
    level: "Moderate",
    message:
      "Members of sensitive groups may experience health effects. The general public is not likely to be affected.",
  },
  4: {
    level: "Poor",
    message:
      "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
  },
  5: {
    level: "Very Poor",
    message:
      "Health warnings of emergency conditions. The entire population is more likely to be affected.",
  },
};
