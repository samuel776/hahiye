import request from "supertest";
import app from "../app";
import User from "../models/User";
import mongoose from "mongoose";
import authHelpers from "../utils/auth";

const fakeUser = {
  user_name: "fake user",
  user_email: "gnv74035@cuoly.com",
  user_password: "123456",
  confirm_password: "123456",
  user_verified: true,
  user_profile: new mongoose.Types.ObjectId(),
};
describe("User Authetication", () => {
  beforeEach(async () => {
    await User.deleteOne({ user_email: fakeUser.user_email });
  });

  it("should register user successful", async () => {
    const res = await request(app)
      .post("/api/users/signup")
      .send({ ...fakeUser, user_verified: undefined, user_profile: undefined });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
  });

  it("should not register user successful because of validation", async () => {
    const res = await request(app).post("/api/users/signup").send();
    expect(res.status).toEqual(400);
  });

  it("should  not  register user who is already exis", async () => {
    await User.create(fakeUser);
    const res = await request(app)
      .post("/api/users/signup")
      .send({ ...fakeUser, user_verified: undefined, user_profile: undefined });
    expect(res.status).toEqual(409);
    expect(res.body).toHaveProperty("success", false);
  });

  it("should login User successfull", async () => {
    await User.create(fakeUser);

    const res = await request(app).post("/api/users/login").send({
      user_email: fakeUser.user_email,
      user_password: fakeUser.user_password,
    });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
  });

  it("should not login User successfull", async () => {
    await User.create(fakeUser);

    const res = await request(app).post("/api/users/login").send();

    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("success", false);
  });

  it("should not  login if user is not verified", async () => {
    await User.create({ ...fakeUser, user_verified: false });

    const res = await request(app).post("/api/users/login").send({
      user_email: fakeUser.user_email,
      user_password: fakeUser.user_password,
    });

    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty("success", false);
  });

  it("should not login User with invalid password", async () => {
    await User.create(fakeUser);

    const res = await request(app).post("/api/users/login").send({
      user_email: fakeUser.user_email,
      user_password: "ghjmfbhjkmst",
    });

    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty("success", false);
  });

  it("should not login user with invalid email", async () => {
    const res = await request(app).post("/api/users/login").send({
      user_email: "abc@gmail.com",
      user_password: fakeUser.user_password,
    });

    expect(res.status).toEqual(404);
  });

  it("Should verifies User", async () => {
    const user = await User.create({ ...fakeUser, user_verified: false });

    const token = authHelpers.signToken({ user_email: user.user_email });

    const res1 = await request(app).get(`/api/users/verify/${token}`);
    expect(res1.status).toEqual(200);

    const res = await request(app).get(`/api/users/verify/${token}`);
    expect(res.status).toEqual(409);
  });

  it("Should not verifies User", async () => {
    const user = await User.create({ ...fakeUser, user_verified: false });

    const token = authHelpers.signToken({ user_email: user.user_email });

    const res = await request(app).get(`/api/users/verify/567890`);

    expect(res.status).toEqual(403);
  });
});
