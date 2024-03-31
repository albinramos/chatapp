import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/download.png';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { registerRoute } from '../utils/APIRoutes';
/* import { use } from '../../../server/routes/userRoutes'; */

function Register() {

  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const toastOptions = {
    position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
  };

  useEffect(() => {
    if(localStorage.getItem('chat-app-user')) {
      navigate('/')
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(handleValidation()) {
      const { password, confirmPassword, username, email } = values; 
      const {data} = await axios.post(registerRoute, {
          username,
          email,
          password,
          confirmPassword,
        });
    if(data.status === false){
      toast.error(data.message, toastOptions);
    }
    if(data.status === true){
        localStorage.setItem('chat-app-user', JSON.stringify(data.user));
        /* pasa la user info en formato json a local storage */
        navigate('/');
      }
  };
};

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      toast.error('Passwords do not match' , toastOptions);
      return false;
    } else if (username.length < 3){
      toast.error('Username must be at least 3 characters long', toastOptions);
      return false;
    } else if (password.length < 8){
      toast.error('Password must be at least 8 characters long', toastOptions);
      return false;
    } else if(email === ''){
      toast.error('Email cannot be empty', toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({...values, [event.target.name]: event.target.value});
  };

  return (
    <>
      <FormContainer>
        <form className='form' onSubmit={(event) => handleSubmit(event)}>
          <div className='brand'>
            <img src={Logo} alt='logo' />
            <h1>Chatown</h1>
          </div>
          <input
            type='text' 
            placeholder='Username' 
            name='username' 
            onChange={(e) => handleChange(e)}
          />
          <input
            type='email' 
            placeholder='Email' 
            name='email' 
            onChange={(e) => handleChange(e)}
          />
          <input
            type='password' 
            placeholder='Password' 
            name='password' 
            onChange={(e) => handleChange(e)}
          />
          <input
            type='password' 
            placeholder= 'Confirm Password' 
            name='confirmPassword' 
            onChange={(e) => handleChange(e)}
          />
          <button type='submit'>Create User</button>
          <span> Already have an account?
            <Link to='/login'> Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #fff;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      width: 10rem;
      padding: 1rem;
    }
    h1 {
      color: black;
      text-transform: uppercase;
      }
    }
  form {
    background-color: white;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input{
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid black;
      border-radius: 0.4rem;
      color: black;
      font-size: 1rem;
      width: 100%;
      &:focus {
        border: 0.1rem solid #0000ff;
        outline: none;
      }
    }
    button{
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
    span{
      color: black;
      text-transform: uppercase;
      a{
        color: grey;
        text-transform: none ;
        text-decoration: none;
        font-weight: bold;
        &:hover {
          color: #0000aa;
      }
    }
  }
}
`;

export default Register;