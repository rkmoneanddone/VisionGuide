export type DetectedDocumentType='product'|'bill'|'article'|'general';
export type ProductCategory='medical'|'electronics'|'food'|'cosmetic'|'household'|'clothing'|'book'|'automotive'|'toy'|'hardware'|'general';

export interface SemanticReadResult{type:DetectedDocumentType;productCategory?:ProductCategory;text:string;}

const PRODUCT_SIGNALS=[/\bbrand\b/i,/\bmodel(?: id)?\b/i,/\bmrp\b/i,/country of origin/i,/package contains/i,/net contents/i,/imported by/i,/manufactur(?:ing|ed)/i,/\bweight\b/i,/\bsize\b/i,/ingredients?/i,/batch/i,/expiry|exp\.?\s*date/i];
const BILL_SIGNALS=[/amount due/i,/due date/i,/consumer (?:no|number)/i,/bill (?:no|number)/i,/units consumed/i,/invoice/i,/subtotal/i,/grand total/i];
const NOISE=[/register your warranty/i,/warranty.?registration/i,/scan me/i,/e-?waste/i,/epr/i,/registration certificate/i,/certificate number/i,/^\s*\|?\s*\d{10,}\s*\|?\s*$/,/^[|Il0-9\s]{12,}$/];

const CATEGORY_SIGNALS:Record<Exclude<ProductCategory,'general'>,RegExp[]>={
 medical:[/\btablet(?:s)?\b/i,/\bcapsule(?:s)?\b/i,/\bsyrup\b/i,/\binjection\b/i,/\bointment\b/i,/\bcream\b/i,/\bmg\b/i,/\bml\b/i,/composition/i,/dosage/i,/schedule [hxh1]/i,/prescription/i,/batch (?:no|number)/i,/expiry|exp\.?\s*date/i],
 electronics:[/\bmodel(?: id| no| number)?\b/i,/input\s*:/i,/output\s*:/i,/\bvolt(?:age)?\b/i,/\bwatts?\b/i,/\bmah\b/i,/\bhz\b/i,/usb|type[- ]?c|bluetooth|wi-?fi/i,/adapter|charger|earphone|headphone|speaker|power bank/i],
 food:[/nutrition/i,/ingredients?/i,/allergen/i,/energy/i,/protein/i,/carbohydrate/i,/sugar/i,/fat\b/i,/best before/i,/fssai/i,/veg(?:etarian)?|non[- ]?veg/i],
 cosmetic:[/cosmetic/i,/skin|hair|face|shampoo|conditioner|serum|lotion|moistur/i,/apply|application/i,/dermatolog/i,/for external use/i],
 household:[/cleaner|detergent|disinfectant|floor wash|dishwash/i,/directions? for use/i,/keep out of reach/i,/caution|warning/i,/hazard/i],
 clothing:[/\bsize\b/i,/fabric/i,/cotton|polyester|viscose|wool|silk|linen/i,/wash care|machine wash|hand wash|do not bleach/i,/garment/i],
 book:[/\bisbn\b/i,/author/i,/publisher/i,/edition/i,/printed by/i,/copyright/i],
 automotive:[/engine oil|motor oil|coolant|brake fluid|lubricant/i,/sae\s*\d/i,/api\s+[a-z]{2}/i,/vehicle|automotive/i],
 toy:[/\btoy\b/i,/ages?\s*\d|\d+\s*\+\s*years/i,/choking hazard/i,/not suitable for children/i],
 hardware:[/drill|screw|bolt|nut|spanner|wrench|tool kit|blade/i,/\bmm\b/i,/diameter/i,/stainless steel/i]
};

function lines(text:string){return text.split(/\r?\n/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);}
function score(items:string[],signals:RegExp[]){return signals.reduce((n,re)=>n+(items.some(x=>re.test(x))?1:0),0);}
function useful(line:string){return !NOISE.some(re=>re.test(line));}
function take(items:string[],re:RegExp){return items.find(x=>re.test(x));}
function add(out:string[],value:string|undefined){if(value&&useful(value)&&!out.some(x=>x.toLowerCase()===value.toLowerCase()))out.push(value);}

export function detectDocumentType(text:string):DetectedDocumentType{
 const items=lines(text);
 const product=score(items,PRODUCT_SIGNALS);const bill=score(items,BILL_SIGNALS);
 if(product>=3&&product>=bill)return'product';
 if(bill>=3)return'bill';
 if(items.length>=5&&items.filter(x=>x.split(' ').length>=7).length>=3)return'article';
 return'general';
}

