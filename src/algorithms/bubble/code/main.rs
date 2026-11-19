fn bubble_sort(data: &mut [i32]) {
    for i in (1..data.len()).rev() { // ⟦outer⟧
        for j in 0..i { // ⟦inner⟧
            if data[j] > data[j + 1] { // ⟦cmp⟧
                data.swap(j, j + 1); // ⟦swap⟧
            }
        }
    }
}

fn main() {
    let mut data = [5, 3, 8, 1, 6, 2];
    bubble_sort(&mut data);
    let out: Vec<String> = data.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}
