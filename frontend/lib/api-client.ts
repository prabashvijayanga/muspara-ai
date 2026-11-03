// lib/api-client.ts

// Fetch the backend URL from environment variables. 
// Using NEXT_PUBLIC_ ensures this variable is accessible in the browser (client-side).
const rawBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
// Remove any trailing slashes to prevent malformed URLs (e.g., http://url.com//api/...)
const BACKEND_BASE_URL = rawBaseUrl.replace(/\/$/, "");

export async function uploadPdfToBackend(file: File) {
  // Create a FormData object to send the file as a multipart/form-data request
  const formData = new FormData();
  formData.append("file", file);

  try {
    // Send a POST request directly to the FastAPI Render backend.
    // Executing this in the browser bypasses Vercel's 10-second serverless timeout.
    const response = await fetch(`${BACKEND_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    // If the response is not OK (e.g., 500 error or memory crash), throw an error
    if (!response.ok) {
      throw new Error("Failed to upload PDF");
    }

    // Parse and return the JSON response containing the processed memory-image URLs
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw error;
  }
}