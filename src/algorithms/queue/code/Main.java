public class Main {
    static int[] queue = new int[4];
    static int head = 0;  // 先頭（次に取り出す位置）
    static int tail = 0;  // 次に入れる位置
    static int count = 0; // 入っている個数

    static void enqueue(int x) {
        if (count == queue.length) { // ⟦full⟧
            return; // いっぱいなので入れられない
        }
        queue[tail] = x; // ⟦store⟧
        tail = (tail + 1) % queue.length; // ⟦tail⟧
        count++; // ⟦tail⟧
    }

    static int dequeue() {
        if (count == 0) { // ⟦empty⟧
            return -1; // 空なので取り出せない（ここでは -1 で知らせる）
        }
        int x = queue[head]; // ⟦take⟧
        head = (head + 1) % queue.length; // ⟦head⟧
        count--; // ⟦head⟧
        return x; // ⟦deqret⟧
    }

    public static void main(String[] args) {
        enqueue(3);
        enqueue(8);
        enqueue(5);
        int a = dequeue();
        enqueue(1);
        enqueue(7);
        int b = dequeue();
        int c = dequeue();
        System.out.println(a + " " + b + " " + c);
    }
}
