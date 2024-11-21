"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/threads.model";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import { model } from "mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();
    debugger;
    const createdThread = await Thread.create({
      text,
      author,
      community: null, // Assign communityId if provided, or leave it null for personal account
    });
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id }, // Add the created thread ID to the user's 'threads' array
    });
    revalidatePath(path); // Revalidate the cache to make sure the new thread is immediately visible
    return createdThread;
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();
    await Thread.findOneAndDelete({ id });
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function updateThread(id: string, text: string): Promise<void> {
  try {
    connectToDB();
    await Thread.findOneAndUpdate({ id }, { text });
  } catch (error: any) {
    throw new Error(`Failed to update thread: ${error.message}`);
  }
}

export async function fetchthread(id: string) {
  try {
    connectToDB();

    // remeber to populate community
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id name parentId image",
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Failed to fetch thread: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();
    // calculate the number of posts to skip based on the page number and page size
    const skipAmount = (pageNumber - 1) * pageSize;

    //fetch the possts that have no parents (top level threads ... i.e., threads that are not comments/replies)

    const postsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalPosts = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const posts = await postsQuery.exec();
    const isNext = totalPosts > skipAmount + posts.length;
    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch threads: ${error.message}`);
  }
}

export async function addCommentToThread(
  threadId: string,
  userId: string,
  commentText: string,
  path: string
) {
  try {
    connectToDB();
    //find the original thread by its own id
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Thread not found");
    }
    // create the new comment thread
    const commentThread = await Thread.create({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    // save the comment thread
    const savedCommentThread = await commentThread.save();
    // add the comment thread id to the original thread
    originalThread.children.push(savedCommentThread._id);
    // save the original thread
    await originalThread.save();
    // revalidate the cache to make sure the new comment is immediately visible
    revalidatePath(path);
    // return commentThread;
  } catch (error: any) {
    throw new Error(`Failed to add comment to thread: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();
    // fetch the user's posts
    // to do populate community
    const threads = await Thread.find({ author: userId }).populate({
      path: "author",
      model: Thread,
      populate: {
        path: "author",
        model: Thread,
        select: "_id name id image",
      },
    });
    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user's posts: ${error.message}`);
  }
}
