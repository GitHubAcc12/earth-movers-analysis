const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function initialize() {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, false);
  }
  
  function resizeCanvas() {
    canvas.width = (3 * window.innerWidth) / 4;
    canvas.height = window.innerHeight / 2;
    canvas.setAttribute("align", "center");
  }

  initialize();

  function getCompositions() {
    console.log("in analysis");
    const n = document.getElementById("number-students-output").value;
    const k = document.getElementById("number-grades-output").value;
    compositions(parseInt(n), parseInt(k));
  }