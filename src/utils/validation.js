const validateSignupData = (req) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.about) {
        return { valid: false, message: "firstName, lastName, email, password, and about are required." };
    }
    if (req.body.password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long." };
    }
    if (req.body.age < 18) {
        return { valid: false, message: "Age must be at least 18." };
    }
    if (!["male", "female", "other"].includes(req.body.gender)) {
        return { valid: false, message: "Gender must be 'male', 'female', or 'other'." };
    }
    return { valid: true, message: "Data is valid." };
}

const validatePassword = (password) => {
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long." };
    }
    return { valid: true }
}
module.exports = { validateSignupData, validatePassword };