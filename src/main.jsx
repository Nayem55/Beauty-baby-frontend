import React,{Suspense,lazy,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Routes,Route,Outlet,useLocation} from 'react-router-dom';
import {StoreProvider,useStore} from './context';
import MarketingIntegrations from './MarketingIntegrations';
import {Header,Footer,CartDrawer,QuickView,Loading,ErrorBox} from './components';
import Home from './Home';
import {Shop,ProductDetail,Wishlist,Checkout,OrderSuccess,Track,Account,StaticPage,NotFound} from './StorePages';
import './design/prototype.css';
import './styles.css';
import './password.css';
const Admin=lazy(()=>import('./admin/Admin'));
class ErrorBoundary extends React.Component{state={error:null};static getDerivedStateFromError(error){return {error};}render(){return this.state.error?<div className="shell store-page"><h1>Something went wrong.</h1><p>Please reload the page to try again.</p><button className="button" onClick={()=>location.reload()}>Reload</button></div>:this.props.children;}}
function Scroll(){const{pathname}=useLocation();useEffect(()=>{window.scrollTo(0,0);document.title=pathname.startsWith('/admin')?'Store admin · Beauty & baby':'Beauty & baby — Care. Play. Glow.';},[pathname]);return null;}
function StoreLayout(){const{store,error,refresh,cartOpen,quick}=useStore();if(!store)return error?<div className="shell store-page"><ErrorBox>{error}</ErrorBox><button className="button" onClick={refresh}>Try again</button></div>:<Loading/>;return <><Header/><main id="main"><Outlet/></main><Footer/>{cartOpen&&<CartDrawer/>}{quick&&!cartOpen&&<QuickView key={quick.id}/>}</>;}
createRoot(document.getElementById('root')).render(<ErrorBoundary><BrowserRouter><StoreProvider><MarketingIntegrations/><Scroll/><Suspense fallback={<Loading/>}><Routes><Route path="/admin/*" element={<Admin/>}/><Route element={<StoreLayout/>}><Route index element={<Home/>}/><Route path="shop" element={<Shop/>}/><Route path="product/:slug" element={<ProductDetail/>}/><Route path="wishlist" element={<Wishlist/>}/><Route path="checkout" element={<Checkout/>}/><Route path="order-success" element={<OrderSuccess/>}/><Route path="track" element={<Track/>}/><Route path="account" element={<Account/>}/><Route path="pages/:slug" element={<StaticPage/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></Suspense></StoreProvider></BrowserRouter></ErrorBoundary>);
