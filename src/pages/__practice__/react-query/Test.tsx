import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Post } from '@/pages/__practice__/react-query/Apitest';

export default function Test() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const idNum = postId ? Number(postId) : NaN;
  const enabled = Number.isFinite(idNum);

  const post = useQuery<Post>({
    queryKey: ['posts', postId],
    enabled,
    queryFn: async () => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${idNum}`,
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      return (await res.json()) as Post;
    },
  });

  console.log(post);
  console.log(post.data);
  console.log('postId:', idNum);
  console.log(
    'fetch url:',
    `https://jsonplaceholder.typicode.com/posts/${idNum}`,
  );

  if (post.isPending) return <div>読み込んでいます...</div>;

  if (!post.data) return <div>{post.status}</div>;

  return (
    <>
      <button onClick={() => void navigate(-1)}>戻る</button>
      {post.isLoading ? (
        <p>読み込み中...</p>
      ) : (
        <div>
          <p>読み込み成功</p>

          <h2>{post.data.title}</h2>
          <p>{post.data.body}</p>
        </div>
      )}
    </>
  );
}
