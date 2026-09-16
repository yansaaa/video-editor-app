import express from 'express';

const app = express();
const port = 4000;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'video-editor-app-backend' });
});

app.post('/api/overlay', (req, res) => {
  const { text = 'Untitled overlay', color, fontSize, opacity, position } = req.body ?? {};

  res.json({
    ok: true,
    message: `Overlay "${text}" accepted for preview`,
    config: {
      text,
      color,
      fontSize,
      opacity,
      position,
    },
  });
});

app.listen(port, () => {
  console.log(`Video editor backend running on http://localhost:${port}`);
});
