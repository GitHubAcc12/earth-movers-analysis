function recCompositions(n, k, current, all_comps) {
  if (current.length === k && sum(current) === n) {
    console.log("Gottem");
    all_comps.push(current);
  } else {
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
  console.log(all_comps.length);
  console.log('done');
}

function sum(arr) {
  return arr.reduce((v1, v2) => v1 + v2, 0);
}
