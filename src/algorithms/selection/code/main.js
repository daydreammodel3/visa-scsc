function selectionSort(data) {
  const n = data.length;
  for (let i = 0; i < n - 1; i++) { // ⟦outer⟧
    let minIndex = i; // ⟦setmin⟧
    for (let j = i + 1; j < n; j++) { // ⟦inner⟧
      if (data[j] < data[minIndex]) { // ⟦cmp⟧
        minIndex = j; // ⟦newmin⟧
      }
    }
    [data[i], data[minIndex]] = [data[minIndex], data[i]]; // ⟦swap⟧
  }
}

const data = [5, 3, 8, 1, 6, 2];
selectionSort(data);
console.log(data.join(" "));
