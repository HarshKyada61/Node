const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const mongoose = require("mongoose");
const User = require("../src/models/user");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "mike@abc.com",
  password: "jkofdeg",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("should signUp a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "harsh",
      email: "harshkyada@gmail.com",
      password: "mypasswo",
    })
    .expect(201);

    //Assert that database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertion about response
    expect(response.body).toMatchObject({
        user: {
            name:"harsh",
            email:"harshkyada@gmail.com"
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe("mypasswo")
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
});

test("Should not login nonexisting user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "suabd@jdnsia.com",
      password: "kniusanfd",
    })
    .expect(400);
});

test("should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get profile for unauhtorized user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("should delete account for user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
});

test("should not delete account for unauhtorized user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});
