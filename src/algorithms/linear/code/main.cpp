#include <iostream>
#include <vector>

int linearSearch(const std::vector<int>& data, int target) {
    for (int i = 0; i < (int)data.size(); i++) { // ⟦loop⟧
        if (data[i] == target) { // ⟦cmp⟧
            return i; // ⟦found⟧
        }
    }
    return -1; // ⟦notfound⟧
}

int main() {
    std::vector<int> data = {7, 3, 9, 4, 6, 2};
    std::cout << linearSearch(data, 4) << std::endl;
}
