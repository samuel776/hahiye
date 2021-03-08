import BlogModel from "../models/blog";

export const createBlog = async (req, res) => {
  
    const { title, body } = req.body;

    const post = await BlogModel.create(req.body);

    return res.status(201).json({
      success: true,
      data: post,
    });
}
