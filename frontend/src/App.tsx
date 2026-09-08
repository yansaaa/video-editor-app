import React from 'react';
import './App.css';
import Timeline from './components/Timeline';
import VideoPlayer from './components/VideoPlayer';
import ControlPanel from './components/ControlPanel';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Video Editor</h1>
      </header>
      <div className="app-container">
        <div className="preview-section">
          <VideoPlayer />
        </div>
        <div className="editing-section">
          <ControlPanel />
          <Timeline />
        </div>
      </div>
    </div>
  );
}

export default App;
