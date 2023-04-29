from aiohttp import web
import socketio

from Utils import cmd,var
from serverDB import DB,Chat,User

db = DB()

PORT = var.PORT

sio = socketio.Server(
    cors_allowed_origins='*',
    logger=True,
)
app = socketio.WSGIApp(sio)
import eventlet



def log(*arg,**kwarg):
    print(*arg,**kwarg)
def send(sid,msg):
    sio.emit(cmd.message,msg, room=sid)
    log(sid,msg)
def send_to_group(group_name,msg):
    for rid in db.groups[group_name].members_id:
        send(rid,msg)
def send_to_all(msg):
    for user in db.users.values():
        rid = user.id
        send(rid,msg)
def send_error(sid,msg):
    if type(msg)!=dict:
        msg = {
            var.sender : var.server_name,
            var.group_name : var.server_name,
            var.data : msg
            }
    sio.emit(cmd.error,msg, room=sid)
    log(sid,msg)
def send_group_name_error(sid):
    send_error(sid, 'group name error')

@sio.on('connect')
def connect(sid, environ, auth):
    db.create_user(sid, sid)
    print('Connected:', sid)

@sio.on('disconnect')
def connect(sid):
    db.delete_user(sid)
    print('Disconnected:', sid)

@sio.on(cmd.message)
def send_message(sid, data):
    msg = {
        var.sender : db.get_user(sid).name,
        }
    if type(data) != dict :
        group_name = 'default'
        msg[var.data] = data
    else:
        if var.group_name not in data.keys():
            group_name = 'default'
        else:
            group_name = data[var.group_name]
        msg[var.data] = data[var.data]

    if group_name not in db.groups_name:
        send_group_name_error(sid)
        return
    msg[var.group_name] = group_name
    send_to_group(group_name,msg)

@sio.on(cmd.dm)
def send_dm(sid, data):
    msg = {
        var.sender : db.get_user(sid).name,
        var.group_name : var.dm,
        var.data : data[var.data]
        }
    send(data[var.reciever],msg)
    
@sio.on(cmd.name)
def change_name(sid, new_name):
    old_name = db.users[sid]
    if not db.rename_user(sid, new_name):
        send_error(sid,'cant change name (name may dupe)')
        return
    msg = {
        var.sender : var.server_name,
        var.group_name : var.server_name,
        var.data : f'change name from {old_name} to {new_name}'
        }
    send_to_all(msg)


@sio.on(cmd.create_group)
def create_group(sid, group_name):
    if db.create_groups(group_name):
        u_name = db.users[sid].name
        msg = {
            var.sender : var.server_name,
            var.group_name : var.server_name,
            var.data : f'group {group_name} has been created by {u_name}'
            }
        send_to_all(msg)
    else:
        send_group_name_error(sid)
    

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', PORT)), app)
    # web.run_app(app, port = PORT)