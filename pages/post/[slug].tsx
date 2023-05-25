import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import client from "../../config/client";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

const Post = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log(post);
  return (
    <article className="h-screen w-screen flex justify-center">
      <div className="gap-4 flex flex-col w-full">
        <div className="w-full h-1/3 relative">
          <Image
            src={post.imageUrl}
            fill
            alt={post.title}
            loading="lazy"
            blurDataURL={post.imageUrl}
            placeholder="blur"
            className="w-full h-80 object-cover rounded-md"
          />
        </div>
        <div className="flex flex-col w-full p-8">
          <p className="font-mono text-sm  text-gray-400">
            Published: {post.created}
          </p>
          <p className="font-mono text-sm  text-gray-400">
            Autor: {post.author}
          </p>
          <h1 className="font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 my-4">
            {post.title}
          </h1>
          <PortableText value={post.text} />
        </div>
      </div>
    </article>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: string[] = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  );
  console.log(paths);
  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
};

type Post = {
  title: string;
  author: string;
  text: [];
  imageUrl: string;
  created: string;
};
type Slug = { slug: string | "" };

export const getStaticProps = async ({ params }: { params: Slug }) => {
  // It's important to default the slug so that it doesn't return "undefined"
  const slug = params.slug;
  const post: Post = await client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0]{title, "author":author->name,"text":body[],  "imageUrl": mainImage.asset->url, "created":_createdAt}
    `,
    { slug }
  );

  return {
    props: {
      post,
    },
  };
};

export default Post;
