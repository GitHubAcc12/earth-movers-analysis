let chart;
let chartCanvas;
const labels = Array.from(new Array(21), (x, i) => i / 20);

function clearChart() {
  if (chart != null) {
    chart.clear();
    chart.destroy();
    chart = null;
  }
}

function plotHistogram(distance_matrix) {
  clearChart();
  document.getElementById("histogram-wrapper").style.visibility = "visible";
  chartCanvas = document.getElementById("histogram");
  let context = chartCanvas.getContext("2d");

  let hist_list = getDataFormatted(distance_matrix);

  chart = new Chart(context, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Number of Distribution Pairs",
          data: hist_list,
          backgroundColor: "#ffffff",
        },
      ],
    },

    options: {
      maintainAspectRatio: false,
    },
  });
}

function getDataFormatted(distance_matrix) {
  let hist_list = new Array(labels.length).fill(0);
  for (let i = 0; i < distance_matrix.length; ++i) {
    for (let j = i + 1; j < distance_matrix[i].length; ++j) {
      // Find Position in labels
      for (let k = 0; k < labels.length - 1; ++k) {
        if (labels[k] < distance_matrix[i][j] < labels[k + 1]) {
          // Add to last index (have to round somewhere)
          hist_list[k] += 1;
          break;
        }
      }
    }
  }
  return hist_list;
}
