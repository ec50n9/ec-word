import { userAlova } from "..";

export const registerUser = (username: string, password: string) =>
  userAlova.Post<{ uid: string }>("/register-user", {
    username,
    password,
  });

export const loginUser = (username: string, password: string) =>
  userAlova.Post<{ uid: string; accessToken: string }>("/login-user", {
    username,
    password,
  });
