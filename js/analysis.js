const canvas = document.getElementById("graph-container");
let network = null;
let dist_matrix = null;
let gpa_dist_matrix = null;
const NODE_COLOR = "#ffffff";
const COMBINED_EDGE_COLOR = "#e34b4b";
const GPA_EDGE_COLOR = "#3895f2";
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

function thresholdNumberInput(val) {
  document.getElementById("distance").value = parseFloat(val);
  if (dist_matrix != null) {
    plotGraph(dist_matrix);
  }
}

//initialize();

function getCompositionsAndDistMatrixFromBackend(n, k) {
  const url = URL + "compositions";
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

function getDistanceMatrixFromDataFromBackend(grades_list) {
  const url = URL + "analyzeData";
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      data: grades_list,
    }),
  })
    .then((response) => response.text())
    .then((html) => plotGraph(html));
}

function plotGraph(backend_response) {
  if (dist_matrix === null) {
    let response = JSON.parse(backend_response);
    dist_matrix = response.emd_distances;
    gpa_dist_matrix = response.gpa_distances;
    plotHistogram(dist_matrix);
  }
  // Show mean and median
  const wrapper = document.getElementById("analysis-wrapper");
  const analyzeGpa = 0; // document.getElementById("analyze-gpa").checked ? 1 : 0;
  wrapper.style.visibility = "visible";
  const mean_output = document.getElementById("mean-output");
  const median_output = document.getElementById("median-output");
  mean_output.value = Math.round(meanEmd(dist_matrix) * 1000) / 1000;
  median_output.value = Math.round(medianEmd(dist_matrix) * 1000) / 1000;

  let threshold = document.getElementById("distance").value;
  let nodes = getNodesDS(dist_matrix);
  let edges = null;
  if (analyzeGpa === 0) {
    edges = getEdgesDS(dist_matrix, threshold);
  } else {
    edges = getCombinedEdges(dist_matrix, gpa_dist_matrix, threshold);
  }
  let data = {
    nodes: nodes,
    edges: edges,
  };

  let options = {
    physics: {
      enabled: true,
      stabilization: {
        enabled: true,
        //iterations: 20000,
      },
    },
    layout: {
      improvedLayout: true,
      randomSeed: "0.26826403120802755:1618885757742",
    },
    edges: {
      smooth: false,
    },
    nodes: {
      color: NODE_COLOR,
      shapeProperties: {
        interpolation: false,
      },
    },
  };
  if (network !== null) {
    network.destroy();
  }
  network = new vis.Network(canvas, data, options);
  //network.stabilize(2000);
  console.log(network.getSeed());
}

function getCombinedEdges(dmatrix1, dmatrix2, threshold) {
  let edges = [];
  for (let i = 0; i < dmatrix1.length; ++i) {
    for (let j = i + 1; j < dmatrix1[i].length; ++j) {
      if (dmatrix1[i][j] <= threshold && dmatrix2[i][j] > threshold) {
        edges.push({ from: i, to: j, color: NODE_COLOR });
      } else if (dmatrix1[i][j] <= threshold && dmatrix2[i][j] <= threshold) {
        edges.push({ from: i, to: j, color: COMBINED_EDGE_COLOR });
      } else if (dmatrix1[i][j] > threshold && dmatrix2[i][j] <= threshold) {
        edges.push({ from: i, to: j, color: GPA_EDGE_COLOR });
      }
    }
  }
  return new vis.DataSet(edges);
}

function medianEmd(dmatrix) {
  // only take upper triangular
  let val_list = [];
  for (let i = 0; i < dmatrix.length; ++i) {
    for (let j = i + 1; j < dmatrix[i].length; ++j) {
      val_list.push(dmatrix[i][j]);
    }
  }
  return median(val_list);
}

function median(values) {
  if (values.length === 0) return 0;

  values.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2) return values[half];

  return (values[half - 1] + values[half]) / 2.0;
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
      if (dmatrix[i][j] <= threshold) {
        edges.push({ from: i, to: j });
      }
    }
  }
  return new vis.DataSet(edges);
}
/* TODO save performance: merge close nodes
function filterDistanceMatrix(dmatrix) {
  // Filter by degree: If out of the n nodes, one has a
  // degree of more than n/4, merge it with all 
  // directly connected vertices (once!)

  const threshold = document.getElementById("distance").value;
  const min_dist = threshold / 2;

  let new_dm = [];
  
  for(let i = 0; i < dmatrix.length; ++i) {
    let new_row = [];
    for (let j = i+1; j < dmatrix[i].length; ++j) {
      if(dmatrix[i][j] < min_dist) {
        for(let k = 0; k < dmatrix[i].length; ++k) {
          new_row.push(Math.min(dmatrix[i][k], dmatrix[j][k]));
        }
      } else {
        new_row = dmatrix[i];
      }
    }
    new_dm.push(new_row);
  }

  // Get rid of i and j! j > i always

  dmatrix.splice(j, 1);
  dmatrix.splice(i, 1);



  return new_dm;
}


function min_dist_exists(dmatrix, min_dist) {
  for(let i = 0; i < dmatrix.length; ++i) {
    for(let j = i+1; j < dmatrix[i].length; ++j) {
      if(dmatrix[i][j] < min_dist) {
        return true;
      }
    }
  }
  return false;
}
*/

function computeDistributionsAndDistanceMatrix() {
  const n = document.getElementById("number-students").value;
  const k = document.getElementById("number-grades").value;

  console.log(
    "As distributions, computing all weak compositions of " +
      n +
      " into " +
      k +
      " parts."
  );
  getCompositionsAndDistMatrixFromBackend(n, k);
}

function analyze() {
  // analyze distance matrix
  dist_matrix = null;
  const selectedFiles = document.getElementById("file-upload").files;
  if (selectedFiles.length === 0) {
    computeDistributionsAndDistanceMatrix();
  } else {
    let reader = new FileReader();
    reader.readAsText(selectedFiles[0]);
    reader.onload = function () {
      const inputData = reader.result;
      getDistanceMatrixFromDataFromBackend(inputData);
    };
  }
}

function meanEmd(dmatrix) {
  let val = 0;
  for (let i = 0; i < dmatrix.length; ++i) {
    for (let j = i + 1; j < dmatrix[i].length; ++j) {
      val += 2 * dmatrix[i][j];
    }
  }
  return val / (dmatrix.length * dmatrix[0].length);
}
