const expect = require("expect");

const { Users } = require("./users");

describe("Users ", () => {
  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: "1",
        name: "Mike",
        room: "Node course"
      },
      {
        id: "2",
        name: "Abhinav",
        room: "React course"
      },
      {
        id: "3",
        name: "Andrew",
        room: "Node course"
      }
    ];
  });
  it("should add new users", () => {
    var users = new Users();
    const user = {
      id: "123",
      name: "abhinav",
      room: "My room"
    };
    users.addUser(user.id, user.name, user.room);

    expect(users.users[0]).toMatchObject(user);
  });

  it("should return names for Node course", () => {
    const userList = users.getUserList("Node course");
    expect(userList).toEqual(expect.arrayContaining(["Mike", "Andrew"]));
  });

  it("should return names for React course", () => {
    const userList = users.getUserList("React course");
    expect(userList).toEqual(expect.arrayContaining(["Abhinav"]));
  });

  it("should remove a user", () => {
    const userId = "1";
    const removedUser = users.removeUser("1");
    expect(removedUser.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it("should not remove a user not present in users", () => {
    const removedUser = users.removeUser("24242");
    expect(removedUser).toBeFalsy();
  });

  it("should find  a user present in users", () => {
    const userId = "2";
    var user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  it("should not find a user not present in users", () => {
    const userId = "225";
    var user = users.getUser(userId);
    expect(user).toBeFalsy();
  });
});
