import palette from '../course/matrix-palette.json';
/** Canvas has no CSS cascade: resolve the same paint tokens used by SVG and HTML. */
export function canvasColor(value:string,element:Element):string {
 const token=value.match(/^var\(--mq-([a-z-]+)\)$/)?.[1];
 if(!token)return value;
 return getComputedStyle(element).getPropertyValue('--mq-'+token).trim() || palette.screen[token as keyof typeof palette.screen];
}
export function rgb(hex:string):[number,number,number] {
 return [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];
}
