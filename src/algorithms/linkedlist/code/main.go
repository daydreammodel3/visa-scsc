package main

import (
	"fmt"
	"strings"
)

type ListElement struct {
	val  int
	next *ListElement
}

var listHead *ListElement

func appendValue(x int) {
	curr := &ListElement{val: x} // ⟦new⟧
	if listHead == nil { // ⟦empty⟧
		listHead = curr // ⟦sethead⟧
	} else {
		prev := listHead // ⟦walk0⟧
		for prev.next != nil { // ⟦walk⟧
			prev = prev.next // ⟦step⟧
		}
		prev.next = curr // ⟦link⟧
	}
}

func removeValue(x int) {
	var prev *ListElement // ⟦rstart⟧
	curr := listHead // ⟦rstart⟧
	for curr != nil { // ⟦rloop⟧
		if curr.val == x { // ⟦rcmp⟧
			if prev == nil { // ⟦rhead⟧
				listHead = curr.next // ⟦unhead⟧
			} else {
				prev.next = curr.next // ⟦unlink⟧
			}
			return // ⟦rdone⟧
		}
		prev = curr // ⟦radv⟧
		curr = curr.next // ⟦radv⟧
	}
}

func main() {
	for _, v := range []int{3, 8, 5, 1} {
		appendValue(v)
	}
	removeValue(8)
	var out []string
	for node := listHead; node != nil; node = node.next {
		out = append(out, fmt.Sprint(node.val))
	}
	fmt.Println(strings.Join(out, " "))
}
