public class Main {
    static int[] stack = new int[5];
    static int top = -1; // 空のときは -1

    static void push(int x) {
        if (top == stack.length - 1) { // ⟦full⟧
            return; // いっぱいなので積めない
        }
        top++; // ⟦inc⟧
        stack[top] = x; // ⟦store⟧
    }

    static int pop() {
        if (top == -1) { // ⟦empty⟧
            return -1; // 空なので取り出せない（ここでは -1 で知らせる）
        }
        int x = stack[top]; // ⟦take⟧
        top--; // ⟦dec⟧
        return x; // ⟦popret⟧
    }

    public static void main(String[] args) {
        push(3);
        push(8);
        push(5);
        int a = pop();
        push(1);
        int b = pop();
        int c = pop();
        System.out.println(a + " " + b + " " + c);
    }
}
