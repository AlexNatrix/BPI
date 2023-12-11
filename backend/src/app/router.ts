import { Router } from "express";
import { BPIController } from "./Controllers/BPIController.ts";
import { logger } from "./logger.ts";


export const router = Router();

router.use(function timeLog(req, res, next) {
  logger.log("http", `METHOD:${req.method} URL:${req.url}`);
  next();
});

router.get("/bpi", BPIController.get);
