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

module.exports = { generateOtp6Digit, createDateTime };
