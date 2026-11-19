func mergeSort(_ data: inout [Int], _ tmp: inout [Int], _ left: Int, _ right: Int) { // ⟦call⟧
    if left >= right { // ⟦base⟧
        return // ⟦leaf⟧
    }
    let mid = (left + right) / 2 // ⟦mid⟧
    mergeSort(&data, &tmp, left, mid) // ⟦recL⟧
    mergeSort(&data, &tmp, mid + 1, right) // ⟦recR⟧
    var i = left // ⟦mstart⟧
    var j = mid + 1 // ⟦mstart⟧
    var k = left // ⟦mstart⟧
    while i <= mid && j <= right { // ⟦mcmp⟧
        if data[i] <= data[j] { // ⟦mcmp⟧
            tmp[k] = data[i] // ⟦takeL⟧
            i += 1 // ⟦takeL⟧
        } else {
            tmp[k] = data[j] // ⟦takeR⟧
            j += 1 // ⟦takeR⟧
        }
        k += 1 // ⟦takeL,takeR⟧
    }
    while i <= mid { // ⟦restL⟧
        tmp[k] = data[i] // ⟦restL⟧
        i += 1 // ⟦restL⟧
        k += 1 // ⟦restL⟧
    }
    while j <= right { // ⟦restR⟧
        tmp[k] = data[j] // ⟦restR⟧
        j += 1 // ⟦restR⟧
        k += 1 // ⟦restR⟧
    }
    for k in left...right { // ⟦copy⟧
        data[k] = tmp[k] // ⟦copy⟧
    }
}

var data = [5, 3, 8, 1, 6, 2]
var tmp = Array(repeating: 0, count: data.count)
mergeSort(&data, &tmp, 0, data.count - 1)
print(data.map(String.init).joined(separator: " "))
