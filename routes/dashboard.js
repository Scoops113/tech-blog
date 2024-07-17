const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../models'); 

router.get('/', async (req, res) => {
  try {
    const userId = req.session.userId; 
    if (!userId) {
      return res.status(401).send('Unauthorized');
    }

    
    const posts = await Post.findAll({
      where: { userId }, 
      include: [
        { model: User, attributes: ['username'] }, 
        { model: Comment, attributes: ['id', 'comment_text', 'createdAt'] }, 
      ],
      order: [['createdAt', 'DESC']], 
    });

    
    res.render('dashboard', { posts });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
