from aiohttp import web
import socketio

from Utils import cmd,var,req,res
from serverDB import DB,Chat,User

db = DB()

PORT = var.PORT

sio = socketio.Server(
    cors_allowed_origins='*',
    logger=True,
)
app = socketio.WSGIApp(sio)
import eventlet

def gen_server_msg(msg:str):
    return {
            var.sender : var.server_name,
            var.group_name : var.server_name,
            var.data : msg
        }

def log(*arg,**kwarg):
    print(*arg,**kwarg)
def send(sid,msg):
    sio.emit(cmd.message,msg, room=sid)
    log(sid,msg)
def send_to_group(group_name,msg):
    db.groups[group_name].add_msg(msg)
    for rid in db.groups[group_name].members_id:
        send(rid,msg)
def send_to_all(msg):
    for user in db.users.values():
        rid = user.id
        send(rid,msg)
def response(sid,msg):
    sio.emit(cmd.response,msg, room=sid)
    log(sid,msg)
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
    if sid not in db.groups[group_name].members_id:
        db.join_group(sid, group_name)
    msg[var.group_name] = group_name
    if db.get_user(sid).name not in db.get_group(group_name).members_name:
        send_group_name_error(sid)
    else:
        send_to_group(group_name,msg)

@sio.on(cmd.dm)
def send_dm(sid, data):
    msg = {
        var.sender : db.get_user(sid).name,
        var.group_name : var.dm,
        var.data : data[var.data]
        }

    reciever_name = data[var.reciever]
    reciever_id = db.get_user_by_name(reciever_name).id
    send(reciever_id,msg)
    
@sio.on(cmd.request)
def request(sid, data):
    if data[var.data] == req.group_name: request = db.groups_name
    if data[var.data] == req.user_name: request = db.users_name
    if data[var.data] == req.db: request = db
    if data[var.data] == req.chat_hist: request = db.get_group(data[var.group_name]).message
    msg = gen_server_msg(request)
    msg[var.title] = data[var.data]
    response(sid,msg)

@sio.on(cmd.join_group)
def join_group(sid, data):
    group_name = data[var.group_name]
    if db.join_group(sid, group_name):
        msg = gen_server_msg(f"{db.users[sid].name} joined chat {group_name}")
        msg[var.group_name] = group_name
        send_to_group(group_name, msg)
        response_msg = msg.copy()
        response_msg[var.title] = cmd.join_group
        response_msg[var.data] = res.success
        response(sid,response_msg)
    else:
        response_msg = gen_server_msg(res.success)
        response_msg[var.group_name] = group_name
        response_msg[var.title] = cmd.join_group
        response_msg[var.data] = res.error
        response(sid,response_msg)
        send_group_name_error(sid)
        
@sio.on(cmd.leave_group)
def leave_group(sid, data):
    group_name = data[var.group_name]
    if db.leave_group(sid, group_name):
        msg = gen_server_msg(f"{db.users[sid].name} leaved chat {group_name}")
        msg[var.group_name] = group_name
        send_to_group(group_name, msg)
        response_msg = msg.copy()
        response_msg[var.title] = cmd.leave_group
        response_msg[var.data] = res.success
        response(sid,response_msg)
    else:
        response_msg = gen_server_msg(res.success)
        response_msg[var.group_name] = group_name
        response_msg[var.title] = cmd.leave_group
        response_msg[var.data] = res.error
        response(sid,response_msg)
        send_group_name_error(sid)
    
@sio.on(cmd.change_user_name)
def change_user_name(sid, data):
    if type(data) == str:new_name = data
    else:new_name = data[var.data]
    old_name = db.users[sid].name
    if not db.rename_user(sid, new_name):
        send_error(sid,'cant change name (name may dupe)')
        return
    msg = gen_server_msg(f'change name from {old_name} to {new_name}')
    send_to_all(msg)

@sio.on(cmd.change_group_name)
def change_user_name(sid, data):
    if type(data) == str:new_name = data
    else:new_name = data[var.data]
    old_name = data[var.group_name]
    if not db.rename_group(old_name, new_name):
        send_error(sid,'cant change name (name may dupe)')
        return
    user_name = db.users[sid].name
    msg = gen_server_msg(f'{user_name} change group name from "{old_name}" to "{new_name}"')
    send_to_all(msg)


@sio.on(cmd.create_group)
def create_group(sid, data):
    group_name = data[var.group_name]
    if db.create_groups(group_name):
        u_name = db.users[sid].name
        msg = gen_server_msg(f'group {group_name} has been created by {u_name}')
        send_to_all(msg)
    else:
        send_group_name_error(sid)
    

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', PORT)), app)
    # web.run_app(app, port = PORT)