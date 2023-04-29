from enum import Enum, auto

class cmd():
    message = 'message'
    error = 'error'
    name = 'name'
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