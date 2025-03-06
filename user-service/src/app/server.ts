import express from 'express';
import userRoutes from './user.routes';

const app = express();

app.use(express.json());
app.use('/users', userRoutes);

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
