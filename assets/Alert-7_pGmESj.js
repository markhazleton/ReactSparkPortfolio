import{u as F,c as R,d as it,a as at}from"./Spinner-CqoPIMNO.js";import{_ as B,r as c,R as y,a as T,j as v}from"./index-BBUXvKCn.js";import{P as L}from"./index-DUs-hFu4.js";function _(){return _=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)({}).hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},_.apply(null,arguments)}function K(t){return"default"+t.charAt(0).toUpperCase()+t.substr(1)}function ut(t){var e=ct(t,"string");return typeof e=="symbol"?e:String(e)}function ct(t,e){if(typeof t!="object"||t===null)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var n=r.call(t,e);if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}function lt(t,e,r){var n=c.useRef(t!==void 0),o=c.useState(e),s=o[0],i=o[1],a=t!==void 0,u=n.current;return n.current=a,!a&&u&&s!==e&&i(e),[a?t:s,c.useCallback(function(f){for(var l=arguments.length,p=new Array(l>1?l-1:0),d=1;d<l;d++)p[d-1]=arguments[d];r&&r.apply(void 0,[f].concat(p)),i(f)},[r])]}function ft(t,e){return Object.keys(e).reduce(function(r,n){var o,s=r,i=s[K(n)],a=s[n],u=B(s,[K(n),n].map(ut)),f=e[n],l=lt(a,i,t[f]),p=l[0],d=l[1];return _({},u,(o={},o[n]=p,o[f]=d,o))},t)}function M(t,e){return M=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(r,n){return r.__proto__=n,r},M(t,e)}function pt(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,M(t,e)}function dt(t){return t&&t.ownerDocument||document}function vt(t){var e=dt(t);return e&&e.defaultView||window}function mt(t,e){return vt(t).getComputedStyle(t,e)}var ht=/([A-Z])/g;function Et(t){return t.replace(ht,"-$1").toLowerCase()}var xt=/^ms-/;function D(t){return Et(t).replace(xt,"-ms-")}var bt=/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;function yt(t){return!!(t&&bt.test(t))}function V(t,e){var r="",n="";if(typeof e=="string")return t.style.getPropertyValue(D(e))||mt(t).getPropertyValue(D(e));Object.keys(e).forEach(function(o){var s=e[o];!s&&s!==0?t.style.removeProperty(D(o)):yt(o)?n+=o+"("+s+") ":r+=D(o)+": "+s+";"}),n&&(r+="transform: "+n+";"),t.style.cssText+=";"+r}const W={disabled:!1},Y=y.createContext(null);var gt=function(e){return e.scrollTop},O="unmounted",x="exited",E="entering",b="entered",A="exiting",h=function(t){pt(e,t);function e(n,o){var s;s=t.call(this,n,o)||this;var i=o,a=i&&!i.isMounting?n.enter:n.appear,u;return s.appearStatus=null,n.in?a?(u=x,s.appearStatus=E):u=b:n.unmountOnExit||n.mountOnEnter?u=O:u=x,s.state={status:u},s.nextCallback=null,s}e.getDerivedStateFromProps=function(o,s){var i=o.in;return i&&s.status===O?{status:x}:null};var r=e.prototype;return r.componentDidMount=function(){this.updateStatus(!0,this.appearStatus)},r.componentDidUpdate=function(o){var s=null;if(o!==this.props){var i=this.state.status;this.props.in?i!==E&&i!==b&&(s=E):(i===E||i===b)&&(s=A)}this.updateStatus(!1,s)},r.componentWillUnmount=function(){this.cancelNextCallback()},r.getTimeouts=function(){var o=this.props.timeout,s,i,a;return s=i=a=o,o!=null&&typeof o!="number"&&(s=o.exit,i=o.enter,a=o.appear!==void 0?o.appear:i),{exit:s,enter:i,appear:a}},r.updateStatus=function(o,s){if(o===void 0&&(o=!1),s!==null)if(this.cancelNextCallback(),s===E){if(this.props.unmountOnExit||this.props.mountOnEnter){var i=this.props.nodeRef?this.props.nodeRef.current:T.findDOMNode(this);i&&gt(i)}this.performEnter(o)}else this.performExit();else this.props.unmountOnExit&&this.state.status===x&&this.setState({status:O})},r.performEnter=function(o){var s=this,i=this.props.enter,a=this.context?this.context.isMounting:o,u=this.props.nodeRef?[a]:[T.findDOMNode(this),a],f=u[0],l=u[1],p=this.getTimeouts(),d=a?p.appear:p.enter;if(!o&&!i||W.disabled){this.safeSetState({status:b},function(){s.props.onEntered(f)});return}this.props.onEnter(f,l),this.safeSetState({status:E},function(){s.props.onEntering(f,l),s.onTransitionEnd(d,function(){s.safeSetState({status:b},function(){s.props.onEntered(f,l)})})})},r.performExit=function(){var o=this,s=this.props.exit,i=this.getTimeouts(),a=this.props.nodeRef?void 0:T.findDOMNode(this);if(!s||W.disabled){this.safeSetState({status:x},function(){o.props.onExited(a)});return}this.props.onExit(a),this.safeSetState({status:A},function(){o.props.onExiting(a),o.onTransitionEnd(i.exit,function(){o.safeSetState({status:x},function(){o.props.onExited(a)})})})},r.cancelNextCallback=function(){this.nextCallback!==null&&(this.nextCallback.cancel(),this.nextCallback=null)},r.safeSetState=function(o,s){s=this.setNextCallback(s),this.setState(o,s)},r.setNextCallback=function(o){var s=this,i=!0;return this.nextCallback=function(a){i&&(i=!1,s.nextCallback=null,o(a))},this.nextCallback.cancel=function(){i=!1},this.nextCallback},r.onTransitionEnd=function(o,s){this.setNextCallback(s);var i=this.props.nodeRef?this.props.nodeRef.current:T.findDOMNode(this),a=o==null&&!this.props.addEndListener;if(!i||a){setTimeout(this.nextCallback,0);return}if(this.props.addEndListener){var u=this.props.nodeRef?[this.nextCallback]:[i,this.nextCallback],f=u[0],l=u[1];this.props.addEndListener(f,l)}o!=null&&setTimeout(this.nextCallback,o)},r.render=function(){var o=this.state.status;if(o===O)return null;var s=this.props,i=s.children;s.in,s.mountOnEnter,s.unmountOnExit,s.appear,s.enter,s.exit,s.timeout,s.addEndListener,s.onEnter,s.onEntering,s.onEntered,s.onExit,s.onExiting,s.onExited,s.nodeRef;var a=B(s,["children","in","mountOnEnter","unmountOnExit","appear","enter","exit","timeout","addEndListener","onEnter","onEntering","onEntered","onExit","onExiting","onExited","nodeRef"]);return y.createElement(Y.Provider,{value:null},typeof i=="function"?i(o,a):y.cloneElement(y.Children.only(i),a))},e}(y.Component);h.contextType=Y;h.propTypes={};function w(){}h.defaultProps={in:!1,mountOnEnter:!1,unmountOnExit:!1,appear:!1,enter:!0,exit:!0,onEnter:w,onEntering:w,onEntered:w,onExit:w,onExiting:w,onExited:w};h.UNMOUNTED=O;h.EXITED=x;h.ENTERING=E;h.ENTERED=b;h.EXITING=A;const Ct=!!(typeof window<"u"&&window.document&&window.document.createElement);var U=!1,I=!1;try{var P={get passive(){return U=!0},get once(){return I=U=!0}};Ct&&(window.addEventListener("test",P,P),window.removeEventListener("test",P,!0))}catch{}function wt(t,e,r,n){if(n&&typeof n!="boolean"&&!I){var o=n.once,s=n.capture,i=r;!I&&o&&(i=r.__once||function a(u){this.removeEventListener(e,a,s),r.call(this,u)},r.__once=i),t.addEventListener(e,i,U?n:s)}t.addEventListener(e,r,n)}function St(t,e,r,n){var o=n&&typeof n!="boolean"?n.capture:n;t.removeEventListener(e,r,o),r.__once&&t.removeEventListener(e,r.__once,o)}function Z(t,e,r,n){return wt(t,e,r,n),function(){St(t,e,r,n)}}function Tt(t,e,r,n){if(n===void 0&&(n=!0),t){var o=document.createEvent("HTMLEvents");o.initEvent(e,r,n),t.dispatchEvent(o)}}function Ot(t){var e=V(t,"transitionDuration")||"",r=e.indexOf("ms")===-1?1e3:1;return parseFloat(e)*r}function Rt(t,e,r){r===void 0&&(r=5);var n=!1,o=setTimeout(function(){n||Tt(t,"transitionend",!0)},e+r),s=Z(t,"transitionend",function(){n=!0},{once:!0});return function(){clearTimeout(o),s()}}function Nt(t,e,r,n){r==null&&(r=Ot(t)||0);var o=Rt(t,r,n),s=Z(t,"transitionend",e);return function(){o(),s()}}function G(t,e){const r=V(t,e)||"",n=r.indexOf("ms")===-1?1e3:1;return parseFloat(r)*n}function Dt(t,e){const r=G(t,"transitionDuration"),n=G(t,"transitionDelay"),o=Nt(t,s=>{s.target===t&&(o(),e(s))},r+n)}function kt(t){t.offsetHeight}const X=t=>!t||typeof t=="function"?t:e=>{t.current=e};function jt(t,e){const r=X(t),n=X(e);return o=>{r&&r(o),n&&n(o)}}function Lt(t,e){return c.useMemo(()=>jt(t,e),[t,e])}function Pt(t){return t&&"setState"in t?T.findDOMNode(t):t??null}const _t=y.forwardRef(({onEnter:t,onEntering:e,onEntered:r,onExit:n,onExiting:o,onExited:s,addEndListener:i,children:a,childRef:u,...f},l)=>{const p=c.useRef(null),d=Lt(p,u),g=C=>{d(Pt(C))},m=C=>j=>{C&&p.current&&C(p.current,j)},S=c.useCallback(m(t),[t]),N=c.useCallback(m(e),[e]),k=c.useCallback(m(r),[r]),nt=c.useCallback(m(n),[n]),rt=c.useCallback(m(o),[o]),ot=c.useCallback(m(s),[s]),st=c.useCallback(m(i),[i]);return v.jsx(h,{ref:l,...f,onEnter:S,onEntered:k,onEntering:N,onExit:nt,onExited:ot,onExiting:rt,addEndListener:st,nodeRef:p,children:typeof a=="function"?(C,j)=>a(C,{...j,ref:g}):y.cloneElement(a,{ref:g})})});function Mt(t){const e=c.useRef(t);return c.useEffect(()=>{e.current=t},[t]),e}function z(t){const e=Mt(t);return c.useCallback(function(...r){return e.current&&e.current(...r)},[e])}const q=it("h4");q.displayName="DivStyledAsH4";const J=c.forwardRef(({className:t,bsPrefix:e,as:r=q,...n},o)=>(e=F(e,"alert-heading"),v.jsx(r,{ref:o,className:R(t,e),...n})));J.displayName="AlertHeading";const At=["onKeyDown"];function Ut(t,e){if(t==null)return{};var r={};for(var n in t)if({}.hasOwnProperty.call(t,n)){if(e.indexOf(n)>=0)continue;r[n]=t[n]}return r}function It(t){return!t||t.trim()==="#"}const Q=c.forwardRef((t,e)=>{let{onKeyDown:r}=t,n=Ut(t,At);const[o]=at(Object.assign({tagName:"a"},n)),s=z(i=>{o.onKeyDown(i),r==null||r(i)});return It(n.href)||n.role==="button"?v.jsx("a",Object.assign({ref:e},n,o,{onKeyDown:s})):v.jsx("a",Object.assign({ref:e},n,{onKeyDown:r}))});Q.displayName="Anchor";const tt=c.forwardRef(({className:t,bsPrefix:e,as:r=Q,...n},o)=>(e=F(e,"alert-link"),v.jsx(r,{ref:o,className:R(t,e),...n})));tt.displayName="AlertLink";function $t(){const t=c.version.split(".");return{major:+t[0],minor:+t[1],patch:+t[2]}}const Ft={[E]:"show",[b]:"show"},$=c.forwardRef(({className:t,children:e,transitionClasses:r={},onEnter:n,...o},s)=>{const i={in:!1,timeout:300,mountOnEnter:!1,unmountOnExit:!1,appear:!1,...o},a=c.useCallback((l,p)=>{kt(l),n==null||n(l,p)},[n]),{major:u}=$t(),f=u>=19?e.props.ref:e.ref;return v.jsx(_t,{ref:s,addEndListener:Dt,...i,onEnter:a,childRef:f,children:(l,p)=>c.cloneElement(e,{...p,className:R("fade",t,e.props.className,Ft[l],r[l])})})});$.displayName="Fade";const Ht={"aria-label":L.string,onClick:L.func,variant:L.oneOf(["white"])},H=c.forwardRef(({className:t,variant:e,"aria-label":r="Close",...n},o)=>v.jsx("button",{ref:o,type:"button",className:R("btn-close",e&&`btn-close-${e}`,t),"aria-label":r,...n}));H.displayName="CloseButton";H.propTypes=Ht;const et=c.forwardRef((t,e)=>{const{bsPrefix:r,show:n=!0,closeLabel:o="Close alert",closeVariant:s,className:i,children:a,variant:u="primary",onClose:f,dismissible:l,transition:p=$,...d}=ft(t,{show:"onClose"}),g=F(r,"alert"),m=z(k=>{f&&f(!1,k)}),S=p===!0?$:p,N=v.jsxs("div",{role:"alert",...S?void 0:d,ref:e,className:R(i,g,u&&`${g}-${u}`,l&&`${g}-dismissible`),children:[l&&v.jsx(H,{onClick:m,"aria-label":o,variant:s}),a]});return S?v.jsx(S,{unmountOnExit:!0,...d,ref:void 0,in:n,children:N}):n?N:null});et.displayName="Alert";const Xt=Object.assign(et,{Link:tt,Heading:J});export{Xt as A,Lt as a,ft as b,z as u};