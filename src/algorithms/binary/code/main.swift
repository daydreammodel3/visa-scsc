func binarySearch(_ data: [Int], _ target: Int) -> Int? {
    var low = 0 // ⟦init⟧
    var high = data.count - 1 // ⟦init⟧
    while low <= high { // ⟦loop⟧
        let mid = (low + high) / 2 // ⟦mid⟧
        if data[mid] == target { // ⟦cmp⟧
            return mid // ⟦found⟧
        } else if data[mid] < target { // ⟦lt⟧
            low = mid + 1 // ⟦right⟧
        } else {
            high = mid - 1 // ⟦left⟧
        }
    }
    return nil // ⟦notfound⟧
}

let data = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(binarySearch(data, 23) ?? -1)
