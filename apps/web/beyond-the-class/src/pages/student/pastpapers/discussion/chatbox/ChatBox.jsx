import { useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import io from 'socket.io-client';

// const socket = io(import.meta.env.VITE_API_URL, { transports: ['websocket'] });

// eslint-disable-next-line react/prop-types
const ChatBox = ({ discussionId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showChatBox, setShowChatBox] = useState(false);
    const [usersCount, setUsersCount] = useState(0);

    // useEffect(() => {
    //     if (discussionId) {
    //         // socket.emit('joinDiscussion', discussionId);

    //         socket.on('message', (message) => {
    //             setMessages((prevMessages) => [...prevMessages, message]);
    //         });

    //         socket.on('users', (users) => {
    //             // console.log(users)
    //             // setUsersCount(users)
    //         })

    //         socket.on('usersCount', (usersCount) => {
    //             // console.log(usersCount)
    //             setUsersCount(usersCount)
    //         })



    //         return () => {
    //             socket.off('message');
    //         };
    //     }
    // }, [discussionId]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            socket.emit('message', discussionId, newMessage);
            setNewMessage('');
        }
    };

    const handleHideChatBox = () => {
        setShowChatBox(!showChatBox);
    };

    return (


        <div className={`fixed bottom-0 right-0 ${showChatBox ? "h-[50%] md:h-[70%]" : "h-[2.7rem]"} w-[80%] md:w-[30rem] max-w-[40rem]  bg-slate-400 dark:bg-[#282828] border border-white rounded-t-xl`}>
            <div className='flex flex-row justify-between'>
                <div className='bg-slate-300 dark:bg-[#9c9c9c] p-2 text-black rounded-tl-lg w-full flex items-center'>

                    <h2 >Discussion {usersCount} online </h2>

                    {discussionId
                        ? <div className='w-2 h-2 rounded-3xl bg-green-600 brightness-110  border border-green-500 m-2'></div>
                        : <div className='w-2 h-2 rounded-3xl bg-red-600 brightness-110  border border-red-500 m-2'></div>
                    }
                </div>

                <button onClick={handleHideChatBox} className='p-2'>
                    {showChatBox ? <IoIosArrowDown /> : <IoIosArrowUp />}
                </button>

            </div>
            <p className='text-sm  mx-2'>These chats are removed on reload</p>
            <div className={`${showChatBox ? "flex flex-col overflow-y-scroll h-[75%] p-1 dark:bg-[#161616] bg-gray-100" : "hidden"}`}>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex  ${msg.user === socket.id ? "justify-end" : "justify-start"} mb-1`}>
                        <div className={`p-2  max-w-[70%] bg-white dark:bg-[#a9a9a9] rounded-xl shadow-md ${msg.user === socket.id ? "bg-blue-500 text-white self-end" : "self-start"}`}>
                            <p className='text-black flex flex-col w-[15rem]'><strong>{msg.user}:</strong> {msg.message}</p>
                            <p className='text-sm text-gray-500'>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className={`${showChatBox ? "flex" : "hidden"} flex flex-row`}>
                <input
                    className='p-2 w-full rounded-xl m-1 text-black'
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}
                />
                <button className='p-2 border rounded-md m-1' onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatBox;
