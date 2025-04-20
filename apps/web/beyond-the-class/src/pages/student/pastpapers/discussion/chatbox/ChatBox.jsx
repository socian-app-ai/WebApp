import React, { useEffect, useState } from 'react';
import { MessageCircle, Send, Users, Minimize2, Maximize2 } from 'lucide-react';
import io from 'socket.io-client';
import { useAuthContext } from '../../../../../context/AuthContext';
import { useRef } from 'react';

const socket = io(import.meta.env.VITE_API_URL, {
    transports: ['websocket']
});

const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
        return `${diffDays}d ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateHeader = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const shouldShowDateHeader = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;

    const currentDate = new Date(currentMsg.timestamp).setHours(0, 0, 0, 0);
    const prevDate = new Date(prevMsg.timestamp).setHours(0, 0, 0, 0);

    return currentDate !== prevDate;
};

const getMessageTime = (timestamp) => {
    return new Date(timestamp).getTime();
};

const MessageGroup = ({ messages, isCurrentUser }) => {
    // Group messages by minute
    const messagesByMinute = messages.reduce((acc, message) => {
        const minute = Math.floor(getMessageTime(message.timestamp) / 60000);
        if (!acc[minute]) {
            acc[minute] = [];
        }
        acc[minute].push(message);
        return acc;
    }, {});

    return (
        <>
            {Object.entries(messagesByMinute).map(([minute, msgs]) => (
                <div
                    key={minute}
                    className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} mb-4`}
                >
                    <div className={`flex items-center space-x-2 mb-1 text-sm ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {msgs[0].username}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                            {formatMessageTime(msgs[0].timestamp)}
                        </span>
                    </div>
                    <div className="space-y-1">
                        {msgs.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`max-w-fit rounded-lg p-3 
                                    ${isCurrentUser
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white dark:bg-gray-800 shadow-sm'}`}
                            >
                                <div className="text-sm break-words">
                                    {msg.message}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
};

const ChatBox = ({ discussionId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showChatBox, setShowChatBox] = useState(false);
    const [usersCount, setUsersCount] = useState(0);
    const { authUser } = useAuthContext();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (authUser && discussionId) {
            socket.emit('joinDiscussion', discussionId);

            socket.on('message', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            socket.on('usersCount', (count) => {
                setUsersCount(count);
            });

            return () => {
                socket.off('message');
                socket.off('users');
                socket.off('usersCount');
            };
        }
    }, [discussionId, authUser]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            const user = {
                _id: authUser._id,
                name: authUser.name,
                username: authUser.username,
                picture: authUser.profile.picture,
            };
            socket.emit('message', { discussionId, message: newMessage, user });
            setNewMessage('');
        }
    };

    // Group messages by user and minute
    const groupedMessages = messages.reduce((acc, message, index) => {
        // Check if we need to show a date header
        if (shouldShowDateHeader(message, messages[index - 1])) {
            acc.push({
                type: 'date',
                timestamp: message.timestamp
            });
        }

        const lastGroup = acc[acc.length - 1];
        const currentMinute = Math.floor(getMessageTime(message.timestamp) / 60000);
        const prevMessage = messages[index - 1];
        const prevMinute = prevMessage ? Math.floor(getMessageTime(prevMessage.timestamp) / 60000) : null;

        if (
            !lastGroup?.messages ||
            lastGroup.type === 'date' ||
            lastGroup.socketId !== message.socketId ||
            currentMinute !== prevMinute
        ) {
            // console.log("D", message)
            acc.push({
                type: 'messages',
                socketId: message.socketId,
                _id: message._id,
                messages: [message]
            });
        } else {
            lastGroup.messages.push(message);
        }

        return acc;
    }, []);


    useEffect(() => {
        // Scroll to the bottom when messages are updated
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);



    return (
        <div className={`fixed z-50 bottom-0 right-4 transition-all duration-300 ease-in-out
            ${showChatBox ? "h-[400px] md:h-[540px] lg:h-[600px]" : "h-12"}
            w-[280px] md:w-[380px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg shadow-lg`}>

            {/* Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Discussion</span>
                    <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                        <Users className="h-3 w-3" />
                        <span>{usersCount}</span>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${discussionId ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <button
                    onClick={() => setShowChatBox(!showChatBox)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    {showChatBox ?
                        <Minimize2 className="h-4 w-4 text-gray-500 dark:text-gray-400" /> :
                        <Maximize2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    }
                </button>
            </div>

            {showChatBox && (
                <>
                    <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
                        Messages are cleared on reload
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 h-[260px] md:h-[400px] lg:h-[460px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                        <div className="space-y-4">
                            {groupedMessages.map((group, index) => {
                                console.log("GRO-- ", group)
                                if (group.type === 'date') {
                                    return (
                                        <div key={`date-${index}`} className="flex justify-center my-6">
                                            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300">
                                                {formatDateHeader(group.timestamp)}
                                            </div>
                                        </div>
                                    );
                                }

                                console.log("GROUP", group)
                                return (
                                    <MessageGroup
                                        key={`msg-${index}`}
                                        messages={group.messages}
                                        // isCurrentUser={group.socketId === socket.id}
                                        isCurrentUser={group._id === authUser._id}
                                    />
                                );

                            })}
                        </div>
                        <div ref={messagesEndRef} />
                    </div>



                    {/* Input Area */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg 
                                    focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                                    text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                                    focus:outline-none"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!newMessage.trim()}
                                className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600
                                    text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </>
            )}


        </div>
    );
};

export default ChatBox;