:root {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #edf5ff;
  background: #07131f;
  color-scheme: dark;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  min-height: 100vh;
}

body {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(117, 160, 255, 0.22), transparent 32%),
    linear-gradient(180deg, #07131f 0%, #0a1731 100%);
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  width: min(1400px, calc(100% - 32px));
  margin: 0 auto;
  padding: 28px 0 40px;
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 24px;
}

.panel {
  background: rgba(11, 19, 28, 0.84);
  border: 1px solid rgba(142, 169, 255, 0.16);
  border-radius: 24px;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(12px);
}

.sidebar {
  padding: 20px;
}

.workspace {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.preview-panel, .timeline-panel {
  padding: 20px;
}

.panel-heading,
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.panel-heading h1,
.section-header h2,
.section-header h3 {
  margin: 6px 0 0;
}

.kicker {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9cc1ff;
}

.stack {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: rgba(15, 27, 41, 0.9);
  border: 1px solid rgba(135, 158, 218, 0.18);
  border-radius: 18px;
  padding: 16px;
}

.card h3 {
  margin: 0 0 12px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  color: #c2d4ff;
  font-size: 13px;
}

input[type='text'],
input[type='file'],
input[type='color'],
input[type='range'] {
  width: 100%;
}

input[type='text'] {
  border: 1px solid rgba(124, 150, 201, 0.28);
  border-radius: 10px;
  background: rgba(7, 17, 25, 0.85);
  padding: 11px 12px;
  color: #edf5ff;
}

input[type='color'] {
  min-height: 44px;
  border: 1px solid rgba(124, 150, 201, 0.2);
  border-radius: 10px;
  background: transparent;
}

input[type='range'] {
  accent-color: #77b6ff;
}

.file-picker {
  position: relative;
  overflow: hidden;
  border: 1px dashed rgba(138, 167, 255, 0.4);
  border-radius: 12px;
  background: rgba(79, 104, 135, 0.12);
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 12px;
}

.file-picker input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.file-picker span {
  color: #dfeaff;
  font-weight: 600;
}

.button-row {
  display: flex;
  gap: 10px;
}

button {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 600;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

button.primary {
  background: linear-gradient(135deg, #7aa8ff 0%, #68d5ff 100%);
  color: #061522;
}

button.secondary {
  background: rgba(129, 152, 190, 0.14);
  color: #edf5ff;
  border: 1px solid rgba(131, 153, 190, 0.2);
}

.metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.metrics div {
  background: rgba(7, 17, 25, 0.76);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid rgba(135, 158, 218, 0.14);
}

.metrics span {
  color: #aebfe8;
  font-size: 12px;
}

.status-pill,
.meta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(99, 121, 255, 0.12);
  color: #99c4ff;
  border: 1px solid rgba(143, 171, 255, 0.22);
  font-size: 12px;
}

.stage {
  position: relative;
  margin-top: 18px;
  min-height: 440px;
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(19, 31, 46, 0.45), rgba(11, 18, 27, 0.72)),
    url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
  border: 1px solid rgba(134, 159, 233, 0.2);
  overflow: hidden;
  display: grid;
  place-items: center;
}

.stage video {
  width: 100%;
  height: 100%;
  max-height: 440px;
  object-fit: cover;
  background: rgba(4, 9, 16, 0.9);
}

.empty-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #dfeaff;
  text-align: center;
  padding: 24px;
}

.empty-stage p {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.stage-overlay {
  position: absolute;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  white-space: nowrap;
}

.timeline-list {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.timeline-item {
  background: rgba(8, 17, 26, 0.8);
  border: 1px solid rgba(135, 158, 218, 0.14);
  border-radius: 16px;
  padding: 14px;
  transition: border-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.timeline-item.selected {
  border-color: rgba(118, 182, 255, 0.72);
  box-shadow: inset 0 0 0 1px rgba(118, 182, 255, 0.3);
}

.clip-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.clip-summary strong {
  display: block;
  margin-bottom: 4px;
}

.clip-summary small {
  color: #a8bfe8;
}

.delete-btn {
  background: rgba(255, 93, 93, 0.08);
  color: #ffb7b7;
  border: 1px solid rgba(255, 93, 93, 0.3);
}

.trim-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.trim-group label {
  margin: 0;
}

.trim-group span {
  color: #dceaff;
  font-size: 12px;
  text-align: right;
}

.empty-state {
  padding: 18px;
  border: 1px dashed rgba(138, 167, 255, 0.3);
  border-radius: 16px;
  color: #bfd4ff;
  background: rgba(13, 24, 36, 0.5);
}

.active-clip-box {
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(11, 20, 32, 0.82);
  border: 1px solid rgba(135, 158, 218, 0.15);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.active-clip-box strong {
  font-size: 18px;
}

.active-clip-box small {
  color: #adc0eb;
}

@media (max-width: 980px) {
  .app-shell {
    grid-template-columns: 1fr;
    width: min(100% - 20px, 900px);
  }

  .trim-group {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .panel-heading,
  .section-header,
  .clip-summary,
  .button-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .stage {
    min-height: 320px;
  }
}























































































































































































































