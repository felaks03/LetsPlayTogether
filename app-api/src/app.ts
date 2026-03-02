import express from "express";
import cors from "cors";
import routes from "./routes";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get("/", (_req, res) => {
  res.send("Backend funcionando");
});

app.use("/api", routes);

app.use(errorHandler);

export default app;