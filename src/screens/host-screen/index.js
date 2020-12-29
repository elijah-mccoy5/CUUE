import React from 'react';

const Host = () => {
    return (
        <div>
            <img  className="song-image"  src={currentlyPlaying.image} alt="currently playing song name"/>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center"}}>
          <h1 className="song-name" onClick={handleToggle}>{currentlyPlaying.name}</h1>
            
            <p className="song-artist">{currentlyPlaying.artist}</p> 
            </div>
            </div>
    );
};

export default Host;