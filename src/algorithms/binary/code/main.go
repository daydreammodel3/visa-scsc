package main

import "fmt"

func binarySearch(data []int, target int) int {
	low := 0 // ⟦init⟧
	high := len(data) - 1 // ⟦init⟧
	for low <= high { // ⟦loop⟧
		mid := (low + high) / 2 // ⟦mid⟧
		if data[mid] == target { // ⟦cmp⟧
			return mid // ⟦found⟧
		} else if data[mid] < target { // ⟦lt⟧
			low = mid + 1 // ⟦right⟧
		} else {
			high = mid - 1 // ⟦left⟧
		}
	}
	return -1 // ⟦notfound⟧
}

func main() {
	data := []int{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}
	fmt.Println(binarySearch(data, 23))
}
