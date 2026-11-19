def linear_search(data, target):
    for i in range(len(data)):  # ⟦loop⟧
        if data[i] == target:  # ⟦cmp⟧
            return i  # ⟦found⟧
    return -1  # ⟦notfound⟧


data = [7, 3, 9, 4, 6, 2]
print(linear_search(data, 4))
