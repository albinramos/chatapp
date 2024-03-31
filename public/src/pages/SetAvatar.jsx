import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Loader from '../assets/Skateboarding.gif';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { setAvatarRoute } from '../utils/APIRoutes';


function SetAvatar() {

  const api = 'https://api.multiavatar.com/45678945';

  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const[isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      if(!localStorage.getItem('chat-app-user')) {
        navigate('/login')
      }
    }
  
    checkAuthentication();
  }, []);

  const setProfilePicture = async () => {
    if(selectedAvatar === undefined){
      toast.error('Please select an avatar', toastOptions);
    } else{
      const user = await JSON.parse(localStorage.getItem('chat-app-user'));
      console.log(`Enviando solicitud POST a: ${setAvatarRoute}/${user._id}`);
      const {data} = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if(data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem('chat-app-user', JSON.stringify(user));
        navigate('/');
      } else {
        toast.error('Error setting profile picture, please try again', toastOptions);
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      for(let i = 0; i < 4; i++) {
        const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`, { responseType: 'arraybuffer' });
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );
        data.push(base64);
      }
      setAvatars(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
    {
      isLoading ? <Container>
        <img src={Loader} alt="loader" className="loader" />
      </Container> : (
          <Container>
          <div className="title-container">
            <h1>Pick an Avatar</h1>
          </div>
          <div className="avatars">
              {
                avatars.map((avatar, index) => {
                  return (
                    <div
                      key={index}
                      className={`avatar ${selectedAvatar === index ? 'selected' : ''}`}>
                        <img src={`data:image/svg+xml;base64,${avatar}`} 
                        alt="avatar"
                        onClick={() => setSelectedAvatar(index)}
                      />
                    </div>
                  );
              })
            }
          </div>
        <button className='submit-btn' onClick={setProfilePicture}>Set as profile picture</button>
        </Container>
      )
    }
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  background-color: #fff;
  height: 100vh;
  width: 100vw;
  .loader {
    width: 8rem;
  }
  .title-container{
    h1{
      color: black;
      font-size: 2rem;
    }
  }
  .avatars{
    display: flex;
    gap: 2rem;
    .avatar{
      cursor: pointer;
      border: 0.4rem solid transparent;
      border-radius: 5rem;
      padding: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.5s ease-in-out; 
      img{
        height: 6rem;
        border-radius: 5rem;
        transition: all 0.3s ease;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
}
.submit-btn{
  background-color: black;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.4rem;
  font-size: 1rem;
  cursor: pointer;
  text-transform: uppercase;
  transition: 0.5s ease-in-out;
  &:hover {
    background-color: #0000aa;
  }
}
`;

export default SetAvatar;