fn merge_sort(data: &mut [i32], tmp: &mut [i32], left: usize, right: usize) { // ⟦call⟧
    if left >= right { // ⟦base⟧
        return; // ⟦leaf⟧
    }
    let mid = (left + right) / 2; // ⟦mid⟧
    merge_sort(data, tmp, left, mid); // ⟦recL⟧
    merge_sort(data, tmp, mid + 1, right); // ⟦recR⟧
    let mut i = left; // ⟦mstart⟧
    let mut j = mid + 1; // ⟦mstart⟧
    let mut k = left; // ⟦mstart⟧
    while i <= mid && j <= right { // ⟦mcmp⟧
        if data[i] <= data[j] { // ⟦mcmp⟧
            tmp[k] = data[i]; // ⟦takeL⟧
            i += 1; // ⟦takeL⟧
        } else {
            tmp[k] = data[j]; // ⟦takeR⟧
            j += 1; // ⟦takeR⟧
        }
        k += 1; // ⟦takeL,takeR⟧
    }
    while i <= mid { // ⟦restL⟧
        tmp[k] = data[i]; // ⟦restL⟧
        i += 1; // ⟦restL⟧
        k += 1; // ⟦restL⟧
    }
    while j <= right { // ⟦restR⟧
        tmp[k] = data[j]; // ⟦restR⟧
        j += 1; // ⟦restR⟧
        k += 1; // ⟦restR⟧
    }
    for k in left..=right { // ⟦copy⟧
        data[k] = tmp[k]; // ⟦copy⟧
    }
}

fn main() {
    let mut data = [6, 3, 8, 1, 5, 2];
    let mut tmp = [0; 6];
    let last = data.len() - 1;
    merge_sort(&mut data, &mut tmp, 0, last);
    let out: Vec<String> = data.iter().map(|x| x.to_string()).collect();
    println!("{}", out.join(" "));
}
