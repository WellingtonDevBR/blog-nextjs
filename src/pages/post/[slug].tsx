import { GetStaticPaths, GetStaticProps } from 'next';
import PrismicDom from 'prismic-dom';
import Header from '../../components/Header';
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './styles/post.module.scss';
import img from './img/img.png'
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import PersonIcon from '@material-ui/icons/Person';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';

interface Slug {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Slug;
}

export default function Post({ post }: PostProps) {

  return (
    <>
      <div className={styles.logoContainer}>
        <img src={img} />
      </div>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.data.title}</h1>
          <div className={styles.memo}>
            <CalendarTodayOutlinedIcon /><span style={{ marginLeft: 5 }}>{post.first_publication_date}</span>
            <PersonIcon style={{ fontSize: 20, marginLeft: 20 }} /><span style={{ marginLeft: 5 }}>{post.data.author}</span>
            <AccessAlarmIcon style={{ fontSize: 20, marginLeft: 20 }} />
          </div>
          {post.data.content.map((post) => (
            <div className={styles.postContent}>
              <h2>{post.heading}</h2>
              <p>{post.body[0]?.text}</p>
            </div>
          ))}

        </article>
      </main>

    </>
  )
}

export const getStaticPaths = async () => {

  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'postt')
  ]);

  const uidPosts = posts.results.map(post => {
    return {
      params: {
        slug: post.uid
      }
    }
  })

  return {
    paths: uidPosts,
    fallback: true
  }
};

export const getStaticProps = async ({ params }) => {

  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('postt', String(slug), {});

  const post = {

    slug: response.slugs,
    first_publication_date: new Date(
      response.first_publication_date
    ).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      content: response.data.content
    }
  }

  return {
    props: {
      post,
    }
  }
};
