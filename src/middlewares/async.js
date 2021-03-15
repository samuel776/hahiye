import respond from "../utils/respond";

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(
    fn(req, res, next).catch((err) => {
      if (err.message === "User not found!")
        return respond.error(res, 404, err.message);

      if (err.code === 11000)
        return respond.error(
          res,
          409,
          `Values entered already exist (${err.message})`,
          err
        );
    })
  );

export default asyncHandler;
