import {
    Schema,
    model,
    type HydratedDocument,
    type InferSchemaType
}
    from "mongoose";



const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            minLength: [3, "Name must be greater than 2 characters"],
            maxLength: [34, "Name must be less than 35 characters"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },
        dob: {
            type: Date,
            required: [true, "Date of birth is required"],
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isSubscribed: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret: Record<string, any>) => {
                ret.id = ret._id.toString(); 
                delete ret._id;              
                delete ret.__v;              
                return ret;
            },
        }


    }
);

export type UserInput = InferSchemaType<typeof userSchema>;

export type UserDocument = HydratedDocument<UserInput>;

export const UserModel = model<UserInput>("User", userSchema);

