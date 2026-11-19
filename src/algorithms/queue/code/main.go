package main

import "fmt"

type Queue struct {
	data  [4]int
	head  int // 先頭（次に取り出す位置）
	tail  int // 次に入れる位置
	count int // 入っている個数
}

func (q *Queue) Enqueue(x int) {
	if q.count == len(q.data) { // ⟦full⟧
		return // いっぱいなので入れられない
	}
	q.data[q.tail] = x // ⟦store⟧
	q.tail = (q.tail + 1) % len(q.data) // ⟦tail⟧
	q.count++ // ⟦tail⟧
}

func (q *Queue) Dequeue() (int, bool) {
	if q.count == 0 { // ⟦empty⟧
		return 0, false // 空なので取り出せない
	}
	x := q.data[q.head] // ⟦take⟧
	q.head = (q.head + 1) % len(q.data) // ⟦head⟧
	q.count-- // ⟦head⟧
	return x, true // ⟦deqret⟧
}

func main() {
	q := &Queue{}
	q.Enqueue(3)
	q.Enqueue(8)
	q.Enqueue(5)
	a, _ := q.Dequeue()
	q.Enqueue(1)
	q.Enqueue(7)
	b, _ := q.Dequeue()
	c, _ := q.Dequeue()
	fmt.Println(a, b, c)
}
