func quickSort(_ data: inout [Int], _ left: Int, _ right: Int) { // ⟦call⟧
    if left < right { // ⟦base⟧
        let p = partition(&data, left, right) // ⟦part,pdone⟧
        quickSort(&data, left, p - 1) // ⟦recL⟧
        quickSort(&data, p + 1, right) // ⟦recR⟧
    }
}

func partition(_ data: inout [Int], _ left: Int, _ right: Int) -> Int { // ⟦pcall⟧
    let pivot = data[right] // ⟦pivot⟧
    var i = left - 1 // ⟦pivot⟧
    for j in left..<right { // ⟦pcmp⟧
        if data[j] <= pivot { // ⟦pcmp⟧
            i += 1 // ⟦pswap⟧
            data.swapAt(i, j) // ⟦pswap⟧
        }
    }
    data.swapAt(i + 1, right) // ⟦pfinal⟧
    return i + 1 // ⟦pret⟧
}

var data = [5, 3, 8, 1, 6, 2]
quickSort(&data, 0, data.count - 1)
print(data.map(String.init).joined(separator: " "))
