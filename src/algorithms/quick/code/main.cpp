#include <iostream>
#include <utility>
#include <vector>

int partition(std::vector<int>& data, int left, int right);

void quickSort(std::vector<int>& data, int left, int right) { // ⟦call⟧
    if (left < right) { // ⟦base⟧
        int p = partition(data, left, right); // ⟦part,pdone⟧
        quickSort(data, left, p - 1); // ⟦recL⟧
        quickSort(data, p + 1, right); // ⟦recR⟧
    }
}

int partition(std::vector<int>& data, int left, int right) { // ⟦pcall⟧
    int pivot = data[right]; // ⟦pivot⟧
    int i = left - 1; // ⟦pivot⟧
    for (int j = left; j < right; j++) { // ⟦pcmp⟧
        if (data[j] <= pivot) { // ⟦pcmp⟧
            i++; // ⟦pswap⟧
            std::swap(data[i], data[j]); // ⟦pswap⟧
        }
    }
    std::swap(data[i + 1], data[right]); // ⟦pfinal⟧
    return i + 1; // ⟦pret⟧
}

int main() {
    std::vector<int> data = {5, 2, 7, 1, 6, 3};
    quickSort(data, 0, (int)data.size() - 1);
    for (std::size_t k = 0; k < data.size(); k++) {
        std::cout << (k ? " " : "") << data[k];
    }
    std::cout << std::endl;
}
