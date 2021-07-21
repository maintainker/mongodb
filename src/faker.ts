import {
	User,
	Blog,
	blogTypes,
	Comment,
	commentTypes,
	userTypes
} from "./models";
import logging from "./config/logging";

const NAMESPACE = "generate fake data";
const generateFakeData = async (
	userCount: number,
	blogCount: number,
	commentCount: number
) => {
	if (userCount < 1) throw new Error("userCount must be plus");
	if (blogCount < 1) throw new Error("userCount must be plus");
	if (commentCount < 1) throw new Error("userCount must be plus");

	const users: userTypes[] = [];
	const blogs: blogTypes[] = [];
	const comments: commentTypes[] = [];
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
	users.map((user) => {
		for (let i = 0; i < blogCount; i++) {
			blogs.push(
				new Blog({
					title: `test blog post ${user.username}_${i}`,
					content: `test blog`,
					islive: i % 2 === 0,
					user
				})
			);
		}
	});
	users.map((user) => {
		const blogsCount = blogs.length;
		for (let i = 0; i < commentCount; i++) {
			const randNum = Math.floor(Math.random() * blogsCount);
			comments.push(
				new Comment({
					content: `test content ${user.username}_${i}`,
					user,
					blog: blogs[randNum]
				})
			);
		}
	});
	logging.info(NAMESPACE, "creating fake data");
	await User.insertMany(users);
	logging.info(NAMESPACE, `${users.length} users is saved`);
	await Blog.insertMany(blogs);
	logging.info(NAMESPACE, `${blogs.length} blogs is saved`);
	await Comment.insertMany(comments);
	logging.info(NAMESPACE, `${comments.length} comments is saved`);

	logging.info(NAMESPACE, "Finished");
};

export default generateFakeData;
