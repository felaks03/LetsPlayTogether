import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from './routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send("Backend funcionando");
});

app.use('/api', routes);

export default app;
