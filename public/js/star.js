// Logic to select atleast one star

document
  .getElementById("rating-form")
  .addEventListener("submit", function (event) {
    const starError = document.getElementById("star-error");
    const ratingInputs = document.getElementsByName("review[rating]");
    let ratingSelected = false;

    for (const input of ratingInputs) {
      if (input.checked && input.value !== "0") {
        ratingSelected = true;
        break;
      }
    }

    if (!ratingSelected) {
      starError.style.display = "block";
      event.preventDefault(); // Prevent form submission
    } else {
      starError.style.display = "none";
    }
  });
