fn insertion_sort(data: &mut [i32]) {
    for i in 1..data.len() { // ⟦outer⟧
        let key = data[i]; // ⟦key⟧
        // j は -1 になることがあるので、usize ではなく isize で持つ
        let mut j = i as isize - 1; // ⟦key⟧
        while j >= 0 && data[j as usize] > key { // ⟦cmp⟧
            data[(j + 1) as usize] = data[j as usize]; // ⟦shift⟧
            j -= 1; // ⟦shift⟧
        }
        data[(j + 1) as usize] = key; // ⟦insert⟧
    }
}

fn main() {
    let mut data = [5, 3, 8, 1, 6, 2];
    insertion_sort(&mut data);
    let out: Vec<String> = data.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}
