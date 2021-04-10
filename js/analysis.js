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



  function getCompsFromBackend(n, k) {
    const params = "students="+n+"&grades="+k;
    const url = "http://localhost:8080/ping";
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        "students": n,
        "grades": k
      })
    }).then(
      response => response.text()
    ).then(
      html => console.log(html)
    );
  }
  
  function getCompositions() {
    let n = document.getElementById('number-students').value;
    let k = document.getElementById('number-grades').value;
    console.log("Computing weak compositions of " + n + " into " + k + " parts.");
    getCompsFromBackend(n, k);
    /*
    console.log("in analysis");
    const n = document.getElementById("number-students-output").value;
    const k = document.getElementById("number-grades-output").value;
    compositions(parseInt(n), parseInt(k));
    */
  }