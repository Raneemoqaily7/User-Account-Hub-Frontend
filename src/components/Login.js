import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies();

  const handleLogin = (e) => {
    e.preventDefault();
   
    console.log('email:', email);
    console.log('Password:', password);
    // Reset form fields
    setEmail('');
    setPassword('');

    const loginUrl = 'http://127.0.0.1:8000/api/login/';
    const data = { username: email, password: password };

    axios.post(loginUrl, data)
        .then(response => {
            console.log(response, "response")
            console.log(response.data, "response.data")
            setCookie("token", response.data.token, { path: '/' });

            console.log(cookies, "cookies")



            axios.get(`http://127.0.0.1:8000/api/users/${email}/`)
                .then((response) => {
                    let user = response.data
                    setCookie("user", response.data, { path: '/' });
                    console.log(response.data, "DTAA")
              
                    console.log(cookies.user, "USER")
                   
                    if (response.data.is_admin === true) {
                        setCookie("userRole", "admin", { path: '/' });

                    } else if (response.data.is_admin === false) {
                        setCookie("userRole", "user", { path: '/' });
                    }


                    if (response.data.is_admin === true && cookies) { //should be developed .............................................
                        navigate('/AdminPage')
                    } else if (response.data.is_admin === false && cookies) {
                        navigate('/profile')

                    }

                })
                .catch((error) => {
                    console.log(error);
                });

            // check if admin 
            console.log(cookies, "cookies")


            // true
            //comp Admin_HOME 
            // false 
            // compt User_HOME

        })
        .catch(error => {
            if (error.message === "Network Error") {
                alert("Network error")
                return;
            }
            console.log(error, "ERROR")
            if (error.response.data && error.response.data.non_field_errors && error.response.data.non_field_errors[0] === "Unable to log in with provided credentials.") {
                setLoginError(error.response.data.non_field_errors[0])
            }
        });
};

  return (
    <>

      <div className="container-fluid py-2 h-50 gradient-custom">
        <div className="row d-flex justify-content-center align-items-center h-50 ">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">

            <div className="card-body p-5 text-center">

              <form className="mb-md-5 mt-md-1 pb-5 login-form">
                <h2 className="fw-bold mb-2 text-uppercase text-warning">login</h2>
                <p className="text-white-50 mb-5">enter</p>
                <div className="form-outline form-white mb-4">
                  <input onChange={(e) => setEmail(e.target.value)}
                    type="text" id="username" className="form-control form-control-lg" required />
                  <label className="form-label" htmlFor="typeEmailX">username</label>

                </div>


                <div className="form-outline form-white mb-4">
                  <input onChange={(e) => setPassword(e.target.value)}
                    id="password" className="form-control form-control-lg" required />
                  <label className="form-label" htmlFor="typeEmailX">password</label>
                </div>





                <button className="btn btn-outline-warning btn-lg px-5 login-btn  " type="submit" onClick={handleLogin} > login</button>
                {loginError && <div className="error">{loginError}</div>}



                {/* <div>
                            <p className="pb-lg-2 mt-2">{t("donthaveaccount")} <Link to="/signup">{t("title")}</Link></p>

                        </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
