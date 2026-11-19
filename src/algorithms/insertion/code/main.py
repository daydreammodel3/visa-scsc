def insertion_sort(data):
    for i in range(1, len(data)):  # ⟦outer⟧
        key = data[i]  # ⟦key⟧
        j = i - 1  # ⟦key⟧
        while j >= 0 and data[j] > key:  # ⟦cmp⟧
            data[j + 1] = data[j]  # ⟦shift⟧
            j -= 1  # ⟦shift⟧
        data[j + 1] = key  # ⟦insert⟧


data = [4, 7, 2, 9, 1, 5]
insertion_sort(data)
print(*data)
