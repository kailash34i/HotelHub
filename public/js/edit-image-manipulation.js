function previewImage(event, imageNumber) {
  const input = event.target;
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewImage = document.getElementById(
        `previewImage${imageNumber}`
      );
      previewImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Image input field for edit forms

const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");

imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
    previewImage.style.display = "block";
  } else {
    previewImage.style.display = "none";
  }
});
