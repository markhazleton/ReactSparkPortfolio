import{r as m,$ as c,j as l}from"./index-D1hWe7m3.js";import{u as N,f as w,c as O,S as P,A as E}from"./Spinner-DZjKQBjZ.js";import{P as i}from"./index-DtM9BUZN.js";var k=["color","size","title","className"];function g(){return g=Object.assign||function(e){for(var s=1;s<arguments.length;s++){var a=arguments[s];for(var t in a)Object.prototype.hasOwnProperty.call(a,t)&&(e[t]=a[t])}return e},g.apply(this,arguments)}function A(e,s){if(e==null)return{};var a=z(e,s),t,r;if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(r=0;r<n.length;r++)t=n[r],!(s.indexOf(t)>=0)&&Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}function z(e,s){if(e==null)return{};var a={},t=Object.keys(e),r,n;for(n=0;n<t.length;n++)r=t[n],!(s.indexOf(r)>=0)&&(a[r]=e[r]);return a}var u=m.forwardRef(function(e,s){var a=e.color,t=e.size,r=e.title,n=e.className,o=A(e,k);return c.createElement("svg",g({ref:s,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16",width:t,height:t,fill:a,className:["bi","bi-arrow-repeat",n].filter(Boolean).join(" ")},o),r?c.createElement("title",null,r):null,c.createElement("path",{d:"M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"}),c.createElement("path",{fillRule:"evenodd",d:"M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"}))});u.propTypes={color:i.string,size:i.oneOfType([i.string,i.number]),title:i.string,className:i.string};u.defaultProps={color:"currentColor",size:"1em",title:null,className:""};var $=["color","size","title","className"];function d(){return d=Object.assign||function(e){for(var s=1;s<arguments.length;s++){var a=arguments[s];for(var t in a)Object.prototype.hasOwnProperty.call(a,t)&&(e[t]=a[t])}return e},d.apply(this,arguments)}function B(e,s){if(e==null)return{};var a=S(e,s),t,r;if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(r=0;r<n.length;r++)t=n[r],!(s.indexOf(t)>=0)&&Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}function S(e,s){if(e==null)return{};var a={},t=Object.keys(e),r,n;for(n=0;n<t.length;n++)r=t[n],!(s.indexOf(r)>=0)&&(a[r]=e[r]);return a}var v=m.forwardRef(function(e,s){var a=e.color,t=e.size,r=e.title,n=e.className,o=B(e,$);return c.createElement("svg",d({ref:s,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16",width:t,height:t,fill:a,className:["bi","bi-emoji-laughing",n].filter(Boolean).join(" ")},o),r?c.createElement("title",null,r):null,c.createElement("path",{d:"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"}),c.createElement("path",{d:"M12.331 9.5a1 1 0 0 1 0 1A5 5 0 0 1 8 13a5 5 0 0 1-4.33-2.5A1 1 0 0 1 4.535 9h6.93a1 1 0 0 1 .866.5M7 6.5c0 .828-.448 0-1 0s-1 .828-1 0S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 0-1 0s-1 .828-1 0S9.448 5 10 5s1 .672 1 1.5"}))});v.propTypes={color:i.string,size:i.oneOfType([i.string,i.number]),title:i.string,className:i.string};v.defaultProps={color:"currentColor",size:"1em",title:null,className:""};const j=m.forwardRef(({as:e,bsPrefix:s,variant:a="primary",size:t,active:r=!1,disabled:n=!1,className:o,...f},p)=>{const h=N(s,"btn"),[x,{tagName:y}]=w({tagName:e,disabled:n,...f}),b=y;return l.jsx(b,{...x,...f,ref:p,disabled:n,className:O(o,h,r&&"active",a&&`${h}-${a}`,t&&`${h}-${t}`,f.href&&n&&"disabled")})});j.displayName="Button";const C=()=>{const[e,s]=m.useState(null),[a,t]=m.useState(!1),[r,n]=m.useState(!1),o=async()=>{t(!0),n(!1);try{const p=await(await fetch("https://v2.jokeapi.dev/joke/Any?safe-mode")).json();s(p)}catch{n(!0)}finally{t(!1)}};return m.useEffect(()=>{o()},[]),a?l.jsx("div",{className:"d-flex justify-content-center align-items-center",style:{height:"100vh"},children:l.jsx(P,{animation:"border",variant:"primary"})}):r?l.jsxs("div",{className:"d-flex flex-column justify-content-center align-items-center",style:{height:"100vh"},children:[l.jsx(E,{variant:"danger",className:"text-center",children:"Failed to fetch the joke. Please try again."}),l.jsxs(j,{variant:"primary",onClick:o,children:[l.jsx(u,{className:"me-2"})," Retry"]})]}):l.jsxs("div",{className:"container mt-5",children:[l.jsxs("div",{className:"bg-light p-5 rounded mb-4 text-center",children:[l.jsx(v,{size:40,className:"mb-3 text-primary"}),e?e.type==="single"?l.jsx("h2",{className:"mb-3",children:e.joke}):l.jsxs(l.Fragment,{children:[l.jsx("h2",{className:"mb-3",children:e.setup}),l.jsx("hr",{}),l.jsx("h3",{className:"fw-bold",children:e.delivery})]}):l.jsx("h2",{children:"No joke available."})]}),l.jsx("div",{className:"text-center",children:l.jsxs(j,{variant:"success",onClick:o,children:[l.jsx(u,{className:"me-2"})," Get Another Joke"]})})]})};export{C as default};