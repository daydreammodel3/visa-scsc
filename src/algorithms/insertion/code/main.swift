func insertionSort(_ data: inout [Int]) {
    for i in 1..<data.count { // ⟦outer⟧
        let key = data[i] // ⟦key⟧
        var j = i - 1 // ⟦key⟧
        while j >= 0 && data[j] > key { // ⟦cmp⟧
            data[j + 1] = data[j] // ⟦shift⟧
            j -= 1 // ⟦shift⟧
        }
        data[j + 1] = key // ⟦insert⟧
    }
}

var data = [5, 3, 8, 1, 6, 2]
insertionSort(&data)
print(data.map(String.init).joined(separator: " "))
