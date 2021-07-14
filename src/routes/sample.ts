import express from 'express';
import logging from '../config/logging';
import controller from "../controllers/sample"
const router = express.Router();
router.use((req,res,next)=>{
  logging.info("SAMPLE/ROUTE",'visited')
})
router.get('/ping',controller.sampleHealthCheck);

export = router;