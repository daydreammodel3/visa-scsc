public class Main {
    static void quickSort(int[] data, int left, int right) { // ⟦call⟧
        if (left < right) { // ⟦base⟧
            int p = partition(data, left, right); // ⟦part,pdone⟧
            quickSort(data, left, p - 1); // ⟦recL⟧
            quickSort(data, p + 1, right); // ⟦recR⟧
        }
    }

    static int partition(int[] data, int left, int right) { // ⟦pcall⟧
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

    public static void main(String[] args) {
        int[] data = {5, 3, 8, 1, 6, 2};
        quickSort(data, 0, data.length - 1);
        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < data.length; k++) {
            sb.append(k > 0 ? " " : "").append(data[k]);
        }
        System.out.println(sb);
    }
}
