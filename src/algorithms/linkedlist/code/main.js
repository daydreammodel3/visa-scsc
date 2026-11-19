class ListElement {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

let listHead = null;

function append(x) {
  const curr = new ListElement(x); // ⟦new⟧
  if (listHead === null) { // ⟦empty⟧
    listHead = curr; // ⟦sethead⟧
  } else {
    let prev = listHead; // ⟦walk0⟧
    while (prev.next !== null) { // ⟦walk⟧
      prev = prev.next; // ⟦step⟧
    }
    prev.next = curr; // ⟦link⟧
  }
}

function remove(x) {
  let prev = null; // ⟦rstart⟧
  let curr = listHead; // ⟦rstart⟧
  while (curr !== null) { // ⟦rloop⟧
    if (curr.val === x) { // ⟦rcmp⟧
      if (prev === null) { // ⟦rhead⟧
        listHead = curr.next; // ⟦unhead⟧
      } else {
        prev.next = curr.next; // ⟦unlink⟧
      }
      return; // ⟦rdone⟧
    }
    prev = curr; // ⟦radv⟧
    curr = curr.next; // ⟦radv⟧
  }
}

for (const v of [3, 8, 5, 1]) {
  append(v);
}
remove(8);

const out = [];
for (let node = listHead; node !== null; node = node.next) {
  out.push(node.val);
}
console.log(out.join(" "));
