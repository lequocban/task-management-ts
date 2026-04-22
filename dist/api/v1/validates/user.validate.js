"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const register = (req, res, next) => {
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
exports.register = register;
const login = (req, res, next) => {
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
exports.login = login;
