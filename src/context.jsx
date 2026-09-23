import React,{createContext,useContext,useEffect,useState,useCallback} from 'react';
import {api} from './api';
const Context=createContext();
const read=(key, fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
export function StoreProvider({children}){
 const [store,setStore]=useState(null),[error,setError]=useState(''),[user,setUser]=useState(null),[authReady,setAuthReady]=useState(false),[products,setProducts]=useState([]);
 const [cart,setCart]=useState(()=>{const v=read('bb-cart',[]);return Array.isArray(v)?v.filter(i=>i.productId&&Number.isInteger(i.quantity)&&i.quantity>0):[];}),[wishes,setWishes]=useState(()=>read('bb-wishes',[]));
 const [cartOpen,setCartOpen]=useState(false),[quick,setQuick]=useState(null),[toast,setToast]=useState('');
 const notify=useCallback(msg=>setToast(msg),[]);
 const refresh=useCallback(async()=>{try{const [s,p]=await Promise.all([api('/store'),api('/products?limit=100')]);setStore(s);setProducts(p.products);setError('');}catch(e){setError(e.message);}},[]);
 useEffect(()=>{refresh();api('/auth/me').then(r=>setUser(r.user)).catch(()=>{}).finally(()=>setAuthReady(true));},[refresh]);
 useEffect(()=>{localStorage.setItem('bb-cart',JSON.stringify(cart));},[cart]);
 useEffect(()=>{localStorage.setItem('bb-wishes',JSON.stringify(wishes));},[wishes]);
 useEffect(()=>{if(user)api('/account/wishlist').then(r=>setWishes(w=>[...new Set([...w,...r.ids])])).catch(e=>notify(e.message));},[user?.id]);
 useEffect(()=>{if(user)api('/account/wishlist',{method:'PUT',body:{ids:wishes}}).catch(()=>{});},[wishes]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),3500);return()=>clearTimeout(t);},[toast]);
 useEffect(()=>{if(store)document.documentElement.style.setProperty('--purple',store.settings.primaryColor);},[store]);
 function add(p,quantity=1,variantId=''){const v=p.variants?.find(v=>v.id===variantId);if(p.variants?.length&&!v){setQuick(p);return;}const key=p.id+':'+variantId;const old=cart.find(i=>i.key===key);if((old?.quantity||0)+quantity>(v?.stock??p.stock)){notify('There is not enough stock for that quantity.');return;}setCart(current=>{const item=current.find(i=>i.key===key);return item?current.map(i=>i.key===key?{...i,quantity:i.quantity+quantity}:i):[...current,{key,productId:p.id,variantId,variantName:v?.name||'',name:p.name,price:v?.price??p.price,image:p.images?.[0]||'',type:p.type,quantity}];});notify(p.name+' added to your bag');}
 function updateQuantity(key,n){setCart(items=>n<=0?items.filter(i=>i.key!==key):items.map(i=>i.key===key?{...i,quantity:Math.min(99,n)}:i));}
 function toggleWish(id){setWishes(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);}
 async function logout(){await api('/auth/logout',{method:'POST'});setUser(null);notify('Signed out');}
 return <Context.Provider value={{store,error,refresh,products,user,setUser,authReady,logout,cart,setCart,add,updateQuantity,cartOpen,setCartOpen,quick,setQuick,wishes,toggleWish,notify}}>{children}{toast&&<div className="toast show" role="status">{toast}</div>}</Context.Provider>;
}
export const useStore=()=>useContext(Context);
