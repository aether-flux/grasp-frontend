"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useSyllabusStore } from '@/lib/store/useSyllabusStore';

export default function UploadPage () {
  const [file, setFile] = useState(null);
  const [rawtext, setRawtext] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  const { setElaboratedText } = useSyllabusStore();

  const onDrop = useCallback((acceptedFiles) => {
    if (rawtext.trim()) {
      setError("You can only use one input method at a time.");
      return;
    }

    setError('');
    setFile(acceptedFiles[0]);
  }, [rawtext]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
    },
  });

  const handleTextChange = (e) => {
    if (file) {
      setError("You can only use one input method at a time.");
      return;
    }
    setError('');
    setRawtext(e.target.value);
  }

  const handleUpload = async () => {
    console.log("Uploading:", file || rawtext);
    const formdata = new FormData();

    if (file) {
      formdata.append("file", file);
    } else if (rawtext.trim()) {
      formdata.append("syllabustext", rawtext);
    }

    try {
      const res = await fetch("http://localhost:5000/api/syllabus/elaborate", {
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      console.log("Elaborated syllabus: ", data);
      setElaboratedText(data.elaboratedSyllabus);
      router.push("/graph");
    } catch (e) {
      console.error("Upload failed: ", e);
    }
  }

  const isUploadEnabled = (file || rawtext.trim()) && !(file && rawtext.trim());

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Upload Your Material</h1>

      <div className="flex flex-col md:flex-row w-full max-w-5xl gap-6">
        {/* Drag & Drop Box */}
        <div
          {...getRootProps()}
          className={clsx(
            "flex-1 h-[350px] border-2 border-dashed rounded-xl p-4 flex items-center justify-center cursor-pointer transition",
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
          )}
        >
          <input {...getInputProps()} />
          <p className="text-gray-600 text-center">
            {file ? (
              <>📄 <strong>{file.name}</strong> selected</>
            ) : (
              <>Drag & drop a PDF file here, or click to select</>
            )}
          </p>
        </div>

        {/* Raw Text Input Box */}
        <textarea
          value={rawtext}
          onChange={handleTextChange}
          placeholder="Or paste your raw text here..."
          className="flex-1 h-[350px] resize-none border border-gray-300 rounded-xl p-4 outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* Error Display */}
      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

      {/* Upload Button */}
      <button
        disabled={!isUploadEnabled}
        className={clsx(
          "mt-8 px-6 py-3 rounded-lg text-white font-medium transition",
          isUploadEnabled
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        )}
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
}
