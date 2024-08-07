export const ownerMiddleware = (req, res, next) => {
  if (req?.user?.role === "owner") {
    console.log(req.user);
    next();
  } else {
    res.status(403).json({
      msg: "Access denied",
      variant: "error",
      payload: null,
    });
  }
};
