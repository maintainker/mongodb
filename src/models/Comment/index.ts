import { Schema, model, Types } from "mongoose";

export interface commentTypes extends Document {
	_id: string;
	content: string;
	blog: string;
	user: string;
}

export const CommentSchema = new Schema<commentTypes>(
	{
		content: { type: String, required: true },
		user: { type: Types.ObjectId, required: true, ref: "user" },
		blog: { type: Types.ObjectId, required: true, ref: "blog" }
	},
	{ timestamps: true }
);

const Comment = model<commentTypes>("comment", CommentSchema);

export default Comment;
