const express = require("express");
const postController = require("../controllers/postController");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/image-file");

const router = express.Router();

router.post("", checkAuth, extractFile, postController.createPost);

router.get("", postController.getPosts);

router.get("/:id", postController.getPost);

router.put("/:id", checkAuth, extractFile, postController.updatePost);

router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
