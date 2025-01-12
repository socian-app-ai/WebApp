// // // import { useEffect, useState } from 'react';
// // // import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
// // // import io from 'socket.io-client';
// // // import { useAuthContext } from '../../../../../context/AuthContext';

// // // const socket = io(import.meta.env.VITE_API_URL, {
// // //     transports: ['websocket']
// // // });

// // // // eslint-disable-next-line react/prop-types
// // // const ChatBox = ({ discussionId }) => {
// // //     const [messages, setMessages] = useState([]);
// // //     const [newMessage, setNewMessage] = useState('');
// // //     const [showChatBox, setShowChatBox] = useState(false);
// // //     const [usersCount, setUsersCount] = useState(0);
// // //     const { authUser } = useAuthContext()

// // //     useEffect(() => {
// // //         if (authUser && discussionId) {
// // //             // const socket = io(import.meta.env.VITE_API_URL, {
// // //             //     query: {
// // //             //         user: {
// // //             //             _id: authUser._id,
// // //             //             name: authUser.name,
// // //             //             username: authUser.username,
// // //             //             picture: authUser.profile.picture,
// // //             //             // department: authUser.,
// // //             //         }
// // //             //     },
// // //             //     transports: ['websocket'],
// // //             // });

// // //             socket.emit('joinDiscussion', discussionId);

// // //             socket.on('message', (message) => {
// // //                 setMessages((prevMessages) => [...prevMessages, message]);
// // //             });

// // //             // socket.on('users', (users) => {
// // //             //     // console.log(users);
// // //             // });

// // //             socket.on('usersCount', (usersCount) => {
// // //                 setUsersCount(usersCount);
// // //             });

// // //             return () => {
// // //                 socket.off('message');
// // //                 socket.off('users');
// // //                 socket.off('usersCount');
// // //             };
// // //         }
// // //     }, [discussionId, authUser]);

// // //     // useEffect(() => {


// // //     //     if (discussionId) {
// // //     //         socket.emit('joinDiscussion', discussionId);

// // //     //         socket.on('message', (message) => {
// // //     //             setMessages((prevMessages) => [...prevMessages, message]);
// // //     //         });

// // //     //         socket.on('users', (users) => {
// // //     //             console.log(users)
// // //     //             // setUsersCount(users)
// // //     //         })

// // //     //         socket.on('usersCount', (usersCount) => {
// // //     //             // console.log(usersCount)
// // //     //             setUsersCount(usersCount)
// // //     //         })



// // //     //         return () => {
// // //     //             socket.off('message');
// // //     //         };
// // //     //     }
// // //     // }, [discussionId]);

// // //     const sendMessage = () => {
// // //         if (newMessage.trim()) {
// // //             const user = {
// // //                 _id: authUser._id,
// // //                 name: authUser.name,
// // //                 username: authUser.username,
// // //                 picture: authUser.profile.picture,
// // //             }
// // //             socket.emit('message', discussionId, newMessage, user);
// // //             setNewMessage('');
// // //         }
// // //     };

// // //     const handleHideChatBox = () => {
// // //         setShowChatBox(!showChatBox);
// // //     };

// // //     return (


