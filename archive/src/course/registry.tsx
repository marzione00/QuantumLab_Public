import React from 'react';
import {chapterOne,ChapterOneDemo} from './chapter-one';
import {chapterTwo,courseChapters} from './catalogue';
import {chapterTwoComponents} from './legacy-tools';
import {bookTwo,bookParts} from './book/chapter-two';
import {chapterThree,chapterFour,partsThree,partsFour} from './algorithms/catalogue';
import {BookTwoLesson,AlgorithmLesson} from './book/views';
import references from './slide-references.json';
export type ChapterId=0|1|2|3|4;
export type Entry={id:string;title:string;short:string;intro:string;part:number;pages:number[];bridge:string};
const refs=references as Record<string,Record<string,number>>;
export const lists:Record<number,Entry[]>={
 1:chapterOne.map(x=>({id:x.id,title:x.title,short:x.short,intro:x.question,part:0,pages:[refs['1'][x.id]],bridge:''})),
 2:bookTwo.map(x=>({...x,pages:[refs['2'][x.id]||319]})),
 3:chapterThree.map(x=>({...x,pages:[refs['3'][x.id]]})),
 4:chapterFour.map(x=>({...x,pages:[refs['4'][String(x.slideChapter)]]}))
};
export const partsByChapter:Record<number,string[]>={1:['Il percorso'],2:bookParts,3:partsThree,4:partsFour};
export const slideFile=(chapter:number)=>chapter===1?'presentazione.pdf':`presentazione-${chapter}.pdf`;
export function RenderLesson({chapter,id}:{chapter:number;id:string}){
 if(chapter===1)return <ChapterOneDemo index={chapterOne.findIndex(x=>x.id===id)}/>;
 if(chapter===2){const book=bookTwo.find(x=>x.id===id)!,legacy=chapterTwo.findIndex(x=>x.id===book.legacy),Tool=chapterTwoComponents[legacy];return <BookTwoLesson id={id} tool={<Tool/>}/>;}
 return <AlgorithmLesson chapter={chapter as 3|4} id={id}/>;
}
export {courseChapters,chapterOne,chapterTwoComponents};
