func selectionSort(_ data: inout [Int]) {
    let n = data.count
    for i in stride(from: 0, to: n - 1, by: 1) { // ⟦outer⟧
        var minIndex = i // ⟦setmin⟧
        for j in (i + 1)..<n { // ⟦inner⟧
            if data[j] < data[minIndex] { // ⟦cmp⟧
                minIndex = j // ⟦newmin⟧
            }
        }
        data.swapAt(i, minIndex) // ⟦swap⟧
    }
}

var data = [5, 3, 8, 1, 6, 2]
selectionSort(&data)
print(data.map(String.init).joined(separator: " "))
