from pony.orm import *


db = Database()

# Define entities in database


class ChatRoom(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
    massages = Set('Massage')


class Massage(db.Entity):
    id = PrimaryKey(int, auto=True)
    data = Required(str)
    massage_no = Required(int)
    sender = Required(str)
    chat_room = Required(ChatRoom)

# Connet database


db.bind(provider='sqlite', filename='db.sqlite', create_db=True)
# set_sql_debug(True)
db.generate_mapping(create_tables=True)
