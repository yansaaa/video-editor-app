import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from 'react';

type Clip = {
  id: string;
  name: string;
  url: string;
  duration: number;
  trimStart: number;
  trimEnd: number;
};

type TextLayer = {
  id: string;
  text: string;
  color: string;
  fontSize: number;
  fontWeight: number;
  opacity: number;
  letterSpacing: number;
  x: number;
  y: number;
  align: 'left' | 'center' | 'right';
  shadow: boolean;
  shadowColor: string;
};

type Project = {
  projectName: string;
  textLayers: TextLayer[];
  clipId: string | null;
  clips: Clip[];
};

type TextLayerPreset = {
  name: string;
  values: Partial<TextLayer>;
};

const storageKey = 'video-editor-project-v1';
const demoClip = (name = 'Opening Shot', duration = 12): Clip => ({ id: crypto.randomUUID(), name, url: '', duration, trimStart: 0, trimEnd: duration });
const defaultLayer = (): TextLayer => ({
  id: crypto.randomUUID(),
  text: 'Launch Day',
  color: '#ffffff',
  fontSize: 42,
  fontWeight: 700,
  opacity: 1,
  letterSpacing: 1,
  x: 50,
  y: 52,
  align: 'center',
  shadow: true,
  shadowColor: '#000000',
});

const textLayerPresets: TextLayerPreset[] = [
  { name: 'Headline', values: { color: '#ffffff', fontSize: 52, fontWeight: 800, letterSpacing: 1, x: 50, y: 52, align: 'center', shadow: true, shadowColor: '#000000' } },
  { name: 'Title Card', values: { color: '#f7d57a', fontSize: 64, fontWeight: 700, letterSpacing: 2, x: 50, y: 40, align: 'center', shadow: true, shadowColor: '#4a2d00' } },
  { name: 'Lower Third', values: { color: '#dfe9ff', fontSize: 30, fontWeight: 600, letterSpacing: 1, x: 50, y: 78, align: 'center', shadow: true, shadowColor: '#0a1220' } },
  { name: 'Neon', values: { color: '#6de7ff', fontSize: 46, fontWeight: 700, letterSpacing: 3, x: 50, y: 50, align: 'center', shadow: true, shadowColor: '#0d1f46' } },
  { name: 'Soft Promo', values: { color: '#f5d0ff', fontSize: 40, fontWeight: 500, letterSpacing: 0, x: 50, y: 52, align: 'center', shadow: false, shadowColor: '#000000' } },
];

const initialProject: Project = {
  projectName: 'Spring Launch Edit',
  textLayers: [defaultLayer()],
  clipId: null,
  clips: [],
};

const formatTime = (seconds: number) => {
  const safe = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  return `${Math.floor(safe / 60)}:${Math.floor(safe % 60).toString().padStart(2, '0')}`;
};

