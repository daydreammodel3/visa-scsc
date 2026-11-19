package main

import (
	"fmt"
	"strings"
)

func quickSort(data []int, left, right int) { // ⟦call⟧
	if left < right { // ⟦base⟧
		p := partition(data, left, right) // ⟦part,pdone⟧
		quickSort(data, left, p-1) // ⟦recL⟧
		quickSort(data, p+1, right) // ⟦recR⟧
	}
}

func partition(data []int, left, right int) int { // ⟦pcall⟧
	pivot := data[right] // ⟦pivot⟧
	i := left - 1 // ⟦pivot⟧
	for j := left; j < right; j++ { // ⟦pcmp⟧
		if data[j] <= pivot { // ⟦pcmp⟧
			i++ // ⟦pswap⟧
			data[i], data[j] = data[j], data[i] // ⟦pswap⟧
		}
	}
	data[i+1], data[right] = data[right], data[i+1] // ⟦pfinal⟧
	return i + 1 // ⟦pret⟧
}

func main() {
	data := []int{5, 3, 8, 1, 6, 2}
	quickSort(data, 0, len(data)-1)
	fmt.Println(strings.Trim(fmt.Sprint(data), "[]"))
}
