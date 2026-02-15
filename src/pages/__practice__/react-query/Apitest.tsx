import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export default function Apitest() {
  const postsData = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/');
    const data = (await res.json()) as Post[];

    return data;
  };

  const posts = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: postsData,
  });

  console.log(posts);

  if (posts.isPending) return <div>読み込んでいます...</div>;

  if (!posts.data) return <div>読み込んでいます</div>;

  return (
    <>
      {posts.isLoading ? (
        <h1>読み込み中</h1>
      ) : (
        posts.data.map((post) => (
          <div key={post.id}>
            <Link to={`/test/${post.id}`}>
              <p>{post.title}</p>
            </Link>
          </div>
        ))
      )}
    </>
  );
}
