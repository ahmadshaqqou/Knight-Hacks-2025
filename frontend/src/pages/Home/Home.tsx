import React, { useState } from 'react';
import TextInput from '../../components/TextInput/TextInput';
import FileUpload from '../../components/FileUpload/FileUpload';
import AnalysisResults from '../../components/AnalysisResults/AnalysisResults';
import HumanApproval from '../../components/HumanApproval/HumanApproval';
import CreateCase from '../../components/CreateCase/CreateCase';
import { tasksAPI } from '../../services/api';

interface AnalysisResult {
  taskDetected: boolean;
  taskDescription?: string;
  confidence?: number;
  specialist?: string;
  id?: string;
}

interface CaseData {
  id: string;
  name: string;
  caseNumber?: string;
  summary: string;
  createdAt: Date;
}

const Home: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [counter, setCounter] = useState<number>(1);

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles([...files, ...uploadedFiles]);
  };

  const handleSubmit = async () => {
    if (!text && files.length === 0) {
      alert('Please enter text or upload files before submitting.');
      return;
    }
    setIsAnalyzing(true);
    try {
      // const res = await tasksAPI.analyzeContent({ text, files });
      const res1 = await fetch(`http://localhost:8000/apps/chat_agent/users/u_123/sessions/s_${counter}`, {method: "POST"});
      const res2 = await fetch(`http://localhost:8000/run`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
          "appName": "chat_agent",
          "user_id": "u_123",
          "session_id": `s_${counter}`,
          "new_message": {
              "role": "user",
              "parts": [
                  {
                      "text": text
                  }
              ]
          }
      })});
      const resData = await res2.json();
      setCounter(counter + 1);
      let resText = "";
      for (const data of resData) {
        const parts = data.content.parts;
        for (const part of parts) {
          if (part.text && part.toString().trim().length > 0) {
            resText += part.text + "\n";
          }
        }
      }

      const dummmy = {
        taskDetected: true,
        taskDescription: resText,
        confidence: 1-Math.pow(Math.random(), 4),
        specialist: "Scheduler",
        id: "abc"
      };
      setAnalysisResult(dummmy);
    } catch (err) {
      console.error('Analysis API error:', err);
      alert('Failed to analyze content. Check backend logs.');
    } finally {
      setIsAnalyzing(false);
    }
  };

    // // Simulate API call to backend
    // setTimeout(() => {
    //   // Mock response
    //   const mockResult: AnalysisResult = {
      //   taskDetected: true,
      //   taskDescription: 'Review contract amendments for client Johnson & Co.',
      //   confidence: 0.89,
      //   specialist: 'Legal Researcher',
      //   id: `task-${Date.now()}`
      // };

    //   // setAnalysisResult(mockResult);
    //   // setIsAnalyzing(false);
    // }, 2000);

  const handleApprove = () => {
    if (!analysisResult) return;
    
    // Simulate API call to store the approved task
    console.log('Task approved:', analysisResult);
    
    // Reset the form
    setText('');
    setFiles([]);
    setAnalysisResult(null);
  };

  const handleReject = () => {
    // Reset the analysis result
    setAnalysisResult(null);
  };

  const handleCaseCreated = (caseData: CaseData) => {
    setCases([...cases, caseData]);
    // In a real application, we would save this to the database
    console.log('New case created:', caseData);
  };


  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-3 text-law-navy">Tender for Lawyers</h1>
        <p className="text-lg text-neutral-dark max-w-2xl mx-auto">
          AI-powered assistant for legal teams. Upload messy content and let our AI specialists organize and route your tasks.
        </p>
      </div>
      
      <div className="flex justify-end mb-6">
        <CreateCase onCaseCreated={handleCaseCreated} />
      </div>
      
      <div className="card mb-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 border-t-4 border-law-navy bg-white bg-opacity-90">
        <h2 className="text-xl font-semibold mb-4 text-law-navy flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-law-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Input Content
        </h2>
        <TextInput
          value={text}
          onChange={handleTextChange}
          placeholder="Paste your email, transcript, or message here..."
        />
        
        <div className="mt-6">
          <FileUpload onUpload={handleFileUpload} files={files} />
        </div>
        
        <div className="mt-6">
          <button
            className={`btn ${isAnalyzing ? 'bg-neutral-light text-neutral-dark' : 'bg-law-navy text-white hover:bg-law-blue'} flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-md transition-all duration-300`}
            onClick={handleSubmit}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-neutral" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Submit for Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {analysisResult && (
        <div className="mt-8 animate-fade-in">
          <AnalysisResults result={analysisResult} />
          <div className="mt-6">
            <HumanApproval
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;