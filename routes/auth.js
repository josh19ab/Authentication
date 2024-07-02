const router = require('express').Router();
const { User } = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            console.log("Validation error:", error.details[0].message);
            return res.status(400).render("login", { message: error.details[0].message });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log("User not found:", req.body.email);
            return res.status(401).render("login", { message: "Invalid Email or Password" });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            console.log("Invalid password for user:", req.body.email);
            return res.status(401).render("login", { message: "Invalid Email or Password" });
        }

        const token = user.generateAccessToken();
        res.cookie("token", token, { httpOnly: true });
        res.render("home", { user });

    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).render("login", { message: "Internal Server Error" });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
}

module.exports = router;