stack = [None] * 5
top = -1  # 空のときは -1


def push(x):
    global top
    if top == len(stack) - 1:  # ⟦full⟧
        return  # いっぱいなので積めない
    top += 1  # ⟦inc⟧
    stack[top] = x  # ⟦store⟧


def pop():
    global top
    if top == -1:  # ⟦empty⟧
        return None  # 空なので取り出せない
    x = stack[top]  # ⟦take⟧
    top -= 1  # ⟦dec⟧
    return x  # ⟦popret⟧


out = []
push(3)
push(8)
push(5)
out.append(pop())
push(1)
out.append(pop())
out.append(pop())
print(*out)
