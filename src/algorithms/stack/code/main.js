const stack = new Array(5).fill(undefined);
let top = -1; // 空のときは -1

function push(x) {
  if (top === stack.length - 1) { // ⟦full⟧
    return; // いっぱいなので積めない
  }
  top++; // ⟦inc⟧
  stack[top] = x; // ⟦store⟧
}

function pop() {
  if (top === -1) { // ⟦empty⟧
    return undefined; // 空なので取り出せない
  }
  const x = stack[top]; // ⟦take⟧
  top--; // ⟦dec⟧
  return x; // ⟦popret⟧
}

const out = [];
push(3);
push(8);
push(5);
out.push(pop());
push(1);
out.push(pop());
out.push(pop());
console.log(out.join(" "));
