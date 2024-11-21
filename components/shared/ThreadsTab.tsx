import { fetchUserPosts } from "@/lib/actions/threads.action";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  //fetch all threads
  const result: any = await fetchUserPosts(accountId);

  if (!result) redirect("/");

  if (result.threads.length === 0) {
    return <p className="no-result">No threads found</p>;
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      <h1 className="head-text">Threads</h1>

      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? {
                  name: result.name,
                  image: result.image,
                  id: result._id || result.id,
                }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author._id || thread.author.id,
                }
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
