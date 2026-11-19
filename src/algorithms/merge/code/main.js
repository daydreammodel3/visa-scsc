function mergeSort(data, tmp, left, right) { // ⟦call⟧
  if (left >= right) { // ⟦base⟧
    return; // ⟦leaf⟧
  }
  const mid = Math.floor((left + right) / 2); // ⟦mid⟧
  mergeSort(data, tmp, left, mid); // ⟦recL⟧
  mergeSort(data, tmp, mid + 1, right); // ⟦recR⟧
  let i = left; // ⟦mstart⟧
  let j = mid + 1; // ⟦mstart⟧
  let k = left; // ⟦mstart⟧
  while (i <= mid && j <= right) { // ⟦mcmp⟧
    if (data[i] <= data[j]) { // ⟦mcmp⟧
      tmp[k] = data[i]; // ⟦takeL⟧
      i++; // ⟦takeL⟧
    } else {
      tmp[k] = data[j]; // ⟦takeR⟧
      j++; // ⟦takeR⟧
    }
    k++; // ⟦takeL,takeR⟧
  }
  while (i <= mid) { // ⟦restL⟧
    tmp[k] = data[i]; // ⟦restL⟧
    i++; // ⟦restL⟧
    k++; // ⟦restL⟧
  }
  while (j <= right) { // ⟦restR⟧
    tmp[k] = data[j]; // ⟦restR⟧
    j++; // ⟦restR⟧
    k++; // ⟦restR⟧
  }
  for (k = left; k <= right; k++) { // ⟦copy⟧
    data[k] = tmp[k]; // ⟦copy⟧
  }
}

const data = [6, 3, 8, 1, 5, 2];
const tmp = new Array(data.length);
mergeSort(data, tmp, 0, data.length - 1);
console.log(data.join(" "));
