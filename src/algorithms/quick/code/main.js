function quickSort(data, left, right) { // ⟦call⟧
  if (left < right) { // ⟦base⟧
    const p = partition(data, left, right); // ⟦part,pdone⟧
    quickSort(data, left, p - 1); // ⟦recL⟧
    quickSort(data, p + 1, right); // ⟦recR⟧
  }
}

function partition(data, left, right) { // ⟦pcall⟧
  const pivot = data[right]; // ⟦pivot⟧
  let i = left - 1; // ⟦pivot⟧
  for (let j = left; j < right; j++) { // ⟦pcmp⟧
    if (data[j] <= pivot) { // ⟦pcmp⟧
      i++; // ⟦pswap⟧
      [data[i], data[j]] = [data[j], data[i]]; // ⟦pswap⟧
    }
  }
  [data[i + 1], data[right]] = [data[right], data[i + 1]]; // ⟦pfinal⟧
  return i + 1; // ⟦pret⟧
}

const data = [5, 2, 7, 1, 6, 3];
quickSort(data, 0, data.length - 1);
console.log(data.join(" "));
