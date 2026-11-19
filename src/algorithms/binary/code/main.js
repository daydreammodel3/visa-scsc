function binarySearch(data, target) {
  let low = 0; // ⟦init⟧
  let high = data.length - 1; // ⟦init⟧
  while (low <= high) { // ⟦loop⟧
    const mid = Math.floor((low + high) / 2); // ⟦mid⟧
    if (data[mid] === target) { // ⟦cmp⟧
      return mid; // ⟦found⟧
    } else if (data[mid] < target) { // ⟦lt⟧
      low = mid + 1; // ⟦right⟧
    } else {
      high = mid - 1; // ⟦left⟧
    }
  }
  return -1; // ⟦notfound⟧
}

const data = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
console.log(binarySearch(data, 23));
