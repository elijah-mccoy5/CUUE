import React, {useState} from 'react';
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import './index.css'
import {useHistory } from 'react-router-dom'
import {useAuth} from '../../context/AuthContext'

const Header = () => {
    const [error, setError] = useState();

    const  { logout } = useAuth();
    const history = useHistory();

    const handleLogOut = async() => {
            setError("")
            try{
                    await logout()
                    history.push("/login")
            }catch{
                setError("Failed to log out")
            }
    }

    return (

            <Navbar sticky="top" bg="light" expand="lg">
                <Navbar.Brand href="/dashboard" style={{fontFamily: "Fugaz One', cursive" }}>
                    CUEE
                    </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="/">Create Party +</Nav.Link>
                    </Nav>
                    <Nav style={{marginRight: "30px", alignItems: "center"}}>
                        <NavDropdown title="Profile" id="basic-nav-dropdown" >
                        <NavDropdown.Item href="#action/3.1">Account</NavDropdown.Item>
                        <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogOut}>Log out</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/support">
                               Support
                        </Nav.Link>
                     </Nav>
                </Navbar.Collapse>
            </Navbar>
    );
};

export default Header;