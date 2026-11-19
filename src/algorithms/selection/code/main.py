def selection_sort(data):
    n = len(data)
    for i in range(n - 1):  # ⟦outer⟧
        min_index = i  # ⟦setmin⟧
        for j in range(i + 1, n):  # ⟦inner⟧
            if data[j] < data[min_index]:  # ⟦cmp⟧
                min_index = j  # ⟦newmin⟧
        data[i], data[min_index] = data[min_index], data[i]  # ⟦swap⟧


data = [5, 3, 8, 1, 6, 2]
selection_sort(data)
print(*data)
