#include <stdio.h>

void bubble_sort(int data[], int n) {
    for (int i = n - 1; i >= 1; i--) { // ⟦outer⟧
        for (int j = 0; j < i; j++) { // ⟦inner⟧
            if (data[j] > data[j + 1]) { // ⟦cmp⟧
                int tmp = data[j]; // ⟦swap⟧
                data[j] = data[j + 1]; // ⟦swap⟧
                data[j + 1] = tmp; // ⟦swap⟧
            }
        }
    }
}

int main(void) {
    int data[] = {5, 3, 8, 1, 6, 2};
    int n = sizeof data / sizeof data[0];
    bubble_sort(data, n);
    for (int k = 0; k < n; k++) {
        printf("%s%d", k ? " " : "", data[k]);
    }
    printf("\n");
    return 0;
}
