import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaPlay, FaPause, FaBackward, FaForward } from "react-icons/fa";

const MiniPlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to right, #1e1e2f, #252545);
  padding: 15px 30px;
  display: flex;
  flex-direction: column;
  color: white;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const TrackImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  margin-right: 15px;
  object-fit: cover;
  background: #333; /* Cor de fundo caso a imagem não carregue */
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
  margin-top: 10px;
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ControlButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: white;
  font-size: 24px;
  transition: all 0.3s ease;

  &:hover {
    color: #ff6b6b;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const VolumeControl = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100px;
  height: 6px;
  background: #555;
  border-radius: 5px;
  outline: none;
  transition: background 0.3s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    background: #ff6b6b;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.3s;
  }

  &:hover {
    background: #777;

    &::-webkit-slider-thumb {
      background: #ff4d4d;
    }
  }
`;

const ProgressBar = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: #555;
  border-radius: 5px;
  outline: none;
  transition: background 0.3s;
  margin: 0 20px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    background: #ff6b6b;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.3s;
  }

  &:hover {
    background: #777;

    &::-webkit-slider-thumb {
      background: #ff4d4d;
    }
  }
`;

const TimeDisplay = styled.div`
  font-size: 14px;
  color: white;
  margin: 0 10px;
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
            src={`http://127.0.0.1:3001/musicas/${currentTrack.imagem}`} // Caminho da imagem
            alt={currentTrack.nome}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/50"; // Fallback em caso de erro
            }}
          />
          <TrackDetails>
            <TrackName>{currentTrack.nome}</TrackName>
            <TrackArtist>{currentTrack.artista}</TrackArtist>
          </TrackDetails>
        </TrackInfo>
        <ControlSection>
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
            <ControlButton onClick={handlePlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </ControlButton>
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
          <TimeDisplay>
            {formatTime(currentTime)} / {formatTime(duration)}
          </TimeDisplay>
          <ProgressBar
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleProgressChange}
          />
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
