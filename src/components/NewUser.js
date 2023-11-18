import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

import axios from "axios";
function NewUser({ showModal, handleClose, setUsers, title, editingUser }) {
  const navigate = useNavigate();
  //   const [showModal, setShowModal] = useState(showModal);
  function convertDateFormat(inputDateString) {
    const inputDate = new Date(inputDateString);

    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(inputDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
  var MALE=0
  var FEMALE =1
  // function convertGender() {
  //   if (editingUser.gender === "MALE") {
  //     return 0;
  //   } else {
  //     return 1;
  //   }
  // }

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    password2: "",
    gender: null,
    date_of_Birth: null,
    status: "0",
  });
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userNameError, setuserNameError] = useState("");

  useEffect(() => {
    console.log(formData, "Before");
    if (editingUser !== undefined && editingUser !== null) {
      setFormData({
        username: editingUser.username,
        email: editingUser.email,
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        password: editingUser.password,
        password2: editingUser.password2,
        gender: editingUser.gender,
        date_of_Birth: convertDateFormat(editingUser.date_of_Birth),
        status: editingUser.status,
      });
      console.log(formData, "After");
    }
  }, [editingUser]);
  const EmailValidation = (email) => {
    // Regular expression for email validation
    const rgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return rgx.test(email);
  };
  // REGEX Validation for Phone

  const UserNameValidation = (username) => {
    // Regular expression for email validation
    const rgx = /^[a-zA-Z0-9]+$/;
    return rgx.test(username);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log({ value, name }, "Sora");
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    console.log(formData, "Form Data");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission logic here
    console.log(formData);
    if (!EmailValidation(formData.email)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError(null);
    }

    if (!UserNameValidation(formData.username)) {
      setuserNameError(
        "Please enter a username cntains only english letters and numbers."
      );
      return;
    } else {
      setuserNameError(null);
    }
    console.log(title, "Titile");
    if (title === "Add New User") {
      console.log(formData, "Add++++");
      axios
        .post("http://127.0.0.1:8000/api/register/", formData)

        .then((result) => {
          alert("added");
          return;
        });
    } else if (title === "Edit User") {
      console.log(formData, "Form Data Edit");
      axios
        .patch(
          `http://127.0.0.1:8000/api/updateuser/${editingUser.id}/`,
          formData, { withCredentials: true }
        )
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            // Successful response
            alert("User updated successfully");
          } else {
            // Handle other status codes (e.g., 404, 500, etc.)
            console.error(
              "Failed to update user. Status code:",
              response.status
            );
            // You might want to show an error message to the user
            alert("Failed to update user. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error updating user:", error);
          // You might want to show an error message to the user
          alert("Error updating user. Please try again.");
        });
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container max-width: 500px   margin: 0 auto padding: 20px">
          <form
            className="signup-form background-color: #f5f5f5 "
            onSubmit={handleSubmit}>
            <h2 className="fw-bold text-uppercase text-warning">{title}</h2>

            <div className="form-group">
              User Name
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
              Email
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
              {title == "Add New User" && (
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
              )}
            </div>
            <div className="form-group mb-4">
              {title == "Add New User" && (
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
              )}
            </div>
            {formData.password !== formData.password2 &&
              title == "Add New User" && (
                <div className="error">Passwords don't match</div>
              )}

            <div className="form-group mb-4">
              First Name
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
              Last Name
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
              Gender
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-control form-control-lg"
                required>
                <option value={null}>Select Gender</option>
                <option value={MALE}>Male</option>
                <option value={FEMALE}>Female</option>
              </select>
            </div>

            <div className="form-group mb-4">
              Birthday
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
              Status
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control form-control-lg"
                required>
                <option value={null}>Select Status</option>
                <option value="0">ACTIVE</option>
                <option value="1">IN ACTIVE</option>
                <option value="2">SUSPENDED</option>
              </select>
            </div>
            <div className="form-group mb-4">
              <input
                type="submit"
                value={title}
                className="btn btn-warning btn-lg"
              />
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}
export default NewUser;