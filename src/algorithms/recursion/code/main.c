#include <stdio.h>

int factorial(int n) { // ⟦call⟧
    if (n <= 1) { // ⟦base⟧
        return 1; // ⟦ret1⟧
    }
    return n * factorial(n - 1); // ⟦rec,ret⟧
}

int main(void) {
    printf("%d\n", factorial(4));
    return 0;
}
