package main

import "fmt"

func factorial(n int) int { // ⟦call⟧
	if n <= 1 { // ⟦base⟧
		return 1 // ⟦ret1⟧
	}
	return n * factorial(n-1) // ⟦rec,ret⟧
}

func main() {
	fmt.Println(factorial(4))
}
