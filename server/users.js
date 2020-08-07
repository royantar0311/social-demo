const users = [];

const addUser = ({ id, name, room }) => {
  console.log(name, room);
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.name === name && user.room === room
  );

  if (existingUser) {
    return { error: 'UserName is taken' };
  }

  const user = { id, name, room };
  users.push(user);
  console.log(users);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  const ret = users.findIndex((user) => {
    if (user.id === id) return user;
  });
  return ret;
};
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { users, addUser, removeUser, getUser, getUsersInRoom };
