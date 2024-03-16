

const validateLoginBody = (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body)
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "email and password are required." });
  }

  next();
};

module.exports = {validateLoginBody};
