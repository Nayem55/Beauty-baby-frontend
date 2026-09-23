const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:1009` : '')).replace(/\/$/, '');
export async function api(path, options={}) {
 const isForm=options.body instanceof FormData;
 const response=await fetch(API_ORIGIN+'/api'+path,{credentials:'include',...options,headers:{...(!isForm&&options.body?{'Content-Type':'application/json'}:{}),...options.headers},body:options.body?(isForm?options.body:JSON.stringify(options.body)):undefined});
 const data=await response.json().catch(()=>({error:'The server returned an unexpected response.'}));
 if(!response.ok)throw Object.assign(new Error(data.error||'Request failed'),{status:response.status});return data;
}
export const money=n=>'৳'+Number(n||0).toLocaleString('en-BD',{maximumFractionDigits:2});
export const date=s=>new Date(s).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
export const slug=s=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function download(name,content,type='application/json'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
export function csv(rows){if(!rows.length)return '';const cols=Object.keys(rows[0]);const cell=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';return '\uFEFF'+[cols,...rows.map(r=>cols.map(c=>r[c]))].map(row=>row.map(cell).join(',')).join('\r\n');}
