import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaPlay, FaPause, FaBackward, FaForward } from "react-icons/fa";

const MiniPlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  color: #e0e0e0;
  box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.6);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
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
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TrackImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 8px;
  margin-right: 20px;
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
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const TrackDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 25px;
  overflow: hidden;
  flex: 1;

  @media (max-width: 768px) {
    margin-right: 0;
    width: 100%;
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
`;

const ControlSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
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
    margin-bottom: 10px;
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  margin: 0 20px;

  @media (max-width: 768px) {
    width: 100%;
    margin: 10px 0;
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
    height: 4px;
  }
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  position: absolute;
  left: 50%;
  margin-bottom: 100px;
  transform: translateX(-50%);
  z-index: 1;

  @media (max-width: 768px) {
    position: static;
    transform: none;
    justify-content: center;
    width: 100%;
    margin-top: 10px;
    gap: 20px;
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
  position: relative;

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
    width: 100%;
    margin-left: 0;
    margin-top: 10px;
  }
`;

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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
        setProgress(
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        );
      };

      const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
      };

      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
          audioRef.current.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
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
          console.error("Error playing audio:", error);
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
        <TrackInfo>
          <TrackImage
            src={`http://127.0.0.1:3001/musicas/${currentTrack.imagem}`}
            alt={currentTrack.nome}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/50";
            }}
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
            <ControlButton
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.max(
                    0,
                    audioRef.current.currentTime - 10
                  );
                }
              }}
            >
              <FaBackward />
            </ControlButton>
            <PlayPauseButton onClick={handlePlayPause}>
              {isPlaying ? (
                <FaPause />
              ) : (
                <FaPlay style={{ marginLeft: "2px" }} />
              )}
            </PlayPauseButton>
            <ControlButton
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.min(
                    audioRef.current.duration,
                    audioRef.current.currentTime + 10
                  );
                }
              }}
            >
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
