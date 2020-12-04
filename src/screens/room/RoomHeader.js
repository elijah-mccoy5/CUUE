import React, { useState } from 'react';

import { Row, Col, Typography, Tooltip, Dropdown, Menu, Button } from 'antd';

import { Share, Link } from 'react-feather';

// import qrIcon from '../../assets/img/qrIcon.svg';

const { Title } = Typography;

const RoomHeader = props => {
  const { roomId, hostActionComponents } = props;

  const [urlCopiedTooltipVisible, setUrlCopiedTooltipVisible] = useState(false);

  const showUrlCopiedTooltip = () => {
    setUrlCopiedTooltipVisible(true);
    setTimeout(() => {
      setUrlCopiedTooltipVisible(false);
    }, 3000);
  };

  const roomUrl = `disko.vip/room/${roomId.toLowerCase()}`;

  const handleCopyUrlToClipboard = () => {
    const roomUrlElement = document.createElement('input');
    roomUrlElement.height = 0;
    roomUrlElement.width = 0;
    roomUrlElement.value = roomUrl;
    document.body.appendChild(roomUrlElement);
    roomUrlElement.select();
    document.execCommand('copy');
    document.body.removeChild(roomUrlElement);
    showUrlCopiedTooltip();
  };

  return (
    <Row
      type="flex"
      align="middle"
      justify="space-between"
      style={{
        paddingTop: '5px',
      }}
    >
      <Col>
        <Title
          level={2}
          style={{
            color: 'white',
          }}
        >
          disko
        </Title>
      </Col>
      <Col>
        <Row type="flex" align="middle" justify="end">
          <Col>{hostActionComponents}</Col>
          <Col>
            <Tooltip
              placement="leftBottom"
              visible={urlCopiedTooltipVisible}
              title={<span>Room URL copied to clipboard!</span>}
            >
              <Dropdown
                overlay={
                  <Menu
                    style={{
                      backgroundColor: '#191414',
                      zIndex: '10',
                    }}
                  >
                    <Menu.Item onClick={handleCopyUrlToClipboard}>
                      <Link color="white" />
                    </Menu.Item>
                    {
                      // <Menu.Item>
                      //   <Img src={qrIcon} />
                      // </Menu.Item>
                    }
                  </Menu>
                }
                placement="bottomLeft"
              >
                <Button type="link">
                  <Share />
                </Button>
              </Dropdown>
            </Tooltip>
          </Col>
          <Col>
            <Title
              level={2}
              style={{
                color: 'white',
                float: 'right',
              }}
            >
              {roomId.toLowerCase()}
            </Title>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default RoomHeader;
