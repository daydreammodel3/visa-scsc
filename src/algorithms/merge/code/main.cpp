#include <iostream>
#include <vector>

void mergeSort(std::vector<int>& data, std::vector<int>& tmp, int left, int right) { // ⟦call⟧
    if (left >= right) { // ⟦base⟧
        return; // ⟦leaf⟧
    }
    int mid = (left + right) / 2; // ⟦mid⟧
    mergeSort(data, tmp, left, mid); // ⟦recL⟧
    mergeSort(data, tmp, mid + 1, right); // ⟦recR⟧
    int i = left; // ⟦mstart⟧
    int j = mid + 1; // ⟦mstart⟧
    int k = left; // ⟦mstart⟧
    while (i <= mid && j <= right) { // ⟦mcmp⟧
        if (data[i] <= data[j]) { // ⟦mcmp⟧
            tmp[k] = data[i]; // ⟦takeL⟧
            i++; // ⟦takeL⟧
        } else {
            tmp[k] = data[j]; // ⟦takeR⟧
            j++; // ⟦takeR⟧
        }
        k++; // ⟦takeL,takeR⟧
    }
    while (i <= mid) { // ⟦restL⟧
        tmp[k] = data[i]; // ⟦restL⟧
        i++; // ⟦restL⟧
        k++; // ⟦restL⟧
    }
    while (j <= right) { // ⟦restR⟧
        tmp[k] = data[j]; // ⟦restR⟧
        j++; // ⟦restR⟧
        k++; // ⟦restR⟧
    }
    for (k = left; k <= right; k++) { // ⟦copy⟧
        data[k] = tmp[k]; // ⟦copy⟧
    }
}

int main() {
    std::vector<int> data = {5, 3, 8, 1, 6, 2};
    std::vector<int> tmp(data.size());
    mergeSort(data, tmp, 0, (int)data.size() - 1);
    for (std::size_t k = 0; k < data.size(); k++) {
        std::cout << (k ? " " : "") << data[k];
    }
    std::cout << std::endl;
}
