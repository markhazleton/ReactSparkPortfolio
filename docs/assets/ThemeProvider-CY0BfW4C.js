import{g as x,r as o}from"./index-CHxRQJmu.js";var u={exports:{}};/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/var p;function l(){return p||(p=1,function(r){(function(){var a={}.hasOwnProperty;function s(){for(var t="",n=0;n<arguments.length;n++){var e=arguments[n];e&&(t=c(t,f(e)))}return t}function f(t){if(typeof t=="string"||typeof t=="number")return t;if(typeof t!="object")return"";if(Array.isArray(t))return s.apply(null,t);if(t.toString!==Object.prototype.toString&&!t.toString.toString().includes("[native code]"))return t.toString();var n="";for(var e in t)a.call(t,e)&&t[e]&&(n=c(n,e));return n}function c(t,n){return n?t?t+" "+n:t+n:t}r.exports?(s.default=s,r.exports=s):window.classNames=s})()}(u)),u.exports}var m=l();const v=x(m),B=["xxl","xl","lg","md","sm","xs"],C="xs",i=o.createContext({prefixes:{},breakpoints:B,minBreakpoint:C}),{Consumer:E,Provider:b}=i;function y(r,a){const{prefixes:s}=o.useContext(i);return r||s[a]||a}function A(){const{breakpoints:r}=o.useContext(i);return r}function N(){const{minBreakpoint:r}=o.useContext(i);return r}function S(){const{dir:r}=o.useContext(i);return r==="rtl"}export{S as a,A as b,v as c,N as d,y as u};
