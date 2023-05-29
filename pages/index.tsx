import client from "@/config/client";
import { GetStaticPaths, InferGetStaticPropsType } from "next";
import { PortableText } from "@portabletext/react"; //reqd texr field from arr
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
const PostIndex = ({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log(posts);
  return (
    <div className="flex flex-wrap gap-4  p-8">
      {posts &&
        posts.map((post) => (
          <Link href={`post/${post.slug}`} key={post.title}>
            <div className="flex flex-col bg-white border-2 border-transparent gap-1 rounded-md w-80 h-[400px] shadow-lg hover:border-purple-300 relative">
              <div className="w-full h-1/3 relative overflow-hidden">
                <Image
                  src={post.imageUrl}
                  fill
                  alt={post.title}
                  className="object-cover"
                  loading="lazy"
                  blurDataURL={post.imageUrl}
                  placeholder="blur"
                />
              </div>
              <div className="flex flex-col p-2">
                <div className="flex gap-1 items-center">
                  <img
                    src={post.author?.img}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="font-mono text-sm  text-gray-400">
                    {post.author?.name}
                  </p>
                </div>
                <div className="flex items-center text-sm text-gray-50">
                  <span className="w-fit bg-rose-300 px-2 rounded-md my-4">
                    {post.categories}
                  </span>
                </div>
                <hr className="w-4/5 m-auto" />

                <h1 className="font-extrabold text-gray-800 text-3xl my-4">
                  {post.title}
                </h1>
                <PortableText value={post.text} />
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default PostIndex;
type Author = {
  name: string;
  img: string;
};

type Post = {
  title: string;
  author: Author;
  text: [];
  imageUrl: string;
  slug: string;
  categories: string[] | string;
};

export const getStaticProps = async () => {
  const posts: Post[] = await client.fetch(
    `*[_type == "post"]{title,"slug":slug.current,"author":author->{name,"img":image.asset->url}, "text":body[],"imageUrl": mainImage.asset->url,"created":_createdAt, "categories":categories[][0]->title}`
  );
  console.log(posts);
  return { props: { posts }, revalidate: 100 };
};
