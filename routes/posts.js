const express = require('express');
const { Post, Comment } = require('../models');
const router = express.Router();


router.get('/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findByPk(postId, {
      include: [{ model: User, attributes: ['username'] }, { model: Comment, include: [User] }],
    });

    if (!post) {
      res.render('error');
      return;
    }

    res.render('post', { post, session: req.session });
  } catch (error) {
    console.error(error);
    res.render('error');
  }
});


router.post('/:postId/comment', async (req, res) => {
  const { content } = req.body;
  const postId = req.params.postId;
  const userId = req.session.userId;

  try {
    await Comment.create({ content, postId, userId });
    res.redirect(`/posts/${postId}`);
  } catch (error) {
    console.error(error);
    res.render('error');
  }
});


router.delete('/comment/:commentId', async (req, res) => {
  const commentId = req.params.commentId;

  try {
    await Comment.destroy({ where: { id: commentId } });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



module.exports = router;
