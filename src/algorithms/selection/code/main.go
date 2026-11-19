package main

import (
	"fmt"
	"strings"
)

func selectionSort(data []int) {
	n := len(data)
	for i := 0; i < n-1; i++ { // ⟦outer⟧
		minIndex := i // ⟦setmin⟧
		for j := i + 1; j < n; j++ { // ⟦inner⟧
			if data[j] < data[minIndex] { // ⟦cmp⟧
				minIndex = j // ⟦newmin⟧
			}
		}
		data[i], data[minIndex] = data[minIndex], data[i] // ⟦swap⟧
	}
}

func main() {
	data := []int{5, 3, 8, 1, 6, 2}
	selectionSort(data)
	fmt.Println(strings.Trim(fmt.Sprint(data), "[]"))
}
