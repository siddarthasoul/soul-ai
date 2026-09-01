import {
    UserModel,
    type UserDocument,
} from "../models/user.model.js";

import type { CreateUserInput } from "../validation/user.validation.js"
export class UserRepository {

    async findByEmail(
        email: string
    ): Promise<UserDocument | null> {
        return UserModel.findOne({ email });
    }

    async findById(
        id: string
    ): Promise<UserDocument | null> {
        return UserModel.findById(id);
    }

    async createUser(
        data: CreateUserInput
    ): Promise<UserDocument> {
        return UserModel.create(data);
    }

    async verifyEmailAndSubscribe(
        id: string
    ): Promise<UserDocument | null> {

        return UserModel.findByIdAndUpdate(
            id,
            {
                isEmailVerified: true,
                isSubscribed: true,
            },
            {
                new: true,
            }
        );
    }
}


const userRepository = new UserRepository();

export default userRepository

