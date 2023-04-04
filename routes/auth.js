const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({ storage });

const {
  login,
  register,
  update,
  deleteAccount,
  newPassword,
  updateProfilePicture,
  getAllUsers,
  logOut,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.post("/update" , update);
router.post("/newPassword", newPassword);
router.post("/deleteUser" , deleteAccount);
router.post("/updateProfilePicture/:id",upload.single('image'), updateProfilePicture);
router.get("/allusers/:id", getAllUsers);
router.get("/logout/:id", logOut);

module.exports = router;
