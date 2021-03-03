function recCompositions(n, k, current, all_comps) {
  if (current.length === k && sum(current) === n) {
    console.log("Gottem");
    all_comps.push(current);
  } else { // No mistake -- just very slow. Improve or do on a backend?
    for (let i = 0; i < n - sum(current) + 1; ++i) {
      if (current.length < k) {
        currentCopy = [...current];
        currentCopy.push(i);
        console.log(currentCopy);
        console.log(sum(currentCopy));
        recCompositions(n, k, currentCopy, all_comps);
      }
    }
  }
  return all_comps;
}

function compositions(n, k) {
  console.log("Composition of " + n + " into " + k + " parts");
  console.log("in comps");
  const all_comps = recCompositions(n, k, [], []);
  console.log("Number comps:  " + all_comps.length);
}

function sum(arr) {
  if (arr.length === 0) {
    return 0;
  }
  if (arr.length === 1) {
    return arr[0];
  }
  const reducer = (v1, v2) => v1 + v2;
  return arr.reduce(reducer);
}
