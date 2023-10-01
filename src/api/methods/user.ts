import { commonAlova } from "..";

export const registerUser = (username: string, password: string) =>
  commonAlova.Post<{ uid: string }>("/register-user", {
    username,
    password,
  });

export const loginUser = (username: string, password: string) =>
  commonAlova.Post<{ uid: string; accessToken: string }>("/login-user", {
    username,
    password,
  });
