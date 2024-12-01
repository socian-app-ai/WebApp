const User = require("../models/user/user.model");

/**
 * Generates a 6-digit OTP.
 * @returns {string} - A 6-digit OTP as a string.
 */
const generateOtp6Digit = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generates a formatted date string in the format "Fri Nov 12 2021".
 * @returns {string} - The formatted date as a string.
 */
function createDateTime() {
  // Create a Date object for November 12, 2021
  const date = new Date("2021-11-12T00:00:00");

  // Format the date to 'Fri Nov 12 2021'
  const formattedDate = date.toDateString();

  return formattedDate;
}

const generateUsername = (name) => {
  return name.replace(/\s+/g, "_"); // Replaces spaces with underscores
};

const generateRandomNumber = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
};

const createUniqueUsername = async (name) => {
  let username = generateUsername(name);
  let finalUsername = username;

  // Check if the username exists in the database
  let user = await User.findOne({ username: finalUsername });

  // Loop until a unique username is found
  while (user) {
    // Username exists, so append a random 4-digit number
    const randomNumber = generateRandomNumber();
    finalUsername = `${username}${randomNumber}`;

    // Check if the newly generated username exists
    user = await User.findOne({ username: finalUsername });
  }

  // Return the unique username
  return finalUsername;
};

module.exports = { generateOtp6Digit, createDateTime, createUniqueUsername };
