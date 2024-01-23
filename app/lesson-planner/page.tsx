'use client';

import './styles.css';
import { useRef, useState } from 'react';
import * as marked from 'marked';

const minimumCharacters = 20;

let processingPlan = false;

// Helper functions for validation (replace with your actual validation logic)
function validateYoutubeLink(link: string) {
    // Implement YouTube link validation logic
    return link.startsWith("https://www.youtube.com/watch?v=");
}

function validateWebsiteLink(link: string | URL) {
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

const maxInputs = new Map<string, number>();
maxInputs.set("youtubeLinks", 3);
maxInputs.set("websiteLinks", 3);
maxInputs.set("documentFiles", 3);
maxInputs.set("imageFiles", 3);
maxInputs.set("textDescription", 1);

const typeDescriptions = new Map<string, string>();
typeDescriptions.set("youtubeLinks", "YouTube link");
typeDescriptions.set("websiteLinks", "website link");

function destroyInput(input: HTMLInputElement) {
    input.parentNode.removeChild(input);
}

// Add event listeners to the initial fields to trigger new field creation

export default function LessonPlanner() {
    // before load
    const [lessonLength, setLessonLength] = useState(60);
    const [studentYear, setStudentYear] = useState(11);
    const [textDescription, setTextDescription] = useState("");
    const [lessonPlanDisplay, setLessonPlanDisplay] = useState("Lesson plan will show here");
    const [descriptionLengthValue, setdesLenVal] = useState("0/20 ");

    const inputRef = useRef(null);

    const [planButtonDisabled, setPlanButtonDisable] = useState(true);

    let inputHandle = (field: any) => {
        field.addEventListener('input', () => {
            if (hasTextInput() && !processingPlan) {
                setPlanButtonDisable(false);
            } else {
                setPlanButtonDisable(true);
            }
        });
    };

    const handleLessonLengthChange = (event: any) => {
        setLessonLength(event.target.value);
    };

    const handleStudentYearChange = (event: any) => {
        setStudentYear(event.target.value);
    };

    const handleDescriptionChange = (event: any) => {
        setTextDescription(event.target.value);
        const characterCount = textDescription.length;
        setdesLenVal(characterCount + "/20 min characters");
        inputHandle(event.target);
    }

    let processingPlan = false;
    function hasTextInput() {
        const characterCount = textDescription.length;

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

    const [images, setImages] = useState([
        null
    ]);

    const [docs, setDocs] = useState([
        null
    ]);

    const addImage = (image: any) => {
        setImages((prevInputs: any) => [...prevInputs, image]);
    };

    const addDoc = (doc: any) => {
        setDocs((prevInputs: any) => [...prevInputs, doc]);
    };

    let planLessonButtonClick = () => {
        let hasInvalidInputs = false;
        const invalidInputs: string[] = [];

        processingPlan = true;
        setPlanButtonDisable(true);

        // Gather lesson information and validate inputs
        const lessonData = new Map();

        // switch (dataType) {
        //     case "youtubeLinks":
        //         if (!validateYoutubeLink(field.value)) {
        //             invalidInputs.push(`YouTube link/s`);
        //             hasInvalidInputs = true;

        if (hasInvalidInputs) {
            setPlanButtonDisable(false);
            processingPlan = false;
            // Display error message to the user
            alert(`Invalid ${invalidInputs.join(" & ")}`);
        } else {
            setLessonPlanDisplay("Lesson plan generating...");
            lessonData.set("lessonLength-1", lessonLength);
            lessonData.set("studentYear-1", studentYear);

            // Handle lesson planning logic here (e.g., send data to a server, process it locally, etc.)
            console.log(lessonData); // For now, just log the gathered data

            const formData = new FormData();

            // Append regular form data
            Object.entries(lessonData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Append files from user input (updated logic)
            if (docs && docs.length > 0) {
                console.log(docs);
                for (let i = 0; i < docs.length; i++) {
                    formData.append("documentFiles", docs[i].files[0]);
                    console.log(docs[i]);
                }
            }

            if (images && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    formData.append("imageFiles", images[i].files[0]);
                }
            }

            fetch('/plan-lesson', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(async data => {
                    setLessonPlanDisplay(await marked.parse(data.plan));  // Renders Markdown with formatting
                    setPlanButtonDisable(false);
                    processingPlan = false;
                })
                .catch(error => {
                    console.error('Error sending lesson data:', error);
                    // Handle any errors here
                    setPlanButtonDisable(false);
                    processingPlan = false;
                });
        }
    };

    let handleImageInput = () => {
        const allInputsHaveValue = images.every(input => input != null);
        if (allInputsHaveValue) {
            addImage(null);
        } else {
            // Check for empty inputs and destroy excess ones
            const inputsToDestroy = images.filter(input => !input.value.trim());
        }
    }

    let handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let values = images;
        console.log(parseInt(event.target.id));
        values[parseInt(event.target.id)] = event.target.files;
        setImages(values);

        const allFileInputsHaveValue = images.every(input => input != null || input.length > 0);
        if (allFileInputsHaveValue) {
            if (images.length < maxInputs.get("imageFiles")) addImage(null);
        } 
    }

    let handleDocChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let values = docs;
        console.log(event.target.id);
        values[parseInt(event.target.id)] = event.target.files;
        setDocs(values);

        const allFileInputsHaveValue = docs.every(input => input != null || input.length > 0);
        if (allFileInputsHaveValue) {
            if (docs.length < maxInputs.get("documentFiles")) addDoc(null);
        } 
    }

    return (
        <>
            <div className="container">
                <h1>Plan Your Lesson</h1>

                <div className="input-fields">
                    <div className="field yt-field" data-type="youtubeLinks">
                        <label htmlFor="youtubeLinks-1">YouTube Videos:</label>
                        <input type="text" id="youtubeLinks-1" placeholder="Enter YouTube link" ref={inputRef} />
                    </div>
                    <div className="field document-field" data-type="documentFiles">
                        <label htmlFor="documentFiles-1">Documents:</label>
                        {
                            docs.map((file, index) => (
                                <input type="file" id={index.toString()}
                                    accept=".docx" 
                                    value={file ? file : ""} onChange={handleDocChange} />
                            ))
                        }
                    </div>
                    <div className="field text-description-field" data-type="textDescription" >
                        <label htmlFor="textDescription-1">Lesson Description:</label>
                        <textarea id="textDescription-1" rows={4} value={textDescription}
                            onChange={handleDescriptionChange} ref={inputRef}></textarea>
                        <span id="textLengthValue">{descriptionLengthValue}</span>
                    </div>
                    <div className="field lesson-length-field" data-type="lessonLength">
                        <label htmlFor="lessonLength-1">Lesson Duration:</label>
                        <input type="range" min="15" max="120" id="lessonLength-1" step="5"
                            value={lessonLength} onChange={handleLessonLengthChange} ref={inputRef} />
                        <span id="lessonLengthValue">{lessonLength + " minutes"}</span>
                    </div>
                    <div className="field image-field" data-type="imageFiles">
                        <label htmlFor="imageFiles-1">Image:</label>
                        {
                            images.map((file, index) => (
                                <input type="file" id={index.toString()}
                                    accept=".jpg, .jpeg, .png"
                                    value={file ?file : ""} onChange={handleImageChange} />
                            ))
                        }
                    </div>
                    <div className="field student-year-field" data-type="studentYear">
                        <label htmlFor="studentYear-1">Student Age:</label>
                        <input type="range" min="5" max="18" id="studentYear-1" step="1"
                            value={studentYear} onChange={handleStudentYearChange} ref={inputRef} />
                        <span id="studentYearValue">{studentYear + " year old"}</span>
                    </div>
                </div>

                <div className="centered_button_container">
                    <div className="centered_button">
                        <button id="plan-lesson" disabled={planButtonDisabled} onClick={planLessonButtonClick}>Plan Lesson</button>
                    </div>
                </div>

                <div className="lesson-plan" id="lesson-plan-display">
                    {lessonPlanDisplay}
                </div>
            </div>

            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
            <script src="../static/js/main.js"></script>
        </>
    );
}