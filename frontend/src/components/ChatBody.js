import React, {useState, useEffect, useRef} from 'react';
import ChatFooter from './ChatFooter';

const ChatBody = ({ socket, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const lastMessageRef = useRef(null);
    useEffect(() => {
        socket.on('receiveMessage', (data) => {
            if(currentUser && currentUser.userName===data.from) {
                setMessages([...messages, {fromSelf:false, message:data.message}])
            }
        })
    }, [socket, messages])

    useEffect(() => {
        socket.on('newCurrentUser', (data) => {
            setMessages(data);
            console.log(data);
        })
    }, [socket])

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);

  return (
    <>
      <div className="chat">
        {currentUser &&
        <>
                <div className="chat-header clearfix">
                    <div className="row">
                        <div className="col-lg-6">
                            <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar"/>
                            </a>
                            <div className="chat-about">
                                <h6 className="m-b-0">{currentUser.userName}</h6>
                                <small>Online</small>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="chat-history">
                    {messages.length>0 &&
                    <ul className="m-b-0">
                        {
                            messages.map((msg, ind) => (
                                (<li className="clearfix" key={ind}>
                                    {(msg.fromSelf===true) &&
                                    <>
                                    <div className="message-data text-end">
                                    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar"/>
                                    </div>
                                    <div className="message other-message float-right"> 
                                        {msg.message} 
                                    </div>
                                    </>}
                                    {(msg.fromSelf===false) &&
                                    <>
                                    <div className="message my-message">
                                        {msg.message}
                                    </div>
                                    <div ref={lastMessageRef} />
                                    </>}
                                </li>)
                                ))
                        }
                    </ul>}
                </div>
                <ChatFooter socket={socket} currentUser={currentUser} messages={messages} setMessages={setMessages}/>
                </>}
            </div>
    </>
  );
};

export default ChatBody;