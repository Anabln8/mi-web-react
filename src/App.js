import React, { useState } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import "./App.css";

function App() {
  // Estado para almacenar el archivo seleccionado
  const [selectFile, setSelectFile] = useState(null);
  // Estado para controlar si se está subiendo un archivo
  const [uploading, setUploading] = useState(false);
  // Estado para mostrar mensajes al usuario
  const [uploadMessage, setUploadMessage] = useState("");

  // Función que se ejecuta cuando el usuario selecciona un archivo
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    console.log("Nombre del archivo:", file.name);
    setSelectFile(file);
  };

  // Función para subir el archivo a S3
  const handleUpload = async () => {
    if (!selectFile) {
      setUploadMessage("Por favor, seleccione un archivo.");
      return;
    }

    setUploading(true);
    setUploadMessage("Subiendo...");

    try {
      // Crear un cliente S3 configurado con las credenciales (definidas en el código)
      const client = new S3Client({
        region: "us-east-1",
        credentials: {
          accessKeyId: "XXXXXXXXX",
          secretAccessKey: "XXXXXXXXX",
          sessionToken: "XXXXXXXXX", 
        },
      });

      // Parámetros para la subida
      const params = {
        Bucket: "nombre-del-bucket", // Reemplaza con el nombre real de tu bucket S3
        Key: selectFile.name,         // Usamos el nombre del archivo seleccionado
        Body: selectFile,             // El contenido del archivo
      };

      // Crear el comando de subida y enviarlo
      const command = new PutObjectCommand(params);
      await client.send(command);

      setUploadMessage("Subida exitosa!");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setUploadMessage("Error al subir archivo. Intente nuevamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Subidor de Archivos</h1>
      <input type="file" onChange={handleFileInput} multiple />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Subiendo..." : "Subir a S3"}
      </button>
      {uploadMessage && (
        <p className={uploading ? "uploading-message" : "upload-message"}>
          {uploadMessage}
        </p>
      )}
    </div>
  );
}

export default App;