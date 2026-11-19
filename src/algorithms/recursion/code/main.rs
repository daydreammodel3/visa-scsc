fn factorial(n: u64) -> u64 { // ⟦call⟧
    if n <= 1 { // ⟦base⟧
        return 1; // ⟦ret1⟧
    }
    n * factorial(n - 1) // ⟦rec,ret⟧
}

fn main() {
    println!("{}", factorial(4));
}
