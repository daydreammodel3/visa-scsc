#include <stdio.h>

int binary_search(const int data[], int n, int target) {
    int low = 0; // ⟦init⟧
    int high = n - 1; // ⟦init⟧
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

int main(void) {
    int data[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = sizeof data / sizeof data[0];
    printf("%d\n", binary_search(data, n, 23));
    return 0;
}
