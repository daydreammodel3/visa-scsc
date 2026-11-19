#include <stdio.h>

#define SIZE 4
int queue[SIZE];
int head = 0;  // 先頭（次に取り出す位置）
int tail = 0;  // 次に入れる位置
int count = 0; // 入っている個数

void enqueue(int x) {
    if (count == SIZE) { // ⟦full⟧
        return; // いっぱいなので入れられない
    }
    queue[tail] = x; // ⟦store⟧
    tail = (tail + 1) % SIZE; // ⟦tail⟧
    count++; // ⟦tail⟧
}

int dequeue(void) {
    if (count == 0) { // ⟦empty⟧
        return -1; // 空なので取り出せない（ここでは -1 で知らせる）
    }
    int x = queue[head]; // ⟦take⟧
    head = (head + 1) % SIZE; // ⟦head⟧
    count--; // ⟦head⟧
    return x; // ⟦deqret⟧
}

int main(void) {
    enqueue(3);
    enqueue(8);
    enqueue(5);
    int a = dequeue();
    enqueue(1);
    enqueue(7);
    int b = dequeue();
    int c = dequeue();
    printf("%d %d %d\n", a, b, c);
    return 0;
}
