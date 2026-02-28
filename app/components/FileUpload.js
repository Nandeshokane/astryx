"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUpload({ onFileUpload, isUploading }) {
    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFileUpload(acceptedFiles[0]);
            }
        },
        [onFileUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        disabled: isUploading,
    });

    return (
        <div className="upload-zone-wrapper">
            <div
                {...getRootProps()}
                className={`upload-zone ${isDragActive ? "active" : ""}`}
                id="upload-zone"
            >
                <input {...getInputProps()} id="file-input" />
                <div className="upload-icon">📄</div>
                {isUploading ? (
                    <>
                        <h3>Extracting text...</h3>
                        <p>Reading your document</p>
                    </>
                ) : isDragActive ? (
                    <>
                        <h3>Drop your document here</h3>
                        <p>Release to upload</p>
                    </>
                ) : (
                    <>
                        <h3>
                            Drag & drop your legal document here
                        </h3>
                        <p>
                            or <span className="browse-text">browse files</span> • PDF files
                            supported
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
