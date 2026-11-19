class ListElement:
    def __init__(self, val):
        self.val = val
        self.next = None


list_head = None


def append(x):
    global list_head
    curr = ListElement(x)  # ⟦new⟧
    if list_head is None:  # ⟦empty⟧
        list_head = curr  # ⟦sethead⟧
    else:
        prev = list_head  # ⟦walk0⟧
        while prev.next is not None:  # ⟦walk⟧
            prev = prev.next  # ⟦step⟧
        prev.next = curr  # ⟦link⟧


def remove(x):
    global list_head
    prev = None  # ⟦rstart⟧
    curr = list_head  # ⟦rstart⟧
    while curr is not None:  # ⟦rloop⟧
        if curr.val == x:  # ⟦rcmp⟧
            if prev is None:  # ⟦rhead⟧
                list_head = curr.next  # ⟦unhead⟧
            else:
                prev.next = curr.next  # ⟦unlink⟧
            return  # ⟦rdone⟧
        prev = curr  # ⟦radv⟧
        curr = curr.next  # ⟦radv⟧


for v in [3, 8, 5, 1]:
    append(v)
remove(8)

out = []
node = list_head
while node is not None:
    out.append(node.val)
    node = node.next
print(*out)
