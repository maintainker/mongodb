import { Schema, model } from "mongoose";

export interface userTypes extends Document {
	_id: string;
	username: string;
	name: { first: string; last: string };
	age: number;
	email: string;
}

const UserSchema = new Schema<userTypes>(
	{
		username: { type: String, required: true, unique: true },
		name: {
			first: { type: String, required: true },
			last: { type: String, required: true }
		},
		age: Number,
		email: String
	},
	{ timestamps: true }
);

const User = model<userTypes>("user", UserSchema);
export default User;