function App() {
  const [project, setProject] = useState<Project>(initialProject);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [draggedClipId, setDraggedClipId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [status, setStatus] = useState('Ready to edit');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const parsed = saved ? JSON.parse(saved) as Project : null;
      const next = parsed?.clips?.length ? parsed : { ...initialProject, textLayers: [defaultLayer()], clips: [demoClip()] };
      setProject(next);
      setSelectedClipId(next.clipId ?? next.clips[0]?.id ?? null);
      setSelectedLayerId(next.textLayers[0]?.id ?? null);
    } catch {
      const next = { ...initialProject, textLayers: [defaultLayer()], clips: [demoClip()] };
      setProject(next);
      setSelectedClipId(next.clips[0].id);
      setSelectedLayerId(next.textLayers[0].id);
    }
  }, []);

  const selectedClip = useMemo(
    () => project.clips.find((clip) => clip.id === selectedClipId) ?? project.clips[0] ?? null,
    [project.clips, selectedClipId],
  );

  const selectedLayer = useMemo(
    () => project.textLayers.find((layer) => layer.id === selectedLayerId) ?? project.textLayers[0] ?? null,
    [project.textLayers, selectedLayerId],
  );

  const totalDuration = project.clips.reduce((sum, clip) => sum + (clip.trimEnd - clip.trimStart), 0);

  const setLayerValue = <K extends keyof TextLayer>(key: K, value: TextLayer[K]) => {
    if (!selectedLayerId) return;
    setProject((prev) => ({
      ...prev,
      textLayers: prev.textLayers.map((layer) => layer.id === selectedLayerId ? { ...layer, [key]: value } : layer),
    }));
  };

  const addTextLayer = () => {
    const layer = defaultLayer();
    setProject((prev) => ({ ...prev, textLayers: [...prev.textLayers, layer] }));
    setSelectedLayerId(layer.id);
    setStatus('New text layer added.');
  };

  const duplicateSelectedLayer = () => {
    if (!selectedLayer) return;
    const duplicate: TextLayer = {
      ...selectedLayer,
      id: crypto.randomUUID(),
      text: `${selectedLayer.text} Copy`,
      x: Math.min(selectedLayer.x + 6, 94),
      y: Math.min(selectedLayer.y + 6, 90),
    };
    setProject((prev) => ({ ...prev, textLayers: [...prev.textLayers, duplicate] }));
    setSelectedLayerId(duplicate.id);
    setStatus('Layer duplicated.');
  };

  const applyLayerPreset = (presetName: string) => {
    if (!selectedLayerId) return;
    const preset = textLayerPresets.find((item) => item.name === presetName);
    if (!preset) return;

    setProject((prev) => ({
      ...prev,
      textLayers: prev.textLayers.map((layer) => (
        layer.id === selectedLayerId ? { ...layer, ...preset.values } : layer
      )),
    }));
    setStatus(`${preset.name} preset applied.`);
  };

  const removeTextLayer = () => {
    if (!selectedLayerId || project.textLayers.length <= 1) return;
    const nextLayers = project.textLayers.filter((layer) => layer.id !== selectedLayerId);
    setProject((prev) => ({ ...prev, textLayers: nextLayers }));
    setSelectedLayerId(nextLayers[0]?.id ?? null);
    setStatus('Text layer removed.');
  };

  const reorderClips = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setProject((prev) => {
      const sourceIndex = prev.clips.findIndex((clip) => clip.id === sourceId);
      const targetIndex = prev.clips.findIndex((clip) => clip.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return prev;
      const clips = [...prev.clips];
      const [moved] = clips.splice(sourceIndex, 1);
      clips.splice(targetIndex, 0, moved);
      return { ...prev, clips };
    });
    setStatus('Timeline order updated.');
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>, id: string) => {
    setDraggedClipId(id);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, targetId: string) => {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData('text/plain') || draggedClipId;
    if (sourceId) reorderClips(sourceId, targetId);
    setDraggedClipId(null);
    setDropTargetId(null);
  };

  const moveClip = (id: string, direction: -1 | 1) => {
    setProject((prev) => {
      const index = prev.clips.findIndex((clip) => clip.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.clips.length) return prev;
      const clips = [...prev.clips];
      [clips[index], clips[nextIndex]] = [clips[nextIndex], clips[index]];
      return { ...prev, clips };
    });
    setStatus('Timeline order updated.');
  };

  const addClip = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setStatus('Only video files are supported.');
      return;
    }
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;
    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 1;
      const clip: Clip = { id: crypto.randomUUID(), name: file.name.replace(/\.[^/.]+$/, ''), url, duration, trimStart: 0, trimEnd: duration };
      setProject((prev) => ({ ...prev, clips: [...prev.clips, clip], clipId: clip.id }));
      setSelectedClipId(clip.id);
      setStatus(`${file.name} added to the timeline.`);
    };
  };

  const updateTrim = (id: string, key: 'trimStart' | 'trimEnd', value: number) => {
    setProject((prev) => ({ ...prev, clips: prev.clips.map((clip) => {
      if (clip.id !== id) return clip;
      if (key === 'trimStart') return { ...clip, trimStart: Math.min(value, clip.trimEnd - 0.1) };
      return { ...clip, trimEnd: Math.max(value, clip.trimStart + 0.1) };
    }) }));
  };

  const removeClip = (id: string) => {
    const remaining = project.clips.filter((clip) => clip.id !== id);
    const nextId = remaining[0]?.id ?? null;
    setProject((prev) => ({ ...prev, clips: remaining, clipId: nextId }));
    setSelectedClipId(nextId);
    setStatus('Clip removed from the timeline.');
  };

  const saveProject = () => {
    localStorage.setItem(storageKey, JSON.stringify({ ...project, clipId: selectedClipId }));
    setStatus('Project saved to local storage.');
  };

  const exportProject = () => {
    const blob = new Blob([JSON.stringify({ ...project, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.projectName.toLowerCase().replace(/\s+/g, '-') || 'video-project'}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus('Project export downloaded.');
  };

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) addClip(file);
    event.target.value = '';
  };

  const activeLayer = selectedLayer ?? project.textLayers[0];

  return (
    <div className="app-shell">
      <aside className="panel sidebar">
        <div className="panel-heading"><span className="kicker">MVP Studio</span><h1>Video Editor</h1></div>
        <section className="card"><h3>Project</h3>
          <label>Title<input value={project.projectName} onChange={(e) => setProject({ ...project, projectName: e.target.value })} /></label>
          <div className="button-row"><button className="primary" onClick={saveProject}>Save</button><button className="secondary" onClick={() => window.location.reload()}>Reload</button></div>
        </section>
        <section className="card"><h3>Media</h3>
          <label className="file-picker"><input type="file" accept="video/*" onChange={handleFileInput} /><span>Upload video</span></label>
          <button className="secondary full" onClick={() => {
            const clip = demoClip('Demo Clip', 9);
            setProject((prev) => ({ ...prev, clips: [...prev.clips, clip], clipId: clip.id }));
            setSelectedClipId(clip.id);
          }}>Add demo clip</button>
        </section>
        <section className="card"><h3>Text layers</h3>
          <div className="layer-list">
            {project.textLayers.map((layer) => (
              <button key={layer.id} className={`layer-chip ${selectedLayerId === layer.id ? 'selected' : ''}`} onClick={() => setSelectedLayerId(layer.id)}>
                {layer.text || 'Untitled layer'}
              </button>
            ))}
          </div>
          <div className="button-row top-gap"><button className="secondary" onClick={addTextLayer}>Add layer</button><button className="secondary" onClick={removeTextLayer}>Remove</button></div>
        </section>
        <section className="card"><h3>Layer styling</h3>
          {activeLayer && (
            <>
              <label>Text<input value={activeLayer.text} onChange={(e) => setLayerValue('text', e.target.value)} /></label>
              <label>Color<input type="color" value={activeLayer.color} onChange={(e) => setLayerValue('color', e.target.value)} /></label>
              <label>Font size<input type="range" min="18" max="110" value={activeLayer.fontSize} onChange={(e) => setLayerValue('fontSize', Number(e.target.value))} /></label>
              <label>Weight<input type="range" min="300" max="900" step="100" value={activeLayer.fontWeight} onChange={(e) => setLayerValue('fontWeight', Number(e.target.value))} /></label>
              <label>Opacity<input type="range" min="0.2" max="1" step="0.05" value={activeLayer.opacity} onChange={(e) => setLayerValue('opacity', Number(e.target.value))} /></label>
              <label>Letter spacing<input type="range" min="0" max="12" value={activeLayer.letterSpacing} onChange={(e) => setLayerValue('letterSpacing', Number(e.target.value))} /></label>
              <div className="two-col">
                <label>X<input type="range" min="0" max="100" value={activeLayer.x} onChange={(e) => setLayerValue('x', Number(e.target.value))} /></label>
                <label>Y<input type="range" min="0" max="100" value={activeLayer.y} onChange={(e) => setLayerValue('y', Number(e.target.value))} /></label>
              </div>
              <label>Alignment<select value={activeLayer.align} onChange={(e) => setLayerValue('align', e.target.value as 'left' | 'center' | 'right')}>
                <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
              </select></label>
              <label className="toggle-row"><input type="checkbox" checked={activeLayer.shadow} onChange={(e) => setLayerValue('shadow', e.target.checked)} /> Shadow</label>
              {activeLayer.shadow && <label>Shadow color<input type="color" value={activeLayer.shadowColor} onChange={(e) => setLayerValue('shadowColor', e.target.value)} /></label>}
              <div className="preset-row">
                <span className="mini-label">Quick presets</span>
                <div className="preset-buttons">
                  {textLayerPresets.map((preset) => (
                    <button type="button" key={preset.name} className="secondary preset-btn" onClick={() => applyLayerPreset(preset.name)}>{preset.name}</button>
                  ))}
                </div>
              </div>
              <button type="button" className="secondary full" onClick={duplicateSelectedLayer}>Duplicate layer</button>
            </>
          )}
        </section>
        <section className="card"><h3>Export</h3><div className="metrics"><div><span>Clips</span><strong>{project.clips.length}</strong></div><div><span>Duration</span><strong>{formatTime(totalDuration)}</strong></div></div><button className="primary full" onClick={exportProject}>Export JSON</button></section>
      </aside>

      <main className="workspace">
        <section className="panel preview-panel"><div className="section-header"><div><span className="kicker">Preview</span><h2>{project.projectName}</h2></div><span className="status-pill">{status}</span></div>
          <div className="stage">
            {selectedClip?.url ? <video src={selectedClip.url} controls playsInline /> : <div className="empty-stage"><p>No source video loaded.</p><small>Upload a clip or add a demo clip to preview the timeline.</small></div>}
            {project.textLayers.map((layer) => (
              <div key={layer.id} className="stage-text-layer" style={{ left: `${layer.x}%`, top: `${layer.y}%`, color: layer.color, fontSize: `${layer.fontSize}px`, fontWeight: layer.fontWeight, opacity: layer.opacity, letterSpacing: `${layer.letterSpacing}px`, textAlign: layer.align, textShadow: layer.shadow ? `0 6px 24px ${layer.shadowColor}` : 'none' }}>
                {layer.text || 'Your title'}
              </div>
            ))}
          </div>
        </section>
        <section className="panel timeline-panel"><div className="section-header"><div><span className="kicker">Timeline</span><h3>Sequence</h3></div><span className="meta">Drag cards to reorder</span></div>
          <div className="timeline-list">{project.clips.length === 0 ? <div className="empty-state">Your timeline is empty.</div> : project.clips.map((clip, index) => <div key={clip.id} className={`timeline-item ${selectedClipId === clip.id ? 'selected' : ''} ${dropTargetId === clip.id ? 'drop-target' : ''}`} onDragOver={(e) => { e.preventDefault(); setDropTargetId(clip.id); }} onDragLeave={() => setDropTargetId((current) => (current === clip.id ? null : current))} onDrop={(e) => handleDrop(e, clip.id)} onDragStart={(event) => handleDragStart(event, clip.id)} draggable>
            <div className="clip-summary"><div className="clip-title"><span className="drag-handle" aria-hidden="true">⋮⋮</span><div><strong>{index + 1}. {clip.name}</strong><small>{clip.url ? 'Imported media' : 'Demo media'}</small></div></div>
            <div className="clip-actions"><button type="button" className="icon-btn" onClick={() => moveClip(clip.id, -1)} disabled={index === 0}>↑</button><button type="button" className="icon-btn" onClick={() => moveClip(clip.id, 1)} disabled={index === project.clips.length - 1}>↓</button><button type="button" className="delete-btn" onClick={() => removeClip(clip.id)}>Delete</button></div></div>
            <div className="trim-group"><label>Start<input type="range" min="0" max={clip.duration} step="0.1" value={clip.trimStart} onChange={(e) => updateTrim(clip.id, 'trimStart', Number(e.target.value))} /><span>{formatTime(clip.trimStart)}</span></label><label>End<input type="range" min="0" max={clip.duration} step="0.1" value={clip.trimEnd} onChange={(e) => updateTrim(clip.id, 'trimEnd', Number(e.target.value))} /><span>{formatTime(clip.trimEnd)}</span></label></div>
          </div>)}</div>
        </section>
      </main>
    </div>
  );
}

export default App;
