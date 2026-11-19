struct Stack {
    data: [i32; 5],
    top: isize, // 空のときは -1
}

impl Stack {
    fn push(&mut self, x: i32) {
        if self.top == self.data.len() as isize - 1 { // ⟦full⟧
            return; // いっぱいなので積めない
        }
        self.top += 1; // ⟦inc⟧
        self.data[self.top as usize] = x; // ⟦store⟧
    }

    fn pop(&mut self) -> Option<i32> {
        if self.top == -1 { // ⟦empty⟧
            return None; // 空なので取り出せない
        }
        let x = self.data[self.top as usize]; // ⟦take⟧
        self.top -= 1; // ⟦dec⟧
        Some(x) // ⟦popret⟧
    }
}

fn main() {
    let mut s = Stack { data: [0; 5], top: -1 };
    let mut out = Vec::new();
    s.push(3);
    s.push(8);
    s.push(5);
    out.push(s.pop().unwrap());
    s.push(1);
    out.push(s.pop().unwrap());
    out.push(s.pop().unwrap());
    let out: Vec<String> = out.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}
