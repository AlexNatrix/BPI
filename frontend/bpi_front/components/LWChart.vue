<script>
import { createChart } from "lightweight-charts";


let series;
let chart;


function getChartSeriesConstructorName(type) {
  return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`;
}


const addSeriesAndData = (type, seriesOptions, data) => {
  const seriesConstructor = getChartSeriesConstructorName(type);
  series = chart[seriesConstructor](seriesOptions);
  series.setData(data);
};


const resizeHandler = (container) => {
  if (!chart || !container) return;
  const dimensions = container.getBoundingClientRect();
  chart.resize(dimensions.width, dimensions.height);
};

export default {
  props: {
    type: {
      type: String,
      default: "line",
    },
    data: {
      type: Array,
      required: true,
    },
    autosize: {
      default: true,
      type: Boolean,
    },
    chartOptions: {
      type: Object,
    },
    seriesOptions: {
      type: Object,
    },
    timeScaleOptions: {
      type: Object,
    },
    priceScaleOptions: {
      type: Object,
    },
  },
  mounted() {
    chart = createChart(this.$refs.chartContainer, this.chartOptions);
    addSeriesAndData(this.type, this.seriesOptions, this.data);

    if (this.priceScaleOptions) {
      chart.priceScale().applyOptions(this.priceScaleOptions);
    }

    if (this.timeScaleOptions) {
      chart.timeScale().applyOptions(this.timeScaleOptions);
    }

    chart.timeScale().fitContent();

    if (this.autosize) {
      window.addEventListener("resize", () =>
        resizeHandler(this.$refs.chartContainer)
      );
    }
  },
  unmounted() {
    if (chart) {
      chart.remove();
      chart = null;
    }
    if (series) {
      series = null;
    }
  },

  watch: {
    autosize(enabled) {
      if (!enabled) {
        window.removeEventListener("resize", () =>
          resizeHandler(this.$refs.chartContainer)
        );
        return;
      }
      window.addEventListener("resize", () =>
        resizeHandler(this.$refs.chartContainer)
      );
    },
    type(newType) {
      if (series && chart) {
        chart.removeSeries(series);
      }
      addSeriesAndData(this.type, this.seriesOptions, this.data);
    },
    data(newData) {
      if (!series) return;
      series.setData(newData);
    },
    chartOptions(newOptions) {
      if (!chart) return;
      chart.applyOptions(newOptions);
    },
    seriesOptions(newOptions) {
      if (!series) return;
      series.applyOptions(newOptions);
    },
    priceScaleOptions(newOptions) {
      if (!chart) return;
      chart.priceScale().applyOptions(newOptions);
    },
    timeScaleOptions(newOptions) {
      if (!chart) return;
      chart.timeScale().applyOptions(newOptions);
    },
  },
  methods: {
    fitContent() {
      if (!chart) return;
      chart.timeScale().fitContent();
    },
    getChart() {
      return chart;
    },
  },
  expose: ["fitContent", "getChart"],
};
</script>

<template>
  <div class="lw-chart" ref="chartContainer"></div>
</template>

<style scoped>
.lw-chart {
  display: block;
  margin: auto;
  margin-top: 3em;
  overflow: visible;
  height: 80vh;
  width: 90vw;
}
</style>
