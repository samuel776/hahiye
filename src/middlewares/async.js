import respond from '../utils/respond';

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(
    fn(req, res, next).catch((err) => {
      if (err.message === 'User not found!')
        return respond.error(res, 404, err.message);

      if (err.name === 'CastError')
        return respond.error(
          res,
          404,
          `Resource not found of id ${err.value}`,
          err
        );
      if (err.code === 11000)
        return respond.error(
          console.log(err),
          res,
          409,
          `Values entered already exist (${err.message})`,
          err
        );
    })
  );

export default asyncHandler;
