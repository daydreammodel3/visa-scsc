public class Main {
    static int factorial(int n) { // ⟦call⟧
        if (n <= 1) { // ⟦base⟧
            return 1; // ⟦ret1⟧
        }
        return n * factorial(n - 1); // ⟦rec,ret⟧
    }

    public static void main(String[] args) {
        System.out.println(factorial(4));
    }
}
