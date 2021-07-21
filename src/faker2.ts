import axios, { AxiosResponse } from "axios";
import { BlogOutput } from "./@Types/output";
import { User, Blog, Comment, commentTypes, userTypes } from "./models";
import logging from "./config/logging";

const NAMESPACE = "generate2 fake data";
const URI = "http://localhost:3001";
const generateFakeData = async (
	userCount: number,
	blogCount: number,
	commentCount: number
) => {
	if (userCount < 1) throw new Error("userCount must be plus");
	if (blogCount < 1) throw new Error("userCount must be plus");
	if (commentCount < 1) throw new Error("userCount must be plus");

	const users: userTypes[] = [];
	const blogs: Promise<BlogOutput>[] = [];
	const comments: Promise<commentTypes>[] = [];
	const date = new Date();
	const userName = `testuser${date.getFullYear()}${(
		"0" +
		(date.getMonth() + 1)
	).slice(-2)}${("0" + (date.getDate() + 1)).slice(-2)}_`;
	logging.info(NAMESPACE, "preparing fake data");

	for (let i = 0; i < userCount; i++) {
		users.push(
			new User({
				username: userName + i,
				name: {
					first: `testFirst_${i}`,
					last: `testLast_${i}`
				},
				age: Math.floor(Math.random() * 70 + 10),
				email: `testFirst_${i}@test.com`
			})
		);
	}

	logging.info(NAMESPACE, "creating fake data");
	await User.insertMany(users);
	logging.info(NAMESPACE, `${users.length} users is saved`);

	users.map((user) => {
		/*new Blog({
					title: `test blog post ${user.username}_${i}`,
					content: `test blog`,
					islive: i % 2 === 0,
					user
				}) */
		for (let i = 0; i < blogCount; i++) {
			blogs.push(
				axios
					.post<BlogOutput>(`${URI}/blog`, {
						title: `test blog post ${user.username}_${i}`,
						content: `test blog`,
						islive: true,
						userId: user._id
					})
					.then((res) => res.data)
			);
		}
	});
	const newBlogs: BlogOutput[] = await Promise.all(blogs);
	logging.info(NAMESPACE, `${newBlogs.length} blogs is saved`);

	users.map((user) => {
		const blogsCount = blogs.length;
		for (let i = 0; i < commentCount; i++) {
			const randNum = Math.floor(Math.random() * blogsCount);
			/**
				new Comment({
					content: `test content ${user.username}_${i}`,
					user,
					blog: blogs[randNum]
				}) */
			comments.push(
				axios
					.post<{ comment: commentTypes }>(
						`${URI}/blog/${newBlogs[randNum].blog._id}/comment`,
						{
							content: `test content ${user.username}_${i}`,
							userId: user._id,
							blog: newBlogs[randNum]
						}
					)
					.then((res) => res.data.comment)
			);
		}
	});
	logging.info(NAMESPACE, `${comments.length} comments is saved`);

	logging.info(NAMESPACE, "Finished");
};

// generateFakeData(10, 30, 1000);

export default generateFakeData;
