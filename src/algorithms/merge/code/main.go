package main

import (
	"fmt"
	"strings"
)

func mergeSort(data, tmp []int, left, right int) { // ⟦call⟧
	if left >= right { // ⟦base⟧
		return // ⟦leaf⟧
	}
	mid := (left + right) / 2 // ⟦mid⟧
	mergeSort(data, tmp, left, mid) // ⟦recL⟧
	mergeSort(data, tmp, mid+1, right) // ⟦recR⟧
	i := left // ⟦mstart⟧
	j := mid + 1 // ⟦mstart⟧
	k := left // ⟦mstart⟧
	for i <= mid && j <= right { // ⟦mcmp⟧
		if data[i] <= data[j] { // ⟦mcmp⟧
			tmp[k] = data[i] // ⟦takeL⟧
			i++ // ⟦takeL⟧
		} else {
			tmp[k] = data[j] // ⟦takeR⟧
			j++ // ⟦takeR⟧
		}
		k++ // ⟦takeL,takeR⟧
	}
	for i <= mid { // ⟦restL⟧
		tmp[k] = data[i] // ⟦restL⟧
		i++ // ⟦restL⟧
		k++ // ⟦restL⟧
	}
	for j <= right { // ⟦restR⟧
		tmp[k] = data[j] // ⟦restR⟧
		j++ // ⟦restR⟧
		k++ // ⟦restR⟧
	}
	for k = left; k <= right; k++ { // ⟦copy⟧
		data[k] = tmp[k] // ⟦copy⟧
	}
}

func main() {
	data := []int{5, 3, 8, 1, 6, 2}
	tmp := make([]int, len(data))
	mergeSort(data, tmp, 0, len(data)-1)
	fmt.Println(strings.Trim(fmt.Sprint(data), "[]"))
}
