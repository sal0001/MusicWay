import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaBackward, FaForward } from 'react-icons/fa';

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
    justify-content: space-between;
    width: 100%;
    margin-top: 0px;
`;

const ControlButtons = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: center;
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
    width: 100%;
    height: 8px;
    background: grey;
    border-radius: 5px;
    outline: none;
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

const TimeDisplay = styled.div`
    font-size: 14px;
    color: white;
    margin-right: 10px;
`;

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const MiniPlayer = ({ currentTrack, audioRef, onPlayPause, onTrackEnd }) => {
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (audioRef.current) {
            const handleTimeUpdate = () => {
                setCurrentTime(audioRef.current.currentTime);
                setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            };

            const handleLoadedMetadata = () => {
                setDuration(audioRef.current.duration);
            };

            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
                    audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
                }
            };
        }
    }, [audioRef]);

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        if (!isNaN(newVolume) && newVolume >= 0 && newVolume <= 1) {
            setVolume(newVolume);
            if (audioRef.current) {
                audioRef.current.volume = newVolume;
            }
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
                    <TimeDisplay>{formatTime(currentTime)} {formatTime(duration)}</TimeDisplay>
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
