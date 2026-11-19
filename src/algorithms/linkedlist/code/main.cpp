#include <iostream>

struct ListElement {
    int val;
    ListElement* next;
};

ListElement* listHead = nullptr;

void append(int x) {
    ListElement* curr = new ListElement{x, nullptr}; // ⟦new⟧
    if (listHead == nullptr) { // ⟦empty⟧
        listHead = curr; // ⟦sethead⟧
    } else {
        ListElement* prev = listHead; // ⟦walk0⟧
        while (prev->next != nullptr) { // ⟦walk⟧
            prev = prev->next; // ⟦step⟧
        }
        prev->next = curr; // ⟦link⟧
    }
}

void remove(int x) {
    ListElement* prev = nullptr; // ⟦rstart⟧
    ListElement* curr = listHead; // ⟦rstart⟧
    while (curr != nullptr) { // ⟦rloop⟧
        if (curr->val == x) { // ⟦rcmp⟧
            if (prev == nullptr) { // ⟦rhead⟧
                listHead = curr->next; // ⟦unhead⟧
            } else {
                prev->next = curr->next; // ⟦unlink⟧
            }
            delete curr; // 外した要素のメモリを返す
            return; // ⟦rdone⟧
        }
        prev = curr; // ⟦radv⟧
        curr = curr->next; // ⟦radv⟧
    }
}

int main() {
    for (int v : {3, 8, 5, 1}) {
        append(v);
    }
    remove(8);
    for (ListElement* node = listHead; node != nullptr; node = node->next) {
        std::cout << node->val << (node->next ? " " : "\n");
    }
    while (listHead != nullptr) {
        ListElement* next = listHead->next;
        delete listHead;
        listHead = next;
    }
}