// // //         <div className={`fixed z-50 bottom-0 right-0 ${showChatBox ? "h-[70%] md:h-[70%]" : "h-[2.7rem]"} w-[80%] md:w-[30rem] max-w-[40rem]  bg-slate-400 dark:bg-[#282828] border border-white rounded-t-xl`}>
// // //             <div className='flex flex-row justify-between'>
// // //                 <div className='bg-slate-300 dark:bg-[#9c9c9c] p-2 text-black rounded-tl-lg w-full flex items-center'>
// // //                     <h2 >Discussion {usersCount} online </h2>
// // //                     {discussionId
// // //                         ? <div className='w-2 h-2 rounded-3xl bg-green-600 brightness-110  border border-green-500 m-2'></div>
// // //                         : <div className='w-2 h-2 rounded-3xl bg-red-600 brightness-110  border border-red-500 m-2'></div>
// // //                     }
// // //                 </div>
// // //                 <button onClick={handleHideChatBox} className='p-2'>
// // //                     {showChatBox ? <IoIosArrowDown /> : <IoIosArrowUp />}
// // //                 </button>
// // //             </div>
// // //             <p className='text-sm  mx-2'>These chats are removed on reload</p>
// // //             <div className={`${showChatBox ? "flex flex-col overflow-y-scroll h-[75%] p-1 dark:bg-[#161616] bg-gray-100" : "hidden"}`}>
// // //                 {messages.map((msg, index) => {
// // //                     // console.log("mes", msg)
// // //                     return (
// // //                         <div key={index} className={`flex  ${msg.user === socket.id ? "justify-end" : "justify-start"} mb-1`}>
// // //                             <div className={`p-2  max-w-[70%] bg-white dark:bg-[#a9a9a9] rounded-xl shadow-md ${msg.socketId === socket.id ? "bg-blue-500 text-white self-end" : "self-start"}`}>
// // //                                 <p className='text-black flex flex-col w-[15rem]'><strong>{msg.username}:</strong> {msg.message}</p>
// // //                                 <p className='text-sm text-gray-500'>{new Date(msg.timestamp).toLocaleTimeString()}</p>
// // //                             </div>
// // //                         </div>
// // //                     )
// // //                 })}
// // //             </div>
// // //             <div className={`${showChatBox ? "flex" : "hidden"} flex flex-row`}>
// // //                 <input
// // //                     className='p-2 w-full rounded-xl m-1 text-black'
// // //                     type="text"
// // //                     value={newMessage}
// // //                     onChange={(e) => setNewMessage(e.target.value)}
// // //                     onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}
// // //                 />
// // //                 <button className='p-2 border rounded-md m-1' onClick={sendMessage}>Send</button>
// // //             </div>
// // //         </div>
// // //     );
// // // };

// // // export default ChatBox;

// // import React, { useEffect, useState } from 'react';
// // import { MessageCircle, Send, Users, Minimize2, Maximize2 } from 'lucide-react';
// // import io from 'socket.io-client';
// // import { useAuthContext } from '../../../../../context/AuthContext';

// // const socket = io(import.meta.env.VITE_API_URL, {
// //     transports: ['websocket']
// // });

// // const ChatBox = ({ discussionId }) => {
// //     const [messages, setMessages] = useState([]);
// //     const [newMessage, setNewMessage] = useState('');
// //     const [showChatBox, setShowChatBox] = useState(false);
// //     const [usersCount, setUsersCount] = useState(0);
// //     const { authUser } = useAuthContext();

// //     useEffect(() => {
// //         if (authUser && discussionId) {
// //             socket.emit('joinDiscussion', discussionId);

// //             socket.on('message', (message) => {
// //                 setMessages((prevMessages) => [...prevMessages, message]);
// //             });

// //             socket.on('usersCount', (count) => {
// //                 setUsersCount(count);
// //             });

// //             return () => {
// //                 socket.off('message');
// //                 socket.off('users');
// //                 socket.off('usersCount');
// //             };
// //         }
// //     }, [discussionId, authUser]);

// //     const sendMessage = () => {
// //         if (newMessage.trim()) {
// //             const user = {
// //                 _id: authUser._id,
// //                 name: authUser.name,
// //                 username: authUser.username,
// //                 picture: authUser.profile.picture,
// //             };
// //             socket.emit('message', discussionId, newMessage, user);
// //             setNewMessage('');
// //         }
// //     };

// //     return (
// //         <div className={`fixed z-50 bottom-0 right-4 transition-all duration-300 ease-in-out
// //             ${showChatBox ? "h-[600px]" : "h-12"}
// //             w-[380px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg shadow-lg`}>

// //             {/* Header */}
// //             <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
// //                 <div className="flex items-center space-x-2">
// //                     <MessageCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
// //                     <span className="font-semibold text-gray-700 dark:text-gray-200">Discussion</span>
// //                     <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
// //                         <Users className="h-3 w-3" />
// //                         <span>{usersCount}</span>
// //                     </div>
// //                     <div className={`h-2 w-2 rounded-full ${discussionId ? 'bg-green-500' : 'bg-red-500'}`} />
// //                 </div>
// //                 <button
// //                     onClick={() => setShowChatBox(!showChatBox)}
// //                     className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
// //                 >
// //                     {showChatBox ?
// //                         <Minimize2 className="h-4 w-4 text-gray-500 dark:text-gray-400" /> :
// //                         <Maximize2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
// //                     }
// //                 </button>
// //             </div>

// //             {showChatBox && (
// //                 <>
// //                     <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
// //                         Messages are cleared on reload
// //                     </div>

