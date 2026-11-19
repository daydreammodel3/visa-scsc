function bubbleSort(data) {
  for (let i = data.length - 1; i >= 1; i--) { // ⟦outer⟧
    for (let j = 0; j < i; j++) { // ⟦inner⟧
      if (data[j] > data[j + 1]) { // ⟦cmp⟧
        [data[j], data[j + 1]] = [data[j + 1], data[j]]; // ⟦swap⟧
      }
    }
  }
}

const data = [5, 3, 8, 1, 6, 2];
bubbleSort(data);
console.log(data.join(" "));
