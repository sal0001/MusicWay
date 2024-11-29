import React, { useState, useEffect } from 'react';
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
        color: grey;
    }
`;

const VolumeControl = styled.input`
    -webkit-appearance: none;
    appearance: none;
    width: 120px;
    height: 8px;
    background: grey;
    border-radius: 5px;
    outline: none;
    transition: background 0.3s;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        cursor: pointer;
    }

    &:hover {
        background: #555;
    }
`;

const MiniPlayer = ({ currentTrack, audioRef, onPlayPause, onTrackEnd }) => {
    const [volume, setVolume] = useState(1); 
    const [isPlaying, setIsPlaying] = useState(false); 

   
    useEffect(() => {
        if (audioRef.current) {
            setIsPlaying(!audioRef.current.paused);
        }
    }, [audioRef.current?.paused]); 

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play().catch((error) => {
                    console.error('Error playing audio:', error);
                });
            } else {
                audioRef.current.pause();
            }
            setIsPlaying(!audioRef.current.paused); 
        }
    };

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
                    <ControlButton onClick={handlePlayPause}>
                        {isPlaying ? (
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
                <VolumeControl
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </MiniPlayerContainer>
        )
    );
};

export default MiniPlayer;
