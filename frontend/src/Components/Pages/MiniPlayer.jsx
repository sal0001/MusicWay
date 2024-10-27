// MiniPlayer.js
import React from 'react';
import styled from 'styled-components';

const MiniPlayerContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #2c2c2c;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
`;

const TrackInfo = styled.div`
    display: flex;
    align-items: center;
`;

const TrackDetails = styled.div`
    margin-left: 15px;
    display: flex;
    flex-direction: column;
`;

const TrackName = styled.span`
    font-weight: bold;
    font-size: 16px;
`;

const TrackArtist = styled.span`
    font-size: 14px;
    color: #bbb;
`;

const ControlButtons = styled.div`
    display: flex;
    align-items: center;
`;

const ControlButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    color: white;
    margin: 0 10px;
    font-size: 20px;
    transition: color 0.3s;

    &:hover {
        color: white;
    }
`;

const MiniPlayer = ({ currentTrack, audioRef, onPlayPause, onTrackEnd }) => {
    return (
        currentTrack && (
            <MiniPlayerContainer>
                <TrackInfo>
                    <TrackDetails>
                        <TrackName>{currentTrack.nome}</TrackName>
                        <TrackArtist>{currentTrack.artista}</TrackArtist>
                    </TrackDetails>
                </TrackInfo>
                <ControlButtons>
                    <ControlButton onClick={() => {
                        if (audioRef.current) {
                            audioRef.current.currentTime = Math.max(0, (audioRef.current.currentTime - 10));
                        }
                    }}>
                        <i className="fas fa-backward"></i>
                    </ControlButton>
                    <ControlButton onClick={onPlayPause}>
                        {audioRef.current && !audioRef.current.paused ? (
                            <i className="fas fa-pause"></i>
                        ) : (
                            <i className="fas fa-play"></i>
                        )}
                    </ControlButton>
                    <ControlButton onClick={() => {
                        if (audioRef.current) {
                            audioRef.current.currentTime = Math.min(audioRef.current.duration, (audioRef.current.currentTime + 10));
                        }
                    }}>
                        <i className="fas fa-forward"></i>
                    </ControlButton>
                </ControlButtons>
            </MiniPlayerContainer>
        )
    );
};

export default MiniPlayer;
