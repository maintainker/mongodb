import { Schema, model, Types } from "mongoose";
import { CommentSchema, commentTypes } from "../";

export interface blogTypes extends Document {
	title: string;
	content: string;
	islive: boolean;
	user?: {
		_id: string;
		username: string;
		name: { first: string; last: string };
	};
	comments: commentTypes[];
}

const BlogSchema = new Schema<blogTypes>(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		islive: { type: Boolean, required: true, default: false },
		user: {
			_id: { type: Types.ObjectId, required: true, ref: "user" },
			username: { type: String, required: true },
			name: {
				first: { type: String, required: true },
				last: { type: String, required: true }
			}
		},
		comments: { type: [CommentSchema], default: [] }
	},
	{ timestamps: true }
);

const Blog = model<blogTypes>("blog", BlogSchema);

export default Blog;
