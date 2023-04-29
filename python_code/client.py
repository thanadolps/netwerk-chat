import asyncio
import socketio

from Utils import cmd,var

sio = socketio.AsyncClient(
    logger=True,
    )

@sio.event
async def connect():
    print('connection established')
    await sio.emit(cmd.message, 'hello from python')
    
    msg = {
        var.data : 'use dict to send to default group'
        }
    await sio.emit(cmd.message, msg)
    msg = {
        var.group_name : 'default',
        var.data : 'rename and send',
        }
    await sio.emit(cmd.name, 'takeshi')
    await sio.emit(cmd.message, msg)
    msg = {
        var.group_name : 'new group',
        var.data : 'create group and send',
        }
    await sio.emit(cmd.create_group, 'new group')
    await sio.emit(cmd.message, msg)

@sio.event
async def message(data):
    out = f'{data[var.sender]} (error) : {data[var.data]}'
    print(out)
@sio.on(cmd.message)
async def display_msg(data):
    out = f'{data[var.sender]} ({data[var.group_name]}) : {data[var.data]}'
    print(out)

@sio.on(cmd.error)
async def display_error(data):
    out = data[var.data]
    print(out)
    
@sio.event
async def disconnect():
    print('disconnected from server')

async def main():
    await sio.connect('http://localhost:5069')
    await sio.wait()

if __name__ == '__main__':
    asyncio.run(main())