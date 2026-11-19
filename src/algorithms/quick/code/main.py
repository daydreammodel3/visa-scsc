def quick_sort(data, left, right):  # ⟦call⟧
    if left < right:  # ⟦base⟧
        p = partition(data, left, right)  # ⟦part,pdone⟧
        quick_sort(data, left, p - 1)  # ⟦recL⟧
        quick_sort(data, p + 1, right)  # ⟦recR⟧


def partition(data, left, right):  # ⟦pcall⟧
    pivot = data[right]  # ⟦pivot⟧
    i = left - 1  # ⟦pivot⟧
    for j in range(left, right):  # ⟦pcmp⟧
        if data[j] <= pivot:  # ⟦pcmp⟧
            i += 1  # ⟦pswap⟧
            data[i], data[j] = data[j], data[i]  # ⟦pswap⟧
    data[i + 1], data[right] = data[right], data[i + 1]  # ⟦pfinal⟧
    return i + 1  # ⟦pret⟧


data = [5, 2, 7, 1, 6, 3]
quick_sort(data, 0, len(data) - 1)
print(*data)
