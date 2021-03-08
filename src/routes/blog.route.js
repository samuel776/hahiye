import express from 'express';
import { createBlog } from '../controllers/blog';

const route = express.Router();

route.post('/', createBlog);

export default route;