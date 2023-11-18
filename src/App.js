

import './App.css';

import SignUp from './components/SignUp'
import Login from './components/Login'
import AdminPage from './components/AdminPage'
import UsersView from './components/UsersView'
import UserProfile from './components/UserProfile'
import AccountView from './components/AccountView';

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  const [cookie, setCookie, removeCookie] = useCookies();
  return (
    <div className="App">
   
     {
      !cookie.token ?
        <Router>
          <Routes>
            <Route path="/" exact element={<Login />} />
            <Route path="/Login" exact element={<Login />} />
            <Route path="/signup" exact element={<SignUp />} />
            <Route path="*" exact element={<Login />} />
          </Routes>
        </Router>
        : cookie.userRole === 'admin' ?
          <Router>
            <Routes>
              
                  <Route path="/AdminPage" element={<UsersView />} />
                  <Route path="/account" element={<AccountView />} />
                
                 <Route path="*" exact element={<Login/>} />

             </Routes>
          </Router>
          : cookie.userRole === "user" ?
            <Router>
              <Routes>
                 <Route path="/profile" element={<UserProfile />} />
                <Route path="*" exact element={<Login />} />

              </Routes>
            </Router>
            :  <Router>
            <Routes>
               <Route path="/" element={<Login/>} />
              <Route path="/login" exact element={<Login />} />

            </Routes>
          </Router>

    }


  </div>
  );
}

export default App;
