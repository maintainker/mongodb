import dotenv from "dotenv";

dotenv.config();

const SERVER_PORT = Number(process.env.SERVER_PORT) || 3001;
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT
}
const config = {
  server: SERVER
}

export default config;