import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, Phone, Calendar, FileText, Upload, Plus, Download, Send, MessageCircle, X, Minimize2 } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import userService from "../../api/userService";
import recordService from "../../api/recordService";
import { getAllMessages, getConversation, sendMessage } from "../../api/messageService";
import { useAuth } from "../../context/AuthContext";

function calculateAge(dob) {
    const birth = typeof dob === "string" ? new Date(dob) : dob;
    if (Number.isNaN(birth.getTime())) {
        throw new Error("Invalid date of birth");
    }

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();

    const hasHadBirthdayThisYear =
        today.getMonth() > birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

    return hasHadBirthdayThisYear ? age : age - 1;
}

function ChatWindow({ selectedDoctorId, currentUserId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const containerRef = useRef();
    const [loading, setLoading] = useState(true);
    const { authUser } = useAuth();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await getConversation(selectedDoctorId);
                if (data && Array.isArray(data)) {
                    const sortedMessages = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    setMessages(sortedMessages);
                } else {
                    setMessages([]);
                }
            } catch (err) {
                console.error("Error fetching messages:", err);
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };
        if (selectedDoctorId) fetchMessages();
    }, [selectedDoctorId]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessageHandler = async (e) => {
        e.preventDefault();
        const text = input.trim();
        if (!text) return;

        const encryptedContent = text; // Placeholder for encryption
        const iv = "placeholder-iv"; // Placeholder for IV

        try {
            const data = await sendMessage({
                recipientId: selectedDoctorId,
                encryptedContent,
                iv,
            });
            if (data.messageId) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: data.messageId,
                        senderId: currentUserId,
                        senderName: "You",
                        encryptedContent: text,
                        iv,
                        isRead: true,
                        timestamp: new Date().toISOString(),
                    },
                ]);
            }
        } catch (err) {
            console.error("Error sending message:", err);
        }
        setInput("");
    };

    const isCurrentUserMessage = (message) => {
        if (message.senderId && currentUserId) {
            return message.senderId === currentUserId;
        }
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
                    messages.map((msg) => {
                        const isCurrentUser = isCurrentUserMessage(msg);
                        return (
                            <div key={msg.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-lg shadow-sm ${
                                        isCurrentUser
                                            ? "bg-blue-500 text-white rounded-br-md"
                                            : "bg-gray-200 text-gray-800 rounded-bl-md"
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed">{msg.encryptedContent}</p>
                                    <p className="text-xs mt-1 opacity-70">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
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
                        onChange={(e) => setInput(e.target.value)}
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

export default function PatientChatPage() {
    const { doctorId } = useParams();
    const [conversations, setConversations] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(doctorId);
    const [isChatOpen, setIsChatOpen] = useState(true); // Start with chat open since it's a dedicated chat page
    const [newRecord, setNewRecord] = useState({ file: null, description: "" });
    const { authUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getAllMessages();
                setConversations(data);
            } catch (err) {
                console.error("Error fetching conversations:", err);
            }
        };
        fetchConversations();
    }, []);

    useEffect(() => {
        if (doctorId && doctorId !== selectedDoctorId) {
            setSelectedDoctorId(doctorId);
        }
    }, [doctorId, selectedDoctorId]);

    const handleChatSelect = (doctorId) => {
        setSelectedDoctorId(doctorId);
        navigate(`/patient/chat/${doctorId}`);
    };

    const loadRecords = () => {
        recordService
            .getRecords(authUser?.id)
            .then((data) => console.log("Patient records:", data)) // Replace with state management
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        loadRecords();
    }, [authUser?.id]);

    const handleRecordChange = (e) => {
        const { name, files, value } = e.target;
        if (name === "file") {
            setNewRecord((prev) => ({ ...prev, file: files[0] }));
        } else {
            setNewRecord((prev) => ({ ...prev, [name]: value }));
        }
    };

    const addRecord = async () => {
        if (!newRecord.file || !newRecord.description) return;
        try {
            await recordService.createRecord(authUser?.id, {
                title: newRecord.file.name,
                type: newRecord.file.name,
                notes: newRecord.description,
                file: newRecord.file,
            });
            setNewRecord({ file: null, description: "" });
            loadRecords();
        } catch (err) {
            console.error("Error uploading record:", err);
        }
    };

    const downloadFile = async (recordId) => {
        try {
            const url = await recordService.downloadRecordFile(recordId);
            window.open(url, "_blank");
        } catch (err) {
            console.error("Download error:", err);
        }
    };

    if (!authUser) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <p className="text-gray-600 font-medium">Please log in to view chats.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 lg:flex-row">
            <Sidebar />
            <main className={`flex-1 pt-20 lg:pt-0 transition-all duration-300 ${isChatOpen ? "mr-96" : "mr-0"}`}>
                <div className="max-w-6xl mx-auto p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                        <div className="mb-4 sm:mb-0">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                Chat with{" "}
                                {conversations.find((c) => c.doctorId === selectedDoctorId)?.doctorName || "Doctor"}
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setIsChatOpen(false);
                                    navigate("/patient/chats");
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
                            >
                                <MessageCircle className="w-4 h-4 inline mr-2" />
                                Back to Chats
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
                                        <p className="text-gray-900 font-medium">{authUser?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="text-gray-900 font-medium">{authUser?.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Date of Birth</p>
                                        <p className="text-gray-900 font-medium">{new Date(authUser?.dob).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Appointments Card - Placeholder */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                                Appointments
                            </h3>
                            <div className="space-y-3">
                                <p className="text-gray-500 text-sm">Appointments will be displayed here.</p>
                            </div>
                        </div>
                    </div>

                    {/* Health Records Section */}
                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                            Health Records
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                            <p className="text-gray-500 text-sm">Records will be displayed here.</p>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Upload New Record</h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer">
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400 hover:text-blue-500 transition-colors" />
                                    <label htmlFor="fileUpload" className="cursor-pointer">
                    <span className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                      {newRecord.file ? newRecord.file.name : "Click to upload or drag and drop"}
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
            <div
                className={`fixed right-0 top-0 h-screen w-96 bg-white shadow-lg border-l border-gray-200 transform transition-transform duration-300 z-50 ${
                    isChatOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-screen">
                    <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Chat with {conversations.find((c) => c.doctorId === selectedDoctorId)?.doctorName || "Doctor"}
                                </h3>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setIsChatOpen(false)}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <Minimize2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedDoctorId(null);
                                        setIsChatOpen(false);
                                        navigate("/patient/chats");
                                    }}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Online now</div>
                    </div>
                    <div className="flex-1 min-h-0">
                        {selectedDoctorId && <ChatWindow selectedDoctorId={selectedDoctorId} currentUserId={authUser?.id} />}
                    </div>
                </div>
            </div>

            {isChatOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
                    onClick={() => {
                        setSelectedDoctorId(null);
                        setIsChatOpen(false);
                        navigate("/patient/chats");
                    }}
                />
            )}
        </div>
    );
}