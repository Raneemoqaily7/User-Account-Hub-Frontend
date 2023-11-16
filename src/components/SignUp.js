import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";


function SignUp() {

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
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [userNameError, setuserNameError] = useState('');
    const EmailValidation = (email) => {

        // Regular expression for email validation
        const rgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return rgx.test(email);
    };

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
        setIsLoading(true)
        e.preventDefault();
        // Perform form submission logic here
        console.log(formData);
        if (!EmailValidation(formData.email)) {
            setEmailError('Please enter a valid email address.');
            setIsLoading(false);
            return;
        } else {
            setEmailError(null);
        }


        if (!UserNameValidation(formData.username)) {
            setuserNameError('Username: only English letters and numbers are allowed');
            setIsLoading(false);
            return;
        } else {
            setuserNameError(null);
        }

        axios.post('http://127.0.0.1:8000/api/register/', formData)
            .then((result) => {
                navigate("/")
                console.log(result, "Result")
                console.log(formData, "formData")
                axios.get(`http://127.0.0.1:8000/api/users/${formData.username}`)
                    .then((response) => {
                        console.log(response.data, "NEW USER CREATED")
                        

                        // navigate("/")
                    })
                    .catch(error => console.error(error))
                    .finally(() => {
                        setIsLoading(false);
                    });

            }).catch((error) => {
                console.log(error, "ERROR")
                setIsLoading(false);
                if (error && error.response) {

                    if (error.response.data && error.response.data.email && error.response.data.email[0] === "account with this email already exists.") {
                        setEmailError(error.response.data.email)
                    }

                    else if (error.response.data && error.response.data.username && error.response.data.username[0] === "account with this username already exists.") {
                        setuserNameError(error.response.data.username)

                    }
                } return;
            })

        
    }
    return (
            


        <div className="container-fluid py-2 h-100 gradient-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card-body p-5 text-center">

                            <form className="mb-md-5 mt-md-1 pb-5 login-form" onSubmit={handleSubmit}>
                                <h2 className="text-uppercase text-warning">title</h2>
                                <div className="form-group mb-4">
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="form-control form-control-lg"
                                        placeholder="username"
                                        required
                                    />
                                    {userNameError && <div className="error">{userNameError}</div>}
                                </div>
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
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-control form-control-lg"
                                        placeholder="email"
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
                                        placeholder="password"
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
                                    placeholder="confirm password"
                                    required
                                />
                            </div>
                            {formData.password !== formData.password2 && (
                                <div className="error">not matching</div>
                            )}

                               
                                <div className="form-group mb-4">
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="form-control form-control-lg"
                                        required
                                    >
                                        <option value={null}>choose gender</option>
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
                                {isLoading && (
                                    <div className="spinner-border text-warning" role="status">
                                        <span className="visually-hidden">loading...</span>
                                    </div>
                                )}
                                <div className="form-group mb-4">
                                    <input type="submit" value="submit" className="btn btn-warning btn-lg" disabled={isLoading} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default SignUp;

