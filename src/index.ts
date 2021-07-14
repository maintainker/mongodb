import express, { Request, Response } from "express";
import config from "./config/config";
import logging from "./config/logging";

const NAMESPACE = 'app'

const app = express();
app.get("/",(req:Request,res:Response)=>{
  return res.send("hello world123")
})

app.listen(config.server.port,()=>{
  logging.info(NAMESPACE,`server listen on port:${config.server.port}`)
})