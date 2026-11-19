package main

import (
	"fmt"
	"strings"
)

func insertionSort(data []int) {
	for i := 1; i < len(data); i++ { // ⟦outer⟧
		key := data[i] // ⟦key⟧
		j := i - 1 // ⟦key⟧
		for j >= 0 && data[j] > key { // ⟦cmp⟧
			data[j+1] = data[j] // ⟦shift⟧
			j-- // ⟦shift⟧
		}
		data[j+1] = key // ⟦insert⟧
	}
}

func main() {
	data := []int{5, 3, 8, 1, 6, 2}
	insertionSort(data)
	fmt.Println(strings.Trim(fmt.Sprint(data), "[]"))
}
