import mongoose, { NumberSchemaDefinition } from "mongoose";

export type Price = {
  timestamp: Date;
  price: Number;
  metadata: {
    symbol: String;
  };
};

export const PriceSchema = new mongoose.Schema(
  {
    timestamp: Date,
    price: Number,
    metadata: {
      symbol: String,
    },
  },
  {
    timeseries: {
      timeField: "timestamp",
      metaField: "metadata",
      granularity: "seconds",
    },
  }
);

export const PriceModel = mongoose.model("PriceSchema", PriceSchema);

// {
//     "time": ISODate("20210701T13:00:01.343"),
//     "symbol": "BTC-USD",
//     "price": 33451.33
//  }
