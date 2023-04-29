import asyncio
import socketio

sio = socketio.AsyncClient()

@sio.event
async def connect():
    print('connection established')
    await sio.emit('message', 'hello from python')
    await sio.emit('message', {'send': 'dict'})

@sio.event
async def my_message(data):
    print('message received with ', data)
    await sio.emit('message', {'response': 'response from python'})

@sio.event
async def disconnect():
    print('disconnected from server')

async def main():
    await sio.connect('http://localhost:5069')
    await sio.wait()

if __name__ == '__main__':
    asyncio.run(main())