def binary_search(data, target):
    low = 0  # ⟦init⟧
    high = len(data) - 1  # ⟦init⟧
    while low <= high:  # ⟦loop⟧
        mid = (low + high) // 2  # ⟦mid⟧
        if data[mid] == target:  # ⟦cmp⟧
            return mid  # ⟦found⟧
        elif data[mid] < target:  # ⟦lt⟧
            low = mid + 1  # ⟦right⟧
        else:
            high = mid - 1  # ⟦left⟧
    return -1  # ⟦notfound⟧


data = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(binary_search(data, 23))
