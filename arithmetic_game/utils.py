# File: `arithmetic_game/utils.py`
import random
import operator
from typing import Tuple, Callable

_OPERATIONS: dict[int, Tuple[str, Callable[[float, float], float]]] = {
    1: ('+', operator.add),
    2: ('-', operator.sub),
    3: ('*', operator.mul),
    4: ('/', operator.truediv),
}

_RANGES: dict[int, Tuple[int, int]] = {
    1: (0, 10),
    2: (0, 40),
    3: (0, 100),
    4: (0, 1000),
}

# File: `arithmetic_game/utils.py`
def generate_question(
    op_level: int,
    range_level: int,
) -> Tuple[str, float]:
    symbol, func = _OPERATIONS[op_level]
    low, high = _RANGES[range_level]

    while True:
        a = random.randint(low, high)
        if func is operator.truediv:
            b = random.randint(low, high)
            while b == 0:
                b = random.randint(low, high)
        else:
            b = random.randint(low, high)

        result = func(a, b)
        if result >= 0:
            break

    return f"{a} {symbol} {b}", round(result, 2)