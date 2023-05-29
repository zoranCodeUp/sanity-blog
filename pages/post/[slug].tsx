import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import client from "../../config/client";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { format } from "date-fns";

const Post = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log(post);
  return (
    <>
      {post ? (
        <>
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
                <div className="white-gradient" />
              </div>
              <div className="flex flex-col xl:w-3/4 w-full mx-auto p-8">
                <p className="font-mono text-sm  text-gray-400">
                  Published:{" "}
                  {format(new Date(post.created), "MMMM dd, yyyy HH:mm")}
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
        </>
      ) : (
        <h3>nothing to show</h3>
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: string[] = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current` //defined() '!null'
  );
  console.log(paths);
  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

type Post = {
  title: string;
  author: string;
  text: [];
  imageUrl: string;
  created: string;
};
type Slug = { slug: string | "" }; //slug must NOT be undefined

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
    revalidate: 100, // In seconds
  };
};

export default Post;
