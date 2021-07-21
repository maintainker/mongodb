import { Router } from "express";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { Blog, User } from "../models";
import logging from "../config/logging";
import commentRouter from "./commentRouter";

const blogRouter = Router();

blogRouter.use("/:blogId/comment", commentRouter);

blogRouter.post("/", async (req: Request, res: Response) => {
	try {
		const { title, content, islive, userId } = req.body;
		logging.info("POST /blog", "api is called");

		//validation check
		if (typeof title !== "string")
			throw {
				status: 400,
				message: "title is required"
			};
		if (typeof content !== "string")
			throw {
				status: 400,
				message: "content is required"
			};
		if (islive && typeof islive !== "boolean")
			throw { status: 400, message: "islive in invalid" };
		if (!isValidObjectId(userId))
			throw { status: 400, message: "userId is invalid" };
		const user = await User.findById(userId);
		if (!user) throw { status: 400, message: "user doesn't exist" };
		logging.info("POST /blog", "validation checked");

		//blog doc create
		const blog = new Blog({ ...req.body, user });
		await blog.save();
		logging.info("POST /blog", "blog is created");
		return res.status(201).send({ success: true, blog });
	} catch (error) {
		logging.error("POST /blog", error.message);
		return res.status(error.status || 500).send({ err: error.message });
	}
});

blogRouter.get("/", async (req: Request, res: Response) => {
	try {
		logging.info("GET /blog", "api is called");
		const blog = await Blog.find().limit(20).populate({ path: "user" });
		logging.info("GET /blog", "blogs is getted");

		return res.send({ blog });
	} catch (error) {
		logging.error("GET /blog", error.message);
		return res.status(error.status || 500).send({ err: error.message });
	}
});

blogRouter.get("/:blogId", async (req: Request, res: Response) => {
	try {
		//생성용
		logging.info("GET /blog/:blogId", "api is called");
		const { blogId } = req.params;
		if (!isValidObjectId(blogId))
			throw { status: 400, message: "invalid blogId" };
		const blog = await Blog.findById({ _id: blogId });
		logging.info("GET /blog/:blogId", "blog is getted");
		return res.send({ blog });
	} catch (error) {
		logging.error("GET /blog/:blogId", error.message);
		return res.status(error.status || 500).send({ err: error.message });
	}
});

blogRouter.put("/:blogId", async (req: Request, res: Response) => {
	try {
		//생성용
		const { title, content } = req.body;
		const { blogId } = req.params;
		logging.info("PUT /blog", "api is called");

		//validation check
		if (typeof title !== "string")
			throw {
				status: 400,
				message: "title is required"
			};
		if (typeof content !== "string")
			throw {
				status: 400,
				message: "content is required"
			};
		const blog = await Blog.findById(blogId);
		if (!isValidObjectId(blogId))
			throw { status: 400, message: "invalid blogId" };
		if (!blog) throw { status: 400, message: "blog doesn't exist" };
		logging.info("PUT /blog", "validation checked");

		await blog.update({ title, content }, { new: true });
		logging.info("PUT /blog", "blog is saved");
		return res.status(201).send({ success: true, blog });
	} catch (error) {
		logging.error("PUT /blog/:blogId", error.message);
		return res.status(error.status || 500).send({ err: error.message });
	}
});

blogRouter.patch("/:blogId", async (req: Request, res: Response) => {
	try {
		//생성용
		const { blogId } = req.params;
		const { islive } = req.body;
		if (!isValidObjectId(blogId))
			throw { status: 400, message: "invalid blogId" };
		if (typeof islive !== "boolean")
			throw { status: 400, message: "invalid islive parameter" };
		const blog = await Blog.findByIdAndUpdate(
			blogId,
			{ islive },
			{ new: true }
		);
		return res.status(201).send({ success: true, blog });
	} catch (error) {
		logging.error("PATCH /blog/:blogId", error.message);
		return res.status(error.status || 500).send({ err: error.message });
	}
});

export default blogRouter;
