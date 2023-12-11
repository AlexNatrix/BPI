<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref } from "vue";
import { createChart } from "lightweight-charts";
import { DateTime } from "ts-luxon"
/*
 * There are example components in both API styles: Options API, and Composition API
 *
 * Select your preferred style from the imports below:
 */
import LWChart from "./components/LWChart.vue";


const chartOptions = ref({});
const data = ref([{open: 42321.169, high: 42321.169, low: 42321.169, close: 42321.169, time: 1201021020}]);
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
  ]
};





const from = ref(new Date())
const to = ref(new Date())
const dateTo= ref('');
const dateFrom= ref('');
const isLoading=ref(false)

const setIntervalMonth=()=>{
  to.value=DateTime.fromJSDate(from.value).minus({months:1}).toJSDate()
}

const customDateFromQue= async()=>{
  if (dateTo.value!=="" && dateFrom.value!==""){
    isLoading.value=true
    setTimeout(()=>"",5000)
    const response  = await fetch(`http://localhost:5000/api/bpi?from=${dateFrom.value}&to=${dateTo.value}`)
    const priceData  = await response.json()
  const newData = (priceData as Array<{timestamp:string,price:number}>)
 const rawSeries = newData.map((a,i)=>{
  const b = newData[i+1]
  isLoading.value=false
  return i<newData.length-1&&a.price&&b.price?
   {open: a.price,
    high: a.price>b.price?a.price:b.price, 
    low: a.price>b.price?b.price:a.price, 
    close: b.price,
    time: DateTime.fromISO(a.timestamp).toSeconds()
  }:{
    open: a.price,
    high: a.price, 
    low: a.price,
    close: a.price,
    time: DateTime.fromISO(a.timestamp).toSeconds()
  }
 })

  data.value=rawSeries

  lwChart.value.fitContent();
  }
}
const setIntervalWeek=()=>{
  to.value=DateTime.fromJSDate(from.value).minus({week:1}).toJSDate()
}

const setIntervalDay=()=>{
  to.value=DateTime.fromJSDate(from.value).minus({day:1}).toJSDate()
}



watchEffect(async fetchData => {
  fetchData(() => {
    /* ... */
  }) // we register cleanup function before Promise resolves
  isLoading.value=true
  const response  = await fetch(`http://localhost:5000/api/bpi?from=${DateTime.fromJSDate(to.value).toISODate()}&to=${DateTime.fromJSDate(from.value).toISODate()}`)
  const priceData  = await response.json()
  const newData = (priceData as Array<{timestamp:string,price:number}>)
 const rawSeries = newData.map((a,i)=>{
  const b = newData[i+1]
  isLoading.value=false
  return i<newData.length-1&&a.price&&b.price?
   {open: a.price,
    high: a.price>b.price?a.price:b.price, 
    low: a.price>b.price?b.price:a.price, 
    close: b.price,
    time: DateTime.fromISO(a.timestamp).toSeconds()
  }:{
    open: a.price,
    high: a.price, 
    low: a.price,
    close: a.price,
    time: DateTime.fromISO(a.timestamp).toSeconds()
  }
 })

  data.value=rawSeries

  lwChart.value.fitContent();
})

// const changeData = () => {
//   const candlestickTypeData = ["candlestick", "bar"].includes(chartType.value);
//   const newData = generateSampleData(candlestickTypeData);
//   data.value = newData;
//   if (chartType.value === "baseline") {
//     const average =
//       newData.reduce((s, c) => {
//         return s + c.value;
//       }, 0) / newData.length;
//     seriesOptions.value = { baseValue: { type: "price", price: average } };
//   }
// };
const timeScaleOptionsNow = {
  timeVisible:true
}
// const changeType = () => {
//   const types = [
//     "line",
//     "area",
//     "baseline",
//     "histogram",
//     "candlestick",
//     "bar",
//   ].filter((t) => t !== chartType.value);
//   const randIndex = Math.round(Math.random() * (types.length - 1));
//   chartType.value = types[randIndex];
//   changeData();


const dur= 10000000
</script>

<template>
  <NuxtLayout class="chart-container">
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
      <button type="button" @click="setIntervalMonth">Month ago</button>
      <button type="button" @click="setIntervalWeek">Week ago</button>
      <button type="button" @click="setIntervalDay">Tomorrow</button>
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
</NuxtLayout>
</template>
<style scoped src="./style.css"></style>
