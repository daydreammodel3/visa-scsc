func bubbleSort(_ data: inout [Int]) {
    for i in stride(from: data.count - 1, through: 1, by: -1) { // ⟦outer⟧
        for j in 0..<i { // ⟦inner⟧
            if data[j] > data[j + 1] { // ⟦cmp⟧
                data.swapAt(j, j + 1) // ⟦swap⟧
            }
        }
    }
}

var data = [5, 3, 8, 1, 6, 2]
bubbleSort(&data)
print(data.map(String.init).joined(separator: " "))
