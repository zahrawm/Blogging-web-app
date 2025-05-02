import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import dotenv from 'dotenv';

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: ' Blog API is running' });
})


app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

});




export default app;