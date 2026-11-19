func factorial(_ n: Int) -> Int { // ⟦call⟧
    if n <= 1 { // ⟦base⟧
        return 1 // ⟦ret1⟧
    }
    return n * factorial(n - 1) // ⟦rec,ret⟧
}

print(factorial(4))
