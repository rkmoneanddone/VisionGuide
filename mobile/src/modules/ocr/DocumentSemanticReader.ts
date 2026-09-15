export type DetectedDocumentType='product'|'bill'|'article'|'general';

export interface SemanticReadResult{type:DetectedDocumentType;text:string;}

const PRODUCT_SIGNALS=[/\bbrand\b/i,/\bmodel(?: id)?\b/i,/\bmrp\b/i,/country of origin/i,/package contains/i,/net contents/i,/imported by/i,/manufactur(?:ing|ed)/i,/\bweight\b/i,/\bsize\b/i];
const BILL_SIGNALS=[/amount due/i,/due date/i,/consumer (?:no|number)/i,/bill (?:no|number)/i,/units consumed/i];
const NOISE=[/register your warranty/i,/warranty.?registration/i,/scan me/i,/e-?waste/i,/epr/i,/registration certificate/i,/certificate number/i,/^\s*\|?\s*\d{10,}\s*\|?\s*$/,/^[|Il0-9\s]{12,}$/];

function lines(text:string){return text.split(/\r?\n/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);}
function score(items:string[],signals:RegExp[]){return signals.reduce((n,re)=>n+(items.some(x=>re.test(x))?1:0),0);}

export function detectDocumentType(text:string):DetectedDocumentType{
 const items=lines(text);
 const product=score(items,PRODUCT_SIGNALS);const bill=score(items,BILL_SIGNALS);
 if(product>=3&&product>=bill)return'product';
 if(bill>=3)return'bill';
 if(items.length>=5&&items.filter(x=>x.split(' ').length>=7).length>=3)return'article';
 return'general';
}

function useful(line:string){return !NOISE.some(re=>re.test(line));}
function take(items:string[],re:RegExp){return items.find(x=>re.test(x));}
function add(out:string[],value:string|undefined){if(value&&useful(value)&&!out.some(x=>x.toLowerCase()===value.toLowerCase()))out.push(value);}

function productText(items:string[]):string{
 const clean=items.filter(useful);
 const out:string[]=[];
 const ordered=[
  /\bbrand\s*:/i,/\bmodel\s*:/i,/model id\s*:/i,/colou?r\s*:/i,/generic name\s*:/i,/net contents?\s*:/i,/package contains\s*:/i,
  /\bmrp\s*:/i,/manufactur(?:ing|ed).*\b(?:import|date|month|year)?\s*:/i,/imported by\s*:/i,/customer complaints?/i,/contact\s*\/?.*support\s*:/i,
  /email\s*\/?.*support\s*:/i,/visit\s*:/i,/country of origin\s*:/i,/size\s*(?:\([^)]*\))?\s*:/i,/weight\s*:/i
 ];
 ordered.forEach(re=>add(out,take(clean,re)));
 // Keep substantial descriptive lines not already captured. Do not invent/correct OCR values.
 clean.filter(x=>x.split(' ').length>=5).forEach(x=>add(out,x));
 return out.join('\n');
}

export function buildSemanticReading(text:string):SemanticReadResult{
 const type=detectDocumentType(text);const items=lines(text);
 if(type==='product')return{type,text:productText(items)};
 return{type,text:items.filter(useful).join('\n')};
}
