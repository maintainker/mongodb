import { Router } from "express";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import Comment from "../models/Comment";
import logging from "../config/logging";
import { User, Blog } from "../models";

const commentRouter = Router({ mergeParams: true });
const route = "/blog/:blogId/comment";

commentRouter.post("/", async (req: Request, res: Response) => {
	try {
		logging.info(`POST ${route}/`, "api is called");
		const { blogId } = req.params;
		const { userId, content } = req.body;
		if (!isValidObjectId(blogId))
			throw { status: 400, message: "invalid blogId" };

		if (!isValidObjectId(userId))
			throw { status: 400, message: "invalid userId" };
		if (typeof content !== "string")
			throw { status: 400, message: "content is required" };
		const [blog, user] = await Promise.all([
			Blog.findById(blogId),
			User.findById(userId)
		]);

		if (!user) throw { status: 400, message: "User doesn't exist" };
		if (!blog) throw { status: 400, message: "Blog doesn't exist" };
		if (!blog.islive) throw { status: 400, message: "Blog is not available" };
		logging.info(`GET ${route}/:commentId`, "validation checked");

		const comment = new Comment({ content, user, blog });
		await Promise.all([
			comment.save(),
			Blog.updateOne({ _id: blogId }, { $push: { comments: comment } })
		]);

		logging.info(`GET ${route}/:commentId`, "comment is created");

		return res.status(201).send({ success: true, comment });
	} catch (error) {
		logging.error(`GET ${route}/:commentId`, error.message);
		return res.status(error.status || 500).send({ err: error.message });
	}
});

commentRouter.get("/", async (req: Request, res: Response) => {
	try {
		logging.info(`GET ${route}/:commentId`, "api is called");
		const { blogId, commentId } = req.params;

		if (!isValidObjectId(blogId))
			throw { status: 400, message: "invalid blogId" };
		if (!isValidObjectId(commentId))
			throw { status: 400, message: "invalid commentId" };
		const comment = await Comment.findById(commentId);
		if (!comment) throw { status: 400, message: "comment doesn't exist" };

		logging.info(`GET ${route}/:commentId`, "validation checked");

		return res.send({ comment });
	} catch (error) {
		logging.error(`GET ${route}/:commentId`, error.message);
		return res.status(error.status || 500).send({ err: error.message });
	}
});

commentRouter.patch("/:commentId", async (req: Request, res: Response) => {
	try {
		const { commentId } = req.params;
		const { content } = req.body;

		if (typeof content !== "string")
			throw { status: 400, message: "content is invalid" };
		if (!isValidObjectId(commentId))
			throw { status: 400, message: "invalid commentId" };
		const comment = await Comment.findById(commentId);
		if (!comment) throw { status: 400, message: "comment doesn't exist" };
		console.log(commentId);
		const test = await Blog.findOne({ "comments._id": commentId });
		console.log(test);
		const [Res, res2] = await Promise.all([
			comment.updateOne({ content }, { new: true }),
			Blog.findOne({ "comments._id": commentId }),
			Blog.updateOne(
				{ "comments._id": commentId },
				{ "comments.$.content": { content } }
			)
		]);
		console.log("res1:", Res);
		console.log("res2:", res2);
		return res.send({ comment });
	} catch (error) {
		logging.error(`GET ${route}/:commentId`, error.message);
		return res.status(error.status || 500).send({ err: error.message });
	}
});

export default commentRouter;
