import express, { Request, Response } from "express";
import config from "./config/config";
import logging from "./config/logging";
import mongoose from "mongoose";
import { userRouter, blogRouter } from "./routes";
import generateFakeData from "./faker2";

const MONGO_PW = "WjFrozxjNvRcA0be";
const MONGO_NAME = "blogService";
const MONGO_URI = `mongodb+srv://admin:${MONGO_PW}@tutorial.ff5mx.mongodb.net/${MONGO_NAME}?retryWrites=true&w=majority`;

const NAMESPACE = "app";

interface user {
	name: string;
	age: number;
}

const openServer = async () => {
	try {
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		});
		logging.info(NAMESPACE, `mongoDB is connected`);
		const app = express();

		app.use(express.json());

		app.get("/", (req: Request, res: Response) => {
			return res.send("hello world123");
		});

		app.use("/user", userRouter);
		app.use("/blog", blogRouter);
		app.listen(config.server.port, async () => {
			logging.info(NAMESPACE, `server listen on port:${config.server.port}`);
			// await generateFakeData(10, 1, 10);
		});
	} catch (error) {
		logging.error(NAMESPACE, error);
	}
};

openServer();
