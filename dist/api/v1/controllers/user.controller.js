"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.detail = exports.resetPassword = exports.otpPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const forgot_password_model_1 = __importDefault(require("../models/forgot-password.model"));
const md5_1 = __importDefault(require("md5"));
const generate_1 = __importDefault(require("../../../helper/generate"));
const sendMail_1 = __importDefault(require("../../../helper/sendMail"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.password = (0, md5_1.default)(req.body.password || "");
    const existEmail = yield user_model_1.default.findOne({
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
    const user = new user_model_1.default({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        token: generate_1.default.generateRandomString(30),
    });
    yield user.save();
    const token = user.token;
    res.cookie("token", token);
    res.json({
        code: 200,
        message: "Đăng ký thành công!",
        token,
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.password = (0, md5_1.default)(req.body.password || "");
    const email = req.body.email;
    const password = req.body.password;
    const user = yield user_model_1.default.findOne({
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
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield user_model_1.default.findOne({
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
    const otp = generate_1.default.generateRandomNumber(6);
    const timeExpires = 5;
    yield forgot_password_model_1.default.create({
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
    sendMail_1.default.sendMail(email || "", subject, html);
    res.json({
        code: 200,
        message: "Mã OTP đã được gửi đến email!",
    });
});
exports.forgotPassword = forgotPassword;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = yield forgot_password_model_1.default.findOne({
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
    const user = yield user_model_1.default.findOne({
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
});
exports.otpPassword = otpPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const password = req.body.password || "";
    const bearerToken = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith("Bearer "))
        ? req.headers.authorization.split(" ")[1]
        : undefined;
    const token = ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.token) || bearerToken || req.body.token;
    if (!token) {
        res.status(401).json({
            code: 401,
            message: "Thiếu token xác thực!",
        });
        return;
    }
    const user = yield user_model_1.default.findOne({
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
    if (user.password === (0, md5_1.default)(password)) {
        res.status(400).json({
            code: 400,
            message: "Mật khẩu mới không được trùng với mật khẩu cũ!",
        });
        return;
    }
    yield user_model_1.default.updateOne({ token }, { password: (0, md5_1.default)(password) });
    res.json({
        code: 200,
        message: "Đặt lại mật khẩu thành công!",
    });
});
exports.resetPassword = resetPassword;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            code: 200,
            message: "Lấy thông tin người dùng thành công!",
            user: req.user,
        });
    }
    catch (_a) {
        res.status(400).json({
            code: 400,
            message: "Lấy thông tin người dùng thất bại!",
        });
    }
});
exports.detail = detail;
const list = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find({ deleted: false }).select("fullName email");
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
    }
    catch (_a) {
        res.status(400).json({
            code: 400,
            message: "Lấy thông tin người dùng thất bại!",
        });
    }
});
exports.list = list;
