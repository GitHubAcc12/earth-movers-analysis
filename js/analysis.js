const canvas = document.getElementById("graph-container");
let network = null;

function initialize() {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, false);
}

function resizeCanvas() {
  canvas.width = (3 * window.innerWidth) / 4;
  canvas.height = window.innerHeight / 2;
  canvas.setAttribute("align", "center");
}

//initialize();

function getCompsFromBackend(n, k) {
  const params = "students=" + n + "&grades=" + k;
  const url = "https://githubacc12.github.io/earth-movers-backend/emd";
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
      color: "#ffebcd"
    }
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

function getCompositions() {
  let n = document.getElementById("number-students").value;
  let k = document.getElementById("number-grades").value;
  console.log("Computing weak compositions of " + n + " into " + k + " parts.");
  getCompsFromBackend(n, k);
  /*
    console.log("in analysis");
    const n = document.getElementById("number-students-output").value;
    const k = document.getElementById("number-grades-output").value;
    compositions(parseInt(n), parseInt(k));
    */
}
