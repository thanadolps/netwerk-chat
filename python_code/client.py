import asyncio
import socketio

from Utils import cmd,var

sio = socketio.Client(
    logger=True,
    )

@sio.event
def connect():
    print('connection established')
    sio.emit(cmd.message, 'hello from python')
    
    msg = {
        var.data : 'use dict to send to default group'
        }
    sio.emit(cmd.message, msg)
    msg = {
        var.group_name : 'default',
        var.data : 'rename and send',
        }
    sio.emit(cmd.name, 'takeshi')
    sio.emit(cmd.message, msg)
    msg = {
        var.group_name : 'new group',
        var.data : 'create group and send',
        }
    sio.emit(cmd.create_group, 'new group')
    sio.emit(cmd.message, msg)

@sio.event
def message(data):
    out = f'{data[var.sender]} (error) : {data[var.data]}'
    print(out)
@sio.on(cmd.message)
def display_msg(data):
    out = f'{data[var.sender]} ({data[var.group_name]}) : {data[var.data]}'
    print(out)

@sio.on(cmd.error)
def display_error(data):
    out = data[var.data]
    print(out)
    
@sio.on(cmd.response)
def display_error(data):
    out = data#[var.data]
    print(out)
    
@sio.event
def disconnect():
    print('disconnected from server')

def main():
    group = var.default_group_name
    sio.connect('http://localhost:5069')
    while 1:
        s = input()
        sl = s.split()
        if sl[0] == 'join_group':
            group_name=' '.join(sl[1:])
            msg = {var.group_name:group_name}
            sio.emit(cmd.join_group, msg)
            group = group_name
        elif sl[0] == 'create_group':
            group_name=' '.join(sl[1:])
            msg = {var.group_name:group_name}
            sio.emit(cmd.create_group, msg)
            group = group_name
        elif sl[0] == 'leave_group':
            group_name=' '.join(sl[1:])
            msg = {var.group_name:group_name}
            sio.emit(cmd.leave_group, msg)
            group = var.default_group_name
        elif sl[0] == 'group': # group new group
            group_name=' '.join(sl[1:])
            group = group_name
        elif sl[0] == 'dm': # dm user1 hello
            msg = {var.group_name:sl[1],var.data:' '.join(sl[2:])}
            sio.emit(cmd.dm, msg)
        else:
            msg = {var.group_name:group,var.data:s}
            sio.emit(cmd.message, msg)
    sio.wait()

if __name__ == '__main__':
    asyncio.run(main())