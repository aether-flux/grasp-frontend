"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useSyllabusStore } from '@/lib/store/useSyllabusStore';
import { Upload as UploadIcon, Type, FileText } from 'lucide-react';

export default function UploadPage () {
  const [file, setFile] = useState(null);
  const [rawtext, setRawtext] = useState('');
  const [text, setText] = useState('');
  const [subname, setSubname] = useState('');
  const [pdfSubname, setPdfSubname] = useState('');
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
    setText(e.target.value);
    setRawtext(subname+text);
  }

  const handleSubnameChange = (e) => {
    if (file) {
      setError("You can only use one input method at a time.");
      return;
    }
    setError('');
    setSubname(e.target.value);
    setRawtext(subname+text);
  }

  const handlePdfSubnameChange = (e) => {
    setError('');
    setPdfSubname(e.target.value);
  }

  const handleUpload = async () => {
    console.log("Uploading:", file || rawtext);
    const formdata = new FormData();

    if (file) {
      formdata.append("file", file);
    } else if (rawtext.trim()) {
      formdata.append("syllabusText", rawtext);
    }

    try {
      const res = await fetch("http://localhost:5000/api/syllabus/elaborate", {
        method: "POST",
        body: formdata,
      });

      const data = await res.json();
      console.log("Data: ", data);
      
      const cleanedText = data.elaboratedSyllabus
        .replace(/^```json/, '')
        .replace(/```$/, '')
        .trim();

      const parsed = JSON.parse(cleanedText);
      // setElaboratedText({
      //   subject: subname,
      //   syllabus: parsed,
      // });

      // Store subject in DB
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const createdBy = userInfo?.civicId || "anonymous";

      const subRes = await fetch("http://localhost:5000/api/subject/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: subname || pdfSubname,
          rawSyllabus: data.elaboratedSyllabus, // or maybe cleanedText
          createdBy
        }),
      });
      const subData = await subRes.json();
      const subjectId = subData._id;

      const treeRes = await fetch("http://localhost:5000/api/tree/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectId,
          title: subname || pdfSubname,
          tree: parsed,
        })
      });
      const { treeId } = await treeRes.json();

      const rootNodeRes = await fetch(`http://localhost:5000/api/nodes/root/${treeId}`);
      const rootNodes = await rootNodeRes.json();
      console.log("Root nodes: ", rootNodes.nodes);

      let childNodes = [];

      for (const rn of rootNodes.nodes) {
        const childRes = await fetch(`http://localhost:5000/api/nodes/children/${rn._id}`);
        const childNode = await childRes.json();
        childNodes.push([childNode.nodes]);
      }


      let firstNode = {
        title: subname || pdfSubname,
      };

      setElaboratedText({
        1: firstNode,
        2: rootNodes.nodes,
        3: childNodes,
      });

      router.push("/graph");
    } catch (e) {
      console.error("Upload failed: ", e);
    }
  }

  const isUploadEnabled = (file || rawtext.trim()) && !(file && rawtext.trim());

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#222222] mb-3">
          Upload Your Material
        </h1>
        <p className="text-gray-600 text-lg">
          Choose a PDF file or paste your text content
        </p>
      </div>

      {/* Split Card Container */}
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Side - Drag & Drop */}
            <div className="flex-1 p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-[#4F46E5]/10 rounded-lg flex items-center justify-center mr-3">
                  <UploadIcon className="w-5 h-5 text-[#4F46E5]" />
                </div>
                <h2 className="text-xl font-semibold text-[#222222]">Upload File</h2>
              </div>

              <textarea
                  value={pdfSubname}
                  onChange={handlePdfSubnameChange}
                  placeholder="Subject name"
                  className={clsx(
                    "w-full h-[50px] resize-none border rounded-xl p-3 outline-none transition-all duration-200 text-[#222222] placeholder-gray-400",
                    subname.trim() 
                      ? "border-[#10B981] bg-[#10B981]/5 focus:ring-2 focus:ring-[#10B981]/20" 
                      : "border-gray-200 focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/20"
                  )}
                />
              
              <div
                {...getRootProps()}
                className={clsx(
                  "h-[280px] border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
                  isDragActive 
                    ? "border-[#4F46E5] bg-[#4F46E5]/5 shadow-lg shadow-[#4F46E5]/20" 
                    : file 
                    ? "border-[#10B981] bg-[#10B981]/5" 
                    : "border-gray-300 hover:border-[#4F46E5] hover:bg-[#4F46E5]/5 hover:shadow-md hover:shadow-[#4F46E5]/10"
                )}
              >
                <input {...getInputProps()} />
                
                {file ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <FileText className="w-8 h-8 text-[#10B981]" />
                    </div>
                    <p className="text-[#222222] font-medium mb-1">File Selected</p>
                    <p className="text-[#10B981] font-semibold text-lg">{file.name}</p>
                    <p className="text-gray-500 text-sm mt-2">Click to change file</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className={clsx(
                      "w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto transition-colors",
                      isDragActive ? "bg-[#4F46E5]/20" : "bg-gray-100"
                    )}>
                      <UploadIcon className={clsx(
                        "w-8 h-8 transition-colors",
                        isDragActive ? "text-[#4F46E5]" : "text-gray-400"
                      )} />
                    </div>
                    <p className="text-[#222222] font-medium mb-2">
                      {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF"}
                    </p>
                    <p className="text-gray-500 text-sm mb-4">or click to browse files</p>
                    <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full inline-block">
                      PDF files only
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Text Input */}
            <div className="flex-1 p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-[#A78BFA]/10 rounded-lg flex items-center justify-center mr-3">
                  <Type className="w-5 h-5 text-[#A78BFA]" />
                </div>
                <h2 className="text-xl font-semibold text-[#222222]">Paste Text</h2>
              </div>
              
              <div className="relative">
                <textarea
                  value={subname}
                  onChange={handleSubnameChange}
                  placeholder="Subject name"
                  className={clsx(
                    "w-full h-[50px] resize-none border rounded-xl p-3 outline-none transition-all duration-200 text-[#222222] placeholder-gray-400",
                    subname.trim() 
                      ? "border-[#10B981] bg-[#10B981]/5 focus:ring-2 focus:ring-[#10B981]/20" 
                      : "border-gray-200 focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/20"
                  )}
                />
                <textarea
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Paste your text content here..."
                  className={clsx(
                    "w-full h-[280px] resize-none border rounded-xl p-4 outline-none transition-all duration-200 text-[#222222] placeholder-gray-400",
                    text.trim() 
                      ? "border-[#10B981] bg-[#10B981]/5 focus:ring-2 focus:ring-[#10B981]/20" 
                      : "border-gray-200 focus:border-[#A78BFA] focus:ring-2 focus:ring-[#A78BFA]/20"
                  )}
                />
                {text.trim() && subname.trim() && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-[#10B981] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                💡 Tip: You can either upload a PDF or paste text, not both at the same time
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Upload Button */}
      <button
        disabled={!isUploadEnabled}
        className={clsx(
          "mt-8 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg cursor-pointer",
          isUploadEnabled
            ? "bg-[#10B981] hover:bg-[#059669] text-white shadow-[#10B981]/30 hover:shadow-[#10B981]/40 hover:shadow-xl transform hover:-translate-y-0.5"
            : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-gray-200"
        )}
        onClick={handleUpload}
      >
        {isUploadEnabled ? "Upload Material" : "Select File or Enter Text"}
      </button>
    </div>
  );
}
