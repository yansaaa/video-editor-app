import { useEffect, useState } from 'react';

type OverlayPreset = {
  id: number;
  label: string;
  text: string;
  color: string;
  fontSize: number;
  opacity: number;
  x: number;
  y: number;
  align: 'left' | 'center' | 'right';
};

const defaultPreset: OverlayPreset = {
  id: 1,
  label: 'Launch Title',
  text: 'Launch Day',
  color: '#ffffff',
  fontSize: 46,
  opacity: 0.95,
  x: 50,
  y: 56,
  align: 'center',
};

const storageKey = 'video-editor-overlay-presets';

function App() {
  const [overlay, setOverlay] = useState<OverlayPreset>(defaultPreset);
  const [savedPresets, setSavedPresets] = useState<OverlayPreset[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      setSavedPresets([defaultPreset]);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as OverlayPreset[];
      setSavedPresets(parsed.length ? parsed : [defaultPreset]);
    } catch {
      setSavedPresets([defaultPreset]);
    }
  }, []);

  useEffect(() => {
    if (savedPresets.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(savedPresets));
    }
  }, [savedPresets]);

  const updateOverlay = <K extends keyof OverlayPreset>(key: K, value: OverlayPreset[K]) => {
    setOverlay((prev) => ({ ...prev, [key]: value }));
  };

  const savePreset = () => {
    const nextPreset: OverlayPreset = {
      ...overlay,
      id: Date.now(),
      label: `Preset ${savedPresets.length + 1}`,
    };

    setSavedPresets((prev) => [nextPreset, ...prev].slice(0, 5));
  };

  const resetPreset = () => {
    setOverlay(defaultPreset);
  };

  return (
    <div className="app-shell">
      <aside className="panel controls">
        <div className="panel-header">
          <span className="eyebrow">Text Overlay Tool</span>
          <h1>Video Editor</h1>
        </div>

        <label>
          Overlay text
          <input
            type="text"
            value={overlay.text}
            onChange={(event) => updateOverlay('text', event.target.value)}
            placeholder="Add a title or caption"
          />
        </label>

        <div className="field-row two-up">
          <label>
            Text color
            <input
              type="color"
              value={overlay.color}
              onChange={(event) => updateOverlay('color', event.target.value)}
            />
          </label>

          <label>
            Font size
            <div className="value-badge">{overlay.fontSize}px</div>
          </label>
        </div>

        <label>
          Font size
          <input
            type="range"
            min="20"
            max="120"
            value={overlay.fontSize}
            onChange={(event) => updateOverlay('fontSize', Number(event.target.value))}
          />
        </label>

        <label>
          Opacity
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.05"
            value={overlay.opacity}
            onChange={(event) => updateOverlay('opacity', Number(event.target.value))}
          />
        </label>

        <div className="field-row two-up">
          <label>
            Horizontal position
            <input
              type="range"
              min="0"
              max="100"
              value={overlay.x}
              onChange={(event) => updateOverlay('x', Number(event.target.value))}
            />
          </label>

          <label>
            Vertical position
            <input
              type="range"
              min="0"
              max="100"
              value={overlay.y}
              onChange={(event) => updateOverlay('y', Number(event.target.value))}
            />
          </label>
        </div>

        <label>
          Alignment
          <select
            value={overlay.align}
            onChange={(event) => updateOverlay('align', event.target.value as 'left' | 'center' | 'right')}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </label>

        <div className="button-group">
          <button className="primary" onClick={savePreset}>Save preset</button>
          <button className="secondary" onClick={resetPreset}>Reset</button>
        </div>
      </aside>

      <main className="panel preview-panel">
        <div className="preview-header">
          <span className="eyebrow">Preview</span>
          <h2>Scene output</h2>
        </div>

        <div className="video-stage">
          <div className="timeline-bar" />
          <div className="video-overlay" style={{ left: `${overlay.x}%`, top: `${overlay.y}%` }}>
            <span
              style={{
                color: overlay.color,
                fontSize: `${overlay.fontSize}px`,
                opacity: overlay.opacity,
                textAlign: overlay.align,
              }}
            >
              {overlay.text || 'Your title'}
            </span>
          </div>
        </div>

        <div className="preset-list">
          <div className="preset-header">
            <h3>Saved presets</h3>
          </div>

          {savedPresets.map((preset) => (
            <button
              type="button"
              key={preset.id}
              className="preset-item"
              onClick={() => setOverlay(preset)}
            >
              <span>{preset.label}</span>
              <small>{preset.text}</small>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
