// Authentication test

import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../app";
import { User } from "../models";

describe("Authentication", () => {
  const userPayload = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "password123",
    username: "testuser",
  };

  describe("POST /api/auth/signup", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app).post("/api/auth/signup").send(userPayload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toHaveProperty("_id");
      expect(response.body.user.email).toBe(userPayload.email);
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"][0]).toMatch(/token=/);
    });

    it("should not register user with existing email", async () => {
      await User.create(userPayload);

      const response = await request(app).post("/api/auth/signup").send(userPayload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it("should validate required fields", async () => {
      const response = await request(app).post("/api/auth/signup").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("POST /api/auth/signin", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/signup").send(userPayload);
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app).post("/api/auth/signin").send({
        email: userPayload.email,
        password: userPayload.password,
      });

      expect(response.status).toBe(200);
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"][0]).toMatch(/token=/);
      expect(response.body.user.email).toBe(userPayload.email);
    });

    it("should not login with incorrect password", async () => {
      const response = await request(app).post("/api/auth/signin").send({
        email: userPayload.email,
        password: "wrongpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it("should not login with non-existent email", async () => {
      const response = await request(app).post("/api/auth/signin").send({
        email: "nonexistent@example.com",
        password: userPayload.password,
      });

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("POST /api/auth/signout", () => {
    it("should clear the token cookie", async () => {
      const response = await request(app).post("/api/auth/signout");

      expect(response.status).toBe(200);
      expect(response.headers["set-cookie"][0]).toMatch(/token=;/);
    });
  });

  describe("GET /api/auth/me", () => {
    let authCookie: string;

    beforeEach(async () => {
      await request(app).post("/api/auth/signup").send(userPayload);

      const signinResponse = await request(app).post("/api/auth/signin").send(userPayload);

      authCookie = signinResponse.headers["set-cookie"][0];
    });

    it("should return user data for authenticated request", async () => {
      const response = await request(app).get("/api/auth/me").set("Cookie", authCookie);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(userPayload.email);
    });

    it("should return 401 for unauthenticated request", async () => {
      const response = await request(app).get("/api/auth/me");

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
    });

    it("should return 401 for invalid token", async () => {
      const response = await request(app).get("/api/auth/me").set("Cookie", ["token=invalid_token"]);

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
    });
  });
});
