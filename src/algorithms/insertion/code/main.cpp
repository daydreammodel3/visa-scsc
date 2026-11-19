#include <iostream>
#include <vector>

void insertionSort(std::vector<int>& data) {
    for (int i = 1; i < (int)data.size(); i++) { // ⟦outer⟧
        int key = data[i]; // ⟦key⟧
        int j = i - 1; // ⟦key⟧
        while (j >= 0 && data[j] > key) { // ⟦cmp⟧
            data[j + 1] = data[j]; // ⟦shift⟧
            j--; // ⟦shift⟧
        }
        data[j + 1] = key; // ⟦insert⟧
    }
}

int main() {
    std::vector<int> data = {5, 3, 8, 1, 6, 2};
    insertionSort(data);
    for (std::size_t k = 0; k < data.size(); k++) {
        std::cout << (k ? " " : "") << data[k];
    }
    std::cout << std::endl;
}
