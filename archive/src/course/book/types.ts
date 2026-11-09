import type {V,R2} from '../math/core';
export type WorkStep={title:string;formula:string;text:string};
export type Diagram={kind:'vectors'|'complex'|'bars'|'orbit'|'numberline'|'grid'|'bloch';title:string;vectors?:{v:R2;label:string;color?:string;from?:R2}[];state?:V;referenceState?:V;values?:number[];labels?:string[];extent?:number;axisLabels?:string[];lines?:{a:R2;b:R2;label?:string;dash?:boolean}[];circles?:number[];weights?:number[];mean?:number;min?:number;max?:number;rowLabels?:string[];columnLabels?:string[];points?:{x:number;y:number;label:string;value?:number}[];xMax?:number;yMax?:number;xLabel?:string;yLabel?:string};
export type WorkedExample={title:string;lead:string;steps:WorkStep[];diagram:Diagram;conclusion:string;state?:V;n?:number;extraFigures?:Diagram[]};
export type BookSection={id:string;title:string;short:string;part:number;intro:string;theory:string[];definition:string;space:string;legacy:string;mode:string;bridge:string};
export const step=(title:string,formula:string,text:string):WorkStep=>({title,formula,text});
