import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from 'react';

type Clip = {
  id: string;
  name: string;
  url: string;
  duration: number;
  trimStart: number;
  trimEnd: number;
};

type Project = {
  projectName: string;
  overlayText: string;
  overlayColor: string;
  overlayFontSize: number;
  clipId: string | null;
  clips: Clip[];
};

const storageKey = 'video-editor-project-v1';
const demoClip = (name = 'Opening Shot', duration = 12): Clip => ({
  id: crypto.randomUUID(), name, url: '', duration, trimStart: 0, trimEnd: duration,
});
const initialProject: Project = {
  projectName: 'Spring Launch Edit', overlayText: 'Launch Day', overlayColor: '#ffffff',
  overlayFontSize: 42, clipId: null, clips: [],
};

const formatTime = (seconds: number) => {
  const safe = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  return `${Math.floor(safe / 60)}:${Math.floor(safe % 60).toString().padStart(2, '0')}`;
};

function App() {
  const [project, setProject] = useState<Project>(initialProject);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [draggedClipId, setDraggedClipId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [status, setStatus] = useState('Ready to edit');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const parsed = saved ? JSON.parse(saved) as Project : null;
      const next = parsed?.clips?.length ? parsed : { ...initialProject, clips: [demoClip()] };
      setProject(next);
      setSelectedClipId(next.clipId ?? next.clips[0]?.id ?? null);
    } catch {
      const next = { ...initialProject, clips: [demoClip()] };
      setProject(next);
      setSelectedClipId(next.clips[0].id);
    }
  }, []);

  const selectedClip = useMemo(
    () => project.clips.find((clip) => clip.id === selectedClipId) ?? project.clips[0] ?? null,
    [project.clips, selectedClipId],
  );
  const totalDuration = project.clips.reduce((sum, clip) => sum + clip.trimEnd - clip.trimStart, 0);

  const selectClip = (id: string) => {
    setSelectedClipId(id);
    setProject((prev) => ({ ...prev, clipId: id }));
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

  return (
    <div className="app-shell">
      <aside className="panel sidebar">
        <div className="panel-heading"><span className="kicker">MVP Studio</span><h1>Video Editor</h1></div>
        <section className="card"><h3>Project</h3>
          <label>Title<input value={project.projectName} onChange={(e) => setProject({ ...project, projectName: e.target.value })} /></label>
          <div className="button-row"><button className="primary" onClick={saveProject}>Save</button><button className="secondary" onClick={() => location.reload()}>Reload</button></div>
        </section>
        <section className="card"><h3>Media</h3>
          <label className="file-picker"><input type="file" accept="video/*" onChange={handleFileInput} /><span>Upload video</span></label>
          <button className="secondary full" onClick={() => { const clip = demoClip('Demo Clip', 9); setProject((prev) => ({ ...prev, clips: [...prev.clips, clip], clipId: clip.id })); setSelectedClipId(clip.id); }}>Add demo clip</button>
        </section>
        <section className="card"><h3>Text overlay</h3>
          <label>Text<input value={project.overlayText} onChange={(e) => setProject({ ...project, overlayText: e.target.value })} /></label>
          <label>Color<input type="color" value={project.overlayColor} onChange={(e) => setProject({ ...project, overlayColor: e.target.value })} /></label>
          <label>Font size<input type="range" min="18" max="96" value={project.overlayFontSize} onChange={(e) => setProject({ ...project, overlayFontSize: Number(e.target.value) })} /></label>
        </section>
        <section className="card"><h3>Export</h3><div className="metrics"><div><span>Clips</span><strong>{project.clips.length}</strong></div><div><span>Duration</span><strong>{formatTime(totalDuration)}</strong></div></div><button className="primary full" onClick={exportProject}>Export JSON</button></section>
      </aside>

      <main className="workspace">
        <section className="panel preview-panel"><div className="section-header"><div><span className="kicker">Preview</span><h2>{project.projectName}</h2></div><span className="status-pill">{status}</span></div>
          <div className="stage">{selectedClip?.url ? <video src={selectedClip.url} controls playsInline /> : <div className="empty-stage"><p>No source video loaded.</p><small>Upload a clip or add a demo clip to preview your edit.</small></div>}<div className="stage-overlay" style={{ color: project.overlayColor, fontSize: `${project.overlayFontSize}px` }}>{project.overlayText || 'Your title'}</div></div>
        </section>
        <section className="panel timeline-panel"><div className="section-header"><div><span className="kicker">Timeline</span><h3>Sequence</h3></div><span className="meta">Drag cards to reorder</span></div>
          <div className="timeline-list">{project.clips.length === 0 ? <div className="empty-state">Your timeline is empty.</div> : project.clips.map((clip, index) => <div key={clip.id} className={`timeline-item ${selectedClipId === clip.id ? 'selected' : ''} ${dropTargetId === clip.id ? 'drop-target' : ''}`} draggable onClick={() => selectClip(clip.id)} onDragStart={(e) => handleDragStart(e, clip.id)} onDragOver={(e) => { e.preventDefault(); setDropTargetId(clip.id); }} onDragLeave={() => setDropTargetId(null)} onDrop={(e) => handleDrop(e, clip.id)} onDragEnd={() => { setDraggedClipId(null); setDropTargetId(null); }}>
            <div className="clip-summary"><div className="clip-title"><span className="drag-handle" aria-hidden="true">⋮⋮</span><div><strong>{index + 1}. {clip.name}</strong><small>{clip.url ? 'Uploaded' : 'Demo clip'} · {formatTime(clip.trimEnd - clip.trimStart)}</small></div></div><div className="clip-actions"><button className="icon-btn" disabled={index === 0} onClick={(e) => { e.stopPropagation(); moveClip(clip.id, -1); }}>↑</button><button className="icon-btn" disabled={index === project.clips.length - 1} onClick={(e) => { e.stopPropagation(); moveClip(clip.id, 1); }}>↓</button><button className="delete-btn" onClick={(e) => { e.stopPropagation(); removeClip(clip.id); }}>Remove</button></div></div>
            <div className="trim-group"><label>Start<input type="range" min="0" max={clip.duration} step="0.1" value={clip.trimStart} onChange={(e) => updateTrim(clip.id, 'trimStart', Number(e.target.value))} /><span>{formatTime(clip.trimStart)}</span></label><label>End<input type="range" min="0" max={clip.duration} step="0.1" value={clip.trimEnd} onChange={(e) => updateTrim(clip.id, 'trimEnd', Number(e.target.value))} /><span>{formatTime(clip.trimEnd)}</span></label></div>
          </div>)}</div>
        </section>
      </main>
    </div>
  );
}

export default App;
