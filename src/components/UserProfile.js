import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
function UserProfile(){
    const [cookies, setCookie, removeCookie] = useCookies();
    const navigate=useNavigate();
    function signOutHandler(){
        removeCookie('token')
        removeCookie('user')
        removeCookie('userRole')
        navigate("/")
      }
    return(
        <>
        <Navbar bg="dark" variant="dark">
          <Container>
             <Nav className="me-auto">
            
              <Nav.Link onClick={signOutHandler}>logout</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <h1>UserProfile</h1>
      </>
    )
}
export default UserProfile