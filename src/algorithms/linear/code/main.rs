fn linear_search(data: &[i32], target: i32) -> Option<usize> {
    for i in 0..data.len() { // ⟦loop⟧
        if data[i] == target { // ⟦cmp⟧
            return Some(i); // ⟦found⟧
        }
    }
    None // ⟦notfound⟧
}

fn main() {
    let data = [7, 3, 9, 4, 6, 2];
    match linear_search(&data, 4) {
        Some(i) => println!("{}", i),
        None => println!("-1"),
    }
}
