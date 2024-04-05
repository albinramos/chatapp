import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { allUsersRoute, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from 'socket.io-client';

function Chat() {

  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      if(!localStorage.getItem('chat-app-user')){
        navigate('/login');
      } else {
        const user = await JSON.parse(localStorage.getItem('chat-app-user'));
        setCurrentUser(user);
        setIsLoaded(true);
      }
    }
    checkAuthentication();
  }, [navigate]);

  useEffect(() => {
    if(currentUser){
      socket.current = io(host);
      socket.current.emit('add-user', currentUser._id);
    }
  }, [currentUser]);


  useEffect(() => {
    const fetchContacts = async () => {
      if(currentUser){
        if(currentUser.isAvatarImageSet){
          try {
            const {data} = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            // Filtrar el array de contactos para excluir al usuario actual
            const filteredContacts = data.filter(contact => contact._id !== currentUser._id);
            setContacts(filteredContacts);
          } catch (error) {
            console.error("Hubo un error al obtener los contactos:", error);
          }
        } else {
          navigate('/setAvatar'); 
        }
      }
    }
    fetchContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
     setCurrentChat(chat);
  }

  //console.log(contacts);

  return (
    <>
      <Container> 
        <div className="container">
          <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
          {
            isLoaded && currentChat === undefined ? (
              <Welcome currentUser={currentUser} />
            ) : (
              <ChatContainer
               currentChat={currentChat} 
               currentUser={currentUser} 
               socket={socket} />
            )
          }
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #fff;
    .container{
      height: 85vh;
      width: 85vw;
      background-color: #000076;
      display: grid;
      grid-template-columns: 25% 75%;
      @media screen and (min-width: 768px) and (max-width: 1024px) {
        grid-template-columns: 35% 65%;
      }
    }
`;

export default Chat;