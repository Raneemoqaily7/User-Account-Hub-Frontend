import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

const NewUser = ({ showModal, handleClose, handleSave, userToEdit }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    status: 0,
    gender: 0,
    date_of_Birth: '',
  });

  useEffect(() => {
    // If userToEdit is provided, populate the form fields with user data
    if (userToEdit) {
      setUserData({
        username: userToEdit.username || '',
        email: userToEdit.email || '',
        firstName: userToEdit.firstName || '',
        lastName: userToEdit.lastName || '',
        status: userToEdit.status || 0,
        gender: userToEdit.gender || 0,
        date_of_Birth: userToEdit.date_of_Birth || '',
      });
    }
  }, [userToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

    const onSave = () => {
      const formattedUserData = {
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        status: parseInt(userData.status),  // Ensure the status is an integer
        gender: parseInt(userData.gender),  // Ensure the gender is an integer
        date_of_Birth: userData.date_of_Birth,
      };
      handleSave(formattedUserData);
    };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{userToEdit ? 'Edit User' : 'Add New User'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Your existing form fields */}
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={userData.username}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              />
          </Form.Group>

          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={userData.status}
              onChange={handleChange}
            >
              {/* You need to map the status values from the backend enum here */}
              <option value={0}>Active</option>
              <option value={1}>Inactive</option>
              {/* Add more options based on the backend enum */}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formGender">
            <Form.Label>Gender</Form.Label>
            <Form.Control
             as="select"
             name="gender"
             value={userData.gender}
             onChange={handleChange}
           >
             {/* You need to map the gender values from the backend enum here */}
             <option value={0}>Male</option>
             <option value={1}>Female</option>
             {/* Add more options based on the backend enum */}
           </Form.Control>
         </Form.Group>
         <Form.Group controlId="formDateOfBirth">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="date_of_Birth"
              value={userData.date_of_Birth}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" onClick={onSave}>
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewUser;
