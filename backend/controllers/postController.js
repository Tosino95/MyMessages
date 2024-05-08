const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Fetching posts failed",
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "Post not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Fetching post failed",
      });
    });
};

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: req.file ? (url + "/images/" + req.file.filename) : '',
    creator: req.userData.userId,
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post created successfully",
        post: { ...createdPost, id: createdPost._id },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a post failed!",
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      // console.log(result);
      if (result.matchedCount > 0) {
        return res.status(200).json({
          message: "Post updated successfully",
        });
      } else {
        return res.status(401).json({
          message: "Not authorized to edit this post",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Couldn't update post",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      // console.log(result);

      if (result.deletedCount > 0) {
        return res.status(200).json({
          message: "Post deleted successfully",
        });
      } else {
        return res.status(401).json({
          message: "Not authorized to delete this post",
        });
      }
    }
  ).catch((err) => {
    res.status(500).json({
      message: "Deleting post failed",
    });
  })
};
