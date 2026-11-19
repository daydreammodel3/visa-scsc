package main

import "fmt"

type Stack struct {
	data [5]int
	top  int // 空のときは -1
}

func (s *Stack) Push(x int) {
	if s.top == len(s.data)-1 { // ⟦full⟧
		return // いっぱいなので積めない
	}
	s.top++ // ⟦inc⟧
	s.data[s.top] = x // ⟦store⟧
}

func (s *Stack) Pop() (int, bool) {
	if s.top == -1 { // ⟦empty⟧
		return 0, false // 空なので取り出せない
	}
	x := s.data[s.top] // ⟦take⟧
	s.top-- // ⟦dec⟧
	return x, true // ⟦popret⟧
}

func main() {
	s := &Stack{top: -1}
	s.Push(3)
	s.Push(8)
	s.Push(5)
	a, _ := s.Pop()
	s.Push(1)
	b, _ := s.Pop()
	c, _ := s.Pop()
	fmt.Println(a, b, c)
}
