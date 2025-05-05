
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routers/auth_routers';
import postRoutes from './routers/post_routers';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api', postRoutes);


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;