import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import {Link, useHistory} from 'react-router-dom'
import { useAuth} from '../../context/AuthContext'


const Login = () => {
    //Sets state of the form being processed
    const [loading, setLoading] = useState(false);

    //Simple string state to console out errors
    const [error, setError] = useState('');

    const emailRef = useRef();
    const passwordRef = useRef();
    const { login }  = useAuth();

    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
          try{
                setError('');
                setLoading(true);
                await login(emailRef.current.value, passwordRef.current.value)
                history.push('/')
            }catch{
                    setError('Failed to Log in')
    }
    setLoading(false);
}
    return (
        <>
          <Container className="d-flex align-items-center justify-content-center"
          style={{minHeight: "100vh"}}>
           <div className="w-100" style={{maxWidth: '400px'}}>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Log in</h2>
                         {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required/>
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required/>
                        </Form.Group>
                        <Button disabled={loading} className="w-100 text-center mt-2" type="submit">Log in</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
               Dont have an account yet?  <Link to="/signup">Sign Up</Link>
            </div>
            </div>
       </Container>
        </>
    );
};


export default Login;