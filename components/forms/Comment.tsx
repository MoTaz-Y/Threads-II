"use client";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import Profile from "../../public/assets/profile.svg";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CommentValidation } from "@/lib/validations/Thread";
import { connectToDB } from "@/lib/mongoose";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/threads.action";
interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  // const { organization } = useOrganization();

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    console.log(values);
    await addCommentToThread(
      threadId,
      JSON.parse(currentUserId),
      values.thread,
      pathname
    );
    form.reset();
  };
  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full item-center  gap-3">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="Profile image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent ">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className=" no-focus border border-dark-4 outline-none text-light-1"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
