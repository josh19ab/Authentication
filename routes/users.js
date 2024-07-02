const router = require('express').Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            console.log("Validation error:", error.details[0].message);
            return res.status(400).render("register", { message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            console.log("User already exists:", req.body.email);
            return res.status(409).render("register", { message: "User with given email already exists." });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashPassword }).save();
        res.status(201).render("login", { message: "User created successfully. Please login." });

    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).render("register", { message: "Internal Server Error" });
    }
});

module.exports = router;
