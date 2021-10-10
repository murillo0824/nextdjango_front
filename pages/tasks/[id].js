import { useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { getAllTasksIds, getTaskData} from "../../lib/tasks";

const fetcher = (url)=> fetch(url).then((res)=>res.json());

export default function Post({staticTask, id}){
  const router= useRouter();
  const {data:task, mutate} = useSWR(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-task/${id}`,
    fetcher,
    {
      fallbackData:staticTask
    }
  );
  useEffect(()=>{
    mutate();
  },[]);

  if(!task || router.isFallback){
    return <div>Loading ...</div>;
  }

  return(<Layout title={`task no ${task.id}`}>
    <span className="mb-4">
      {"id : "}{task.id}
    </span>
    <p className="mb-4 font-bold text-xl">
      {task.title}
    </p>
    <p className="mb-12">
      {task.created_at}
    </p>
    <Link href="/task-page">
        <div className="flex cursor-pointer mt-12">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
          <span className="hover:bg-indigo-600 transition-all duration-500">
            back to blog list
          </span>
        </div>
      </Link>
  </Layout>);
}

export async function getStaticPaths(){
  const paths = await getAllTasksIds();
  return{
    paths,
    fallback:true,
  };
}

export async function getStaticProps({params}){
  const {task: staticTask}= await getTaskData(params.id);
  return {
    props:{
      id:staticTask.id,
      staticTask,
    },
    revalidate:3,
  }
}

