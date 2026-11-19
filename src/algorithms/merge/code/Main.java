public class Main {
    static void mergeSort(int[] data, int[] tmp, int left, int right) { // ⟦call⟧
        if (left >= right) { // ⟦base⟧
            return; // ⟦leaf⟧
        }
        int mid = (left + right) / 2; // ⟦mid⟧
        mergeSort(data, tmp, left, mid); // ⟦recL⟧
        mergeSort(data, tmp, mid + 1, right); // ⟦recR⟧
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

    public static void main(String[] args) {
        int[] data = {5, 3, 8, 1, 6, 2};
        int[] tmp = new int[data.length];
        mergeSort(data, tmp, 0, data.length - 1);
        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < data.length; k++) {
            sb.append(k > 0 ? " " : "").append(data[k]);
        }
        System.out.println(sb);
    }
}
