import express from "express";
import mongoose from "mongoose";
import { router } from "./router.ts";
import { logger } from "./logger.ts";
import { agregationService } from "./Services/AgregationService.ts";
import cors from  "cors"



const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || "mongodb://root:example@mongo:27017/";
const PRICE_API_URL =
  process.env.PRICE_API_URL ||
  "https://api.coindesk.com/v1/bpi/currentprice.json";

const AGREGATION_INTERVAL = parseInt(process.env.AGREGATION_INTERVAL!) || 60000;

const app = express();

app.use(express.json());
app.use(cors())
app.use("/api", router);

async function connectToDatabase() {
  // return connection property from mongoose.connect call
  return (await mongoose.connect(DB_URL)).connection
}

const connectToDB = ()=>{
  mongoose.connect(DB_URL,{
    serverSelectionTimeoutMS: 5000
  }).catch(error => logger.log("error",error))
}


async function startApp() {
  try {
    connectToDB()
    await agregationService.init();
    const agregation = async () => {
      setInterval(async () => {
        await agregationService.agregate(new URL(PRICE_API_URL));
      }, AGREGATION_INTERVAL);
    };
    await agregation();
    app.listen(PORT);
    logger.log("info", `Service started at: ${PORT}`);
  } catch (e) {
    logger.log("error", e);
  }
}

startApp();


