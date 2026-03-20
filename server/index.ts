import express from 'express';
import cors from 'cors';
import { availabilityRouter } from './routes/availability';
import { bookRouter } from './routes/book';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', availabilityRouter);
app.use('/api', bookRouter);

app.listen(PORT, () => {
  console.log(`[Server] API running on http://localhost:${PORT}`);
});
