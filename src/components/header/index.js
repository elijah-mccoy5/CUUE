import React from 'react';
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';
import './index.css'

const Header = () => {
    return (
            <Navbar sticky="top" bg="light" expand="lg">
                <Navbar.Brand href="/" style={{fontFamily: "Fugaz One', cursive" }}>
                    CUEE
                    </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="/connect">Create Party +</Nav.Link>
                    </Nav>
                    <Nav style={{marginRight: "30px", alignItems: "center"}}>
                        <NavDropdown title="Profile" id="basic-nav-dropdown" >
                        <NavDropdown.Item href="#action/3.1">Account</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Log out</NavDropdown.Item>
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