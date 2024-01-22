'use client';

import './styles.css';
import { useState } from 'react';
import * as marked from 'marked';

const minimumCharacters = 20;

// Helper functions for validation (replace with your actual validation logic)
function validateYoutubeLink(link: any) {
    // Implement YouTube link validation logic
    return link.startsWith("https://www.youtube.com/watch?v=");
}

function validateWebsiteLink(link: any) {
    // Implement website link validation logic
    try {
        new URL(link);
        return true;
    } catch (err) {
        return false;
    }
}

function validateFileType(fileValue: string, allowedExtensions: string | any[]) {
    // Implement file type validation logic (modify based on your input mechanism)
    const fileExtension = fileValue.split(".").pop().toLowerCase();
    return allowedExtensions.includes(fileExtension);
}

function hasTextInput(textDescription: HTMLTextAreaElement) {
    const characterCount = textDescription.value.length;

    if (characterCount >= minimumCharacters) {
        // User has written 20+ characters
        console.log("Description has sufficient characters!");
        return true
    } else {
        // Character count is below 20
        console.log("Description needs more characters.");
        return false
    }
}

const maxInputs = new Map<string, number>();
maxInputs.set("youtubeLinks", 3);
maxInputs.set("websiteLinks", 3);
maxInputs.set("documentFiles", 3);
maxInputs.set("imageFiles", 3);
maxInputs.set("textDescription", 1);

const typeDescriptions = {
    youtubeLinks: "YouTube link",
    websiteLinks: "website link",
};

const addInput = (field: Element) => {
    const fieldCount = field.querySelectorAll('input, textarea').length;
    const dataType = field.dataset.type;
    const maxFields = maxInputs.get(dataType); // Retrieve max fields for this type

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

function destroyInput(input: any) {
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


export default function Planner() {
    const [lessonLength, setLessonLength] = useState(60);
    const [studentYear, setStudentYear] = useState(11);
    const [textDescription, setTextDescription] = useState("");
    const [lessonPlanDisplay, setLessonPlanDisplay] = useState("");
    const [descriptionLengthValue, setdesLenVal] = useState("");

    const handleLessonLengthChange = (event: any) => {
        setLessonLength(event.target.value);
    };

    const handleStudentYearChange = (event: any) => {
        setStudentYear(event.target.value);
    };

    const handleDescriptionChange = (event: any) => {
        setTextDescription(event.target.value);
    }

    let processingPlan = false;

    let textDescriptionChange = () => {
        const characterCount = textDescription.length;
        setdesLenVal(characterCount + "/20 min characters");
    };

    let inputFields = document.querySelectorAll('.input-fields input, .input-fields textarea') as NodeListOf<HTMLInputElement>;
    let planLessonButtonCLick = () => {
        let hasInvalidInputs = false;
        const invalidInputs: any = [];

        processingPlan = true;
        inputFields = document.querySelectorAll('.input-fields input, .input-fields textarea') as NodeListOf<HTMLInputElement>;

        // Gather lesson information and validate inputs
        const lessonData = new Map<string, string>();
        inputFields.forEach(field => {
            if (field.value) {
                const dataType = field.parentElement?.dataset.type;

                switch (dataType) {
                    case "youtubeLinks":
                        if (!validateYoutubeLink(field.value)) {
                            invalidInputs.push(`YouTube link/s`);
                            hasInvalidInputs = true;
                        }
                        break;
                    case "documentFiles":
                        if (!validateFileType(field.value, ["docx"])) {
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
                        lessonData.set(field.id, field.value); // Store data for other field types
                }
            }
        });

        if (hasInvalidInputs) {
            processingPlan = false;
            // Display error message to the user
            alert(`Invalid ${invalidInputs.join(" & ")}`);
        } else {
            setLessonPlanDisplay("Lesson plan generating...");
            lessonData.set("lessonLength-1", lessonLengthValue.textContent);
            lessonData.set("studentYear-1", studentYearValue.textContent);

            // Handle lesson planning logic here (e.g., send data to a server, process it locally, etc.)
            console.log(lessonData); // For now, just log the gathered data

            const formData = new FormData();

            // Append regular form data
            Object.entries(lessonData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Append files from user input (updated logic)
            const imageFiles = document.querySelector('.image-field input[type="file"]') as HTMLInputElement;
            const documentFiles = document.querySelector('.document-field input[type="file"]') as HTMLInputElement;

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

            fetch('/api/plan', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    lessonPlanDisplay.innerHTML = marked.parse(data.plan);  // Renders Markdown with formatting
                    processingPlan = false;
                })
                .catch(error => {
                    console.error('Error sending lesson data:', error);
                    // Handle any errors here
                    processingPlan = false;
                });
        }
    };

    return (
        <>
            <title>Lesson Planner</title>
            <body>
                <div className="container">
                    <h1>Plan Your Lesson</h1>

                    <div className="input-fields">
                        <div className="field yt-field" data-type="youtubeLinks">
                            <label htmlFor="youtubeLinks-1">YouTube Videos:</label>
                            <input type="text" id="youtubeLinks-1" placeholder="Enter YouTube link" />
                        </div>
                        <div className="field document-field" data-type="documentFiles">
                            <label htmlFor="documentFiles-1">Documents:</label>
                            <input type="file" id="documentFiles-1" />
                        </div>
                        <div className="field text-description-field" data-type="textDescription">
                            <label htmlFor="textDescription-1">Lesson Description:</label>
                            <textarea id="textDescription-1" rows={4} value={textDescription}
                            onChange={handleDescriptionChange}></textarea>
                            <span id="textLengthValue">0/20 min characters</span>
                        </div>
                        <div className="field lesson-length-field" data-type="lessonLength">
                            <label htmlFor="lessonLength-1">Lesson Duration:</label>
                            <input type="range" min="15" max="120" id="lessonLength-1" step="5"
                                value={lessonLength} onChange={handleLessonLengthChange} />
                            <span id="lessonLengthValue">{lessonLength + " minutes"}</span>
                        </div>
                        <div className="field image-field" data-type="imageFiles">
                            <label htmlFor="imageFiles-1">Image:</label>
                            <input type="file" id="imageFiles-1" />
                        </div>
                        <div className="field student-year-field" data-type="studentYear">
                            <label htmlFor="studentYear-1">Student Age:</label>
                            <input type="range" min="5" max="18" id="studentYear-1" step="1"
                                value={studentYear} onChange={handleStudentYearChange} />
                            <span id="studentYearValue">{studentYear + " year old"}</span>
                        </div>
                    </div>

                    <div className="centered_button_container">
                        <div className="centered_button">
                            <button id="plan-lesson" disabled={processingPlan}
                                onClick={planLessonButtonCLick}>Plan Lesson</button>
                        </div>
                    </div>

                    <div className="lesson-plan" id="lesson-plan-display">
                       {lessonPlanDisplay} 
                    </div>
                </div>

                <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
            </body>
        </>
    );
}