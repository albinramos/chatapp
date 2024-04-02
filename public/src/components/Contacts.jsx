import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../assets/download.png';

function Contacts({ contacts, currentUser, changeChat }) {

  const [currentUserName, setCurrentUserName] = useState(undefined);

  const [currentUserImage, setCurrentUserImage] = useState(undefined);

  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchData = () => {
      //console.log(contacts);
      if(currentUser){
        setCurrentUserName(currentUser.username);
        setCurrentUserImage(currentUser.avatarImage);
      }
    };
  
    fetchData();
  }, [currentUser]);

  //console.log(contacts);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  }

  return (
    <>
      {
        currentUserImage && currentUserName && (
          <Container>
            <div className="brand">
              <img src={Logo} alt="logo" />
              <h3>ChatApp</h3>
            </div>
            <div className="contacts">
              { 
                contacts && contacts.map((contact, index) => {
                  return(
                    <div className={`contact ${index === currentSelected ? "selected" : "" }`} 
                    key={index}
                    onClick={() => changeCurrentChat(index, contact)} >
                      <div className="avatar">
                        <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="avatar" />
                      </div>
                      <div className="username">
                        <h3>{contact.username}</h3>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className="currentUser">
              <div className="avatar">
                <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
              </div>
                <div className="username">
                  <h2>{currentUserName}</h2>
              </div>
            </div>
          </Container>
        )
      }
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #fff;
  .brand{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img{
      height: 2rem; // Aquí se cambió 'heigth' por 'height'
    }
    h3{
      color: black;
      font-size: 2rem;
      text-transform: uppercase;
    }
  }
  .contacts{
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar{
      width: 0.2rem;
      padding: 0.5rem;
      &-thumb{
        background-color: red;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
  }
  .contact{
    background-color: #ffffff39;
    min-height: 5rem;
    width: 90%;
    cursor: pointer;
    border-radius: 0.2rem;
    padding: 0.4rem;
    gap: 1rem;
    align-items: center;
    display: flex;
    transition: 0.5s ease-in-out;
    .avatar{
      img{
        height: 3rem;
      }
    }
    .username{
      h3{
        color: black;
      }
    }
  }
  .selected{
    background-color: #000076;
  }
}
.currentUser{
  background-color: #0d0d30;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  .avatar{
    img{
      height: 4rem;
      max-inline-size: 100%;
    }
  }
  .username{
    h2{
      color: white;
    }
  }
  @media screen and (min-width: 768px) and (max-width: 1024px){
    gap:0.5rem;
    .username{
      h2{
        font-size: 1rem;
      }
    }
  }
}
`;

export default Contacts;