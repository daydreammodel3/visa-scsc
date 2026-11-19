package main

import (
	"fmt"
	"strings"
)

func bubbleSort(data []int) {
	for i := len(data) - 1; i >= 1; i-- { // ⟦outer⟧
		for j := 0; j < i; j++ { // ⟦inner⟧
			if data[j] > data[j+1] { // ⟦cmp⟧
				data[j], data[j+1] = data[j+1], data[j] // ⟦swap⟧
			}
		}
	}
}

func main() {
	data := []int{5, 3, 8, 1, 6, 2}
	bubbleSort(data)
	fmt.Println(strings.Trim(fmt.Sprint(data), "[]"))
}
