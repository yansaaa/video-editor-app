import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import './VideoPlayer.css';

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { currentTime, setCurrentTime } = useEditorStore();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setCurrentTime(video.currentTime);
  };

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        className="video-element"
        onTimeUpdate={handleTimeUpdate}
        controls
      />
      <div className="video-controls">
        <button onClick={handlePlayPause} className="control-button">
          Play/Pause
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