// //                     {/* Messages Area */}
// //                     <div className="flex-1 h-[460px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
// //                         <div className="space-y-4">
// //                             {messages.map((msg, index) => (
// //                                 <div key={index}
// //                                     className={`flex ${msg.socketId === socket.id ? 'justify-end' : 'justify-start'}`}>
// //                                     <div className={`max-w-[70%] rounded-lg p-3 space-y-1
// //                                         ${msg.socketId === socket.id
// //                                             ? 'bg-blue-500 text-white ml-8'
// //                                             : 'bg-white dark:bg-gray-800 mr-8 shadow-sm'}`}>
// //                                         <div className="font-medium text-sm">
// //                                             {msg.username}
// //                                         </div>
// //                                         <div className="text-sm break-words">
// //                                             {msg.message}
// //                                         </div>
// //                                         <div className={`text-xs ${msg.socketId === socket.id
// //                                             ? 'text-blue-100'
// //                                             : 'text-gray-500 dark:text-gray-400'}`}>
// //                                             {new Date(msg.timestamp).toLocaleTimeString()}
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>

// //                     {/* Input Area */}
// //                     <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
// //                         <div className="flex items-center space-x-2">
// //                             <input
// //                                 type="text"
// //                                 className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg 
// //                                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
// //                                     text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
// //                                     focus:outline-none"
// //                                 placeholder="Type your message..."
// //                                 value={newMessage}
// //                                 onChange={(e) => setNewMessage(e.target.value)}
// //                                 onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
// //                             />
// //                             <button
// //                                 onClick={sendMessage}
// //                                 disabled={!newMessage.trim()}
// //                                 className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600
// //                                     text-white rounded-lg transition-colors disabled:cursor-not-allowed"
// //                             >
// //                                 <Send className="h-4 w-4" />
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </>
// //             )}
// //         </div>
// //     );
// // };

// // export default ChatBox;



// import React, { useEffect, useState } from 'react';
// import { MessageCircle, Send, Users, Minimize2, Maximize2 } from 'lucide-react';
// import io from 'socket.io-client';
// import { useAuthContext } from '../../../../../context/AuthContext';

// const socket = io(import.meta.env.VITE_API_URL, {
//     transports: ['websocket']
// });

// const formatMessageTime = (timestamp) => {
//     const messageDate = new Date(timestamp);
//     const now = new Date();
//     const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));

//     if (diffDays > 0) {
//         return `${diffDays}d ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
//     }
//     return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// };

// const formatDateHeader = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleDateString(undefined, {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//     });
// };

// const shouldShowDateHeader = (currentMsg, prevMsg) => {
//     if (!prevMsg) return true;

//     const currentDate = new Date(currentMsg.timestamp).setHours(0, 0, 0, 0);
//     const prevDate = new Date(prevMsg.timestamp).setHours(0, 0, 0, 0);

//     return currentDate !== prevDate;
// };

// const Message = ({ message, showHeader, isCurrentUser }) => {
//     return (
//         <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
//             {showHeader && (
//                 <div className={`flex items-center space-x-2 mb-1 text-sm ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
//                     <span className="font-medium text-gray-700 dark:text-gray-300">
//                         {message.username}
//                     </span>
//                     <span className="text-gray-500 dark:text-gray-400">
//                         {formatMessageTime(message.timestamp)}
//                     </span>
//                 </div>
//             )}
//             <div className={`max-w-[70%] rounded-lg p-3 
//                 ${isCurrentUser
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-white dark:bg-gray-800 shadow-sm'}`}>
//                 <div className="text-sm break-words">
//                     {message.message}
//                 </div>
//             </div>
//         </div>
//     );
// };

// const ChatBox = ({ discussionId }) => {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [showChatBox, setShowChatBox] = useState(false);
//     const [usersCount, setUsersCount] = useState(0);
//     const { authUser } = useAuthContext();

//     useEffect(() => {
//         if (authUser && discussionId) {
//             socket.emit('joinDiscussion', discussionId);

//             socket.on('message', (message) => {
//                 setMessages((prevMessages) => [...prevMessages, message]);
//             });

//             socket.on('usersCount', (count) => {
//                 setUsersCount(count);
//             });

//             return () => {
//                 socket.off('message');
//                 socket.off('users');
//                 socket.off('usersCount');
//             };
//         }
//     }, [discussionId, authUser]);

