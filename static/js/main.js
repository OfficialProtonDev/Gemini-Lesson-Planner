let inputFields = document.querySelectorAll('.input-fields input, .input-fields textarea');
const planLessonButton = document.getElementById('plan-lesson');
const lessonPlanDisplay = document.getElementById('lesson-plan-display');
const slider = document.getElementById("lessonLength-1");
const sliderValue = document.getElementById("lessonLengthValue");

slider.addEventListener("input", () => {
  sliderValue.textContent = slider.value + " minutes";
});

inputFields.forEach(field => {
  field.addEventListener('input', () => {
    if (hasAnyInput()) {
      planLessonButton.disabled = false;
    } else {
      planLessonButton.disabled = true;
    }
  });
});

planLessonButton.addEventListener('click', () => {
  let hasInvalidInputs = false;
  const invalidInputs = [];

  inputFields = document.querySelectorAll('.input-fields input, .input-fields textarea');

  // Gather lesson information and validate inputs
  const lessonData = {};
  inputFields.forEach(field => {
    if (field.value) {
      const dataType = field.parentElement.dataset.type;

      switch (dataType) {
        case "youtubeLinks":
          if (!validateYoutubeLink(field.value)) {
            invalidInputs.push(`YouTube link/s`);
            hasInvalidInputs = true;
          }
          break;
        case "documentFiles":
          if (!validateFileType(field.value, ["doc", "docx", "pdf"])) {
            invalidInputs.push(`document file/s`);
            hasInvalidInputs = true;
          }
          break;
        case "imageFiles":
          if (!validateFileType(field.value, ["jpg", "jpeg", "png"])) {
            invalidInputs.push(`image file/s`);
            hasInvalidInputs = true;
          }
          break;
        default:
          lessonData[field.id] = field.value; // Store data for other field types
      }
    }
  });

  if (hasInvalidInputs) {
    // Display error message to the user
    alert(`Invalid ${invalidInputs.join(" & ")}`);
  } else {
    lessonPlanDisplay.textContent = "Lesson plan generating...";
    lessonData["lessonLength-1"] = sliderValue.textContent;

    // Handle lesson planning logic here (e.g., send data to a server, process it locally, etc.)
    console.log(lessonData); // For now, just log the gathered data

    const formData = new FormData();

    // Append regular form data
    Object.entries(lessonData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append files from user input (updated logic)
    const imageFiles = document.querySelector('.image-field input[type="file"]');
    const documentFiles = document.querySelector('.document-field input[type="file"]');

    if (documentFiles && documentFiles.files.length > 0) {
      for (let i = 0; i < documentFiles.files.length; i++) {
        formData.append("documentFiles", documentFiles.files[i]);
        console.log(documentFiles.files[i]);
      }
    }

    if (imageFiles && imageFiles.files.length > 0) {
      for (let i = 0; i < imageFiles.files.length; i++) {
        formData.append("imageFiles", imageFiles.files[i]);
      }
    }

    console.log("FormData constructed successfully."); // Log a success message instead

    fetch('/plan-lesson', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      lessonPlanDisplay.innerHTML = marked.parse(data.plan);  // Renders Markdown with formatting
    })
    .catch(error => {
      console.error('Error sending lesson data:', error);
      // Handle any errors here
    });
  }
});

// Helper functions for validation (replace with your actual validation logic)
function validateYoutubeLink(link) {
  // Implement YouTube link validation logic
  return link.startsWith("https://www.youtube.com/watch?v=");
}

function validateWebsiteLink(link) {
  // Implement website link validation logic
  try {
    new URL(link);
    return true;
  } catch (err) {
    return false;
  }
}

function validateFileType(fileValue, allowedExtensions) {
  // Implement file type validation logic (modify based on your input mechanism)
  const fileExtension = fileValue.split(".").pop().toLowerCase();
  return allowedExtensions.includes(fileExtension);
}

function hasAnyInput() {
    return [...inputFields].some(field => field.value !== "");
}

const maxInputs = {
    youtubeLinks: 3,
    websiteLinks: 3,
    documentFiles: 3,
    imageFiles: 3,
    textDescription: 1,
};

const typeDescriptions = {
    youtubeLinks: "YouTube link",
    websiteLinks: "website link",
};
  
  const addInput = (field) => {
    const fieldCount = field.querySelectorAll('input, textarea').length;
    const dataType = field.dataset.type;
    const maxFields = maxInputs[dataType]; // Retrieve max fields for this type
  
    if (fieldCount < maxFields) {
      const newInput = document.createElement('input');
      newInput.type = dataType === 'text-description' ? 'textarea' : 'text';
      newInput.id = `${dataType}-${fieldCount + 1}`;

      if (field.dataset.type === 'documentFiles' || field.dataset.type === 'imageFiles') {
        newInput.type = 'file'; // Set the input type to file
      }

      else {
        newInput.placeholder = `Enter ${typeDescriptions[dataType]}`;
      }
  
      field.appendChild(newInput);
  
      newInput.addEventListener('input', () => {
        if (hasAnyInput()) {
          planLessonButton.disabled = false;
        } else {
          planLessonButton.disabled = true;
        }
      });
    }
  };

  function destroyInput(input) {
    input.parentNode.removeChild(input);
  }
  
  // Add event listeners to the initial fields to trigger new field creation
  const initialFields = document.querySelectorAll('.field');
  initialFields.forEach(field => {
    field.addEventListener('input', () => {
      const allInputsHaveValue = Array.from(field.querySelectorAll('input, textarea')).every(input => input.value.trim());
      if (allInputsHaveValue) {
        addInput(field);
      } else {
        // Check for empty inputs and destroy excess ones
        const inputsToDestroy = Array.from(field.querySelectorAll('input, textarea')).filter(input => !input.value.trim());
        if (inputsToDestroy.length > 1) {
          inputsToDestroy.slice(1).forEach(input => destroyInput(input)); // Destroy all but the first empty input
        }
      }
    });

    field.addEventListener('change', (event) => {
        const dataType = field.dataset.type;

        if (dataType === 'documentFiles' || dataType === 'imageFiles') {
          const allFileInputsHaveValue = Array.from(field.querySelectorAll('input[type="file"]')).every(input => input.files.length > 0);
          if (allFileInputsHaveValue) {
            addInput(field);
          } else {
            // Check for empty file inputs and destroy excess ones
            const emptyFileInputs = Array.from(field.querySelectorAll('input[type="file"]')).filter(input => input.files.length === 0);
            if (emptyFileInputs.length > 1) {
              emptyFileInputs.slice(1).forEach(input => destroyInput(input)); // Destroy all but the first empty input
            }
          }
        }
    });

    inputFields = document.querySelectorAll('.input-fields input, .input-fields textarea');
  });