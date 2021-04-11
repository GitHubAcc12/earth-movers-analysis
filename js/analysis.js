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

function plotGraph(dmatrix) {
  dist_matrix = dmatrix;
  let distance_matrix = JSON.parse(dmatrix);
  let threshold = document.getElementById("distance").value;
  let nodes = getNodesDS(distance_matrix);
  let edges = getEdgesDS(distance_matrix, threshold);
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
  const selectedFile = document.getElementById("file-upload").files;
  if (selectedFile === null) {
    computeDistributionsAndDistanceMatrix();
  } else {
    let reader = new FileReader();
    reader.readAsText(selectedFile[0]);
    reader.onload = function () {
      const inputData = reader.result;
      getDistanceMatrixFromDataFromBackend(inputData);
    };
  }
}
