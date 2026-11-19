#include <stdio.h>
#include <stdlib.h>

typedef struct ListElement {
    int val;
    struct ListElement *next;
} ListElement;

ListElement *list_head = NULL;

// stdio.h に remove() があるので、名前に list_ を付けている
void list_append(int x) {
    ListElement *curr = malloc(sizeof(ListElement)); // ⟦new⟧
    curr->val = x; // ⟦new⟧
    curr->next = NULL; // ⟦new⟧
    if (list_head == NULL) { // ⟦empty⟧
        list_head = curr; // ⟦sethead⟧
    } else {
        ListElement *prev = list_head; // ⟦walk0⟧
        while (prev->next != NULL) { // ⟦walk⟧
            prev = prev->next; // ⟦step⟧
        }
        prev->next = curr; // ⟦link⟧
    }
}

void list_remove(int x) {
    ListElement *prev = NULL; // ⟦rstart⟧
    ListElement *curr = list_head; // ⟦rstart⟧
    while (curr != NULL) { // ⟦rloop⟧
        if (curr->val == x) { // ⟦rcmp⟧
            if (prev == NULL) { // ⟦rhead⟧
                list_head = curr->next; // ⟦unhead⟧
            } else {
                prev->next = curr->next; // ⟦unlink⟧
            }
            free(curr); // 外した要素のメモリを返す
            return; // ⟦rdone⟧
        }
        prev = curr; // ⟦radv⟧
        curr = curr->next; // ⟦radv⟧
    }
}

int main(void) {
    int values[] = {3, 8, 5, 1};
    for (int k = 0; k < 4; k++) {
        list_append(values[k]);
    }
    list_remove(8);
    for (ListElement *node = list_head; node != NULL; node = node->next) {
        printf("%d%s", node->val, node->next ? " " : "\n");
    }
    while (list_head != NULL) {
        ListElement *next = list_head->next;
        free(list_head);
        list_head = next;
    }
    return 0;
}
