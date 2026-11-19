struct Queue {
    var data = Array(repeating: 0, count: 4)
    var head = 0  // 先頭（次に取り出す位置）
    var tail = 0  // 次に入れる位置
    var count = 0 // 入っている個数

    mutating func enqueue(_ x: Int) {
        if count == data.count { // ⟦full⟧
            return // いっぱいなので入れられない
        }
        data[tail] = x // ⟦store⟧
        tail = (tail + 1) % data.count // ⟦tail⟧
        count += 1 // ⟦tail⟧
    }

    mutating func dequeue() -> Int? {
        if count == 0 { // ⟦empty⟧
            return nil // 空なので取り出せない
        }
        let x = data[head] // ⟦take⟧
        head = (head + 1) % data.count // ⟦head⟧
        count -= 1 // ⟦head⟧
        return x // ⟦deqret⟧
    }
}

var q = Queue()
var out: [Int] = []
q.enqueue(3)
q.enqueue(8)
q.enqueue(5)
out.append(q.dequeue()!)
q.enqueue(1)
q.enqueue(7)
out.append(q.dequeue()!)
out.append(q.dequeue()!)
print(out.map(String.init).joined(separator: " "))
