//----- Function To Handle Image Input Change----------

  function handleImageInput(inputId, previewId) {
    const imageInput = document.getElementById(inputId);
    const previewImage = document.getElementById(previewId);
    const imageContainer = imageInput.parentElement.parentElement; // Select the parent .img-container

    // Hide the preview image initially
    previewImage.style.display = "none";

    imageInput.addEventListener("change", function(event) {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          previewImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
        previewImage.style.display = "block";
        imageContainer.classList.add(
          "d-flex",
          "justify-content-around",
          "align-items-center"
        );
      }
    });
  }

  // Call handleImageInput function for each image input

  handleImageInput("imageInput1", "previewImage1");
  handleImageInput("imageInput2", "previewImage2");
  handleImageInput("imageInput3", "previewImage3");