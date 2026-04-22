import type { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

type AuthRequest = Request & {
  user?: unknown;
};

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.headers.authorization) {
    res.status(401).json({
      code: 401,
      message: "Unauthorized",
    });
    return;
  }

  const token = req.headers.authorization.split(" ")[1];
  const user = await User.findOne({
    token,
    deleted: false,
  }).select("-password -token");

  if (!user) {
    res.status(400).json({
      code: 400,
      message: "Token không hợp lệ!",
    });
    return;
  }

  req.user = user;
  next();
};
