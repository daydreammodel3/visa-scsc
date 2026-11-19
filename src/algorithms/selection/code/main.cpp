#include <iostream>
#include <utility>
#include <vector>

void selectionSort(std::vector<int>& data) {
    int n = (int)data.size();
    for (int i = 0; i < n - 1; i++) { // ⟦outer⟧
        int minIndex = i; // ⟦setmin⟧
        for (int j = i + 1; j < n; j++) { // ⟦inner⟧
            if (data[j] < data[minIndex]) { // ⟦cmp⟧
                minIndex = j; // ⟦newmin⟧
            }
        }
        std::swap(data[i], data[minIndex]); // ⟦swap⟧
    }
}

int main() {
    std::vector<int> data = {6, 4, 9, 2, 7, 3};
    selectionSort(data);
    for (std::size_t k = 0; k < data.size(); k++) {
        std::cout << (k ? " " : "") << data[k];
    }
    std::cout << std::endl;
}
