func linearSearch(_ data: [Int], _ target: Int) -> Int? {
    for i in 0..<data.count { // ⟦loop⟧
        if data[i] == target { // ⟦cmp⟧
            return i // ⟦found⟧
        }
    }
    return nil // ⟦notfound⟧
}

let data = [7, 3, 9, 4, 6, 2]
print(linearSearch(data, 4) ?? -1)
