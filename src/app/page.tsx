// import { db } from "@/server/db";
// import type { inferAsyncReturnType } from "@trpc/server";
// import { posts } from "@/server/db/schema";
// import { revalidatePath } from "next/cache";
// import { eq } from "drizzle-orm";
// import Link from "next/link";

// export default async function Home() {
//   const posts = await db.query.posts.findMany();
//   const postsa = await db.query.posts.findFirst()
//   console.log(postsa);

//   return (
//     <div className="container flex max-w-2xl flex-col gap-24 px-4 py-16">
//       <h1 className="w-full text-6xl text-center">this is home page</h1>
//       <Link className="p-4 bg-amber-200 rounded-2xl" href="/login">login</Link>
//       <div className="flex flex-col text-xl ">
//         <h1 className="text-2xl font-bold">Posts</h1>
//         {posts.map((post) => (
//           <PostView post={post} key={post.id} />
//         ))}
//       </div>

//       <div className="flex flex-col gap-4">
//         <h1 className="text-2xl font-bold">Create a new post</h1>
//         <CreatePost />
//       </div>
//     </div>
//   );
// }

// type PostType = NonNullable<
//   inferAsyncReturnType<typeof db.query.posts.findFirst>
// >;

// function PostView({ post }: { post: PostType }) {
//   async function deletePostAction() {
//     "use server";

//     await db.delete(posts).where(eq(posts.id, post.id)); // Delete post from DB
//     revalidatePath("/vanilla-action"); // Revalidate page to see changed content
//   }

//   return (
//     <div className="flex justify-between p-2 bg-gray-600/10 hover:bg-gray-800/80">
//       {post.name}

//       {/* Note: For actions to work, they have to be IN a form. The action itself can be bound at either via form action={thing} OR button formAction={thing} */}
//       <form>
//         <button
//           formAction={deletePostAction}
//           className="border p-2 font-bold text-red-300"
//         >
//           Delete
//         </button>
//       </form>
//     </div>
//   );
// }

// function CreatePost() {
//   async function  createPostAction(formData: FormData) {
//     "use server";

//     const name = formData.get("post-name") as string; // Get name from formData
//     await db.insert(posts).values({ name }); // Insert into DB
//     revalidatePath("/vanilla-action"); // Revalidate page to see new content
//   }

//   return (
//     <form action={createPostAction}>
//       <input
//         type="text"
//         name="post-name"
//         className="p-4 text-xl text-black bg-gray-700 rounded-2xl"
//         required
//       />
//       <button
//         type="submit"
//         className="ml-4 rounded-xl border bg-white p-4 text-black"
//       >
//         Submit
//       </button>
//     </form>
//   );
// }

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-cyan-900 dark:text-white"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.03}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export default function BackgroundPaths({
    title = "Background Paths",
}: {
    title?: string;
}) {
    const words = title.split(" ");

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-4 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block text-transparent bg-clip-text 
                                        bg-gradient-to-r from-blue-300 to-cyan-800/20 
                                        dark:from-white dark:to-white/80"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    <div
                        className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 
                        dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
                        overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <Link href={"/login"}>
                            <Button
                                variant="ghost"
                                className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                            bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                            text-black dark:text-white transition-all duration-300 
                            group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                            hover:shadow-md dark:hover:shadow-neutral-800/50"
                            >
                                <span className="opacity-90 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600 group-hover:opacity-100 transition-opacity">
                                    Get Started
                                </span>
                                <span
                                    className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                                transition-all duration-300"
                                >
                                    →
                                </span>
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
