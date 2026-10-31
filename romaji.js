/* Original kana input engine. No external libraries. */
(function(root){
const map={};
function add(k,v){map[k]=v.split(',');}
const rows=[['あいうえお','a i u e o'],['かきくけこ','ka ki ku ke ko'],['さしすせそ','sa si,shi su se so'],['たちつてと','ta ti,chi tu,tsu te to'],['なにぬねの','na ni nu ne no'],['はひふへほ','ha hi hu,fu he ho'],['まみむめも','ma mi mu me mo'],['やゆよ','ya yu yo'],['らりるれろ','ra ri ru re ro'],['わをん','wa wo nn,n\',xn'],['がぎぐげご','ga gi gu ge go'],['ざじずぜぞ','za zi,ji zu ze zo'],['だぢづでど','da di du de do'],['ばびぶべぼ','ba bi bu be bo'],['ぱぴぷぺぽ','pa pi pu pe po']];
rows.forEach(([k,v])=>[...k].forEach((c,i)=>add(c,v.split(' ')[i])));
add('う','u,wu,whu');add('ー','-');
for(const [kana,base] of [['き','ky'],['し','sy,sh'],['ち','ty,ch,cy'],['に','ny'],['ひ','hy'],['み','my'],['り','ry'],['ぎ','gy'],['じ','zy,j,jy'],['ぢ','dy'],['び','by'],['ぴ','py']]){
 for(const [small,vowel] of [['ゃ','a'],['ゅ','u'],['ょ','o']]){
  const direct=base.split(',').map(b=>b+vowel);
  const separate=map[kana].flatMap(b=>['x','l'].map(x=>b+x+'y'+vowel));
  map[kana+small]=[...direct,...separate];
 }
}
for(const [k,v] of [['ゃ','ya'],['ゅ','yu'],['ょ','yo'],['ぁ','a'],['ぃ','i'],['ぅ','u'],['ぇ','e'],['ぉ','o']]) map[k]=['x'+v,'l'+v];
function tokenize(text){const out=[];for(let i=0;i<text.length;i++){if(map[text.slice(i,i+2)]){out.push(text.slice(i,i+2));i++;}else out.push(text[i]);}return out;}
function options(tokens,i){const t=tokens[i];if(t==='っ'){
 const next=i+1<tokens.length?options(tokens,i+1):[];
 return ['xtu','ltu','xtsu','ltsu',...new Set(next.map(x=>x[0]).filter(x=>/[bcdfghjklmpqrstvwxyz]/.test(x)))];
 }const a=[...(map[t]||[])];if(t==='ん'&&tokens[i+1]&&!/^[あいうえおなにぬねのやゆよ]/.test(tokens[i+1]))a.push('n');return a;}
class Input{
 constructor(text){this.tokens=tokenize(text);this.states=[{i:0,p:''}];this.history=[];}
 feed(key){let next=[];for(const s of this.states){for(const word of options(this.tokens,s.i)){if(word.startsWith(s.p+key)){const p=s.p+key;next.push(p===word?{i:s.i+1,p:''}:{i:s.i,p});}}}
 if(!next.length)return false;
 this.history.push(this.states);this.states=next.filter((s,i,a)=>a.findIndex(t=>t.i===s.i&&t.p===s.p)===i);return true;}
 back(){if(this.history.length)this.states=this.history.pop();}
 get done(){return this.states.some(s=>s.i===this.tokens.length);}
 get completed(){return Math.min(...this.states.map(s=>s.i));}
 hint(){const s=[...this.states].sort((a,b)=>b.i-a.i||b.p.length-a.p.length)[0];let result='';for(let i=s.i;i<this.tokens.length;i++)result+=(options(this.tokens,i)[0]||'').slice(i===s.i?s.p.length:0);return result;}
}
root.Romaji={Input,map,tokenize,rows};if(typeof module!=='undefined')module.exports=root.Romaji;
})(typeof window==='undefined'?globalThis:window);
