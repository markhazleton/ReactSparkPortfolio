import{r as c,R as l,j as a}from"./index-CIqxbFzs.js";import{M as h,C as k}from"./Chat-m1qXggie.js";import{P as i}from"./index-DTzawEW1.js";import{A as O}from"./useMergedRefs-DzEuyGB1.js";import{S as E,C as p}from"./Spinner-CguEJ4AK.js";import{B as b}from"./Button-C4RU11YF.js";var P=["color","size","title","className"];function u(){return u=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var s=arguments[n];for(var t in s)Object.prototype.hasOwnProperty.call(s,t)&&(e[t]=s[t])}return e},u.apply(this,arguments)}function z(e,n){if(e==null)return{};var s=A(e,n),t,r;if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],!(n.indexOf(t)>=0)&&Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}function A(e,n){if(e==null)return{};var s={},t=Object.keys(e),r,o;for(o=0;o<t.length;o++)r=t[o],!(n.indexOf(r)>=0)&&(s[r]=e[r]);return s}var g=c.forwardRef(function(e,n){var s=e.color,t=e.size,r=e.title,o=e.className,m=z(e,P);return l.createElement("svg",u({ref:n,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16",width:t,height:t,fill:s,className:["bi","bi-arrow-repeat",o].filter(Boolean).join(" ")},m),r?l.createElement("title",null,r):null,l.createElement("path",{d:"M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"}),l.createElement("path",{fillRule:"evenodd",d:"M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"}))});g.propTypes={color:i.string,size:i.oneOfType([i.string,i.number]),title:i.string,className:i.string};g.defaultProps={color:"currentColor",size:"1em",title:null,className:""};var M=["color","size","title","className"];function f(){return f=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var s=arguments[n];for(var t in s)Object.prototype.hasOwnProperty.call(s,t)&&(e[t]=s[t])}return e},f.apply(this,arguments)}function S(e,n){if(e==null)return{};var s=B(e,n),t,r;if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],!(n.indexOf(t)>=0)&&Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}function B(e,n){if(e==null)return{};var s={},t=Object.keys(e),r,o;for(o=0;o<t.length;o++)r=t[o],!(n.indexOf(r)>=0)&&(s[r]=e[r]);return s}var j=c.forwardRef(function(e,n){var s=e.color,t=e.size,r=e.title,o=e.className,m=S(e,M);return l.createElement("svg",f({ref:n,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16",width:t,height:t,fill:s,className:["bi","bi-emoji-laughing",o].filter(Boolean).join(" ")},m),r?l.createElement("title",null,r):null,l.createElement("path",{d:"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"}),l.createElement("path",{d:"M12.331 9.5a1 1 0 0 1 0 1A5 5 0 0 1 8 13a5 5 0 0 1-4.33-2.5A1 1 0 0 1 4.535 9h6.93a1 1 0 0 1 .866.5M7 6.5c0 .828-.448 0-1 0s-1 .828-1 0S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 0-1 0s-1 .828-1 0S9.448 5 10 5s1 .672 1 1.5"}))});j.propTypes={color:i.string,size:i.oneOfType([i.string,i.number]),title:i.string,className:i.string};j.defaultProps={color:"currentColor",size:"1em",title:null,className:""};const L=()=>{const[e,n]=c.useState(null),[s,t]=c.useState(!1),[r,o]=c.useState(!1),[m,x]=c.useState(!1),v=async()=>{t(!0),o(!1);try{const d=await fetch("https://v2.jokeapi.dev/joke/Any?safe-mode");if(!d.ok)throw new Error(`HTTP error! status: ${d.status}`);const N=await d.json();n(N)}catch{o(!0)}finally{t(!1)}};c.useEffect(()=>{v()},[]);const y=()=>{x(!0)},w=()=>{x(!1)};return a.jsxs("div",{className:"container mt-5",children:[a.jsxs("div",{className:"bg-light p-5 rounded mb-4 text-center",children:[a.jsx(j,{size:40,className:"mb-3 text-primary"}),r?a.jsx(O,{variant:"danger",children:"Failed to fetch a joke. Please try again later."}):s?a.jsx(E,{animation:"border",role:"status",className:"mb-3"}):e?e.type==="single"?a.jsx("h2",{className:"mb-3",children:e.joke}):a.jsxs(a.Fragment,{children:[a.jsx("h2",{className:"mb-3",children:e.setup}),a.jsx("hr",{}),a.jsx("h3",{className:"fw-bold",children:e.delivery})]}):a.jsx("h2",{children:"No joke available."})]}),a.jsxs("div",{className:"text-center mb-4",children:[a.jsxs(b,{variant:"success",onClick:v,disabled:s,children:[a.jsx(g,{className:"me-2"})," Get Another Joke"]}),a.jsx(b,{variant:"secondary",onClick:y,className:"ms-3",children:"Joke Explainer"})]}),a.jsxs(p,{className:"mb-5",children:[a.jsx(p.Header,{className:"bg-primary text-white",children:"Joke Explainer Video"}),a.jsx(p.Body,{className:"text-center",children:a.jsx("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/R9UPM9fHW-Y?si=njUwkztHdfm_8nBR",title:"YouTube video player",frameBorder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",referrerPolicy:"strict-origin-when-cross-origin",allowFullScreen:!0})}),a.jsx(p.Footer,{className:"text-muted",children:"Enjoy the video and don't forget to subscribe to the channel!  This is a video to explain the Joke Explainer functionality."})]}),a.jsxs(h,{show:m,onHide:w,size:"lg",centered:!0,children:[a.jsx(h.Header,{closeButton:!0,children:a.jsx(h.Title,{children:"Joke Explainer"})}),a.jsx(h.Body,{style:{height:"80vh",overflow:"hidden"},children:a.jsx("div",{style:{height:"100%",overflowY:"auto"},children:a.jsx(k,{variantName:"Joke Explainer",initialMessage:e?e.type==="single"?e.joke:`${e.setup} ${e.delivery}`:"No joke available to explain."})})})]})]})};export{L as default};
