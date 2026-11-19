function linearSearch(data, target) {
  for (let i = 0; i < data.length; i++) { // ⟦loop⟧
    if (data[i] === target) { // ⟦cmp⟧
      return i; // ⟦found⟧
    }
  }
  return -1; // ⟦notfound⟧
}

const data = [7, 3, 9, 4, 6, 2];
console.log(linearSearch(data, 4));