//     const sendMessage = () => {
//         if (newMessage.trim()) {
//             const user = {
//                 _id: authUser._id,
//                 name: authUser.name,
//                 username: authUser.username,
//                 picture: authUser.profile.picture,
//             };
//             socket.emit('message', discussionId, newMessage, user);
//             setNewMessage('');
//         }
//     };

//     const shouldShowMessageHeader = (currentMsg, prevMsg) => {
//         if (!prevMsg) return true;

//         const sameUser = currentMsg.socketId === prevMsg.socketId;
//         const timeDiff = Math.abs(new Date(currentMsg.timestamp) - new Date(prevMsg.timestamp));
//         const sameMinute = timeDiff < 60000; // 60000ms = 1 minute

//         return !sameUser || !sameMinute;
//     };

//     // Prepare messages with date headers and proper grouping
//     const processedMessages = messages.reduce((acc, message, index) => {
//         // Check if we need to show a date header
//         if (shouldShowDateHeader(message, messages[index - 1])) {
//             acc.push({
//                 type: 'date',
//                 timestamp: message.timestamp
//             });
//         }

//         // Add message with header visibility flag
//         acc.push({
//             type: 'message',
//             data: message,
//             showHeader: shouldShowMessageHeader(message, messages[index - 1])
//         });

//         return acc;
//     }, []);

//     return (
//         <div className={`fixed z-50 bottom-0 right-4 transition-all duration-300 ease-in-out
//             ${showChatBox ? "h-[600px]" : "h-12"}
//             w-[380px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg shadow-lg`}>

//             {/* Header */}
//             <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                     <MessageCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//                     <span className="font-semibold text-gray-700 dark:text-gray-200">Discussion</span>
//                     <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
//                         <Users className="h-3 w-3" />
//                         <span>{usersCount}</span>
//                     </div>
//                     <div className={`h-2 w-2 rounded-full ${discussionId ? 'bg-green-500' : 'bg-red-500'}`} />
//                 </div>
//                 <button
//                     onClick={() => setShowChatBox(!showChatBox)}
//                     className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                     {showChatBox ?
//                         <Minimize2 className="h-4 w-4 text-gray-500 dark:text-gray-400" /> :
//                         <Maximize2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
//                     }
//                 </button>
//             </div>

//             {showChatBox && (
//                 <>
//                     <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
//                         Messages are cleared on reload
//                     </div>

//                     {/* Messages Area */}
//                     <div className="flex-1 h-[460px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
//                         <div className="space-y-4">
//                             {processedMessages.map((item, index) => {
//                                 if (item.type === 'date') {
//                                     return (
//                                         <div key={`date-${index}`} className="flex justify-center my-6">
//                                             <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300">
//                                                 {formatDateHeader(item.timestamp)}
//                                             </div>
//                                         </div>
//                                     );
//                                 }

//                                 return (
//                                     <Message
//                                         key={`msg-${index}`}
//                                         message={item.data}
//                                         showHeader={item.showHeader}
//                                         isCurrentUser={item.data.socketId === socket.id}
//                                     />
//                                 );
//                             })}
//                         </div>
//                     </div>

//                     {/* Input Area */}
//                     <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
//                         <div className="flex items-center space-x-2">
//                             <input
//                                 type="text"
//                                 className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg 
//                                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
//                                     text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
//                                     focus:outline-none"
//                                 placeholder="Type your message..."
//                                 value={newMessage}
//                                 onChange={(e) => setNewMessage(e.target.value)}
//                                 onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//                             />
//                             <button
//                                 onClick={sendMessage}
//                                 disabled={!newMessage.trim()}
//                                 className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600
//                                     text-white rounded-lg transition-colors disabled:cursor-not-allowed"
//                             >
//                                 <Send className="h-4 w-4" />
//                             </button>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default ChatBox;

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
            socket.emit('message', discussionId, newMessage, user);
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
            ${showChatBox ? "h-[600px]" : "h-12"}
            w-[380px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg shadow-lg`}>

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
                    <div className="flex-1 h-[460px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                        <div className="space-y-4">
                            {groupedMessages.map((group, index) => {
                                if (group.type === 'date') {
                                    return (
                                        <div key={`date-${index}`} className="flex justify-center my-6">
                                            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300">
                                                {formatDateHeader(group.timestamp)}
                                            </div>
                                        </div>
                                    );
                                }

                                // console.log("GROUP", group)
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