#include <stdio.h>

int partition(int data[], int left, int right);

void quick_sort(int data[], int left, int right) { // ⟦call⟧
    if (left < right) { // ⟦base⟧
        int p = partition(data, left, right); // ⟦part,pdone⟧
        quick_sort(data, left, p - 1); // ⟦recL⟧
        quick_sort(data, p + 1, right); // ⟦recR⟧
    }
}

int partition(int data[], int left, int right) { // ⟦pcall⟧
    int pivot = data[right]; // ⟦pivot⟧
    int i = left - 1; // ⟦pivot⟧
    for (int j = left; j < right; j++) { // ⟦pcmp⟧
        if (data[j] <= pivot) { // ⟦pcmp⟧
            i++; // ⟦pswap⟧
            int tmp = data[i]; // ⟦pswap⟧
            data[i] = data[j]; // ⟦pswap⟧
            data[j] = tmp; // ⟦pswap⟧
        }
    }
    int tmp = data[i + 1]; // ⟦pfinal⟧
    data[i + 1] = data[right]; // ⟦pfinal⟧
    data[right] = tmp; // ⟦pfinal⟧
    return i + 1; // ⟦pret⟧
}

int main(void) {
    int data[] = {5, 3, 8, 1, 6, 2};
    int n = sizeof data / sizeof data[0];
    quick_sort(data, 0, n - 1);
    for (int k = 0; k < n; k++) {
        printf("%s%d", k ? " " : "", data[k]);
    }
    printf("\n");
    return 0;
}
