var On=Array.isArray,Jn=Array.from,nt=Object.isFrozen,tt=Object.defineProperty,et=Object.getOwnPropertyDescriptor,Rn=Object.getOwnPropertyDescriptors,rt=Object.prototype,ot=Array.prototype,Dn=Object.getPrototypeOf,on=Map.prototype,Nn=on.set,Cn=on.get;function st(n,t,e){Nn.call(n,t,e)}function ut(n,t){return Cn.call(n,t)}const g=2,L=4,R=8,sn=16,y=32,G=64,S=128,T=256,E=512,x=1024,b=2048,M=4096,gn=8192,un=16384,J=Symbol("$state");function ln(n){return n===this.v}function xn(n,t){return n!=n?t==t:n!==t||n!==null&&typeof n=="object"||typeof n=="function"}function bn(n){return!xn(n,this.v)}const lt=1,it=2,ft=4,at=8,ct=16,_t=64,pt=1,vt=2,dt=4,ht=8,Et=1,mt=2,yt="[",Mn="]",Tt=`${Mn}!`,Pn=Symbol(),wt=["beforeinput","click","dblclick","contextmenu","focusin","focusout","keydown","keyup","mousedown","mousemove","mouseout","mouseover","mouseup","pointerdown","pointermove","pointerout","pointerover","pointerup","touchend","touchmove","touchstart"],At=["touchstart","touchmove","touchend"],kt={formnovalidate:"formNoValidate",ismap:"isMap",nomodule:"noModule",playsinline:"playsInline",readonly:"readOnly"};function qn(n){throw new Error("effect_in_teardown")}function Fn(){throw new Error("effect_in_unowned_derived")}function Ln(n){throw new Error("effect_orphan")}function jn(){throw new Error("effect_update_depth_exceeded")}function St(){throw new Error("hydration_missing_marker_close")}function It(){throw new Error("hydration_missing_marker_open")}function Ot(n){throw new Error("props_invalid_value")}function Hn(){throw new Error("state_unsafe_mutation")}function fn(n){return{f:0,reactions:null,equals:ln,v:n,version:0}}function Rt(n){var e;const t=fn(n);return t.equals=bn,_!==null&&_.l!==null&&((e=_.l).s??(e.s=[])).push(t),t}function Dt(n,t){var e=n.v!==Pn;return!k&&e&&v!==null&&Z()&&v.f&g&&Hn(),n.equals(t)||(n.v=t,n.version++,Z()&&e&&l!==null&&l.f&T&&!(l.f&y)&&(p!==null&&p.includes(n)?(m(l,E),K(l)):A===null?$n([n]):A.push(n)),X(n,E,!0)),t}function Nt(n){var t=document.createElement("template");return t.innerHTML=n,t.content}function Yn(n){if(On(n))for(var t=0;t<n.length;t++){var e=n[t];e.isConnected&&e.remove()}else n.isConnected&&n.remove()}function an(n){l===null&&v===null&&Ln(),W&&qn()}function nn(n,t){var e=t.last;e===null?t.last=t.first=n:(e.next=n,n.prev=e,t.last=n)}function P(n,t,e){var r=(n&G)!==0,o={ctx:_,deps:null,dom:null,f:n|E,first:null,fn:t,last:null,next:null,parent:r?null:l,prev:null,teardown:null,transitions:null};if(v!==null&&!r){var s=v.f;s&g&&(s&S&&Fn(),l!==null&&nn(o,l)),nn(o,v)}if(e){var f=C;try{tn(!0),B(o),o.f|=gn}finally{tn(f)}}else K(o);return o}function Ct(n){if(an(),l!==null&&(l.f&R)!==0&&_!==null&&!_.m){const e=_;(e.e??(e.e=[])).push(n)}else cn(n)}function gt(n){return an(),Un(n)}function xt(n){const t=P(G,n,!0);return()=>{Q(t)}}function cn(n){return P(L,n,!1)}function Un(n){return P(R,n,!0)}function bt(n,t=0){return P(R|sn|t,n,!0)}function Mt(n){return P(R|y,n,!0)}function _n(n){var t=n.teardown;if(t!==null){const e=W;en(!0);try{t.call(null)}finally{en(e)}}}function Q(n){var t=n.dom;if(t!==null&&Yn(t),U(n),Y(n,0),m(n,M),n.transitions)for(const s of n.transitions)s.stop();_n(n);var e=n.parent;if(e!==null&&n.f&y&&e.first!==null){var r=n.prev,o=n.next;r!==null?o!==null?(r.next=o,o.prev=r):(r.next=null,e.last=r):o!==null?(o.prev=null,e.first=o):(e.first=null,e.last=null)}n.next=n.prev=n.teardown=n.ctx=n.dom=n.deps=n.parent=n.fn=null}function Pt(n,t){var e=[];pn(n,e,!0),Bn(e,()=>{Q(n),t&&t()})}function Bn(n,t){var e=n.length;if(e>0){var r=()=>--e||t();for(var o of n)o.out(r)}else t()}function pn(n,t,e){if(!(n.f&b)){if(n.f^=b,n.transitions!==null)for(const f of n.transitions)(f.is_global||e)&&t.push(f);for(var r=n.first;r!==null;){var o=r.next,s=(r.f&un)!==0||(r.f&y)!==0;pn(r,t,s?e:!1),r=o}}}function qt(n){vn(n,!0)}function vn(n,t){if(n.f&b){n.f^=b,q(n)&&B(n);for(var e=n.first;e!==null;){var r=e.next,o=(e.f&un)!==0||(e.f&y)!==0;vn(e,o?t:!1),e=r}if(n.transitions!==null)for(const s of n.transitions)(s.is_global||t)&&s.in()}}const Ft=()=>{};function Lt(n){return n()}function Kn(n){for(var t=0;t<n.length;t++)n[t]()}let j=!1,z=[];function dn(){j=!1;const n=z.slice();z=[],Kn(n)}function jt(n){j||(j=!0,queueMicrotask(dn)),z.push(n)}function Vn(){j&&dn()}function Ht(n){let t=g|E;l===null&&(t|=S);const e={deps:null,deriveds:null,equals:ln,f:t,first:null,fn:n,last:null,reactions:null,v:null,version:0};if(v!==null&&v.f&g){var r=v;r.deriveds===null?r.deriveds=[e]:r.deriveds.push(e)}return e}function hn(n){U(n);var t=n.deriveds;if(t!==null){n.deriveds=null;for(var e=0;e<t.length;e+=1)zn(t[e])}}function En(n,t){hn(n);var e=yn(n),r=(N||n.f&S)&&n.deps!==null?x:T;m(n,r);var o=n.equals(e);return o||(n.v=e,X(n,E,t)),o}function zn(n){hn(n),U(n),Y(n,0),m(n,M),n.first=n.last=n.deps=n.reactions=n.fn=null}const mn=0,Zn=1;let F=mn,H=!1,C=!1,W=!1;function tn(n){C=n}function en(n){W=n}let I=[],O=0,v=null,l=null,p=null,c=0,A=null;function $n(n){A=n}let k=!1,N=!1,_=null;function Z(){return _!==null&&_.l===null}function q(n){var h;var t=n.f,e=(t&E)!==0,r=(t&S)!==0;if(e&&!r)return!0;if(t&x||e&&r){var o=n.deps;if(o!==null)for(var s=o.length,f,d=0;d<s;d++){var u=o[d];if(!e&&q(u)&&(f=En(u,!0)),r){var i=u.version;if(i>n.version)return n.version=i,!f;if(!N&&!((h=u==null?void 0:u.reactions)!=null&&h.includes(n))){var a=u.reactions;a===null?u.reactions=[n]:a.push(n)}}else if(n.f&E)return!0}r||m(n,T)}return e}function yn(n){const t=p,e=c,r=A,o=v,s=N,f=k;p=null,c=0,A=null,v=n,N=!C&&(n.f&S)!==0,k=!1;try{let d=n.fn(),u=n.deps;if(p!==null){let i;if(u!==null){const a=u.length,h=c===0?p:u.slice(0,c).concat(p),D=h.length>16&&a-c>1?new Set(h):null;for(i=c;i<a;i++){const w=u[i];(D!==null?!D.has(w):!h.includes(w))&&Tn(n,w)}}if(u!==null&&c>0)for(u.length=c+p.length,i=0;i<p.length;i++)u[c+i]=p[i];else n.deps=u=p;if(!N)for(i=c;i<u.length;i++){const a=u[i],h=a.reactions;h===null?a.reactions=[n]:h[h.length-1]!==n&&h.push(n)}}else u!==null&&c<u.length&&(Y(n,c),u.length=c);return d}finally{p=t,c=e,A=r,v=o,N=s,k=f}}function Tn(n,t){const e=t.reactions;let r=0;if(e!==null){r=e.length-1;const o=e.indexOf(n);o!==-1&&(r===0?t.reactions=null:(e[o]=e[r],e.pop()))}r===0&&t.f&S&&(m(t,E),Y(t,0))}function Y(n,t){const e=n.deps;if(e!==null){const r=t===0?null:e.slice(0,t);let o;for(o=t;o<e.length;o++){const s=e[o];(r===null||!r.includes(s))&&Tn(n,s)}}}function U(n){let t=n.first;n.first=null,n.last=null;for(var e;t!==null;)e=t.next,Q(t),t=e}function B(n){var t=n.f;if(!(t&M)){m(n,T);var e=n.ctx,r=l,o=_;l=n,_=e;try{t&sn||U(n),_n(n);var s=yn(n);n.teardown=typeof s=="function"?s:null}finally{l=r,_=o}}}function wn(){O>1e3&&(O=0,jn()),O++}function An(n){for(var t=0;t<n.length;t++){var e=n[t];Sn(e,R|L)}}function rn(n){var t=n.length;if(t!==0){wn();for(var e=0;e<t;e++){var r=n[e];!(r.f&(M|b))&&q(r)&&B(r)}}}function Gn(){if(H=!1,O>101)return;const n=I;I=[],An(n),H||(O=0)}function K(n){F===mn&&(H||(H=!0,queueMicrotask(Gn)));for(var t=n;t.parent!==null;){t=t.parent;var e=t.f;if(e&y){if(!(e&T))return;m(t,x)}}I.push(t)}function kn(n,t,e,r){var o=n.first,s=[];n:for(;o!==null;){var f=o.f,d=(f&(M|b))===0,u=f&y,i=(f&T)!==0,a=o.first;if(d&&(!u||!i)){if(u&&m(o,T),f&R){if(u){if(!e&&a!==null){o=a;continue}}else if(q(o)&&(B(o),a=o.first),!e&&a!==null){o=a;continue}}else if(f&L)if(u||i){if(!e&&a!==null){o=a;continue}}else s.push(o)}var h=o.next;if(h===null){let w=o.parent;for(;w!==null;){if(n===w)break n;var V=w.next;if(V!==null){o=V;continue n}w=w.parent}}o=h}if(s.length>0&&(t&L&&r.push(...s),!e))for(var D=0;D<s.length;D++)kn(s[D],t,!1,r)}function Sn(n,t,e=!1){var r=[],o=C;C=!0;try{n.first===null&&!(n.f&y)?rn([n]):(kn(n,t,e,r),rn(r))}finally{C=o}}function Yt(n){O=0,Sn(n,R,!0)}function In(n,t=!0){var e=F,r=I;try{wn();const s=[];F=Zn,I=s,t&&An(r);var o=n==null?void 0:n();return Vn(),(I.length>0||s.length>0)&&In(),O=0,o}finally{F=e,I=r}}async function Ut(){await Promise.resolve(),In()}function Qn(n){const t=n.f;if(t&M)return n.v;if(v!==null&&!(v.f&(y|G))&&!k){const e=(v.f&S)!==0,r=v.deps;p===null&&r!==null&&r[c]===n&&!(e&&l!==null)?c++:(r===null||c===0||r[c-1]!==n)&&(p===null?p=[n]:p.push(n)),A!==null&&l!==null&&l.f&T&&!(l.f&y)&&A.includes(n)&&(m(l,E),K(l))}return t&g&&q(n)&&En(n,!1),n.v}function X(n,t,e){var r=n.reactions;if(r!==null)for(var o=Z(),s=r.length,f=0;f<s;f++){var d=r[f],u=d.f;if(!(u&E||(!e||!o)&&d===l)){m(d,t);var i=(u&x)!==0,a=(u&S)!==0;(u&T||i&&a)&&(d.f&g?X(d,x,e):K(d))}}}function Bt(n){const t=k;try{return k=!0,n()}finally{k=t}}const Wn=~(E|x|T);function m(n,t){n.f=n.f&Wn|t}function Xn(n){return typeof n=="object"&&n!==null&&typeof n.f=="number"}function Kt(n,t=!1,e){_={p:_,c:null,e:null,m:!1,s:n,x:null,l:null},t||(_.l={s:null,u:null,r1:[],r2:fn(!1)})}function Vt(n){const t=_;if(t!==null){const e=t.e;if(e!==null){t.e=null;for(let r=0;r<e.length;r++)cn(e[r])}_=t.p,t.m=!0}return{}}function zt(n){if(!(typeof n!="object"||!n||n instanceof EventTarget)){if(J in n)$(n);else if(!Array.isArray(n))for(let t in n){const e=n[t];typeof e=="object"&&e&&J in e&&$(e)}}}function $(n,t=new Set){if(typeof n=="object"&&n!==null&&!(n instanceof EventTarget)&&!t.has(n)){t.add(n);for(let r in n)try{$(n[r],t)}catch{}const e=Dn(n);if(e!==Object.prototype&&e!==Array.prototype&&e!==Map.prototype&&e!==Set.prototype&&e!==Date.prototype){const r=Rn(e);for(let o in r){const s=r[o].get;if(s)try{s.call(n)}catch{}}}}}function Zt(n){return Xn(n)?Qn(n):n}export{Et as $,Yn as A,qt as B,T as C,Mt as D,Pt as E,un as F,jt as G,Tt as H,Ot as I,dt as J,bn as K,pt as L,ht as M,Ht as N,Ut as O,vt as P,yt as Q,Mn as R,J as S,St as T,Pn as U,In as V,It as W,Jn as X,xt as Y,At as Z,Nt as _,Ct as a,mt as a0,b as a1,lt as a2,it as a3,_t as a4,pn as a5,Bn as a6,Q as a7,ct as a8,ft as a9,at as aa,ut as ab,st as ac,kt as ad,wt as ae,Rn as af,Zt as ag,l as b,_ as c,Bt as d,Lt as e,Yt as f,Qn as g,zt as h,cn as i,Un as j,Vt as k,nt as l,Rt as m,Ft as n,rt as o,Kt as p,ot as q,Kn as r,Dt as s,tt as t,gt as u,fn as v,On as w,et as x,Dn as y,bt as z};