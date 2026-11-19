#include <stdio.h>

int linear_search(const int data[], int n, int target) {
    for (int i = 0; i < n; i++) { // ⟦loop⟧
        if (data[i] == target) { // ⟦cmp⟧
            return i; // ⟦found⟧
        }
    }
    return -1; // ⟦notfound⟧
}

int main(void) {
    int data[] = {7, 3, 9, 4, 6, 2};
    int n = sizeof data / sizeof data[0];
    printf("%d\n", linear_search(data, n, 4));
    return 0;
}
