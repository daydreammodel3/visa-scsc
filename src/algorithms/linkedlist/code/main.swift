final class ListElement {
    var val: Int
    var next: ListElement?

    init(_ val: Int) {
        self.val = val
        self.next = nil
    }
}

var listHead: ListElement? = nil

func append(_ x: Int) {
    let curr = ListElement(x) // ⟦new⟧
    if listHead == nil { // ⟦empty⟧
        listHead = curr // ⟦sethead⟧
    } else {
        var prev = listHead! // ⟦walk0⟧
        while prev.next != nil { // ⟦walk⟧
            prev = prev.next! // ⟦step⟧
        }
        prev.next = curr // ⟦link⟧
    }
}

func remove(_ x: Int) {
    var prev: ListElement? = nil // ⟦rstart⟧
    var curr = listHead // ⟦rstart⟧
    while curr != nil { // ⟦rloop⟧
        if curr!.val == x { // ⟦rcmp⟧
            if prev == nil { // ⟦rhead⟧
                listHead = curr!.next // ⟦unhead⟧
            } else {
                prev!.next = curr!.next // ⟦unlink⟧
            }
            return // ⟦rdone⟧
        }
        prev = curr // ⟦radv⟧
        curr = curr!.next // ⟦radv⟧
    }
}

for v in [3, 8, 5, 1] {
    append(v)
}
remove(8)
var out: [String] = []
var node = listHead
while let n = node {
    out.append(String(n.val))
    node = n.next
}
print(out.joined(separator: " "))
