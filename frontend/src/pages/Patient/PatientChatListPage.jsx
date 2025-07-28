import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { getAllMessages } from "../../api/messageService";
import { useAuth } from "../../context/AuthContext";

const PatientChatListPage = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getAllMessages();
                setConversations(data);
            } catch (err) {
                console.error("Error fetching conversations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    const handleChatSelect = (doctorId) => {
        navigate(`/patient/chat/${doctorId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading chats...</p>
                </div>
            </div>
        );
    }

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
            <main className="flex-1 pt-20 lg:pt-0 p-4 sm:p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6" aria-label="Chat List">
                        My Chats
                    </h1>
                    {conversations.length === 0 ? (
                        <div className="text-center text-gray-500" role="alert" aria-live="polite">
                            <p>No conversations found. Start a chat with a doctor!</p>
                        </div>
                    ) : (
                        <div className="grid gap-4" role="list" aria-label="List of doctor chats">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.doctorId}
                                    role="listitem"
                                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer"
                                    onClick={() => handleChatSelect(conv.doctorId)}
                                    onKeyPress={(e) => e.key === "Enter" && handleChatSelect(conv.doctorId)}
                                    tabIndex={0}
                                    aria-label={`Chat with ${conv.doctorName}, latest message: ${conv.latestMessage?.encryptedContent || "No message"}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                                                aria-hidden="true"
                                            >
                        <span className="text-blue-600 font-medium">
                          {conv.doctorName.charAt(0)}
                        </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{conv.doctorName}</p>
                                                <p className="text-xs text-gray-500 truncate w-40">
                                                    {conv.latestMessage?.encryptedContent || "No recent messages"}
                                                </p>
                                            </div>
                                        </div>
                                        {conv.unreadCount > 0 && (
                                            <span
                                                className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                                                aria-label={`${conv.unreadCount} unread messages`}
                                            >
                        {conv.unreadCount}
                      </span>
                                        )}
                                        <button
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors ml-4"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChatSelect(conv.doctorId);
                                            }}
                                            aria-label={`Start chat with ${conv.doctorName}`}
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span>Chat</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PatientChatListPage;