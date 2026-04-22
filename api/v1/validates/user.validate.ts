import { Request, Response, NextFunction } from "express";

interface RegisterBody {
  fullName?: string;
  email?: string;
  password?: string;
}

interface LoginBody {
  email?: string;
  password?: string;
}

export const register = (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.body.fullName) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập họ tên!",
    });
    return;
  }

  if (!req.body.email) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập email!",
    });
    return;
  }

  if (!req.body.password) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập mật khẩu!",
    });
    return;
  }

  next();
};

export const login = (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.body.email) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập email!",
    });
    return;
  }

  if (!req.body.password) {
    res.status(400).json({
      code: 400,
      message: "Vui lòng nhập mật khẩu!",
    });
    return;
  }

  next();
};
