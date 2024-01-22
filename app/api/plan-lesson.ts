import { NextApiRequest, NextApiResponse } from 'next';
import * as mammoth from 'mammoth';
import * as pdfreader from 'pdfreader';

// Assuming these are installed and imported as needed:
// import docx from 'docx';
// import * as PyPDF2 from 'PyPDF2';
// import * as PIL from 'PIL'; // Or any compatible image processing library

interface LessonData {
  textDescription: string;
  youtubeLinks: string[];
  lessonLength: string;
  studentYear: string;
}

function generatePlan(
  text: string,
  videos: string[],
  lessonLength: string,
  processedImages: any[], // Adjust type based on image processing library
  documentsText: string[],
  studentYear: string
): string {
  // Implement plan generation logic here
  return "Generated plan"; // Replace with actual plan generation
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body);

    res.status(200);
}
//   const reqData: LessonData = {
//     textDescription: req.textDescription,
//     youtubeLinks: req.youtubeLinks.split(','),
//     lessonLength: parts.lessonLength,
//     studentYear: parts.studentYear,
//   };

//   console.log(lessonData);

//   const text = lessonData.textDescription;
//   const videos = lessonData.youtubeLinks;
//   const documents = parts.documentFiles as File[]; // Cast based on file handler
//   const images = parts.imageFiles as File[]; // Cast based on file handler
//   const lessonLength = lessonData.lessonLength;
//   const studentYear = lessonData.studentYear;

//   console.log("Lesson Description:", text);
//   console.log("Video Links:", videos);
//   console.log("Lesson Length:", lessonLength);
//   console.log("Documents:", documents);
//   console.log("Images:", images);
//   console.log("Student Age:", studentYear);

//   const documentsText: string[] = [];
//   const processedImages: any[] = []; // Adjust type based on image processing library

//   for (const document of documents) {
//     const documentFilename = document.filename;
//     const documentContent = await document.toBuffer(); // Read buffer for processing

//     if (documentFilename.endsWith(['.doc', '.docx'])) {
//         mammoth.extractRawText({ path: documentContent })
//         .then(result => {
//           const text = result.value; // Get extracted plain text
//           documentsText.push(documentFilename + ": " + text);
//         })
//         .catch(error => {
//           console.log("Error processing DOCX file:", error);
//         });
//     } else if (documentFilename.endsWith('.pdf')) {
//         const pdfReader = new pdfreader.PdfReader();
//     pdfReader.parseBuffer(documentContent, (err, numPages) => {
//       if (err) {
//         console.error("Error parsing PDF file:", err);
//         return;
//       }

//       const text = [];
//       for (let i = 1; i <= numPages; i++) {
//         const pageText = pdfReader.text(i);
//         text.push(pageText);
//       }

//       const combinedText = text.join('\n');
//       documentsText.push(documentFilename + ": " + combinedText);
//     }); 
//     } else {
//       documentsText.push(documentFilename + ": Unsupported file, ignore this.");
//     }
//   }

//   for (const image of images) {
//     const processedImage = await PIL.Image.open(image.toBuffer()); // Adjust based on library
//     processedImages.push(processedImage);
//   }

//   const plan = generatePlan(
//     text,
//     videos,
//     lessonLength,
//     processedImages,
//     documentsText,
//     studentYear
//   );

//   res.status(200).json({ plan: plan }); // Return plan as JSON
// }