export function detectProductCategory(text:string):ProductCategory{
 const items=lines(text);let best:ProductCategory='general';let bestScore=0;
 (Object.keys(CATEGORY_SIGNALS) as Array<Exclude<ProductCategory,'general'>>).forEach(category=>{
  const value=score(items,CATEGORY_SIGNALS[category]);
  if(value>bestScore){best=category;bestScore=value;}
 });
 // Require multiple independent clues. A single word such as "size" or "warning" must not force a category.
 return bestScore>=2?best:'general';
}

const COMMON_ORDER=[/\bbrand\s*:/i,/product name\s*:/i,/generic name\s*:/i,/\bmodel\s*:/i,/model id\s*:/i,/colou?r\s*:/i];
const CATEGORY_ORDER:Record<ProductCategory,RegExp[]>={
 medical:[/composition\s*:/i,/strength\s*:/i,/dosage form\s*:/i,/dosage\s*:/i,/warning\s*:/i,/batch\s*(?:no|number)?\s*:/i,/mfg\.?\s*(?:date)?\s*:/i,/exp(?:iry)?\.?\s*(?:date)?\s*:/i,/manufactur(?:ed|er)/i],
 electronics:[/input\s*:/i,/output\s*:/i,/power\s*:/i,/voltage\s*:/i,/capacity\s*:/i,/compatib/i,/package contains\s*:/i,/net contents?\s*:/i],
 food:[/net (?:weight|quantity|contents?)\s*:/i,/ingredients?\s*:/i,/allergen/i,/nutrition/i,/energy\s*:/i,/protein\s*:/i,/carbohydrate\s*:/i,/sugar\s*:/i,/fat\s*:/i,/best before/i,/fssai/i],
 cosmetic:[/net contents?\s*:/i,/ingredients?\s*:/i,/directions?\s*:/i,/how to use/i,/warning\s*:/i,/for external use/i,/exp(?:iry)?/i],
 household:[/net contents?\s*:/i,/directions?\s*:/i,/how to use/i,/caution\s*:/i,/warning\s*:/i,/hazard/i,/ingredients?\s*:/i],
 clothing:[/\bsize\s*:/i,/colou?r\s*:/i,/material\s*:/i,/fabric\s*:/i,/wash care/i,/care instructions?/i],
 book:[/title\s*:/i,/author\s*:/i,/publisher\s*:/i,/edition\s*:/i,/isbn\s*:/i],
 automotive:[/grade\s*:/i,/viscosity\s*:/i,/specification\s*:/i,/capacity\s*:/i,/directions?\s*:/i,/warning\s*:/i],
 toy:[/age\s*:/i,/ages?\s+/i,/contents?\s*:/i,/warning\s*:/i,/choking hazard/i],
 hardware:[/\bsize\s*:/i,/material\s*:/i,/diameter\s*:/i,/dimensions?\s*:/i,/specification\s*:/i],
 general:[/net contents?\s*:/i,/package contains\s*:/i,/\bsize\s*:/i,/\bweight\s*:/i]
};
const TRADE_ORDER=[/\bmrp\s*:/i,/manufactur(?:ing|ed|er).*:/i,/imported by\s*:/i,/marketed by\s*:/i,/country of origin\s*:/i,/customer complaints?/i,/contact\s*\/?.*support\s*:/i,/email\s*\/?.*support\s*:/i,/website\s*:/i,/visit\s*:/i];

function productText(items:string[],category:ProductCategory):string{
 const clean=items.filter(useful);const out:string[]=[];
 [...COMMON_ORDER,...CATEGORY_ORDER[category],...TRADE_ORDER].forEach(re=>add(out,take(clean,re)));
 // Preserve useful OCR verbatim. Semantic reading may reorder or omit noise, but never correct or invent values.
 clean.filter(x=>x.split(' ').length>=5).forEach(x=>add(out,x));
 return out.join('\n');
}

export function buildSemanticReading(text:string):SemanticReadResult{
 const type=detectDocumentType(text);const items=lines(text);
 if(type==='product'){
  const productCategory=detectProductCategory(text);
  return{type,productCategory,text:productText(items,productCategory)};
 }
 return{type,text:items.filter(useful).join('\n')};
}
