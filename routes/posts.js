const express = require('express');
const { User, Post, Comment } = require('../models');
const router = express.Router();

// Get a specific post
router.get('/:postId', async (req, res) => {
  const postId = parseInt(req.params.postId, 10);

  if (isNaN(postId)) {
    return res.status(400).send('Invalid post ID');
  }

  try {
    const post = await Post.findByPk(postId, {
      include: [
        { model: User, attributes: ['username'] },
        { model: Comment, include: [User] },
      ],
    });

    if (!post) {
      return res.status(404).send('Post not found');
    }

    res.render('post', { post, session: req.session });
  } catch (error) {
    console.error('Error retrieving post:', error);
    res.status(500).send('Error retrieving post');
  }
});

// Post a comment on a specific post
router.post('/:postId/comment', async (req, res) => {
  const { content } = req.body;
  const postId = parseInt(req.params.postId, 10);
  const userId = req.session.userId;

  if (isNaN(postId) || !userId) {
    return res.redirect('/auth/login');
  }

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    if (!content) {
      return res.status(400).send('Comment content is required');
    }

    await Comment.create({ content, post_id: postId, user_id: userId });
    res.redirect(`/posts/${postId}`);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).send('Error creating comment');
  }
});

// Create a new post
router.post('/create', async (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.redirect('/auth/login');
  }

  try {
    if (!title || !content) {
      return res.status(400).send('Title and content are required');
    }
    
    console.log('Creating post with data:', { title, content, user_id: userId });
    const newPost = await Post.create({ title, content, user_id: userId });
    
    console.log('Post created successfully:', newPost);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Error creating post');
  }
});

// Delete a comment
router.delete('/comment/:commentId', async (req, res) => {
  const commentId = parseInt(req.params.commentId, 10);

  if (isNaN(commentId)) {
    return res.sendStatus(400);
  }

  try {
    await Comment.destroy({ where: { id: commentId } });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
