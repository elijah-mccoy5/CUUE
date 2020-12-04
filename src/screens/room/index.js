import React from 'react';

import { useSelector } from 'react-redux';

import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import { Redirect } from 'react-router-dom';

import { Col } from 'react-bootstrap';

// import Img from 'react-image';

import Queue from '../Queue';
import SearchBar from '../SearchBar';
import Search from '../Search';
import Player from '../Player';
import LoadingPage from '../LoadingPage';
import RoomHeader from './RoomHeader';
import GuestTooltip from './GuestTooltip';

import './index.css';

const Room = props => {
  const { roomId, hostActionComponents, ...rest } = props;
  const searchEnabled = useSelector(state => state.search.searchEnabled);

  const renderPlayer = () => {
    if (!hostActionComponents) {
      return null;
    }
    return <Player roomId={roomId} {...rest} />;
  };

  const roomReference = `rooms.${roomId}`;

  const roomDataQuery = {
    collection: 'rooms',
    doc: roomId,
    storeAs: roomReference,
  };

  useFirestoreConnect([roomDataQuery]);

  const roomSelector = useSelector(
    state => state.firestore.ordered[roomReference],
  );

  if (!isLoaded(roomSelector)) {
    return <LoadingPage />;
  }

  const roomDoesNotExist = isEmpty(roomSelector);

  if (roomDoesNotExist) {
    return <Redirect to="/" />;
  }

  const room = roomSelector[0];

  const renderBody = () => {
    const body = searchEnabled ? (
      <Search room={room} />
    ) : (
      <Queue roomId={roomId} {...rest} />
    );

    return body;
  };

  return (
    <Col
      xs={24}
      md={12}
      lg={10}
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <RoomHeader {...props} />
      <SearchBar room={room} />
      <GuestTooltip room={room} />
      {renderBody()}
      {renderPlayer()}
    </Col>
  );
};

export default Room;