import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaPlay,
  FaPause,
  FaBackward,
  FaForward,
  FaTimes,
} from "react-icons/fa";

const MiniPlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  color: #e0e0e0;
  box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.6);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  transition: transform 0.3s ease;
  transform: ${(props) =>
    props.isVisible ? "translateY(0)" : "translateY(100%)"};

  @media (max-width: 768px) {
    padding: 10px 15px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #c0c0d0;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #ff6b6b;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  animation: fadeIn 0.5s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TrackImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 15px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  background: #2a2a3a;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    margin-right: 10px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    margin-bottom: 5px;
    margin-right: 0;
  }
`;

const TrackDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    flex: 1;
    margin-right: 10px;
  }

  @media (max-width: 480px) {
    width: 100%;
    margin-right: 0;
  }
`;

const TrackName = styled.span`
  font-weight: 700;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: linear-gradient(to right, #ffffff, #d0d0ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const TrackArtist = styled.span`
  font-size: 14px;
  color: #a0a0c0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 4px;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    margin-top: 2px;
  }
`;

const ControlSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;

  @media (max-width: 768px) {
    margin-top: 10px;
    flex-wrap: wrap;
  }

  @media (max-width: 480px) {
    margin-top: 8px;
  }
`;

const TimeDisplay = styled.div`
  font-size: 13px;
  color: #c0c0d0;
  min-width: 50px;
  font-family: monospace;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  transition: color 0.3s ease;

  &:hover {
    color: #ffffff;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    min-width: 40px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 2px 6px;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  margin: 0 15px;

  @media (max-width: 768px) {
    margin: 0 10px;
  }

  @media (max-width: 480px) {
    margin: 0 5px;
  }
`;

const ProgressBar = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    height: 6px;
    width: ${(props) => props.value}%;
    background: linear-gradient(to right, #ff4d4d, #ff8787);
    border-radius: 8px;
    top: 0;
    left: 0;
    pointer-events: none;
    transition: width 0.2s ease;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    background: #ff6b6b;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 8px rgba(255, 107, 107, 0.6);
    transition: all 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    &::-webkit-slider-thumb {
      background: #ff4d4d;
      transform: scale(1.2);
    }
  }

  @media (max-width: 768px) {
    height: 5px;
    &::-webkit-slider-thumb {
      width: 12px;
      height: 12px;
    }
  }

  @media (max-width: 480px) {
    height: 4px;
    &::-webkit-slider-thumb {
      width: 10px;
      height: 10px;
    }
  }
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    justify-content: center;
    width: 100%;
  }
`;

const ControlButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #c0c0d0;
  font-size: 22px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ffffff;
    transform: scale(1.15);
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const PlayPauseButton = styled(ControlButton)`
  background: linear-gradient(45deg, #ff4d4d, #ff6b6b);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  color: white;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.5);

  &:hover {
    background: linear-gradient(45deg, #ff6b6b, #ff8787);
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(255, 107, 107, 0.7);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
`;

const VolumeControl = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 120px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-left: 20px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    background: #ff6b6b;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 8px rgba(255, 107, 107, 0.6);
    transition: all 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    &::-webkit-slider-thumb {
      background: #ff4d4d;
      transform: scale(1.2);
    }
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 5px;
    margin-left: 10px;
    &::-webkit-slider-thumb {
      width: 12px;
      height: 12px;
    }
  }

  @media (max-width: 480px) {
    width: 60px;
    height: 4px;
    margin-left: 5px;
    &::-webkit-slider-thumb {
      width: 10px;
      height: 10px;
    }
  }
`;

const MiniPlayer = ({ currentTrack, audioRef }) => {
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Changed default to false

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100 || 0);
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        // Only show player on first load if it starts playing
        if (!isVisible && !audio.paused) {
          setIsVisible(true);
        }
      };

      const handlePlay = () => {
        setIsPlaying(true);
        // Show player when playback starts, unless explicitly closed
        if (!isVisible) {
          setIsVisible(true);
        }
      };

      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);

      // Set initial state based on audio
      setIsPlaying(!audio.paused);
      if (!audio.paused && !isVisible) {
        setIsVisible(true);
      }

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioRef, currentTrack]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (!isNaN(newVolume) && newVolume >= 0 && newVolume <= 1) {
      setVolume(newVolume);
      if (audioRef.current) audioRef.current.volume = newVolume;
    }
  };

  const handleProgressChange = (e) => {
    if (audioRef.current) {
      const newTime = (audioRef.current.duration * e.target.value) / 100;
      audioRef.current.currentTime = newTime;
      setProgress(e.target.value);
    }
  };

  const handleBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 10
      );
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 10
      );
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current
          .play()
          .catch((error) => console.error("Playback error:", error));
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Only render if there's a track and the player is visible
  if (!currentTrack || !isVisible) return null;

  return (
    <MiniPlayerContainer isVisible={isVisible}>
      <CloseButton onClick={handleClose}>
        <FaTimes />
      </CloseButton>
      <TrackInfo>
        <TrackImage
          src={`http://127.0.0.1:3001/musicas/${currentTrack.imagem}`}
          alt={currentTrack.nome}
          onError={(e) => (e.target.src = "https://via.placeholder.com/50")}
        />
        <TrackDetails>
          <TrackName>{currentTrack.nome}</TrackName>
          <TrackArtist>{currentTrack.artista}</TrackArtist>
        </TrackDetails>
      </TrackInfo>
      <ControlSection>
        <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
        <ProgressContainer>
          <ProgressBar
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleProgressChange}
          />
        </ProgressContainer>
        <TimeDisplay>{formatTime(duration)}</TimeDisplay>
        <ControlButtons>
          <ControlButton onClick={handleBackward}>
            <FaBackward />
          </ControlButton>
          <PlayPauseButton onClick={handlePlayPause}>
            {isPlaying ? <FaPause /> : <FaPlay style={{ marginLeft: "2px" }} />}
          </PlayPauseButton>
          <ControlButton onClick={handleForward}>
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
  );
};

export default MiniPlayer;
