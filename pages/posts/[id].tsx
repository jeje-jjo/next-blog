import { getAllPostIds, getPostData } from '@/lib/post'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head  from 'next/head'
import React from 'react'
import postStyle from '../../styles/Post.module.css'

const Post = ({postData} : {
      postData : {
        title : string
        date : string
        contentHtml : string
      }
}) => {
  return (
    <div className={postStyle.container}>
      <Head>
        <title>{postData.title}</title>
      </Head>

      <article>
        <h1 >{postData.title}</h1>
        <div>
          {postData.date}
        </div>
        <div dangerouslySetInnerHTML={{ __html : postData.contentHtml}}/>
      </article>
    </div>
  )
}

export default Post

// path를 가져오기
export const getStaticPaths : GetStaticPaths = async () => {
    const paths = getAllPostIds();

    return {
      paths,
      // fallback 이 false라면 getStaticPaths로 리턴되지 않ㅇ는 것은 모두 404 페이지를 호출함
      // true일 경우 getStaticPaths로 리턴되지 않는 것은 404로 뜨지 않고, fallback 페이지가 뜨게 됨
      fallback : false
    }
}

export const getStaticProps : GetStaticProps = async({params}) => {
    const postData = await getPostData(params.id as string)

    return {
        props : {
          postData
        }
    }
}