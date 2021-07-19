import { Router } from "express";
import { createCampanhaRouter } from "./routes/campanha/createCampanha";
import { deleteCampanhaRouter } from "./routes/campanha/deleteCampanha";
import { getCampanhaRouter } from "./routes/campanha/getCampanha";
import { whatsSendRouter } from "./routes/campanha/initCampanha";
import { listCampanhaRouter } from "./routes/campanha/listCampanha";
import { updateCampanhaRouter } from "./routes/campanha/updateCampanha";
import { createRegistroRouter } from "./routes/registro/createRegistro";
import { deleteRegistroRouter } from "./routes/registro/deleteRegistro";
import { getRegistroRouter } from "./routes/registro/getRegistro";
import { listRegistrosRouter } from "./routes/registro/listRegistros";
import { updateRegistroRouter } from "./routes/registro/updateRegistro";
import { uploadRouter } from "./routes/upload";
import { changePasswordRouter } from "./routes/user/changePassword";
import { createUserRouter } from "./routes/user/createUser";
import { deleteUserRouter } from "./routes/user/deleteUser";
import { forgotPasswordRouter } from "./routes/user/forgotPassword";
import { listUsersRouter } from "./routes/user/listUsers";
import { loginRouter } from "./routes/user/login";
import { logoutRouter } from "./routes/user/logout";
import { resetPasswordRouter } from "./routes/user/resetPassword";

const userRoutes = [
  createUserRouter,
  loginRouter,
  logoutRouter,
  listUsersRouter,
  deleteUserRouter,
];

const campanhaRoutes = [
  createCampanhaRouter,
  getCampanhaRouter,
  listCampanhaRouter,
  updateCampanhaRouter,
  deleteCampanhaRouter,
];

const registroRouters = [
  createRegistroRouter,
  getRegistroRouter,
  listRegistrosRouter,
  updateRegistroRouter,
  deleteRegistroRouter,
];

const utilsRouters = [
  forgotPasswordRouter,
  resetPasswordRouter,
  changePasswordRouter,
];

const routes: Router[] = [
  ...userRoutes,
  ...campanhaRoutes,
  ...registroRouters,
  ...utilsRouters,
  whatsSendRouter,
  uploadRouter,
];

export { routes };
