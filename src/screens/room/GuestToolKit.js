import React from 'react';

import { useSelector } from 'react-redux';

import { useFirestore, isLoaded, isEmpty } from 'react-redux-firebase';

import { Affix, Tooltip } from 'antd';

import { Users } from 'react-feather';

import { GUEST_DISPLAY_NAME_REFERENCE } from '../../constants';

const GuestTooltip = props => {
  const { room } = props;
  const roomId = room.id;

  const auth = useSelector(state => state.firebase.auth);
  const firestore = useFirestore();

  const guestDisplayNameSelector = useSelector(
    state => state.firestore.ordered[GUEST_DISPLAY_NAME_REFERENCE],
  );

  if (
    isLoaded(auth) &&
    !isEmpty(auth) &&
    isLoaded(guestDisplayNameSelector) &&
    !isEmpty(guestDisplayNameSelector)
  ) {
    const arrayUnion = firestore.FieldValue.arrayUnion;
    // const arrayRemove = firestore.FieldValue.arrayRemove;
    const roomUpdateReference = firestore.collection('rooms').doc(roomId);
    const guestDisplayName = guestDisplayNameSelector[0].displayName;
    const roomUpdateObject = {};

    if (!room.guestUids.includes(auth.uid)) {
      roomUpdateObject.guestUids = arrayUnion(auth.uid);
    }
    if (
      guestDisplayName &&
      !room.guestDisplayNames.includes(guestDisplayName)
    ) {
      roomUpdateObject.guestDisplayNames = arrayUnion(guestDisplayName);
    }
    if (Object.keys(roomUpdateObject).length !== 0) {
      roomUpdateReference.update(roomUpdateObject);
    }
  }

  const guestToolTipText = (
    <div>
      <div
        key="host_tooltip_item"
        style={{
          textAlign: 'right',
          color: '#f01dbb',
        }}
      >
        {room.hostDisplayName}
      </div>
      {room.guestDisplayNames.map(displayName => (
        <div
          key={`${displayName}_tooltip_item`}
          style={{
            textAlign: 'right',
          }}
        >
          {displayName}
        </div>
      ))}
    </div>
  );

  return (
    <Affix
      style={{
        height: '0px',
        textAlign: 'right',
      }}
      offsetTop={55}
    >
      <Tooltip
        trigger={['hover', 'click']}
        placement="bottomRight"
        title={guestToolTipText}
      >
        <Users
          style={{
            color: 'white',
            position: 'relative',
            zIndex: '999',
          }}
        />
      </Tooltip>
    </Affix>
  );
};

export default GuestTooltip;