import mongoose from "mongoose";
import bcrypt from "bcrypt"


const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v); // Simple email format validation
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8 // Password should be at least 8 characters long
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)


schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});


const userSchema = mongoose.model("Users", schema)


export default userSchema
