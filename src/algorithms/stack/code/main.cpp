#include <iostream>

const int SIZE = 5;
int stack[SIZE];
int top = -1; // 空のときは -1

void push(int x) {
    if (top == SIZE - 1) { // ⟦full⟧
        return; // いっぱいなので積めない
    }
    top++; // ⟦inc⟧
    stack[top] = x; // ⟦store⟧
}

int pop() {
    if (top == -1) { // ⟦empty⟧
        return -1; // 空なので取り出せない（ここでは -1 で知らせる）
    }
    int x = stack[top]; // ⟦take⟧
    top--; // ⟦dec⟧
    return x; // ⟦popret⟧
}

int main() {
    push(3);
    push(8);
    push(5);
    int a = pop();
    push(1);
    int b = pop();
    int c = pop();
    std::cout << a << " " << b << " " << c << std::endl;
}
