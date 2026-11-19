public class Main {
    static int linearSearch(int[] data, int target) {
        for (int i = 0; i < data.length; i++) { // ⟦loop⟧
            if (data[i] == target) { // ⟦cmp⟧
                return i; // ⟦found⟧
            }
        }
        return -1; // ⟦notfound⟧
    }

    public static void main(String[] args) {
        int[] data = {7, 3, 9, 4, 6, 2};
        System.out.println(linearSearch(data, 4));
    }
}
