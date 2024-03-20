import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'


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