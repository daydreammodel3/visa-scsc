function insertionSort(data) {
  for (let i = 1; i < data.length; i++) { // ⟦outer⟧
    const key = data[i]; // ⟦key⟧
    let j = i - 1; // ⟦key⟧
    while (j >= 0 && data[j] > key) { // ⟦cmp⟧
      data[j + 1] = data[j]; // ⟦shift⟧
      j--; // ⟦shift⟧
    }
    data[j + 1] = key; // ⟦insert⟧
  }
}

const data = [4, 7, 2, 9, 1, 5];
insertionSort(data);
console.log(data.join(" "));
