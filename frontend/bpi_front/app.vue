<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { DateTime } from "ts-luxon";
import LWChart from "./components/LWChart.vue";

const chartOptions = ref({});
const data = ref([
  {
    open: 42321.169,
    high: 42321.169,
    low: 42321.169,
    close: 42321.169,
    time: 1201021020,
  },
]);
const seriesOptions = ref({
  color: "rgb(45, 77, 205)",
});
const chartType = ref("candlestick");
const lwChart = ref();

function randomShade() {
  return Math.round(Math.random() * 255);
}

const randomColor = (alpha = 1) => {
  return `rgba(${randomShade()}, ${randomShade()}, ${randomShade()}, ${alpha})`;
};

const colorsTypeMap = {
  candlestick: [
    ["upColor", 1],
    ["downColor", 1],
    ["borderUpColor", 1],
    ["borderDownColor", 1],
    ["wickUpColor", 1],
    ["wickDownColor", 1],
  ],
};

const from = ref(new Date());
const to = ref(new Date());
const dateTo = ref("");
const dateFrom = ref("");
const config = useRuntimeConfig();

const setIntervalMonth = () => {
  to.value = DateTime.fromJSDate(from.value).minus({ months: 1 }).toJSDate();
};

const customDateFromQue = async () => {
  try {
    const baseUrl = config.public.BASE_URL || `http://localhost:5000`;
    if (dateTo.value !== "" && dateFrom.value !== "") {
      setTimeout(() => "", 5000);
      const response = await fetch(
        `${baseUrl}/api/bpi?from=${dateFrom.value}&to=${dateTo.value}`
      );
      const priceData = await response.json();
      const newData = priceData as Array<{ timestamp: string; price: number }>;
      const rawSeries = newData.map((a, i) => {
        const b = newData[i + 1];
        return i < newData.length - 1 && a.price && b.price
          ? {
              open: a.price,
              high: a.price > b.price ? a.price : b.price,
              low: a.price > b.price ? b.price : a.price,
              close: b.price,
              time: DateTime.fromISO(a.timestamp).toSeconds(),
            }
          : {
              open: a.price,
              high: a.price,
              low: a.price,
              close: a.price,
              time: DateTime.fromISO(a.timestamp).toSeconds(),
            };
      });

      data.value = rawSeries;

      lwChart.value.fitContent();
    }
  } catch (e) {
    console.log(e);
  }
};
const setIntervalWeek = () => {
  to.value = DateTime.fromJSDate(from.value).minus({ week: 1 }).toJSDate();
};

const setIntervalDay = () => {
  to.value = DateTime.fromJSDate(from.value).minus({ day: 1 }).toJSDate();
};

const setIntervalYear = () => {
  to.value = DateTime.fromJSDate(from.value).minus({ year: 1 }).toJSDate();
};

watchEffect(async () => {
  try {
    const baseUrl = config.public.BASE_URL || `http://localhost:5000`;
    const response = await fetch(
      `${baseUrl}/api/bpi?from=${DateTime.fromJSDate(
        to.value
      ).toISODate()}&to=${DateTime.fromJSDate(from.value).toISODate()}`
    );
    const priceData = await response.json();
    const newData = priceData as Array<{ timestamp: string; price: number }>;
    const rawSeries = newData.map((a, i) => {
      const b = newData[i + 1];
      return i < newData.length - 1 && a.price && b.price
        ? {
            open: a.price,
            high: a.price > b.price ? a.price : b.price,
            low: a.price > b.price ? b.price : a.price,
            close: b.price,
            time: DateTime.fromISO(a.timestamp).toSeconds(),
          }
        : {
            open: a.price,
            high: a.price,
            low: a.price,
            close: a.price,
            time: DateTime.fromISO(a.timestamp).toSeconds(),
          };
    });

    data.value = rawSeries;

    lwChart.value.fitContent();
  } catch (e) {
    console.log(e);
  }
});

const timeScaleOptionsNow = {
  timeVisible: true,
};
</script>

<template>
  <div class="chart-container">
    <LWChart
      :timeScaleOptions="timeScaleOptionsNow"
      :type="chartType"
      :data="data"
      :autosize="true"
      :chart-options="chartOptions"
      :series-options="seriesOptions"
      ref="lwChart"
    />
    <div class="panel">
      <button type="button" @click="setIntervalYear">Year ago</button>
      <button type="button" @click="setIntervalMonth">Month ago</button>
      <button type="button" @click="setIntervalWeek">Week ago</button>
      <button type="button" @click="setIntervalDay">Day ago</button>
      <div style="margin-top: 10px">
        <input
          v-model="dateFrom"
          @input="customDateFromQue"
          type="text"
          placeholder="From"
          onfocus="(this.type='date')"
          onblur="(this.type='text')"
        />
        <input
          v-model="dateTo"
          @input="customDateFromQue"
          type="text"
          placeholder="To"
          onfocus="(this.type='date')"
          onblur="(this.type='text')"
        />
      </div>
    </div>
  </div>
</template>
<style scoped src="./style.css"></style>
