from enum import Enum, auto

class cmd():
    message = 'message'
    error = 'error'
    change_user_name = 'change_user_name'
    change_group_name = 'change_group_name'
    create_group = 'create_group'
    join_group = 'join_group'
    leave_group = 'leave_group'
    dm = 'dm'
    request = 'request'
    response = 'response'

class var():
    HOST = '127.0.0.1'  # Standard loopback interface address (localhost)
    PORT = 5069        # Port to listen on (non-privileged ports are > 1023)
    group_name = 'group_name'
    data = 'data'
    sender = 'sender'
    reciever = 'reciever'
    dm = 'dm'
    server_name = 'server'
    default_group_name = 'default'
    title = 'title'
    old = 'old'
    new = 'new'

class req():
    group_name = 'group_name'
    user_name = 'user_name'
    db = 'db'
    chat_hist = 'chat_hist'

class res():
    success = 'success'
    error = 'error'