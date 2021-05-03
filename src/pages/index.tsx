import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';
import Prismic from '@prismicio/client'
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import PersonIcon from '@material-ui/icons/Person';
import { RichText } from 'prismic-reactjs';
import Link from 'next/link'
import { useEffect, useState } from 'react';


type Post = {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  banner: ImageBitmap;
  excerpt: string;
  updatedAt: string
};

interface PostsProps {
  getPosts: Post[]
}

let arrayForHoldingPosts = [];
const postsPerPage = 1;

export default function Home({ getPosts }: PostsProps) {

  const [posts, setPost] = useState<Post[]>(getPosts);
  const [nextPage, setNextPage] = useState(1);

  const loopWithSlice = (start, end) => {
    const slicedPosts = posts.slice(start, end);
    arrayForHoldingPosts = [...arrayForHoldingPosts, ...slicedPosts];
    setPost(arrayForHoldingPosts);
  };

  useEffect(() => {
    loopWithSlice(0, postsPerPage);
  }, [nextPage]);

  const handleShowMorePosts = () => {
    console.log(getPosts.length)
    console.log(nextPage);
    if (getPosts.length <= nextPage) {
      return;
    }
    loopWithSlice(nextPage, nextPage + postsPerPage);
    setNextPage(nextPage + postsPerPage)
  }

  return (
    <>
      {
        posts.map(post => (
          <div className={styles.postContainer}>
            <Link href={`/post/${post.slug}`}>
              <h2>
                {post.title}
              </h2>
            </Link>
            <p className={styles.post}>{post.subtitle}</p>
            <div className={styles.date} >
              <CalendarTodayOutlinedIcon style={{ fontSize: 20 }} /><span style={{ marginLeft: 5 }}>{post.updatedAt}</span>
              <PersonIcon style={{ fontSize: 20, marginLeft: 20 }} /><span style={{ marginLeft: 5 }}>{post.author}</span>
            </div>
          </div>
        ))
      }
      <div className={styles.loadPost}>
        <button onClick={handleShowMorePosts}>Load More</button>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    Prismic.predicates.at('document.type', 'postt'),
    {
      fetch: ['postt.title', 'postt.subtitle', 'postt.author', 'postt.banner', 'postt.content'],
      pageSize: 100,
    }
  );

  const getPosts = response.results.map(post => {
    return {
      slug: post.uid,
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
      banner: post.data.banner,
      content: RichText.asText(post.data.content),
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: { getPosts }
  }
};