#include <stdio.h>

void insertion_sort(int data[], int n) {
    for (int i = 1; i < n; i++) { // ⟦outer⟧
        int key = data[i]; // ⟦key⟧
        int j = i - 1; // ⟦key⟧
        while (j >= 0 && data[j] > key) { // ⟦cmp⟧
            data[j + 1] = data[j]; // ⟦shift⟧
            j--; // ⟦shift⟧
        }
        data[j + 1] = key; // ⟦insert⟧
    }
}

int main(void) {
    int data[] = {5, 3, 8, 1, 6, 2};
    int n = sizeof data / sizeof data[0];
    insertion_sort(data, n);
    for (int k = 0; k < n; k++) {
        printf("%s%d", k ? " " : "", data[k]);
    }
    printf("\n");
    return 0;
}
