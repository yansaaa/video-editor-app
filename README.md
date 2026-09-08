# Video Editor App

A web-based video editing application built with React and Node.js, featuring timeline editing, video trimming, text overlays, and WebCodecs for efficient video processing.

## Features

- **Timeline Editor**: Arrange and manage video clips on an interactive timeline
- **Trim/Cut**: Cut and trim video segments with frame-accurate control
- **Text Overlays**: Add text layers to your videos with customizable properties
- **WebCodecs**: Client-side video decoding/encoding for better performance
- **Local Storage**: Store your projects and media locally in the browser
- **Export**: Render and download your edited videos

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express
- **Video Processing**: WebCodecs API (browser-based)
- **Storage**: Browser LocalStorage + Optional Server Storage (AWS S3 / Local Disk)

## Project Structure

```
video-editor-app/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── utils/
│   │   └── App.tsx
│   └── package.json
├── backend/            # Node.js/Express server
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.ts
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yansaaa/video-editor-app.git
cd video-editor-app

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Development

```bash
# Terminal 1: Start backend server
cd backend
npm run dev

# Terminal 2: Start React development server
cd frontend
npm start
```

The app will be available at `http://localhost:3000`

## Features in Development

- [ ] Basic React UI setup
- [ ] Timeline component
- [ ] Video player integration
- [ ] Clip management
- [ ] Trim/cut functionality
- [ ] Text overlay system
- [ ] WebCodecs integration
- [ ] Export/render pipeline
- [ ] Local storage persistence
- [ ] Server upload capability

## API Endpoints

Coming soon...

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
