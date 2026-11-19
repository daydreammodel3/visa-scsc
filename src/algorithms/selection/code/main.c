#include <stdio.h>

void selection_sort(int data[], int n) {
    for (int i = 0; i < n - 1; i++) { // ⟦outer⟧
        int min_index = i; // ⟦setmin⟧
        for (int j = i + 1; j < n; j++) { // ⟦inner⟧
            if (data[j] < data[min_index]) { // ⟦cmp⟧
                min_index = j; // ⟦newmin⟧
            }
        }
        int tmp = data[i]; // ⟦swap⟧
        data[i] = data[min_index]; // ⟦swap⟧
        data[min_index] = tmp; // ⟦swap⟧
    }
}

int main(void) {
    int data[] = {5, 3, 8, 1, 6, 2};
    int n = sizeof data / sizeof data[0];
    selection_sort(data, n);
    for (int k = 0; k < n; k++) {
        printf("%s%d", k ? " " : "", data[k]);
    }
    printf("\n");
    return 0;
}
