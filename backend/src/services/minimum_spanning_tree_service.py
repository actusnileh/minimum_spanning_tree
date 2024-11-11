import random

def prism_mst(graph: list) -> tuple[float, list, list]:
    text_result = []
    weight = 0  # Общий вес
    edges = []  # Список для хранения рёбер остовного дерева

    vertex_count: int = len(graph)
    text_result.append(f"Количество вершин: {vertex_count}\n")

    visited: list = [False] * vertex_count

    random_start_vertex = random.randint(0, vertex_count - 1)
    text_result.append(
        f"Выбираем случайную вершину, с которой начнём: {random_start_vertex}\n"
    )

    visited[random_start_vertex] = True

    while len(edges) < vertex_count - 1:
        min_edge = (None, None, float("inf"))

        for u in range(vertex_count):  # Ищем минимального соседа
            if visited[u]:
                for v in range(vertex_count):
                    if not visited[v] and graph[u][v] > 0:  # Только непосещённые соседи
                        if graph[u][v] < min_edge[2]:
                            min_edge = (u, v, graph[u][v])

        # Если не нашли подходящего ребра, значит граф состоит из нескольких компонент
        if min_edge[0] is None or min_edge[1] is None:
            text_result.append("Граф состоит из нескольких компонент. Невозможно построить остовное дерево.\n")
            return (weight, edges, text_result)

        u, v, min_weight = min_edge
        visited[v] = True  # Помечаем вершину как посещённую
        edges.append((u, v, min_weight))  # Добавляем ребро в остовное дерево
        weight += min_weight  # Добавляем вес рёбру
        text_result.append(f"Добавляем ребро ({u}, {v}) с весом {min_weight}\n")

    text_result.append("\n\nМинимальное остовное дерево построено.\n")
    text_result.append(f"Общий вес остовного дерева: {weight}\n")
    text_result.append(f"Рёбра остовного дерева: {edges}")

    return (weight, edges, text_result)
