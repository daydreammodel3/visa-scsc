public class Main {
    static void selectionSort(int[] data) {
        int n = data.length;
        for (int i = 0; i < n - 1; i++) { // ⟦outer⟧
            int minIndex = i; // ⟦setmin⟧
            for (int j = i + 1; j < n; j++) { // ⟦inner⟧
                if (data[j] < data[minIndex]) { // ⟦cmp⟧
                    minIndex = j; // ⟦newmin⟧
                }
            }
            int tmp = data[i]; // ⟦swap⟧
            data[i] = data[minIndex]; // ⟦swap⟧
            data[minIndex] = tmp; // ⟦swap⟧
        }
    }

    public static void main(String[] args) {
        int[] data = {5, 3, 8, 1, 6, 2};
        selectionSort(data);
        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < data.length; k++) {
            sb.append(k > 0 ? " " : "").append(data[k]);
        }
        System.out.println(sb);
    }
}
