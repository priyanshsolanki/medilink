import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Mail, Phone, Calendar, FileText, Upload, Plus, Download, Send, MessageCircle, X, Minimize2 } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import userService from "../../api/userService";
import recordService from "../../api/recordService";
import { getConversation, sendMessage } from "../../api/messageService";
import {useAuth} from "../../context/AuthContext";

function calculateAge(dob) {
  const birth = typeof dob === 'string' ? new Date(dob) : dob;
  if (Number.isNaN(birth.getTime())) {
    throw new Error('Invalid date of birth');
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  const hasHadBirthdayThisYear =
      today.getMonth() > birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  return hasHadBirthdayThisYear ? age : age - 1;
}

function ChatWindow({ userType, patientId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const containerRef = useRef();
  const [loading, setLoading] = useState(true);
  const {authUser} = useAuth();
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getConversation(patientId);
        if (data && Array.isArray(data)) {
          // Sort messages by timestamp to ensure proper ordering (oldest first, newest last)
          const sortedMessages = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          setMessages(sortedMessages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [patientId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const encryptedContent = text; // Placeholder for encryption
    const iv = 'placeholder-iv';   // Placeholder for IV

    try {
      const data = await sendMessage({
        recipientId: patientId,
        encryptedContent,
        iv,
      });
      if (data.messageId) {
        // Add the new message to the end of the array (bottom of chat)
        setMessages(prev => [
          ...prev,
          {
            id: data.messageId,
            senderId: currentUserId, // Use actual sender ID
            senderName: 'You',
            encryptedContent: text,
            iv,
            isRead: true,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
    setInput('');
  };

  // Helper function to determine if message is from current user
  const isCurrentUserMessage = (message) => {
    // Check by senderId if available, otherwise fall back to senderName
    if (message.senderId && currentUserId) {
      return message.senderId === currentUserId;
    }
    // Fallback: if the message was sent by "You" or current user
    return message.senderName === authUser?.name;
  };

  if (loading) {
    return (
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
      <div className="flex flex-col h-full">
        <div ref={containerRef} className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0">
          {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p className="text-sm">No messages yet. Start the conversation!</p>
              </div>
          ) : (
              messages.map(msg => {
                const isCurrentUser = isCurrentUserMessage(msg);
                return (
                    <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-lg shadow-sm ${
                          isCurrentUser
                              ? 'bg-blue-500 text-white rounded-br-md'
                              : 'bg-gray-200 text-gray-800 rounded-bl-md'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.encryptedContent}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                );
              })
          )}
        </div>
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
          <form onSubmit={sendMessageHandler} className="flex items-center space-x-3">
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
                type="submit"
                disabled={!input.trim()}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
  );
}

export default function DoctorPatientChatPage() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const {authUser} = useAuth();
  const [appointments] = useState([
    { id: '1', date: '2025-07-20', time: '10:00 AM', status: 'Completed' },
    { id: '2', date: '2025-07-25', time: '2:00 PM', status: 'Scheduled' },
  ]);
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({ file: null, description: '' });
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Fetch patient data
    userService.getUserById(patientId)
        .then(data => setPatient(data))
        .catch(err => console.error(err));
  }, [patientId]);

  const loadRecords = () => {
    recordService.getRecords(patientId)
        .then(data => setRecords(data))
        .catch(err => console.error(err));
  };

  useEffect(() => {
    loadRecords();
  }, [patientId]);

  const handleRecordChange = (e) => {
    const { name, files, value } = e.target;
    if (name === 'file') {
      setNewRecord(prev => ({ ...prev, file: files[0] }));
    } else {
      setNewRecord(prev => ({ ...prev, [name]: value }));
    }
  };

  const addRecord = async () => {
    if (!newRecord.file || !newRecord.description) return;
    try {
      await recordService.createRecord(patientId, {
        title: newRecord.file.name,
        type: newRecord.file.name,
        notes: newRecord.description,
        file: newRecord.file
      });
      setNewRecord({ file: null, description: '' });
      loadRecords();
    } catch (err) {
      console.error('Error uploading record:', err);
    }
  };

  const downloadFile = async (recordId) => {
    try {
      const url = await recordService.downloadRecordFile(recordId);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  if (!patient) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading patient...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="flex flex-col min-h-screen bg-gray-50 lg:flex-row">
        <Sidebar />
        <main className={`flex-1 pt-20 lg:pt-0 transition-all duration-300 ${isChatOpen ? 'mr-96' : 'mr-0'}`}>
          <div className="max-w-6xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Patient Profile - {patient.name}
                </h2>
                <div className="flex space-x-2 sm:space-x-4 mt-2">
                <span className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-100 text-blue-800 rounded-lg text-xs sm:text-sm font-medium">
                  Age {calculateAge(patient.dob)} • {patient.gender}
                </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  {isChatOpen ? 'Close Chat' : 'Open Chat'}
                </button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient Details Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  Patient Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900 font-medium">{patient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900 font-medium">{patient.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-gray-900 font-medium">{new Date(patient.dob).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointments Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  Appointments
                </h3>
                <div className="space-y-3">
                  {appointments.map(appt => (
                      <div key={appt.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{appt.date} at {appt.time}</p>
                            <p className="text-xs text-gray-500">Status: {appt.status}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                            appt.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                      {appt.status}
                    </span>
                      </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Health Records Section */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Health Records
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                {records.map(rec => (
                    <div key={rec._id} className="group p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all bg-gray-50 hover:bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <FileText className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">{rec.title}</h4>
                              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                            {new Date(rec.createdAt).toLocaleDateString()}
                          </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{rec.notes}</p>
                            <p className="text-xs text-gray-500">By Dr. {rec?.uploadedBy?.name}</p>
                          </div>
                        </div>
                        {rec.fileUrl && (
                            <button
                                onClick={() => downloadFile(rec._id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-all flex-shrink-0"
                                title="Download file"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                        )}
                      </div>
                    </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Upload New Record</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400 hover:text-blue-500 transition-colors" />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                    <span className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                      {newRecord.file ? newRecord.file.name : 'Click to upload or drag and drop'}
                    </span>
                      <p className="text-xs text-gray-500 mt-1">PDF, DOC, JPG up to 10MB</p>
                    </label>
                    <input
                        id="fileUpload"
                        type="file"
                        name="file"
                        onChange={handleRecordChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-4">
                  <textarea
                      name="description"
                      rows={4}
                      placeholder="Enter record description..."
                      value={newRecord.description}
                      onChange={handleRecordChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                    <button
                        onClick={addRecord}
                        disabled={!newRecord.file || !newRecord.description}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Upload Record</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Chat Sidebar */}
        <div className={`fixed right-0 top-0 h-screen w-96 bg-white shadow-lg border-l border-gray-200 transform transition-transform duration-300 z-50 ${
            isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-screen">
            <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-gray-900">Chat with {patient.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                      onClick={() => setIsChatOpen(false)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button
                      onClick={() => setIsChatOpen(false)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1">Online now</div>
            </div>
            <div className="flex-1 min-h-0">
              <ChatWindow
                  userType="doctor"
                  patientId={patientId}
                  currentUserId={authUser?.id}
              />
            </div>
          </div>
        </div>

        {isChatOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
                onClick={() => setIsChatOpen(false)}
            />
        )}
      </div>
  );
}