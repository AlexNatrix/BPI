import moment from "moment";
import { Price, PriceModel } from "../Models/Price.ts";
import { Request, Response } from "express";
import { ValidationError, bpiService } from "../Services/BPIservice.ts";
import { logger } from "../logger.ts";

interface TimeInterval {
  from: string;
  to: string;
}

class bpiController {
  async get(req: Request<{}, {}, {}, TimeInterval>, res: Response) {
    try {
      const price = await bpiService.get(req.query);
      return res.json(price);
    } catch (e) {
      switch (true) {
        case e instanceof ValidationError:
          logger.log("http", `URL:${req.url} status:400`);
          res.status(400).json(e);
          break;
        default:
          logger.log("http", `URL:${req.url} status:500`);
          res.status(500).json(e);
          break;
      }
    }
  }
}

export const BPIController = new bpiController();
