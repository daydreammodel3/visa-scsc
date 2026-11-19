package main

import "fmt"

func linearSearch(data []int, target int) int {
	for i := 0; i < len(data); i++ { // ⟦loop⟧
		if data[i] == target { // ⟦cmp⟧
			return i // ⟦found⟧
		}
	}
	return -1 // ⟦notfound⟧
}

func main() {
	data := []int{7, 3, 9, 4, 6, 2}
	fmt.Println(linearSearch(data, 4))
}
