import { Router, Request, Response } from "express";
import logging from "../config/logging";
import { User } from "../models";
import mongoose from "mongoose";

const userRouter = Router();

userRouter.get("/", async (req: Request, res: Response) => {
	try {
		logging.info("GET /user", "api is called");
		const users = await User.find({});
		logging.info("GET /user", "Users is getted");
		return res.send({ users });
	} catch (error) {
		logging.error("GET /user", error.message);
		return res.status(error.status || 500).send({ err: error.message });
	}
});

userRouter.get("/:userId", async (req: Request, res: Response) => {
	const NAMESPACE = "GET /user/:userId";
	try {
		logging.info(NAMESPACE, "api is called");
		if (!mongoose.isValidObjectId(req.params.userId))
			throw {
				status: 400,
				message: "Invalid userId"
			};

		const user = await User.findOne({ _id: req.params.userId });
		logging.info(NAMESPACE, "user is getted");
		console.log(user);
		return res.send(user);
	} catch (error) {
		logging.error(NAMESPACE, error.message);
		return res.status(error.status || 500).send({ err: error.message });
	}
});

userRouter.post("/", async (req: Request, res: Response) => {
	try {
		logging.info("POST /user", "api is called");
		const { username, name } = req.body;

		if (!username) throw { status: 400, message: "username is required" };
		if (!name || !name.first || !name.last)
			throw { status: 400, message: "name is required" };

		const user = new User({ ...req.body });
		await user.save();
		logging.info("POST /user", "user is created");

		return res.send({ user });
	} catch (error) {
		logging.error("POST /user", error.message);
		return res.status(error.status || 500).json({ err: error.message });
	}
});
userRouter.delete("/:userId", async (req: Request, res: Response) => {
	const NAMESPACE = "DELETE /user/:userId";
	try {
		logging.info(NAMESPACE, "api is called");
		if (!mongoose.isValidObjectId(req.params.userId))
			throw {
				status: 400,
				message: "invalid userId"
			};
		const user = await User.findOneAndDelete({ _id: req.params.userId });
		logging.info(NAMESPACE, "user is deleted");
		return res.status(201).send({ success: true });
	} catch (error) {
		logging.error(NAMESPACE, error.message);
		return res.status(error.status || 500).json({ err: error.message });
	}
});
userRouter.put("/:userId", async (req: Request, res: Response) => {
	const NAMESPACE = "PUT /user/:userId";
	try {
		logging.info(NAMESPACE, "api is called");
		if (!mongoose.isValidObjectId(req.params.userId))
			throw {
				status: 400,
				message: "invalid userId"
			};
		const user = await User.findOneAndUpdate({ _id: req.params.userId });
		logging.info(NAMESPACE, "user is deleted");
		return res.status(201).send({ success: true });
	} catch (error) {
		logging.error(NAMESPACE, error.message);
		return res.status(error.status || 500).json({ err: error.message });
	}
});

export default userRouter;
