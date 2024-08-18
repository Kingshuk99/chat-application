import React, { useEffect, useState } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import './chat.css';

const ChatPage = ({ socket }) => {
    const [currentUser, setCurrentUser] = useState(null);
    
  return (
    <div className="container">
<div className="row clearfix">
    <div className="col-lg-12">
        <div className="card chat-app">
            <ChatBar socket={socket} currentUser={currentUser} setCurrentUser={setCurrentUser}/>
            <ChatBody socket={socket} currentUser={currentUser}/>
        </div>
    </div>
</div>
</div>

  );
};

export default ChatPage;