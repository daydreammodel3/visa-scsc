// p - 1 や left - 1 が -1 になることがあるので、位置は isize で持つ
fn quick_sort(data: &mut [i32], left: isize, right: isize) { // ⟦call⟧
    if left < right { // ⟦base⟧
        let p = partition(data, left, right); // ⟦part,pdone⟧
        quick_sort(data, left, p - 1); // ⟦recL⟧
        quick_sort(data, p + 1, right); // ⟦recR⟧
    }
}

fn partition(data: &mut [i32], left: isize, right: isize) -> isize { // ⟦pcall⟧
    let pivot = data[right as usize]; // ⟦pivot⟧
    let mut i = left - 1; // ⟦pivot⟧
    for j in left..right { // ⟦pcmp⟧
        if data[j as usize] <= pivot { // ⟦pcmp⟧
            i += 1; // ⟦pswap⟧
            data.swap(i as usize, j as usize); // ⟦pswap⟧
        }
    }
    data.swap((i + 1) as usize, right as usize); // ⟦pfinal⟧
    i + 1 // ⟦pret⟧
}

fn main() {
    let mut data = [5, 2, 7, 1, 6, 3];
    let last = data.len() as isize - 1;
    quick_sort(&mut data, 0, last);
    let out: Vec<String> = data.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}
