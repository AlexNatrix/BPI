import moment from "moment";
import { PriceModel } from "../Models/Price.ts";

interface TimeInterval {
  from: string;
  to: string;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class BPIservice {
  validate(timeInterval: TimeInterval): boolean {
    const { from, to } = timeInterval;
    if (!from || !to) {
      return false;
    }
    if (
      !moment(from, moment.ISO_8601, true).isValid() ||
      !moment(to, moment.ISO_8601, true).isValid() ||
      moment(to, moment.ISO_8601, true).isBefore(
        moment(from, moment.ISO_8601, true)
      )
    ) {
      return false;
    }
    return true;
  }
  async get(timeInterval: TimeInterval) {
    if (!this.validate(timeInterval)) {
      throw new ValidationError(
        "Sorry, but your specified start date is invalid. Please check and try again."
      );
    }
    const { from, to } = timeInterval;
    const priceData = await PriceModel.find({
      timestamp: {
        $gte: moment(from, moment.ISO_8601, true).toDate(),
        $lte: moment(to, moment.ISO_8601, true).add(1, "days").toDate(),
      },
    }).select("-_id -__v");
    return priceData;
  }
}

export const bpiService = new BPIservice();
