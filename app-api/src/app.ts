import express from "express";
import path from "path";
import cors from "cors";
import routes from "./routes";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(requestLogger);

app.get("/", (_req, res) => {
  res.send("Backend funcionando");
});

app.use("/api", routes);

app.use(errorHandler);

export default app;