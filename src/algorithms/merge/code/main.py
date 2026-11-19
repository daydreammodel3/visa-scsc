def merge_sort(data, tmp, left, right):  # ⟦call⟧
    if left >= right:  # ⟦base⟧
        return  # ⟦leaf⟧
    mid = (left + right) // 2  # ⟦mid⟧
    merge_sort(data, tmp, left, mid)  # ⟦recL⟧
    merge_sort(data, tmp, mid + 1, right)  # ⟦recR⟧
    i = left  # ⟦mstart⟧
    j = mid + 1  # ⟦mstart⟧
    k = left  # ⟦mstart⟧
    while i <= mid and j <= right:  # ⟦mcmp⟧
        if data[i] <= data[j]:  # ⟦mcmp⟧
            tmp[k] = data[i]  # ⟦takeL⟧
            i += 1  # ⟦takeL⟧
        else:
            tmp[k] = data[j]  # ⟦takeR⟧
            j += 1  # ⟦takeR⟧
        k += 1  # ⟦takeL,takeR⟧
    while i <= mid:  # ⟦restL⟧
        tmp[k] = data[i]  # ⟦restL⟧
        i += 1  # ⟦restL⟧
        k += 1  # ⟦restL⟧
    while j <= right:  # ⟦restR⟧
        tmp[k] = data[j]  # ⟦restR⟧
        j += 1  # ⟦restR⟧
        k += 1  # ⟦restR⟧
    for k in range(left, right + 1):  # ⟦copy⟧
        data[k] = tmp[k]  # ⟦copy⟧


data = [5, 3, 8, 1, 6, 2]
tmp = [None] * len(data)
merge_sort(data, tmp, 0, len(data) - 1)
print(*data)
