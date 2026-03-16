import { Router, type IRouter } from "express";
import healthRouter from "./health";
import spendRouter from "./spend";
import delegationRouter from "./delegation";

const router: IRouter = Router();

router.use(healthRouter);
router.use(spendRouter);
router.use(delegationRouter);

export default router;
