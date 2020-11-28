import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Button } from 'react-bootstrap'

const Links = () => {

    return (
        <div>
            <Button onClick={() => { WebBrowser.openBrowserAsync('https://docs.expo.io')}}>Press it</Button>
        </div>
    );
};

export default Links;