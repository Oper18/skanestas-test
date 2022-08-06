# Description

Test project for fullstack position in skanestas

# Start project

1. Prepare backend environment
    1. install python 3.10
    2. create virtual environment `python -m venv venv-<name>`
    3. activate virtual environment `source venv-<name>/bin/activate`
    4. install websocket library `pip isntall websockets`
    5. if you want to use custom host and port set environment variables `HOST` and `PORT` by command `export HOST=<host> && export PORT=<port>` (by default it `localhost:8765`)
    6. start websocket server `python backend/main.py`
2. Prepare frontend environment
    1. install packages `npm install`
    2. create .env file from .env.example with values created at backend configuration steps
    3. run develop node.js server `npm start`
3. Open `<host>:<port>` in your favoritebrower
