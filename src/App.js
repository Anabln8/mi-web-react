import { useState } from "react";
import "./App.css";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";

function App() {
  const [selectFile, setSelectFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileInput = (e) => {
    // Extract the first file from the FileList
    const file = e.target.files[0];
    console.log("Nombre del archivo:", file.name);
    setSelectFile(file);
  };

  const handleUpload = async () => {
    if (!selectFile) {
      setUploadMessage("Please select a file.");
      return;
    }
    

    setUploading(true);
    setUploadMessage("Uploading...");

    try {
   
      const fileStream = selectFile.stream ? selectFile.stream() : selectFile;
      const params = {
        Bucket: "osmefru",
        Key: selectFile.name,
        Body: fileStream,
      };
      const parallelUploads3 = new Upload({
        client:  new S3Client({
          region: "us-east-1",
          credentials: {
            accessKeyId: "XXXXXXXXXXXX",
            secretAccessKey: "XXXXXXXXXXXXXX",
            sessionToken: "XXXXXXXXXXX"
          },
        }),
        params: params,
      });
  
      parallelUploads3.on("httpUploadProgress", (progress) => {
        console.log(progress);
      });
  
      await parallelUploads3.done();



      setUploadMessage("Upload successful!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>File Uploader</h1>
      <input type="file" onChange={handleFileInput} multiple></input>
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload To S3"}
      </button>
      {uploadMessage && <p className={uploading ? "uploading-message" : "upload-message"}>{uploadMessage}</p>}
    </div>
  );
}

export default App;