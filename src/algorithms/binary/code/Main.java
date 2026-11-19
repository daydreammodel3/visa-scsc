public class Main {
    static int binarySearch(int[] data, int target) {
        int low = 0; // ⟦init⟧
        int high = data.length - 1; // ⟦init⟧
        while (low <= high) { // ⟦loop⟧
            int mid = (low + high) / 2; // ⟦mid⟧
            if (data[mid] == target) { // ⟦cmp⟧
                return mid; // ⟦found⟧
            } else if (data[mid] < target) { // ⟦lt⟧
                low = mid + 1; // ⟦right⟧
            } else {
                high = mid - 1; // ⟦left⟧
            }
        }
        return -1; // ⟦notfound⟧
    }

    public static void main(String[] args) {
        int[] data = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        System.out.println(binarySearch(data, 23));
    }
}
