import { Router } from "express";
import * as controllers from "../controllers/user.controller";
import * as validates from "../validates/user.validate";
import { requireAuth } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/register", validates.register, controllers.register);
router.post("/login", validates.login, controllers.login);

router.post("/password/forgot", controllers.forgotPassword);
router.post("/password/otp", controllers.otpPassword);
router.post("/password/reset", controllers.resetPassword);

router.get("/detail", requireAuth, controllers.detail);
router.get("/list", requireAuth, controllers.list);

export const userRoutes: Router = router;

