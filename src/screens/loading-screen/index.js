import React from 'react';

import { Row } from 'antd';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import Loader from 'react-loader-spinner';

const LoadingPage = props => {
  return (
    <Row
      type="flex"
      align="middle"
      justify="center"
      style={{
        height: '100%',
      }}
    >
      <Loader
        type="ThreeDots"
        color="#1DB954"
        height={100}
        width={100}
        timeout={3000} // 3 secs
      />
    </Row>
  );
};

export default LoadingPage;