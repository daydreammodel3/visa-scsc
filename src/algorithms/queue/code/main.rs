struct Queue {
    data: [i32; 4],
    head: usize,  // 先頭（次に取り出す位置）
    tail: usize,  // 次に入れる位置
    count: usize, // 入っている個数
}

impl Queue {
    fn enqueue(&mut self, x: i32) {
        if self.count == self.data.len() { // ⟦full⟧
            return; // いっぱいなので入れられない
        }
        self.data[self.tail] = x; // ⟦store⟧
        self.tail = (self.tail + 1) % self.data.len(); // ⟦tail⟧
        self.count += 1; // ⟦tail⟧
    }

    fn dequeue(&mut self) -> Option<i32> {
        if self.count == 0 { // ⟦empty⟧
            return None; // 空なので取り出せない
        }
        let x = self.data[self.head]; // ⟦take⟧
        self.head = (self.head + 1) % self.data.len(); // ⟦head⟧
        self.count -= 1; // ⟦head⟧
        Some(x) // ⟦deqret⟧
    }
}

fn main() {
    let mut q = Queue { data: [0; 4], head: 0, tail: 0, count: 0 };
    let mut out = Vec::new();
    q.enqueue(3);
    q.enqueue(8);
    q.enqueue(5);
    out.push(q.dequeue().unwrap());
    q.enqueue(1);
    q.enqueue(7);
    out.push(q.dequeue().unwrap());
    out.push(q.dequeue().unwrap());
    let out: Vec<String> = out.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}
