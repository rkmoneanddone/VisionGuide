type Frame={x:number;y:number;width:number;height:number};
type OcrLine={text:string;frame:Frame};
type OcrBlock={text:string;frame:Frame;lines:OcrLine[]};

export interface LayoutTextResult{rawText:string;layoutText:string;}

function median(values:number[]):number{const v=[...values].sort((a,b)=>a-b);return v.length?v[Math.floor(v.length/2)]:16;}
function normalize(s:string){return s.normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/[ \t]+/g,' ').trim();}

export function rebuildTextFromLayout(rawText:string,blocks:OcrBlock[]|undefined):LayoutTextResult{
 const lines=(blocks??[]).flatMap(block=>(block.lines??[]).map(line=>({text:normalize(line.text),frame:line.frame??block.frame}))).filter(x=>x.text&&x.frame);
 if(lines.length<2)return{rawText,layoutText:rawText};
 const h=Math.max(8,median(lines.map(x=>x.frame.height||0)));
 // Group nearby lines into visual rows first. This prevents right-side QR/warranty text
 // from being inserted into the middle of a left-side product-details paragraph.
 const sorted=[...lines].sort((a,b)=>a.frame.y-b.frame.y||a.frame.x-b.frame.x);
 const rows:{y:number;items:typeof lines}[]=[];
 for(const line of sorted){
  const row=rows.find(r=>Math.abs(r.y-line.frame.y)<=h*.55);
  if(row){row.items.push(line);row.y=(row.y*(row.items.length-1)+line.frame.y)/row.items.length;}else rows.push({y:line.frame.y,items:[line]});
 }
 rows.sort((a,b)=>a.y-b.y);
 const output:string[]=[];
 for(const row of rows){
  row.items.sort((a,b)=>a.frame.x-b.frame.x);
  // Large horizontal separation means separate columns/regions; keep them as separate lines.
  let current='';let right=0;
  for(const item of row.items){
   const gap=item.frame.x-right;
   if(current&&gap>Math.max(h*3,item.frame.height*4)){output.push(current);current=item.text;}
   else current=current?`${current} ${item.text}`:item.text;
   right=item.frame.x+item.frame.width;
  }
  if(current)output.push(current);
 }
 return{rawText,layoutText:output.join('\n')};
}
