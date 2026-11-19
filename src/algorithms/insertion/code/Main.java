public class Main {
    static void insertionSort(int[] data) {
        for (int i = 1; i < data.length; i++) { // ⟦outer⟧
            int key = data[i]; // ⟦key⟧
            int j = i - 1; // ⟦key⟧
            while (j >= 0 && data[j] > key) { // ⟦cmp⟧
                data[j + 1] = data[j]; // ⟦shift⟧
                j--; // ⟦shift⟧
            }
            data[j + 1] = key; // ⟦insert⟧
        }
    }

    public static void main(String[] args) {
        int[] data = {5, 3, 8, 1, 6, 2};
        insertionSort(data);
        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < data.length; k++) {
            sb.append(k > 0 ? " " : "").append(data[k]);
        }
        System.out.println(sb);
    }
}
