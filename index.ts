import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as database from "./config/database";

import mainV1Routes from "./api/v1/routes/index.route";
import bodyParser from "body-parser";

dotenv.config();
database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 4000;

// parse application/json
app.use(bodyParser.json());

// cors
const corsOptions = {
  origin: "https://frontend-task-management-sooty.vercel.app", // Thay bằng link frontend thực tế
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Thêm dòng này nếu API của bạn có lưu cookie hoặc token
};
app.use(cors(corsOptions));

mainV1Routes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
