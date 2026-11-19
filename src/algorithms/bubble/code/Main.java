public class Main {
    static void bubbleSort(int[] data) {
        for (int i = data.length - 1; i >= 1; i--) { // ⟦outer⟧
            for (int j = 0; j < i; j++) { // ⟦inner⟧
                if (data[j] > data[j + 1]) { // ⟦cmp⟧
                    int tmp = data[j]; // ⟦swap⟧
                    data[j] = data[j + 1]; // ⟦swap⟧
                    data[j + 1] = tmp; // ⟦swap⟧
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] data = {5, 3, 8, 1, 6, 2};
        bubbleSort(data);
        StringBuilder sb = new StringBuilder();
        for (int k = 0; k < data.length; k++) {
            sb.append(k > 0 ? " " : "").append(data[k]);
        }
        System.out.println(sb);
    }
}
