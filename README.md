# Video Editor App

A browser-based video editing MVP built with React, TypeScript, and Vite. It provides a lightweight local editing workflow for uploading clips, arranging them on a timeline, trimming clips, styling text layers, and exporting project metadata.

## Features

- **Video upload**: Add local video files to the project
- **Timeline editing**: Select, remove, and reorder clips with drag and drop
- **Move controls**: Use up/down controls as an alternative to dragging
- **Trim controls**: Set the start and end points for each clip
- **Video preview**: Preview the selected uploaded clip in the browser
- **Text layers**: Add, select, and remove multiple text layers
- **Text styling**: Customize text, color, size, weight, opacity, letter spacing, alignment, position, and shadow
- **Local project saving**: Save the project to browser local storage
- **JSON export**: Download the project configuration as JSON

> This MVP does not render a final edited video file yet. Export currently downloads the editable project metadata.

## Tech Stack

- React 18
- TypeScript
- Vite
- Browser File and URL APIs
- LocalStorage for project persistence
- Express backend scaffold

## Project Structure

```text
video-editor-app/
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
├── backend/
│   ├── package.json
│   └── server.js
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm
- A modern browser with support for local video playback and `URL.createObjectURL`

## Installation

Clone the repository and install the frontend dependencies:

```bash
git clone https://github.com/yansaaa/video-editor-app.git
cd video-editor-app/frontend
npm install
```

Install the backend dependencies separately if you want to run the API scaffold:

```bash
cd ../backend
npm install
```

## Development

Start the frontend:

```bash
cd frontend
npm run dev
```

The Vite development server will print the local URL, normally `http://localhost:3000`.

Start the backend in a second terminal:

```bash
cd backend
npm run dev
```

The backend runs on `http://localhost:4000` and currently exposes:

- `GET /api/health`
- `POST /api/overlay`

## Usage

1. Open the frontend in your browser.
2. Upload a video or add a demo clip.
3. Select a clip to preview it.
4. Drag timeline cards to reorder them, or use the arrow buttons.
5. Adjust the trim start and end sliders.
6. Add and style text layers in the sidebar.
7. Click **Save** to store the project locally.
8. Click **Export JSON** to download the project configuration.

Uploaded media uses temporary browser object URLs, so video files need to be uploaded again when starting a new browser session. Project metadata is saved locally, but source video files are not uploaded to a server.

## Build

Create a production frontend build with:

```bash
cd frontend
npm run build
```

## Current Limitations

- No final MP4/WebM rendering pipeline
- No server-side media storage
- No audio editing
- Local video object URLs are session-scoped
- Only one selected clip is previewed at a time

## Contributing

Issues and enhancement requests are welcome.

## License

MIT
