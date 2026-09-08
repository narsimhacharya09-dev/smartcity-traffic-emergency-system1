"""
Custom Min-Heap and Priority Queue Implementation.

This module provides a pure Python Min-Heap data structure built from first principles
without relying on python's heapq library, supporting full educational transparency
and high efficiency O(log N) operations for Dijkstra's Algorithm and Emergency Dispatching.
"""

from typing import Generic, TypeVar, List, Tuple, Optional, Dict, Any

T = TypeVar('T')


class MinHeapNode(Generic[T]):
    def __init__(self, item: T, priority: float):
        self.item = item
        self.priority = priority

    def __repr__(self):
        return f"MinHeapNode(item={self.item}, priority={self.priority})"


class MinHeap(Generic[T]):
    """
    Min-Heap Data Structure using 0-indexed array representation.
    Children of index i are at 2i + 1 and 2i + 2.
    Parent of index i is at (i - 1) // 2.
    """

    def __init__(self):
        self.heap: List[MinHeapNode[T]] = []
        self.position_map: Dict[Any, int] = {}  # Maps item key/representation to index in heap for O(1) lookups

    def _get_key(self, item: T) -> Any:
        # If item has an id or key attribute, use that; otherwise use the item itself
        if hasattr(item, "id"):
            return getattr(item, "id")
        return item

    def is_empty(self) -> bool:
        return len(self.heap) == 0

    def size(self) -> int:
        return len(self.heap)

    def peek(self) -> Optional[Tuple[T, float]]:
        if self.is_empty():
            return None
        return self.heap[0].item, self.heap[0].priority

    def _swap(self, i: int, j: int) -> None:
        key_i = self._get_key(self.heap[i].item)
        key_j = self._get_key(self.heap[j].item)
        self.position_map[key_i] = j
        self.position_map[key_j] = i
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]

    def _bubble_up(self, index: int) -> None:
        while index > 0:
            parent_index = (index - 1) // 2
            if self.heap[index].priority < self.heap[parent_index].priority:
                self._swap(index, parent_index)
                index = parent_index
            else:
                break

    def _bubble_down(self, index: int) -> None:
        length = len(self.heap)
        while True:
            left_child = 2 * index + 1
            right_child = 2 * index + 2
            smallest = index

            if left_child < length and self.heap[left_child].priority < self.heap[smallest].priority:
                smallest = left_child

            if right_child < length and self.heap[right_child].priority < self.heap[smallest].priority:
                smallest = right_child

            if smallest != index:
                self._swap(index, smallest)
                index = smallest
            else:
                break

    def insert(self, item: T, priority: float) -> None:
        node = MinHeapNode(item, priority)
        self.heap.append(node)
        index = len(self.heap) - 1
        key = self._get_key(item)
        self.position_map[key] = index
        self._bubble_up(index)

    def extract_min(self) -> Optional[Tuple[T, float]]:
        if self.is_empty():
            return None

        root = self.heap[0]
        root_key = self._get_key(root.item)
        last_node = self.heap.pop()

        if root_key in self.position_map:
            del self.position_map[root_key]

        if len(self.heap) > 0:
            self.heap[0] = last_node
            last_key = self._get_key(last_node.item)
            self.position_map[last_key] = 0
            self._bubble_down(0)

        return root.item, root.priority

    def decrease_key(self, item: T, new_priority: float) -> bool:
        key = self._get_key(item)
        if key not in self.position_map:
            return False

        index = self.position_map[key]
        if new_priority >= self.heap[index].priority:
            return False  # Not a decrease

        self.heap[index].priority = new_priority
        self._bubble_up(index)
        return True

    def contains(self, item: T) -> bool:
        key = self._get_key(item)
        return key in self.position_map


class PriorityQueue(Generic[T]):
    """
    Priority Queue wrapping the custom MinHeap.
    Items with lower numerical priority values are popped first.
    """

    def __init__(self):
        self._heap = MinHeap[T]()

    def push(self, item: T, priority: float) -> None:
        self._heap.insert(item, priority)

    def pop(self) -> Optional[Tuple[T, float]]:
        return self._heap.extract_min()

    def peek(self) -> Optional[Tuple[T, float]]:
        return self._heap.peek()

    def is_empty(self) -> bool:
        return self._heap.is_empty()

    def size(self) -> int:
        return self._heap.size()

    def update_priority(self, item: T, new_priority: float) -> None:
        if self._heap.contains(item):
            self._heap.decrease_key(item, new_priority)
        else:
            self._heap.insert(item, new_priority)
