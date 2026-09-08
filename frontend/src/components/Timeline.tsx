import React, { useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import './Timeline.css';

const Timeline: React.FC = () => {
  const { clips, currentTime } = useEditorStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    // Update current time based on click
  };

  return (
    <div className="timeline">
      <div className="timeline-header">
        <h3>Timeline</h3>
      </div>
      <div className="timeline-container">
        <div className="timeline-ruler">
          {/* Timeline ruler markers */}
          {[...Array(10)].map((_, i) => (
            <div key={i} className="timeline-marker">
              {i * 10}s
            </div>
          ))}
        </div>
        <div className="timeline-track" onClick={handleTimelineClick}>
          {clips.map((clip, index) => (
            <div
              key={index}
              className="clip-item"
              style={{
                left: `${(clip.startTime / 300) * 100}%`,
                width: `${((clip.endTime - clip.startTime) / 300) * 100}%`,
              }}
            >
              <span className="clip-label">{clip.name}</span>
            </div>
          ))}
          <div
            className="playhead"
            style={{
              left: `${(currentTime / 300) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
