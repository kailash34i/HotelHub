// Get elements
const date1Input = document.getElementById("date1");
const date2Input = document.getElementById("date2");
const priceElement = document.getElementById("priceTotal");
const taxElement = document.getElementById("tax");
const totalElement = document.getElementById("total");
const totalHiddenElement = document.getElementById("totalhidden");

// Calculate total price function
function calculateTotalPrice() {
  const date1 = new Date(date1Input.value);
  const date2 = new Date(date2Input.value);
  const timeDifference = date2.getTime() - date1.getTime();
  const nights = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days and round up
  const totalPrice = pricePerNight * nights;
  priceElement.innerText = totalPrice.toLocaleString("en-In");
  const tax = (totalPrice * 18) / 100;
  taxElement.innerText = tax.toLocaleString("en-In");
  totalElement.innerText = (totalPrice + tax).toLocaleString("en-In");
  totalHiddenElement.value = (totalPrice + tax);
}

// Set default dates
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1); // Next day
const fiveDaysLater = new Date(today);
fiveDaysLater.setDate(today.getDate() + 6); // Five days later

// Format dates as yyyy-mm-dd
const formattedTomorrow = tomorrow.toISOString().split("T")[0];
const formattedFiveDaysLater = fiveDaysLater.toISOString().split("T")[0];

// Set default values for date inputs
date1Input.value = formattedTomorrow;
date2Input.value = formattedFiveDaysLater;

// Add event listener to input fields
date1Input.addEventListener("change", calculateTotalPrice);
date2Input.addEventListener("change", calculateTotalPrice);

calculateTotalPrice();