import React, { useState, useEffect } from 'react';
import './chat.css';

const ChatBar = ({socket, currentUser, setCurrentUser}) => {
    const [users, setUsers] = useState([]);
    useEffect(()=> {
        socket.on('userJoined', (users) => {
            const otherUsers = users.filter(user => user.userName!==sessionStorage.getItem('userName'));
            setUsers(otherUsers);
        })
        if(currentUser===null && users.length>0) {
            setCurrentUser(users[0]);
        }
    }, [socket, users])

    useEffect(() => {
        socket.on('userLeft', (users) => {
            const otherUsers = users.filter(user => user.userName!==sessionStorage.getItem('userName'));
            setUsers(otherUsers);
            if(otherUsers.length>0) {
                setCurrentUser(otherUsers[0]);
            }
        })
    },[socket, users])

    useEffect(() => {
        if(currentUser) {
            socket.emit('changedCurrentUser', {from:sessionStorage.getItem('userName'), to:currentUser.userName});
        }
    }, [currentUser])
    
    return (
        
        <div id="plist" className="people-list">
                <ul className="list-unstyled chat-list mt-2 mb-0">
                    {
                        users.map((user, index) => (
                            <li className="clearfix" key={index} onClick={()=>{
                                setCurrentUser(users[index]);
                                }}>
                                <img src={`https://bootdey.com/img/Content/avatar/avatar${index+1}.png`} alt="avatar"/>
                                <div className="about">
                                    <div className="name">{user.userName}</div>
                                    <div className="status"> <i className="fa fa-circle online"></i> online </div>                                            
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
    );
  };
  
  export default ChatBar;