import axios from "axios";
import logging from "./config/logging";
// import generateFakeData from "./faker2";
const URI = "http://localhost:3001";
const NAMESPACE = "axios test";
logging.info(NAMESPACE, "testStart");

const axiosCall = async (): Promise<void> => {
	// logging.info(NAMESPACE, "client api call");
	// try {
	// 	const response = await axios.get<any>(`${URI}/blog`);
	// 	logging.info(NAMESPACE, "data", response.data?.blog[0]);
	// } catch (error) {
	// 	console.error(error);
	// }
	// await generateFakeData(30, 10, 1000);
};

axiosCall();
