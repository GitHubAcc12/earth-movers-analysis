const canvas = document.getElementById("graph-container");
let network = null;
let dist_matrix = null;
const URL = "https://earth-mover-310304.uc.r.appspot.com/";

function initialize() {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, false);
}

function resizeCanvas() {
  canvas.width = (3 * window.innerWidth) / 4;
  canvas.height = window.innerHeight / 2;
  canvas.setAttribute("align", "center");
}

function thresholdSlideInput(val) {
  document.getElementById("distance-output").value = parseFloat(val);
  if (dist_matrix != null) {
    plotGraph(dist_matrix);
  }
}

//initialize();

function getCompositionsAndDistMatrixFromBackend(n, k) {
  const url = URL + "emd";
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      students: n,
      grades: k,
    }),
  })
    .then((response) => response.text())
    .then((html) => plotGraph(html));
}

function plotGraph(dmatrix) {
  dist_matrix = dmatrix;
  console.log("Received Response, starting plot");
  let distance_matrix = JSON.parse(dmatrix);
  let threshold = document.getElementById("distance").value;
  let nodes = getNodesDS(distance_matrix);
  let edges = getEdgesDS(distance_matrix, threshold);
  console.log("Computed nodes and edges.");
  let data = {
    nodes: nodes,
    edges: edges,
  };

  let options = {
    physics: {
      enabled: false,
    },
    layout: {
      improvedLayout: false,
    },
    edges: {
      smooth: false,
    },
    nodes: {
      color: "#ffffff",
      shapeProperties: {
        interpolation: false,
      },
    },
  };
  if (network !== null) {
    network.destroy();
  }
  console.log("Starting to initialize network.");
  network = new vis.Network(canvas, data, options);
  network.stabilize(2000);
}

function getNodesDS(dmatrix) {
  let nodes = [];
  for (let i = 0; i < dmatrix.length; ++i) {
    nodes.push({ id: i, label: "" + i });
  }
  return new vis.DataSet(nodes);
}

function getEdgesDS(dmatrix, threshold) {
  let edges = [];
  for (let i = 0; i < dmatrix.length; ++i) {
    for (let j = i + 1; j < dmatrix.length; ++j) {
      if (dmatrix[i][j] < threshold) {
        edges.push({ from: i, to: j });
      }
    }
  }
  return new vis.DataSet(edges);
}

function computeDistributionsAndDistanceMatrix() {
  let n = document.getElementById("number-students").value;
  let k = document.getElementById("number-grades").value;
  console.log(
    "As distributions, computing all weak compositions of " +
      n +
      " into " +
      k +
      " parts."
  );
  getCompositionsAndDistMatrixFromBackend(n, k);
}
