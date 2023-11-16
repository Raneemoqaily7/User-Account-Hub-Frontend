import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';

import axios from "axios"
 function NewUser({ showModal, handleClose, setUsers }) {

    const navigate = useNavigate();

    

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        password2: "",
        gender: 0,
        date_of_Birth: null,
        status: 0
    });
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [userNameError, setuserNameError] = useState('');
    const EmailValidation = (email) => {

        // Regular expression for email validation
        const rgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return rgx.test(email);
    };
    // REGEX Validation for Phone

    const UserNameValidation = (username) => {

        // Regular expression for email validation
        const rgx = /^[a-zA-Z0-9]+$/
        return rgx.test(username);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;


        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));

        console.log(formData, "Form Data")
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform form submission logic here
        console.log(formData);
        if (!EmailValidation(formData.email)) {
            setEmailError('Please enter a valid email address.');
            return;
        } else {
            setEmailError(null);
        }


        if (!UserNameValidation(formData.username)) {
            setuserNameError('Please enter a username cntains only english letters and numbers.');
            return;
        } else {
            setuserNameError(null);
        }



 

        axios.post('http://127.0.0.1:8000/api/register/', formData)
            .then((result) => {
                 axios.get('http://127.0.0.1:8000/api/users/')
                    .then((response) => {
                      setUsers(response.data)
                        //  navigate("/")
                         handleClose();
                    })

                    .catch(error => console.error(error));
 
            }).catch((error) => {
                console.log(error, "ERROR")
                if (error && error.response) {

                    if (error.response.data && error.response.data.email && error.response.data.email[0] === "account with this email already exists.") {
                        setEmailError(error.response.data.email)
                    } 
                    else if (error.response.data && error.response.data.username && error.response.data.username[0] === "account with this username already exists.") {
                        setuserNameError(error.response.data.username)

                    }
                }

                return;
            })

    };

   

   

    return (
        
    
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="container max-width: 500px   margin: 0 auto padding: 20px">
  
                        <form className="signup-form background-color: #f5f5f5 " onSubmit={handleSubmit}>
                            <h2 className="fw-bold text-uppercase text-warning">Add New User</h2>

                            <div className="form-group">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="form-control form-control-lg"
                                    placeholder="Username"
                                    required
                                />
                                {userNameError && <div className="error">{userNameError}</div>}
                            </div>

                            <div className="form-group mb-4">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-control form-control-lg"
                                    placeholder="Email"
                                    required
                                />
                                {emailError && <div className="error">{emailError}</div>}
                            </div>
                            <div className="form-group mb-4">
                                <div className="input-group">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-control form-control-lg"
                                        placeholder="Password"
                                        required
                                    />

                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <input
                                    type="password"
                                    id="password2"
                                    name="password2"
                                    value={formData.password2}
                                    onChange={handleChange}
                                    className="form-control form-control-lg"
                                    placeholder="Confirm Password"
                                    required
                                />
                            </div>
                            {formData.password !== formData.password2 && (
                                <div className="error">Passwords don't match</div>
                            )}

                            <div className="form-group mb-4">
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="form-control form-control-lg"
                                    placeholder="firstName"
                                    required
                                />
                            </div>

                            <div className="form-group mb-4">
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="form-control form-control-lg"
                                    placeholder="lastName"
                                    required
                                />
                            </div>

                            <div className="form-group mb-4">
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="form-control form-control-lg"
                                    required
                                >
                                    <option value={null}>Select Gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                </select>
                            </div>

                            <div className="form-group mb-4">
                                <input
                                    type="date"
                                    id="date_of_Birth"
                                    name="date_of_Birth"
                                    value={formData.date_of_Birth}
                                    onChange={handleChange}
                                    className="form-control form-control-lg"
                                    
                                />
                            </div>

                         

                            <div className="form-group mb-4">
                                <input type="submit" value="New User" className="btn btn-warning btn-lg" />
                            </div>
                        </form>

                    </div>
          
 
            
        </Modal.Body>
      </Modal>
    );
}
export default NewUser;

