import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, Calendar as CalendarIcon, FileText, Upload, Plus } from 'lucide-react';
import Sidebar from '../../components/Sidebar';

export default function DoctorPatientChatPage() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [appointments] = useState([
    { id: '1', date: '2025-07-20', time: '10:00 AM', status: 'Completed' },
    { id: '2', date: '2025-07-25', time: '2:00 PM', status: 'Scheduled' },
  ]);
  const [records, setRecords] = useState([
    { id: 'r1', date: '2025-06-15', type: 'Blood Test', description: 'Cholesterol levels normal.' },
    { id: 'r2', date: '2025-07-01', type: 'X-Ray', description: 'No fractures detected.' },
  ]);
  const [newRecord, setNewRecord] = useState({ file: null, description: '' });

  useEffect(() => {
    // TODO: replace with real API call
    setPatient({
      id: patientId,
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      contact: 'johndoe@example.com',
      phone: '+1 (555) 987-6543',
    });
  }, [patientId]);

  const handleRecordChange = (e) => {
    const { name, files, value } = e.target;
    if (name === 'file') {
      setNewRecord(prev => ({ ...prev, file: files[0] }));
    } else {
      setNewRecord(prev => ({ ...prev, [name]: value }));
    }
  };

  const addRecord = () => {
    if (newRecord.file && newRecord.description) {
      setRecords(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString(),
          type: newRecord.file.name,
          description: newRecord.description,
        },
      ]);
      setNewRecord({ file: null, description: '' });
    }
  };

  if (!patient) {
    return <div className="flex items-center justify-center h-screen">Loading patient...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 lg:flex-row">
      <Sidebar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Chat with {patient.name} (ID: {patient.id})
            </h2>
            <span className="text-sm text-gray-600">
              Age {patient.age} • {patient.gender}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Panel */}
            <aside className="w-full lg:w-1/3 bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3">Patient Details</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{patient.contact}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{patient.phone}</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Appointments</h3>
                <ul className="divide-y divide-gray-200">
                  {appointments.map(appt => (
                    <li key={appt.id} className="py-2 flex items-center gap-2 text-gray-800">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span>{appt.date} at {appt.time} — {appt.status}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Health Records</h3>
                <ul className="space-y-2">
                  {records.map(rec => (
                    <li key={rec.id} className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {rec.type} <span className="text-xs text-gray-500">({rec.date})</span>
                        </div>
                        <div className="text-sm text-gray-700">{rec.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Upload Section */}
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Upload New Record</h4>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 transition">
                    <Upload className="w-6 h-6 mb-2 text-gray-400" />
                    <label htmlFor="fileUpload" className="cursor-pointer text-sm font-medium">
                      {newRecord.file ? newRecord.file.name : 'Click to upload or drag and drop'}
                    </label>
                    <input
                      id="fileUpload"
                      type="file"
                      name="file"
                      onChange={handleRecordChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Enter record description..."
                    value={newRecord.description}
                    onChange={handleRecordChange}
                    className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={addRecord}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                  >
                    <Plus className="w-4 h-4" /> Upload Record
                  </button>
                </div>
              </section>
            </aside>

            {/* Chat Window */}
            <section className="w-full flex-1 bg-white rounded-lg shadow border border-gray-200 flex flex-col overflow-hidden">
              <ChatWindow userType="doctor" />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChatWindow({ userType }) {
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'doctor', content: 'Hello John, how are you today?' },
    { id: 'm2', sender: 'patient', content: 'I am feeling better, thanks!' },
  ]);
  const [input, setInput] = useState('');
  const containerRef = useRef();

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: userType, content: text }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={containerRef} className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'}`}>  
            <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === userType ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>{msg.content}</div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex items-center p-4 border-t">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none"
        />
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition">Send</button>
      </form>
    </div>
  );
}