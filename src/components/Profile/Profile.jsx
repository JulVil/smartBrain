import React, { useEffect, useState } from 'react';
import Logo from '../Logo/Logo';
import Message from '../Message/Message';
import './Profile.css'

const Profile = ({ id, handleUserUpdate, onRouteChange }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updateEmail, setUpdateEmail] = useState('');
  const [updateHash, setUpdateHash] = useState('');
  const [updateCard, setUpdateCard] = useState(false);
  const [deleteCard, setDeleteCard] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3001/profile/${id}`)
    .then(response => response.json())
    .then(data => {
      setUserData(data)
    });
  }, [id]);
  
  let formattedDate = '';
    if(userData.joined)
      formattedDate = userData.joined.substring(0,10);
  
  const onNameUpdate = (event) =>{
    setUpdateName(event.target.value);
  }

  const onEmailUpdate = (event) =>{
    setUpdateEmail(event.target.value);
  }

  const onHashUpdate = (event) =>{
    setUpdateHash(event.target.value);
  }

  const handleUpdateProfileCard = () => {
    setUpdateCard(true);
  }

  const handleDeleteProfileCard = () => {
    setDeleteCard(true);
  }

  const onCancelUpdate = () => {
    setUpdateCard(false)
    setUpdateName('')
    setUpdateEmail('')
    setUpdateHash('')
  }

  const onSubmitUpdate = (field, value) => {
    if(field === 'name'){
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000);
      setResponseMessage('Name updated!')
      setUpdateName('')
    }else if(field === 'email'){
      setUpdateEmail('')
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000);
      setResponseMessage('Email updated!')
    }else {
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000);
      setResponseMessage('Password updated!')
      setUpdateHash('')
    }

    fetch(`http://localhost:3001/updateProfile/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({[field]: value})
    })
    .then(response => response.json())
    .then(newUserData => {
      console.log(newUserData)
      setUserData(newUserData)
      handleUserUpdate(newUserData)
    })
    .catch(console.log);
  }

  const onSubmitDelete = () => {
    setUpdateCard(false);
    setDeleteCard(false);
    onRouteChange('signin');

    fetch(`http://localhost:3001/deleteProfile/${id}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: userData.email
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    })
    .catch(console.log)
  }

  return (
    <div>
      <Logo/>
      <div className="profile-wrapper">
        <div className='main-wrapper'>
          {updateCard ? (
            <div className='profile-border'>
              <h1>This is your profile</h1>
                <div className='user-container'>
                  <label htmlFor='update-container'>Name:</label>
                  <div className='field-container'>
                    <input 
                      className='update-container' 
                      type='text' 
                      placeholder={userData.name}
                      onChange={onNameUpdate} required/>
                    <button
                      disabled={!updateName} 
                      onClick={() => onSubmitUpdate('name', updateName)}>Update</button>
                  </div>
                  <label htmlFor='update-container'>Email:</label>
                  <div className='field-container'>
                  <input 
                    className='update-container' 
                    type='email' 
                    placeholder={userData.email}
                    onChange={onEmailUpdate} required/>
                    <button
                      disabled={!updateEmail} 
                      onClick={() => onSubmitUpdate('email', updateEmail)}>Update</button>
                  </div>
                  <label htmlFor='update-container'>Password:</label>
                  <div className='field-container'>
                  <input 
                    className='update-container' 
                    type='password' 
                    placeholder='New Password'
                    onChange={onHashUpdate} required/>
                    <button
                      disabled={!updateHash} 
                      onClick={() => onSubmitUpdate('password', updateHash)}>Update</button>
                </div>
                </div>
                <div className='button-container'>
                  <button 
                    className='profile-button'
                    onClick={onCancelUpdate}>Cancel</button>
                </div>
            </div>
          ) : deleteCard ? (
            <div className='profile-border'>
              <h1>
                Are you sure you want to delete your profile?
                <br/>
                All data will be lost.
              </h1>
              <div className='button-container'>
                <button 
                  className='profile-button'
                  onClick={() => onSubmitDelete()}>Delete</button>
                <button 
                  className='profile-button'
                  onClick={() => setDeleteCard(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className='profile-border'>
              <h1>This is your profile</h1>
              <div className='user-container'>
                Name:
                <div className='info-container'>{userData.name}</div>
                Email:
                <div className='info-container'>{userData.email}</div>
                Entries:
                <div className='info-container'>{userData.entries}</div>
                Joined in: 
                <div className='info-container'>{formattedDate}</div>
              </div>
              <div className='button-container'>
                <button 
                  className='profile-button' 
                  onClick={() => handleUpdateProfileCard()}>Update</button>
                <button 
                  className='profile-button'
                  onClick={() => handleDeleteProfileCard()}>Delete</button>
              </div>
            </div>
          )}
        </div>
          <Message type='success' showMessage={showMessage} responseMessage={responseMessage}/>
      </div>
    </div>
  )
}
export default Profile;