import React, { useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import './ControlPanel.css';

const ControlPanel: React.FC = () => {
  const { clips, addClip, removeClip, addTextOverlay } = useEditorStore();
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      addClip({
        id: Date.now().toString(),
        name: file.name,
        url,
        duration: 0,
        startTime: 0,
        endTime: 0,
      });
      setFileName(file.name);
    }
  };

  const handleAddText = () => {
    addTextOverlay({
      id: Date.now().toString(),
      text: 'New Text',
      startTime: 0,
      endTime: 5,
      x: 10,
      y: 10,
      fontSize: 24,
      color: '#ffffff',
    });
  };

  return (
    <div className="control-panel">
      <div className="panel-section">
        <h4>Import</h4>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          className="file-input"
        />
        {fileName && <p className="file-name">{fileName}</p>}
      </div>

      <div className="panel-section">
        <h4>Clips ({clips.length})</h4>
        <div className="clips-list">
          {clips.map((clip) => (
            <div key={clip.id} className="clip-item-list">
              <span>{clip.name}</span>
              <button
                className="delete-btn"
                onClick={() => removeClip(clip.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h4>Effects</h4>
        <button className="action-button" onClick={handleAddText}>
          Add Text Overlay
        </button>
        <button className="action-button">
          Add Transition
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
