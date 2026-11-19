#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& data, int target) {
    int low = 0; // ⟦init⟧
    int high = (int)data.size() - 1; // ⟦init⟧
    while (low <= high) { // ⟦loop⟧
        int mid = (low + high) / 2; // ⟦mid⟧
        if (data[mid] == target) { // ⟦cmp⟧
            return mid; // ⟦found⟧
        } else if (data[mid] < target) { // ⟦lt⟧
            low = mid + 1; // ⟦right⟧
        } else {
            high = mid - 1; // ⟦left⟧
        }
    }
    return -1; // ⟦notfound⟧
}

int main() {
    std::vector<int> data = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    std::cout << binarySearch(data, 23) << std::endl;
}
