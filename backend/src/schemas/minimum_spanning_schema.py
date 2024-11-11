from typing import Union
from pydantic import BaseModel


class GraphMatrix(BaseModel):
    graph: list[list[Union[float, None]]]
