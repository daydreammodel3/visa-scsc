struct ListElement {
    val: i32,
    next: Option<Box<ListElement>>,
}

// Rust では「次の要素への参照」を Option<Box<...>> で表す。
// prev と curr を同時に書きかえられないため、remove では「次を指している場所」cursor を進めていく。
fn append(list_head: &mut Option<Box<ListElement>>, x: i32) {
    let curr = Box::new(ListElement { val: x, next: None }); // ⟦new⟧
    if list_head.is_none() { // ⟦empty⟧
        *list_head = Some(curr); // ⟦sethead⟧
    } else {
        let mut prev = list_head.as_mut().unwrap(); // ⟦walk0⟧
        while prev.next.is_some() { // ⟦walk⟧
            prev = prev.next.as_mut().unwrap(); // ⟦step⟧
        }
        prev.next = Some(curr); // ⟦link⟧
    }
}

fn remove(list_head: &mut Option<Box<ListElement>>, x: i32) {
    let mut cursor = list_head; // ⟦rstart⟧
    while cursor.is_some() { // ⟦rloop⟧
        if cursor.as_ref().unwrap().val == x { // ⟦rcmp⟧
            // 先頭でも途中でも、「curr を指していた場所」を curr.next に付けかえる
            let next = cursor.as_mut().unwrap().next.take(); // ⟦rhead⟧
            *cursor = next; // ⟦unhead,unlink⟧
            return; // ⟦rdone⟧
        }
        cursor = &mut cursor.as_mut().unwrap().next; // ⟦radv⟧
    }
}

fn main() {
    let mut list_head: Option<Box<ListElement>> = None;
    for v in [3, 8, 5, 1] {
        append(&mut list_head, v);
    }
    remove(&mut list_head, 8);

    let mut out = Vec::new();
    let mut node = list_head.as_ref();
    while let Some(n) = node {
        out.push(n.val.to_string());
        node = n.next.as_ref();
    }
    println!("{}", out.join(" "));
}
