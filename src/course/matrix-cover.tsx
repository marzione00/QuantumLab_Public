import type {ReactNode} from 'react';
/** Decorative code is confined to covers; every scientific figure remains independent. */
export function CoverArt({children}:{children:ReactNode}){
 return <div className="matrix-cover-art"><div className="matrix-rain" aria-hidden="true">{['0100101001010010','101101001101','00101011010010101','110100101001','01101001011010','101100101010010','001011010100','110010110101001','010011010101','10010100110110'].map((s,i)=><span key={i}>{s}</span>)}</div>{children}</div>;
}
export function MatrixCover(){
 return <CoverArt><svg viewBox="0 0 520 435" role="img" aria-label="Sfera di Bloch e circuito con tre trasformazioni: preparazione, fase e ricombinazione">
  <g fill="none" stroke="var(--mq-wire)" strokeWidth="1.1">
   <circle cx="262" cy="172" r="123"/>
   <ellipse cx="262" cy="172" rx="123" ry="39" strokeDasharray="5 6"/>
   <path d="M139 172A123 39 0 0 0 385 172"/>
   <ellipse cx="262" cy="172" rx="43" ry="123" strokeDasharray="4 6"/>
   <ellipse cx="262" cy="172" rx="87" ry="123" strokeDasharray="4 6"/>
   <path d="M262 38V306M123 172H401" opacity=".65"/>
  </g>
  <g fontFamily="Consolas,monospace" fontSize="14" fill="var(--mq-muted)"><text x="276" y="44">H</text><text x="276" y="310">V</text><text x="404" y="177">+45°</text></g>
  <path d="M262 172L329 84" stroke="var(--mq-green)" strokeWidth="3"/>
  <path d="M329 84L324 100L314 92Z" fill="var(--mq-green)"/>
  <circle cx="329" cy="84" r="5" fill="var(--mq-green)"/>
  <path d="M262 172L354 195" stroke="var(--mq-blue)" strokeWidth="2" strokeDasharray="4 5"/>
  <circle cx="354" cy="195" r="4" fill="var(--mq-blue)"/>
  <path d="M290 172Q306 184 287 191" fill="none" stroke="var(--mq-amber)" strokeWidth="1.5"/>
  <text x="307" y="186" fontFamily="Georgia,serif" fontSize="18" fill="var(--mq-amber)">φ</text>
  <circle cx="262" cy="172" r="3" fill="var(--mq-text)"/>
  <path d="M57 355H464" stroke="var(--mq-wire)" strokeWidth="1.5"/>
  <g fontFamily="Georgia,serif" fontSize="25" textAnchor="middle">
   <circle cx="58" cy="355" r="5" fill="var(--mq-green)"/>
   {[155,261,367].map((x,i)=><g key={x}><rect x={x-25} y="329" width="50" height="52" rx="4" fill="var(--mq-surface)" stroke={i===1?'var(--mq-blue)':'var(--mq-green)'}/><text x={x} y="364" fill={i===1?'var(--mq-blue)':'var(--mq-green)'}>{i===1?'F':'R'}</text></g>)}
   <path d="M444 373V339H479V373ZM450 361Q462 344 473 361M462 361L469 351" fill="var(--mq-panel)" stroke="var(--mq-muted)" strokeWidth="1.4"/>
  </g>
  <g fill="var(--mq-muted)" fontFamily="Consolas,monospace" fontSize="11" textAnchor="middle"><text x="155" y="405">preparare</text><text x="261" y="405">trasformare</text><text x="367" y="405">ricombinare</text></g>
 </svg></CoverArt>;
}
