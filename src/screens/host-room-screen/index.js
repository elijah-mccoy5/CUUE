import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';

import {Row, Col, Button} from 'antd' 

import { Trash } from 'react-feather';

import Room from '../room';
import LoadingPage from '../LoadingPage';

import { HOST_PROVIDERS_REFERENCE } from '../../constants';

const HostRoomPage = props => {
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);

  const firebase = useFirebase();

  const [loading, setLoading] = useState(false);

  const firestoreHostProvidersQuery = {
    collection: `hosts/${auth.uid}/providers`,
    storeAs: HOST_PROVIDERS_REFERENCE,
  };

  useFirestoreConnect([firestoreHostProvidersQuery]);

  // if (!isLoaded(hostProviders)) {
  //   return <LoadingPage />;
  // }

  // if (isEmpty(hostProviders)) {
  //   // redirect to home? maybe use youtube
  // }

  const asyncGenerateNewRoom = firebase
    .functions()
    .httpsCallable('asyncGenerateNewRoom');

  const handleOpenNewRoom = async () => {
    try {
      setLoading(true);
      const roomGenerationResult = await asyncGenerateNewRoom();
      console.log(roomGenerationResult);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!profile.currentRoomId) {
    return (
      <Row
        type="flex"
        align="middle"
        justify="center"
        style={{
          height: '100%',
        }}
      >
        <Col>
          <Button type="primary" block onClick={handleOpenNewRoom}>
            Open a Room
          </Button>
        </Col>
      </Row>
    );
  }

  return (
    <Room
      roomId={profile.currentRoomId}
      hostActionComponents={<HostActionComponents />}
    />
  );
};

const HostActionComponents = props => {
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);

  const firestore = useFirestore();

  const handleCloseRoom = async () => {
    await firestore
      .collection('rooms')
      .doc(profile.currentRoomId)
      .delete();
    await firestore
      .collection('hosts')
      .doc(auth.uid)
      .update({
        currentRoomId: firestore.FieldValue.delete(),
      });
  };

  return (
    <Button type="link" onClick={handleCloseRoom}>
      <Trash />
    </Button>
  );
};

export default HostRoomPage;
