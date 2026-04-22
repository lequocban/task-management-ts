import type { Request, Response } from "express";
import User from "../models/user.model";
import ForgotPassword from "../models/forgot-password.model";
import md5 from "md5";
import generateHelper from "../../../helper/generate";
import sendMailHelper from "../../../helper/sendMail";

interface RegisterBody {
  fullName?: string;
  email?: string;
  password?: string;
}

interface LoginBody {
  email?: string;
  password?: string;
}

interface ForgotPasswordBody {
  email?: string;
}

interface OtpPasswordBody {
  email?: string;
  otp?: string;
}

interface ResetPasswordBody {
  password?: string;
  token?: string;
}

type AuthRequest = Request & {
  user?: unknown;
};

// [POST]  /users/register
export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
): Promise<void> => {
  req.body.password = md5(req.body.password || "");

  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (existEmail) {
    res.status(400).json({
      code: 400,
      message: "Email đã tồn tại!",
    });
    return;
  }

  const user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    token: generateHelper.generateRandomString(30),
  });

  await user.save();
  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "Đăng ký thành công!",
    token,
  });
};

// [POST]  /users/login
export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
): Promise<void> => {
  req.body.password = md5(req.body.password || "");
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email,
    deleted: false,
  });

  if (!user) {
    res.status(400).json({
      code: 400,
      message: "Email không tồn tại!",
    });
    return;
  }

  if (user.password !== password) {
    res.status(400).json({
      code: 400,
      message: "Mật khẩu không đúng!",
    });
    return;
  }

  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "Đăng nhập thành công!",
    token,
  });
};

// [POST]  /users/password/forgot
export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordBody>,
  res: Response,
): Promise<void> => {
  const email = req.body.email;
  const user = await User.findOne({
    email,
    deleted: false,
  });

  if (!user) {
    res.status(400).json({
      code: 400,
      message: "Email không tồn tại!",
    });
    return;
  }

  const otp = generateHelper.generateRandomNumber(6);
  const timeExpires = 5;

  await ForgotPassword.create({
    email,
    otp,
    expiredAt: Date.now() + timeExpires * 60 * 1000,
  });

  const subject = "Mã OTP đặt lại mật khẩu của bạn";
  const html = `<p>Chào bạn,</p>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Mã OTP của bạn là:</p>
      <h2> <b>${otp}</b> </h2>
      <p>Lưu ý không chia sẻ mã OTP này với bất kỳ ai.</p>
      <p>Mã OTP này sẽ hết hạn sau 5 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
    `;

  sendMailHelper.sendMail(email || "", subject, html);

  res.json({
    code: 200,
    message: "Mã OTP đã được gửi đến email!",
  });
};

// [POST]  /users/password/otp
export const otpPassword = async (
  req: Request<{}, {}, OtpPasswordBody>,
  res: Response,
): Promise<void> => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email,
    otp,
  });

  if (!result) {
    res.status(400).json({
      code: 400,
      message: "Mã OTP không hợp lệ!",
    });
    return;
  }

  const user = await User.findOne({
    email,
    deleted: false,
  });

  if (!user) {
    res.status(400).json({
      code: 400,
      message: "Người dùng không tồn tại!",
    });
    return;
  }

  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "Xác thực OTP thành công!",
    token,
  });
};

// [POST] /users/password/reset
export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordBody>,
  res: Response,
): Promise<void> => {
  const password = req.body.password || "";

  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : undefined;

  const token = req.cookies?.token || bearerToken || req.body.token;

  if (!token) {
    res.status(401).json({
      code: 401,
      message: "Thiếu token xác thực!",
    });
    return;
  }

  const user = await User.findOne({
    token,
    deleted: false,
  });

  if (!user) {
    res.status(400).json({
      code: 400,
      message: "Người dùng không tồn tại!",
    });
    return;
  }

  if (user.password === md5(password)) {
    res.status(400).json({
      code: 400,
      message: "Mật khẩu mới không được trùng với mật khẩu cũ!",
    });
    return;
  }

  await User.updateOne({ token }, { password: md5(password) });
  res.json({
    code: 200,
    message: "Đặt lại mật khẩu thành công!",
  });
};

// [GET]  /users/detail
export const detail = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    res.json({
      code: 200,
      message: "Lấy thông tin người dùng thành công!",
      user: req.user,
    });
  } catch {
    res.status(400).json({
      code: 400,
      message: "Lấy thông tin người dùng thất bại!",
    });
  }
};

// [GET]  /users/list
export const list = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ deleted: false }).select("fullName email");

    if (!users || users.length === 0) {
      res.status(404).json({
        code: 404,
        message: "Không tìm thấy người dùng!",
      });
      return;
    }

    res.json({
      code: 200,
      message: "Lấy thông tin người dùng thành công!",
      users,
    });
  } catch {
    res.status(400).json({
      code: 400,
      message: "Lấy thông tin người dùng thất bại!",
    });
  }
};
