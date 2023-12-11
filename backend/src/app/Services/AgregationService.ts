import moment from "moment";
import { PriceModel } from "../Models/Price.ts";
import axios from "axios";
import { json } from "express";
import { logger } from "../logger.ts";
import { bootstrap } from "../BootStrapData.ts";

type AgregatorConfig = {
  timeOut: String;
};

class AgregationService {
  timeout: String;
  constructor(config: AgregatorConfig) {
    this.timeout = config.timeOut;
  }
  async init() {
    const lower = await PriceModel.find()
      .sort({ timestamp: 1 })
      .limit(1)
      .select("timestamp")
      .then((res) =>
        res[0].timestamp ? new Date(res[0].timestamp) : new Date()
      )
      .catch((e) => {
        logger.log("warn", e);
        return new Date();
      });
    const initialData = bootstrap
      .filter((p) => moment(p.x).isBefore(moment(lower)))
      .map((p) => {
        return {
          timestamp: moment(p.x).toISOString(),
          metadata: {
            symbol: "BTC-USD",
          },
          price: p.y,
        };
      });
    await PriceModel.insertMany(initialData);
    logger.log("info", `Boostraped ${initialData.length} entries`);
  }
  async agregate(source: URL) {
    try{
      const instance = axios.create({
        baseURL: `https://${source.hostname}`,
        timeout: +this.timeout,
      });
  
      instance.interceptors.request.use((request) => {
        logger.log(
          "http",
          `Request method:${request.method} URL:${request.baseURL}/${request.url}`
        );
        return request;
      });
  
      instance.interceptors.response.use((response) => {
        logger.log(
          "http",
          `Response:${response.config.baseURL} status:${response.status}${response.statusText}`
        );
        return response;
      });
      const data = await instance.get(source.pathname).then((res) => res.data);
  
      const isPresent = await PriceModel.findOne({
        timestamp: data.time.updatedISO,
      });
      if (!isPresent) {
        await PriceModel.create({
          timestamp: data.time.updatedISO,
          metadata: {
            symbol: "BTC-USD",
          },
          price: data.bpi.USD.rate_float,
        });
      }
    }catch(e){
      logger.log("warn",e)
    }
  }
}

export const agregationService = new AgregationService({
  timeOut: process.env.AGREGATOR_TIMEOUT || "5000",
});
