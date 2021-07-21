import { blogTypes } from "../../models";

export interface output {
	success: boolean;
	error?: string;
	message?: string;
}

export interface BlogOutput extends output {
	blog: blogTypes & { _id: string };
}
