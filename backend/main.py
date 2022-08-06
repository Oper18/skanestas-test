import os
from random import random
import asyncio
import websockets
import json
import time


_PRICES = {
    i: {
        "name": "ticker_{}".format(
            str(i) if len(str(i)) > 1 else "0" + str(i)
        ),
        "price": 0,
        "color": "#fff",
        "changes": list(),
        "timestamp": 0,
    }
    for i in range(100)
}


def generate_movement():
    movement = -1 if random() < 0.5 else 1
    return movement


async def server(websocket):
    global _PRICES
    
    while True:
        for k, v in _PRICES.items():
            price_changing = generate_movement()
            v["price"] += price_changing
            if price_changing > 0:
                v["color"] = "#00ff00"
            elif price_changing < 0:
                v["color"] = "#ff0000"
            else:
                v["color"] = "#fff"
            v["changes"].append(v["price"])
            v["timestamp"] += 1
       
        await websocket.send(json.dumps(_PRICES))

        time.sleep(1.0)


async def main():
    async with websockets.serve(
        server,
        os.environ.get("HOST", "localhost"),
        os.environ.get("PORT", 8765),
    ):
        await asyncio.Future()


if __name__ == '__main__':
    asyncio.run(main())

