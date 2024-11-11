from fastapi import APIRouter

from src.schemas.minimum_spanning_schema import GraphMatrix
from src.services.minimum_spanning_tree_service import prism_mst


router = APIRouter()


@router.post("/minimum_spanning_tree/")
async def minimum_spanning_tree(matrix: GraphMatrix):
    graph = [
        [float("inf") if weight is None else weight for weight in row]
        for row in matrix.graph
    ]

    weight, edges, text = prism_mst(graph)
    return {"weight": weight, "edges": edges, "text": text}
