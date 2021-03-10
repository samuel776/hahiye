import utils from '../utils';
import UserControllers from './users';

const User = new UserControllers(utils);

export {
    User,
}