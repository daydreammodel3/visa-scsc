const queue = new Array(4).fill(undefined);
let head = 0; // 先頭（次に取り出す位置）
let tail = 0; // 次に入れる位置
let count = 0; // 入っている個数

function enqueue(x) {
  if (count === queue.length) { // ⟦full⟧
    return; // いっぱいなので入れられない
  }
  queue[tail] = x; // ⟦store⟧
  tail = (tail + 1) % queue.length; // ⟦tail⟧
  count++; // ⟦tail⟧
}

function dequeue() {
  if (count === 0) { // ⟦empty⟧
    return undefined; // 空なので取り出せない
  }
  const x = queue[head]; // ⟦take⟧
  head = (head + 1) % queue.length; // ⟦head⟧
  count--; // ⟦head⟧
  return x; // ⟦deqret⟧
}

const out = [];
enqueue(3);
enqueue(8);
enqueue(5);
out.push(dequeue());
enqueue(1);
enqueue(7);
out.push(dequeue());
out.push(dequeue());
console.log(out.join(" "));
