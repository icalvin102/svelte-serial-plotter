import{a as x,t as y,b as c,d as i,f as I,e as f}from"../chunks/disclose-version.CXrSO0el.js";import{u as k,a as l,c as E,r as b,b as N,C as A,f as C,d as g,e as L,g as m,h as U,n as u,i as j,U as p,s as _,m as w,p as D,j as S,k as T}from"../chunks/runtime.DboeV76f.js";import{s as Z}from"../chunks/entry.CjLRcySJ.js";function q(){const e=E,s=e.l.u;s&&(s.b.length&&k(()=>{var n;d(e),b(s.b);const t=(n=N)==null?void 0:n.parent;t!=null&&!(t.f&A)&&C(t)}),l(()=>{const t=g(()=>s.m.map(L));return()=>{for(const n of t)typeof n=="function"&&n()}}),s.a.length&&l(()=>{d(e),b(s.a)}))}function d(e){if(e.l.s)for(const s of e.l.s)m(s);U(e.s)}function z(e,s,t){if(e==null)return s(void 0),u;const n=e.subscribe(s,t);return n.unsubscribe?()=>n.unsubscribe():n}function B(e,s,t){let n=t[s];const r=n===void 0;r&&(n={store:null,last_value:null,value:w(p),unsubscribe:u},t[s]=n),(r||n.store!==e)&&(n.unsubscribe(),n.store=e??null,n.unsubscribe=F(e,n.value));const a=m(n.value);return a===p?n.last_value:a}function F(e,s){return e==null?(_(s,void 0),u):z(e,t=>_(s,t))}function G(e){H(()=>{let s;for(s in e)e[s].unsubscribe()})}function H(e){j(()=>()=>g(e))}const J=()=>{const e=Z;return{page:{subscribe:e.page.subscribe},navigating:{subscribe:e.navigating.subscribe},updated:e.updated}},K={subscribe(e){return J().page.subscribe(e)}};var M=y("<h1> </h1> <p> </p>",1);function R(e,s){D(s,!1);const t={};G(t);const n=()=>B(K,"$page",t);q();var r=M(),a=I(r),v=i(a),h=f(f(a,!0)),$=i(h);S(()=>{var o;c(v,n().status),c($,(o=n().error)==null?void 0:o.message)}),x(e,r),T()}export{R as component};
