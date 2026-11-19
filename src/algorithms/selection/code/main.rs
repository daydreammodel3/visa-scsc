fn selection_sort(data: &mut [i32]) {
    let n = data.len();
    for i in 0..n - 1 { // ⟦outer⟧
        let mut min_index = i; // ⟦setmin⟧
        for j in i + 1..n { // ⟦inner⟧
            if data[j] < data[min_index] { // ⟦cmp⟧
                min_index = j; // ⟦newmin⟧
            }
        }
        data.swap(i, min_index); // ⟦swap⟧
    }
}

fn main() {
    let mut data = [5, 3, 8, 1, 6, 2];
    selection_sort(&mut data);
    let out: Vec<String> = data.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}
