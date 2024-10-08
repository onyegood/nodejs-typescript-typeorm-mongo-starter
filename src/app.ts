import cors from "cors";
import express, { Express } from "express";

import authRoute from "@/routes/AuthRoutes";
import otpRoute from "@/routes/OtpRoutes";
import userRoute from "@/routes/UserRoutes";

const app: Express = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userRoute);
app.use("/api/v1", authRoute);
app.use("/api/v1", otpRoute);

export default app;
