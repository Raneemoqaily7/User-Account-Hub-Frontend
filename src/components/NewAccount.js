import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

import axios from "axios";
function NewAccount({ showModal, handleClose, setUsers, title, editingAccount }) {
  const navigate = useNavigate();
  const [AccountNumberError,setAccountNumberError] =useState()
  const [balanceError,setBalanceError] =useState()
 
 
  

  const [formData, setFormData] = useState({
    accountNumber: "",
    balance: "",
    currency: "",
    status: ""
  });
  
  

  useEffect(() => {
    console.log(formData, "Before");
    if (editingAccount !== undefined && editingAccount !== null) {
      setFormData({
        accountNumber: editingAccount.accountNumber,
        balance: editingAccount.balance,
        currency: editingAccount.currency,
        
        status: editingAccount.status,
      });
      console.log(formData, "After");
    }
  }, [editingAccount]);

  const accountNumberValidation = (accountNumber) => {
  
    const rgx = /^\d{7}$/;
    return rgx.test(accountNumber);
  };

  const balanceValidation = (balance) => {
   
    const rgx = /^[0-9]{1,5}(\.[0-9]{1,2})?$/;
    return rgx.test(balance);
  };
  

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log({ value, name }, "raneem");
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
    if (!accountNumberValidation(formData.accountNumber)) {
      setAccountNumberError("Please enter a valid  Account number only numbers of 7 digits.");
      return;
    } else {
      setAccountNumberError(null);
    }

    if (!balanceValidation(formData.balance)) {
      setBalanceError(
        "Enter a valid decimal number with up to 5 digits before the decimal point and 2 digits after."
      );
      return;
    } else {
      balanceValidation(null);
    }
    console.log(title, "Titile");
    if (title === "Add New Account") {
      console.log(formData, "Add");
      axios
        .post("http://127.0.0.1:8000/api/addaccount/", formData)

        .then((result) => {
          alert("added");
          return;
        });
    } else if (title === "Edit Account") {
      console.log(formData, "Form Data Edit");
      axios
        .patch(
          `http://127.0.0.1:8000/api/updateaccount/${editingAccount.id}/`,
          formData
        )
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            // Successful response
            alert("Account updated successfully");
          } else {
            // Handle other status codes (e.g., 404, 500, etc.)
            console.error(
             
              response.status
            );
            
            alert("Failed to update Account. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error updating Account:", error);
          
          alert("Error updating Account. Please try again.");
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
            Account Number
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="form-control form-control-lg"
                placeholder="Account Number"
                required
              />
              {AccountNumberError && <div className="error">{AccountNumberError}</div>}
            </div>

            <div className="form-group mb-4">
              Balance
              <input
                type="balance"
                id="balance"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                className="form-control form-control-lg"
                placeholder="Balance"
                required
              />
              {balanceError && <div className="error">{balanceError}</div>}
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
export default NewAccount;