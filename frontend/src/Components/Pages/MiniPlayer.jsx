import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaBackward, FaForward, FaVolumeUp, FaVolumeDown, FaVolumeMute } from 'react-icons/fa'; // Import icons from react-icons

const MiniPlayerContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #2c2c2c;
    padding: 10px 30px;
    display: flex;
    flex-direction: column;
    color: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
`;

const TrackInfo = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

const TrackDetails = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 20px; 
`;

const TrackName = styled.span`
    font-weight: bold;
    font-size: 16px;
`;

const TrackArtist = styled.span`
    font-size: 14px;
    color: #bbb;
`;

const ControlSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between; /* Space between controls */
    width: 100%;
    margin-top: 0px;
`;

const ControlButtons = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1; /* Allow the buttons to take available space */
    justify-content: center; /* Center the play/pause button */
    margin-right: 100px;
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
    height: 8px;
    background: grey;
    border-radius: 5px;
    outline: none;
    margin-right: 50px;
    transition: background 0.3s;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        cursor: pointer;
    }

    &:hover {
        background: #555;
    }
`;

const ProgressBar = styled.input`
    -webkit-appearance: none;
    appearance: none;
    width: 300%;
    height: 8px;
    background: white;
    border-radius: 5px;
    outline: none;
    margin-right: 200px;
    margin-left: 150px;
    transition: background 0.3s;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 10px;
        height: 10px;
        background: black;
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
    const [progress, setProgress] = useState(0);  

    useEffect(() => {
        if (audioRef.current) {
            setIsPlaying(!audioRef.current.paused);
        }
    }, [audioRef.current?.paused]);

    useEffect(() => {
        if (audioRef.current) {
            const updateProgress = () => {
                const currentTime = audioRef.current.currentTime;
                const duration = audioRef.current.duration;
                setProgress((currentTime / duration) * 100);  
            };

            const interval = setInterval(updateProgress, 500); 

            return () => clearInterval(interval); 
        }
    }, [audioRef]);

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

    const handleProgressChange = (e) => {
        if (audioRef.current) {
            const newTime = (audioRef.current.duration * e.target.value) / 100;
            audioRef.current.currentTime = newTime;
            setProgress(e.target.value);  
        }
    };

    return (
        currentTrack && (
            <MiniPlayerContainer>
                
                <ControlSection>
                <TrackInfo>
                    <TrackDetails>
                        <TrackName>{currentTrack.nome}</TrackName>
                        <TrackArtist>{currentTrack.artista}</TrackArtist>
                    </TrackDetails>
                </TrackInfo>
                <ProgressBar
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress}
                    onChange={handleProgressChange}
                />



                    <ControlButtons>
                        <ControlButton onClick={() => {
                            if (audioRef.current) {
                                audioRef.current.currentTime = Math.max(0, (audioRef.current.currentTime - 10));
                            }
                        }}>
                            <FaBackward />
                        </ControlButton>
                        <ControlButton onClick={handlePlayPause}>
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </ControlButton>
                        <ControlButton onClick={() => {
                            if (audioRef.current) {
                                audioRef.current.currentTime = Math.min(audioRef.current.duration, (audioRef.current.currentTime + 10));
                            }
                        }}>
                            <FaForward />
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
                   
                     

                </ControlSection>

            </MiniPlayerContainer>
        )
    );
};

export default MiniPlayer;
