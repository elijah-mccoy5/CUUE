import React from 'react';
import { Form, Button, Card } from 'react-bootstrap'
import spotify from '../../assets/spotify.png';


const Connect = () => {

    return (
        <>
        <div className="connect">
        </div>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Connect!</h2>
                    <Button className="ml-5"variant="light" size="lg"><img style={{ width: "2vw"}} className="mr-2" src={spotify} alt="spotify icon"/>Connect with Spotify</Button>                   
                </Card.Body>
            </Card>
        </>
    );
};

export default Connect;