export const authorization = (rol) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuario no autenticado" }); // mejor enviar json
    }
    if (req.user.rol !== rol) {
      return res.status(403).json({ error: "Usuario no autorizado" }); // 403 es correcto para falta de permiso
    }
    next();
  };
};
