import * as AuthServices from "../services/AuthServices.js";

export const registerUser = async (req, res) => {
  return AuthServices.register(req, res);
};

export const loginUser = async (req, res) => {
  return AuthServices.login(req, res);
};

export const protectUser = async (req, res, next) => {
  return AuthServices.protect(req, res, next);
};

export const forgotPassword = async (req, res) => {
  return AuthServices.resetPassword(req, res);
};

export const getMe = async (req, res) => {
  return AuthServices.getUser(req, res);
};

export const logoutUser = async (req, res) => {
  return AuthServices.logout(req, res);
};

