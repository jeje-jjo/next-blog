import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark';
import remarkHtml from 'remark-html';


// 포스트 디렉토리 경로 잡아주기
const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData(){
    // posts 파일 이름 잡아주기
    const fileNames = fs.readdirSync(postsDirectory);

    const allPostsData = fileNames.map(fileName => {

        // file 이름에서 .md 제거
        const id = fileName.replace(/\.md$/, "");

        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf-8');

        const matterResult = matter(fileContents);

        return {
            id,
            ...matterResult.data as {date : string; title : string}
        }
    })

    // Sorting
    return allPostsData.sort((a, b) => {
        if(a.date < b.date){
            return 1;
        }else{
            return -1;
        }
    })
}


// [id].tsx에서 사용하게 될 함수
// 여기에서 사용하게 될 경로를 저장
export function getAllPostIds(){

    // fileName들이 배열 형태로 들어가게 됨
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map(fileName => {
        return {
            params : {
                id : fileName.replace(/\.md$/, '')
            }
        }
    });
}


// 포스트 데이터를 저장
export async function getPostData(id:string){
    const fullPath = path.join(postsDirectory, `${id}.md`)

    // file의 인코딩 문자 설정
    const fileContents = fs.readFileSync(fullPath, 'utf-8')

    // matter 형태의 데이터 저장
    const matterResult = matter(fileContents);

    const processedContent = await remark().use(remarkHtml).process(matterResult.content);

    const contentHtml = processedContent.toString();

    return {
        id, 
        contentHtml,
        ...(matterResult.data as {date : string; title : string })
    }
}