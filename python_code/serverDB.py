
from Utils import cmd,var

class DB():

    def __init__(self):
        self.groups = dict() #name to chat
        self.users = dict() #id to user
        self.create_groups(var.default_group_name)

    @property
    def users_name(self):
        return [i.name for i in self.users.values()]
    @property
    def groups_name(self):
        return [i.name for i in self.groups.values()]
    @property
    def all_name(self):
        return self.users_name+self.groups_name
    def is_name_exist(self,name):
        return name in self.all_name

    def join_group(self,user_id,group_name):
        if group_name not in self.groups_name:
            self.create_groups(group_name)
        self.groups[group_name].add(self.users[user_id])
        self.users[user_id].add(self.groups[group_name])

    def leave_group(self,user_id,group_name):
        self.groups[group_name].remove(self.users[user_id])
        self.users[user_id].remove(self.groups[group_name])

    def delete_user(self,user_id):
        for group in self.users[user_id].groups:
            self.leave_group(user_id,group.name)
        self.users.pop(user_id)
        
    def delete_group(self,group_name):
        for user_id in self.groups[group_name].members_id:
            self.leave_group(user_id,group_name)
        self.groups.pop(group_name)

    def rename_user(self,user_id,new_name):
        if self.is_name_exist(new_name):return False
        self.users[user_id].name = new_name
        return True

    def rename_group(self,group_name,new_name):
        if self.is_name_exist(new_name):return False
        self.groups[group_name].name = new_name
        self.groups[new_name] = self.groups.pop(group_name)
        return True

    def create_user(self,user_id,name):
        if self.is_name_exist(name):return False
        u = User(user_id,name)
        self.users[user_id] = u
        self.join_group(user_id,var.default_group_name)
        return u

    def create_groups(self,name):
        if self.is_name_exist(name):return False
        u = Chat(name)
        self.groups[name] = u
        return u

    def get_user(self,id):
        return self.users[id]
    def get_group(self,name):
        return self.groups[name]
        

def is_name_dupe(name,list_of_object_with_name_attribute):
    for i in list_of_object_with_name_attribute:
        if name in i.name:
            return True
    return False

class User:
    def __init__(self,id,name):
        self.id = id
        self.name = name
        self.groups = []
    
    def add(self,u):
        self.groups.append(u)

    def remove(self,u):
        self.groups.remove(u)

class Chat:
    def __init__(self,name):
        self.name = name
        self._u = dict()
        self.message = []

    @property
    def members_id(self):return list(self._u)
    @property
    def members_name(self):return list(u.name for u in self._u)

    def add(self,u):
        self._u[u.id] = u
        
    def remove(self,u):
        self._u.pop(u.id)
    

    
# class NameEntities:
#     def __init__(self):
#         self.l = []
#     def __setitem__(self,key,val):
#         for i in self.l:
#             if key in l:
#                 return False
#         self.l.append(val)
#     def __getitem__(self,key):
#         for i in self.l:
#             if key == i.name:
#                 return i