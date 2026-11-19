queue = [None] * 4
head = 0  # 先頭（次に取り出す位置）
tail = 0  # 次に入れる位置
count = 0  # 入っている個数


def enqueue(x):
    global tail, count
    if count == len(queue):  # ⟦full⟧
        return  # いっぱいなので入れられない
    queue[tail] = x  # ⟦store⟧
    tail = (tail + 1) % len(queue)  # ⟦tail⟧
    count += 1  # ⟦tail⟧


def dequeue():
    global head, count
    if count == 0:  # ⟦empty⟧
        return None  # 空なので取り出せない
    x = queue[head]  # ⟦take⟧
    head = (head + 1) % len(queue)  # ⟦head⟧
    count -= 1  # ⟦head⟧
    return x  # ⟦deqret⟧


out = []
enqueue(3)
enqueue(8)
enqueue(5)
out.append(dequeue())
enqueue(1)
enqueue(7)
out.append(dequeue())
out.append(dequeue())
print(*out)
