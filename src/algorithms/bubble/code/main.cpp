#include <iostream>
#include <utility>
#include <vector>

void bubbleSort(std::vector<int>& data) {
    for (int i = (int)data.size() - 1; i >= 1; i--) { // ⟦outer⟧
        for (int j = 0; j < i; j++) { // ⟦inner⟧
            if (data[j] > data[j + 1]) { // ⟦cmp⟧
                std::swap(data[j], data[j + 1]); // ⟦swap⟧
            }
        }
    }
}

int main() {
    std::vector<int> data = {5, 3, 8, 1, 6, 2};
    bubbleSort(data);
    for (std::size_t k = 0; k < data.size(); k++) {
        std::cout << (k ? " " : "") << data[k];
    }
    std::cout << std::endl;
}
