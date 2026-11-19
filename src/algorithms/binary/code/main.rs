fn binary_search(data: &[i32], target: i32) -> Option<usize> {
    // high が -1 になることがあるので、usize ではなく isize で持つ
    let mut low: isize = 0; // ⟦init⟧
    let mut high: isize = data.len() as isize - 1; // ⟦init⟧
    while low <= high { // ⟦loop⟧
        let mid = (low + high) / 2; // ⟦mid⟧
        if data[mid as usize] == target { // ⟦cmp⟧
            return Some(mid as usize); // ⟦found⟧
        } else if data[mid as usize] < target { // ⟦lt⟧
            low = mid + 1; // ⟦right⟧
        } else {
            high = mid - 1; // ⟦left⟧
        }
    }
    None // ⟦notfound⟧
}

fn main() {
    let data = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
    match binary_search(&data, 23) {
        Some(i) => println!("{}", i),
        None => println!("-1"),
    }
}
