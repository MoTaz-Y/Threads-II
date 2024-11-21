"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  userId: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  path: string;
}
export const fetchUser = async (userId: string) => {
  try {
    connectToDB();
    const user = await User.findOne({ id: userId });
    if (user) {
      return {
        id: user.id,
        objectId: user._id.toString(), // Convert ObjectId to a string
        username: user.username,
        name: user.name,
        bio: user.bio,
        image: user.image,
        onboarded: user.onboarded,
      };
    }
    return user;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

export const updateUser = async ({
  userId,
  name,
  username,
  image,
  bio,
  path,
}: Params) => {
  try {
    connectToDB();
    await User.findOneAndUpdate(
      { id: userId },
      { name, username, image, bio, onboarded: true },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    } else {
      return "/";
    }
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

export const fetchAllUsers = async () => {
  try {
    connectToDB();
    return await User.find({});
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

// export const fetchUsers = async ({
//   userId,
//   searchString = "",
//   pageNumber = 1,
//   pageSize = 20,
//   sortBy = "desc",
// }: {
//   userId: string;
//   searchString?: string;
//   pageNumber?: number;
//   pageSize?: number;
//   sortBy?: SortOrder;
// }) => {
//   try {
//     connectToDB();

//     // Fetch all users
//     const skipAmount = (pageNumber - 1) * pageSize;
//     const regex = new RegExp(searchString, "i"); // 'i' flag for case-insensitive search
//     const query: FilterQuery<typeof User> = {
//       id: { $ne: userId }, // Exclude the current user from the results.
//     };

//     if (searchString.trim() !== "") {
//       query.$or = [
//         { username: { $regex: regex } },
//         { name: { $regex: regex } },
//       ];
//     }

//     const usersQuery = await User.find(query)
//       .sort({ createdAt: sortBy })
//       .skip(skipAmount)
//       .limit(pageSize);

//     const totalUsersCount = await User.countDocuments(query);

//     // Return the results with pagination information
//     const users = {
//       users: usersQuery,
//       totalUsersCount,
//       currentPage: pageNumber,
//       pageSize,
//     };
//     return users;
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     throw error;
//   }
// };
