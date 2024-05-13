const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    bookings: { type: [Schema.Types.ObjectId], ref: "accommodations" }
})

/*
 * Middleware that is used before the document is saved to the database.
 * if (this.isModified("password")) is used for not re-hashing the password.
 */
UserSchema.pre("save", async function(next) {
    if (this.isModified("password") || this.isNew) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model("User", UserSchema);