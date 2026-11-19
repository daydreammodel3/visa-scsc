struct Stack {
    var data = Array(repeating: 0, count: 5)
    var top = -1 // 空のときは -1

    mutating func push(_ x: Int) {
        if top == data.count - 1 { // ⟦full⟧
            return // いっぱいなので積めない
        }
        top += 1 // ⟦inc⟧
        data[top] = x // ⟦store⟧
    }

    mutating func pop() -> Int? {
        if top == -1 { // ⟦empty⟧
            return nil // 空なので取り出せない
        }
        let x = data[top] // ⟦take⟧
        top -= 1 // ⟦dec⟧
        return x // ⟦popret⟧
    }
}

var s = Stack()
var out: [Int] = []
s.push(3)
s.push(8)
s.push(5)
out.append(s.pop()!)
s.push(1)
out.append(s.pop()!)
out.append(s.pop()!)
print(out.map(String.init).joined(separator: " "))
