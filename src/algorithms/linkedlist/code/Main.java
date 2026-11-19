import java.util.StringJoiner;

public class Main {
    static class ListElement {
        int val;
        ListElement next;

        ListElement(int val) {
            this.val = val;
            this.next = null;
        }
    }

    static ListElement listHead = null;

    static void append(int x) {
        ListElement curr = new ListElement(x); // ⟦new⟧
        if (listHead == null) { // ⟦empty⟧
            listHead = curr; // ⟦sethead⟧
        } else {
            ListElement prev = listHead; // ⟦walk0⟧
            while (prev.next != null) { // ⟦walk⟧
                prev = prev.next; // ⟦step⟧
            }
            prev.next = curr; // ⟦link⟧
        }
    }

    static void remove(int x) {
        ListElement prev = null; // ⟦rstart⟧
        ListElement curr = listHead; // ⟦rstart⟧
        while (curr != null) { // ⟦rloop⟧
            if (curr.val == x) { // ⟦rcmp⟧
                if (prev == null) { // ⟦rhead⟧
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

    public static void main(String[] args) {
        for (int v : new int[] {3, 8, 5, 1}) {
            append(v);
        }
        remove(8);
        StringJoiner out = new StringJoiner(" ");
        for (ListElement node = listHead; node != null; node = node.next) {
            out.add(String.valueOf(node.val));
        }
        System.out.println(out);
    }
}
