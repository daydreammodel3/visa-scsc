def bubble_sort(data):
    for i in range(len(data) - 1, 0, -1):  # ⟦outer⟧
        for j in range(i):  # ⟦inner⟧
            if data[j] > data[j + 1]:  # ⟦cmp⟧
                data[j], data[j + 1] = data[j + 1], data[j]  # ⟦swap⟧


data = [5, 3, 8, 1, 4]
bubble_sort(data)
print(*data)
