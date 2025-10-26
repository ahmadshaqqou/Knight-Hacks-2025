import { randomInt } from 'crypto';
import React, { useState, useEffect } from 'react';

// Define types for our data
interface Case {
  id: string;
  name: string;
  caseNumber?: string;
  summary: string;
  createdAt: Date;
}

interface Email {
  id: string;
  subject: string;
  sender: string;
  recipient: string;
  content: string;
  date: Date;
  caseId: string;
  read: boolean;
}

const Email: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data for cases
  useEffect(() => {
    // In a real application, this would be an API call
    const mockCases: Case[] = [
      {
        id: 'case-1',
        name: 'Johnson & Co. Contract Review',
        caseNumber: 'JC-2025-001',
        summary: 'Review and negotiate terms for the Johnson & Co. service agreement',
        createdAt: new Date('2025-10-15')
      },
      {
        id: 'case-2',
        name: 'Smith v. Davidson',
        caseNumber: 'SD-2025-042',
        summary: 'Personal injury lawsuit regarding workplace accident',
        createdAt: new Date('2025-09-28')
      },
      {
        id: 'case-3',
        name: 'Westfield Property Acquisition',
        caseNumber: 'WP-2025-013',
        summary: 'Commercial real estate purchase for Westfield Corp',
        createdAt: new Date('2025-10-05')
      }
    ];
    
    setCases(mockCases);
    setLoading(false);
  }, []);

  // Mock data for emails based on selected case
  useEffect(() => {
    if (selectedCaseId) {
      setLoading(true);
      
      // In a real application, this would be an API call
      setTimeout(() => {
        /*const mockEmails: Email[] = [
          {
            id: `email-${selectedCaseId}-1`,
            subject: 'Initial consultation follow-up',
            sender: 'client@example.com',
            recipient: 'lawyer@firm.com',
            content: 'Thank you for meeting with me yesterday. I\'ve attached the documents we discussed. Please let me know if you need anything else.',
            date: new Date('2025-10-20T14:30:00'),
            caseId: selectedCaseId,
            read: true
          },
          {
            id: `email-${selectedCaseId}-2`,
            subject: 'Document request',
            sender: 'lawyer@firm.com',
            recipient: 'client@example.com',
            content: 'Could you please provide the following documents for our next meeting:\n\n1. Signed contract from 2024\n2. Correspondence with the other party\n3. Financial statements from Q1 2025',
            date: new Date('2025-10-21T09:15:00'),
            caseId: selectedCaseId,
            read: true
          },
          {
            id: `email-${selectedCaseId}-3`,
            subject: 'Meeting rescheduling',
            sender: 'client@example.com',
            recipient: 'lawyer@firm.com',
            content: 'I need to reschedule our meeting planned for tomorrow. Would Thursday at 2pm work for you instead?',
            date: new Date('2025-10-22T16:45:00'),
            caseId: selectedCaseId,
            read: false
          },
          {
            id: `email-${selectedCaseId}-4`,
            subject: 'Case update',
            sender: 'lawyer@firm.com',
            recipient: 'client@example.com',
            content: 'I wanted to provide you with an update on your case. We\'ve made progress on the following items:\n\n- Filed the necessary paperwork with the court\n- Received initial disclosure from the opposing party\n- Scheduled depositions for next month\n\nPlease review the attached summary and let me know if you have any questions.',
            date: new Date('2025-10-23T11:20:00'),
            caseId: selectedCaseId,
            read: false
          }
        ];
        */
       let mockEmails: Email[] = [];
       let idx = 0;
        fetch('http://localhost:6767/api/email', {"credentials": "include"}) 
          .then(response => {
            if(!response.ok){
              throw new Error("Error fetching from API");
            }
            return response.json();
          })
          .then(data => {
            data['emails'].forEach((element: any) => {
              mockEmails.push({id : `${element.gmail_id}`, subject : `${element.subject}`, sender : `${element.sender}`, recipient : `${element.to}`, content : `${element.body_text}`, date : new Date(element.date), caseId : selectedCaseId, read : false});
            });
            setEmails(mockEmails);
            setLoading(false);
          })
      }, 500);
    } else {
      setEmails([]);
      setSelectedEmail(null);
    }
  }, [selectedCaseId]);

  // Format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Handle case selection
  const handleCaseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const caseId = e.target.value;
    setSelectedCaseId(caseId === '' ? null : caseId);
    setSelectedEmail(null);
  };

  // Handle email selection
  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    // Clear any previous AI summary when switching emails
    setAiSummary(null);
    setAiError(null);
    setAiLoading(false);
    
    // Mark email as read if it wasn't already
    if (!email.read) {
      const updatedEmails = emails.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      );
      setEmails(updatedEmails);
    }
  };

  // Generate AI summary for the selected email by calling the AI endpoint
  const generateAiSummary = async () => {
    if (!selectedEmail) return;

    setAiLoading(true);
    setAiError(null);
    setAiSummary(null);

    // ASSUMPTION: the AI summary endpoint is hosted locally. Update this URL
    // to your real endpoint or move into configuration as needed.
    const generate_rand_session = Math.floor(Math.random() * 1000);
    const AGENT = 'emailagent';
    const AI_ENDPOINT_INIT = `http://localhost:8000/apps/${AGENT}/users/u_123/sessions/s_${generate_rand_session}`;
    const AI_ENDPOINT = `http://localhost:8000/run`;
    
    // Session creation endpoint
    try {
      const session_init = await fetch(AI_ENDPOINT_INIT, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (err: any) {
      return setAiError('Failed to initialize AI session');
    }

    // Main endpoint
    try {
      const res = await fetch(AI_ENDPOINT, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "appName": AGENT,
          "user_id": 'u_123',
          "session_id": `s_${generate_rand_session.toString()}`,
          "new_message": {
          "role": "user",
          "parts": [
              {
                  "text": `Summarize the following email content in a concise manner, highlighting key points and action items:\n\n${selectedEmail.content}`,
              }
          ]
      }
        })
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || `AI API returned status ${res.status}`);
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        // Try common field names, fallback to raw stringify
        //const summary = json.summary || json.result || json.data || JSON.stringify(json);
        setAiSummary(json[0]["content"]["parts"][0]["text"]);
      } else {
        const text = await res.text();
        let output_text = JSON.parse(text);
       
         output_text = output_text[0]["content"]["parts"][0]["text"];

        setAiSummary(output_text);
      }
    } catch (err: any) {
      setAiError(err?.message || 'Failed to generate AI summary');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-law-navy">Email Management</h1>
        <p className="text-lg text-neutral-dark max-w-3xl mx-auto">
          View and manage emails associated with your cases
        </p>
      </div>
      
      {/* Case selection dropdown */}
      <div className="mb-6">
        <label htmlFor="caseSelect" className="block text-sm font-medium text-neutral-dark mb-2">
          Select Case
        </label>
        <select
          id="caseSelect"
          className="w-full md:w-1/2 px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-law-navy"
          value={selectedCaseId || ''}
          onChange={handleCaseSelect}
        >
          <option value="">-- Select a case --</option>
          {cases.map(caseItem => (
            <option key={caseItem.id} value={caseItem.id}>
              {caseItem.name} {caseItem.caseNumber ? `(${caseItem.caseNumber})` : ''}
            </option>
          ))}
        </select>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-law-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : selectedCaseId ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email list */}
          <div className="md:col-span-1 border border-neutral-light rounded-md overflow-hidden">
            <div className="bg-neutral-lightest p-3 border-b border-neutral-light">
              <h2 className="font-medium text-law-navy">Emails ({emails.length})</h2>
            </div>
            
            <div className="divide-y divide-neutral-light max-h-[600px] overflow-y-auto">
              {emails.length === 0 ? (
                <div className="p-4 text-center text-neutral">
                  No emails found for this case
                </div>
              ) : (
                emails.map(email => (
                  <div
                    key={email.id}
                    className={`p-3 cursor-pointer hover:bg-neutral-lightest transition-colors duration-200 ${
                      selectedEmail?.id === email.id ? 'bg-neutral-lightest' : ''
                    } ${!email.read ? 'font-semibold' : ''}`}
                    onClick={() => handleEmailSelect(email)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium truncate flex-grow">{email.subject}</span>
                      <span className="text-xs text-neutral whitespace-nowrap ml-2">
                        {formatDate(email.date).split(',')[0]}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-dark truncate">
                      {email.sender}
                    </div>
                    <div className="text-xs text-neutral truncate mt-1">
                      {email.content.substring(0, 60)}...
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Email content */}
          <div className="md:col-span-2 border border-neutral-light rounded-md">
            {selectedEmail ? (
              <div className="h-full flex flex-col">
                <div className="bg-neutral-lightest p-4 border-b border-neutral-light">
                  <h2 className="text-xl font-medium text-law-navy mb-1">{selectedEmail.subject}</h2>
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-neutral-dark">From: </span>
                      <span className="text-law-navy">{selectedEmail.sender}</span>
                    </div>
                    <div className="text-neutral">
                      {formatDate(selectedEmail.date)}
                    </div>
                  </div>
                  <div className="text-sm mt-1">
                    <span className="text-neutral-dark">To: </span>
                    <span className="text-law-navy">{selectedEmail.recipient}</span>
                  </div>
                </div>
                
                <div className="p-4 flex-grow overflow-y-auto">
                  <div className="whitespace-pre-line text-neutral-dark">
                    {selectedEmail.content}
                  </div>
                </div>
                
                <div className="border-t border-neutral-light p-3 bg-neutral-lightest">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={generateAiSummary}
                      disabled={aiLoading}
                      className="px-3 py-1 bg-law-navy text-white rounded hover:bg-law-blue transition-colors duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {aiLoading ? (
                        <span className="inline-flex items-center space-x-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Generating...</span>
                        </span>
                      ) : (
                        'Generate AI Summary'
                      )}
                    </button>
                    <button className="px-3 py-1 bg-white border border-neutral-light text-neutral-dark rounded hover:bg-neutral-lightest transition-colors duration-200 text-sm">
                      Forward
                    </button>
                  </div>
                  
                </div>
                <div className="p-5 flex-grow overflow-y-auto">
                  {aiLoading ? (
                    <div className="text-center text-neutral">
                      <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-law-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <div>Generating AI summary...</div>
                    </div>
                  ) : aiError ? (
                    <div className="text-sm text-red-600">Error generating summary: {aiError}</div>
                  ) : aiSummary ? (
                    <div className="whitespace-pre-line text-neutral-dark">{aiSummary}</div>
                  ) : (
                    <div className="text-neutral">AI summary will appear here. Click "Generate AI Summary" to create one for the selected email.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-neutral">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-neutral-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p>Select an email to view its contents</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-neutral-lightest rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-xl font-medium text-neutral-dark mb-2">No Case Selected</h3>
          <p className="text-neutral max-w-md mx-auto">
            Please select a case from the dropdown above to view associated emails
          </p>
        </div>
      )}
    </div>
  );
};

export default Email;