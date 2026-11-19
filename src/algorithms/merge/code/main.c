#include <stdio.h>

void merge_sort(int data[], int tmp[], int left, int right) { // ⟦call⟧
    if (left >= right) { // ⟦base⟧
        return; // ⟦leaf⟧
    }
    int mid = (left + right) / 2; // ⟦mid⟧
    merge_sort(data, tmp, left, mid); // ⟦recL⟧
    merge_sort(data, tmp, mid + 1, right); // ⟦recR⟧
    int i = left; // ⟦mstart⟧
    int j = mid + 1; // ⟦mstart⟧
    int k = left; // ⟦mstart⟧
    while (i <= mid && j <= right) { // ⟦mcmp⟧
        if (data[i] <= data[j]) { // ⟦mcmp⟧
            tmp[k] = data[i]; // ⟦takeL⟧
            i++; // ⟦takeL⟧
        } else {
            tmp[k] = data[j]; // ⟦takeR⟧
            j++; // ⟦takeR⟧
        }
        k++; // ⟦takeL,takeR⟧
    }
    while (i <= mid) { // ⟦restL⟧
        tmp[k] = data[i]; // ⟦restL⟧
        i++; // ⟦restL⟧
        k++; // ⟦restL⟧
    }
    while (j <= right) { // ⟦restR⟧
        tmp[k] = data[j]; // ⟦restR⟧
        j++; // ⟦restR⟧
        k++; // ⟦restR⟧
    }
    for (k = left; k <= right; k++) { // ⟦copy⟧
        data[k] = tmp[k]; // ⟦copy⟧
    }
}

int main(void) {
    int data[] = {5, 3, 8, 1, 6, 2};
    int n = sizeof data / sizeof data[0];
    int tmp[sizeof data / sizeof data[0]];
    merge_sort(data, tmp, 0, n - 1);
    for (int k = 0; k < n; k++) {
        printf("%s%d", k ? " " : "", data[k]);
    }
    printf("\n");
    return 0;
}
