(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e,t){if(e===void 0||!e.document)throw Error(`jQuery requires a window with a document`);var n=[],r=Object.getPrototypeOf,i=n.slice,a=n.flat?function(e){return n.flat.call(e)}:function(e){return n.concat.apply([],e)},o=n.push,s=n.indexOf,c={},l=c.toString,u=c.hasOwnProperty,d=u.toString,f=d.call(Object),p={};function m(e){return e==null?e+``:typeof e==`object`?c[l.call(e)]||`object`:typeof e}function h(e){return e!=null&&e===e.window}function g(e){var t=!!e&&e.length,n=m(e);return typeof e==`function`||h(e)?!1:n===`array`||t===0||typeof t==`number`&&t>0&&t-1 in e}var _=e.document,v={type:!0,src:!0,nonce:!0,noModule:!0};function y(e,t,n){n||=_;var r,i=n.createElement(`script`);for(r in i.text=e,v)t&&t[r]&&(i[r]=t[r]);n.head.appendChild(i).parentNode&&i.parentNode.removeChild(i)}var b=`4.0.0`,x=/HTML$/i,S=function(e,t){return new S.fn.init(e,t)};S.fn=S.prototype={jquery:b,constructor:S,length:0,toArray:function(){return i.call(this)},get:function(e){return e==null?i.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)},map:function(e){return this.pushStack(S.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(i.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},even:function(){return this.pushStack(S.grep(this,function(e,t){return(t+1)%2}))},odd:function(){return this.pushStack(S.grep(this,function(e,t){return t%2}))},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()}},S.extend=S.fn.extend=function(){var e,t,n,r,i,a,o=arguments[0]||{},s=1,c=arguments.length,l=!1;for(typeof o==`boolean`&&(l=o,o=arguments[s]||{},s++),typeof o!=`object`&&typeof o!=`function`&&(o={}),s===c&&(o=this,s--);s<c;s++)if((e=arguments[s])!=null)for(t in e)r=e[t],!(t===`__proto__`||o===r)&&(l&&r&&(S.isPlainObject(r)||(i=Array.isArray(r)))?(n=o[t],a=i&&!Array.isArray(n)?[]:!i&&!S.isPlainObject(n)?{}:n,i=!1,o[t]=S.extend(l,a,r)):r!==void 0&&(o[t]=r));return o},S.extend({expando:`jQuery`+(b+Math.random()).replace(/\D/g,``),isReady:!0,error:function(e){throw Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!e||l.call(e)!==`[object Object]`?!1:(t=r(e),t?(n=u.call(t,`constructor`)&&t.constructor,typeof n==`function`&&d.call(n)===f):!0)},isEmptyObject:function(e){for(var t in e)return!1;return!0},globalEval:function(e,t,n){y(e,{nonce:t&&t.nonce},n)},each:function(e,t){var n,r=0;if(g(e))for(n=e.length;r<n&&t.call(e[r],r,e[r])!==!1;r++);else for(r in e)if(t.call(e[r],r,e[r])===!1)break;return e},text:function(e){var t,n=``,r=0,i=e.nodeType;if(!i)for(;t=e[r++];)n+=S.text(t);return i===1||i===11?e.textContent:i===9?e.documentElement.textContent:i===3||i===4?e.nodeValue:n},makeArray:function(e,t){var n=t||[];return e!=null&&(g(Object(e))?S.merge(n,typeof e==`string`?[e]:e):o.call(n,e)),n},inArray:function(e,t,n){return t==null?-1:s.call(t,e,n)},isXMLDoc:function(e){var t=e&&e.namespaceURI,n=e&&(e.ownerDocument||e).documentElement;return!x.test(t||n&&n.nodeName||`HTML`)},contains:function(e,t){var n=t&&t.parentNode;return e===n||!!(n&&n.nodeType===1&&(e.contains?e.contains(n):e.compareDocumentPosition&&e.compareDocumentPosition(n)&16))},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r,i=[],a=0,o=e.length,s=!n;a<o;a++)r=!t(e[a],a),r!==s&&i.push(e[a]);return i},map:function(e,t,n){var r,i,o=0,s=[];if(g(e))for(r=e.length;o<r;o++)i=t(e[o],o,n),i!=null&&s.push(i);else for(o in e)i=t(e[o],o,n),i!=null&&s.push(i);return a(s)},guid:1,support:p}),typeof Symbol==`function`&&(S.fn[Symbol.iterator]=n[Symbol.iterator]),S.each(`Boolean Number String Function Array Date RegExp Object Error Symbol`.split(` `),function(e,t){c[`[object `+t+`]`]=t.toLowerCase()});function C(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var w=n.pop,T=`[\\x20\\t\\r\\n\\f]`,E=_.documentMode,ee=E&&RegExp(`:enabled|:disabled|\\[`+T+`*name`+T+`*=`+T+`*(?:''|"")`),te=RegExp(`^`+T+`+|((?:^|[^\\\\])(?:\\\\.)*)`+T+`+$`,`g`),D=`(?:\\\\[\\da-fA-F]{1,6}`+T+`?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+`,ne=RegExp(`^`+T+`*([>+~]|`+T+`)`+T+`*`),re=RegExp(T+`|>`),O=/[+~]/,ie=_.documentElement,ae=ie.matches||ie.msMatchesSelector;function oe(){var e=[];function t(n,r){return e.push(n+` `)>S.expr.cacheLength&&delete t[e.shift()],t[n+` `]=r}return t}function se(e){return e&&e.getElementsByTagName!==void 0&&e}var ce=`\\[`+T+`*(`+D+`)(?:`+T+`*([*^$|!~]?=)`+T+`*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(`+D+`))|)`+T+`*\\]`,le=`:(`+D+`)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|`+ce+`)*)|.*)\\)|)`,ue={ID:RegExp(`^#(`+D+`)`),CLASS:RegExp(`^\\.(`+D+`)`),TAG:RegExp(`^(`+D+`|[*])`),ATTR:RegExp(`^`+ce),PSEUDO:RegExp(`^`+le),CHILD:RegExp(`^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(`+T+`*(even|odd|(([+-]|)(\\d*)n|)`+T+`*(?:([+-]|)`+T+`*(\\d+)|))`+T+`*\\)|)`,`i`)},de=new RegExp(le),k=RegExp(`\\\\[\\da-fA-F]{1,6}`+T+`?|\\\\([^\\r\\n\\f])`,`g`),fe=function(e,t){var n=`0x`+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,n&1023|56320))};function pe(e){return e.replace(k,fe)}function A(e){S.error(`Syntax error, unrecognized expression: `+e)}var j=RegExp(`^`+T+`*,`+T+`*`),M=oe();function me(e,t){var n,r,i,a,o,s,c,l=M[e+` `];if(l)return t?0:l.slice(0);for(o=e,s=[],c=S.expr.preFilter;o;){for(a in(!n||(r=j.exec(o)))&&(r&&(o=o.slice(r[0].length)||o),s.push(i=[])),n=!1,(r=ne.exec(o))&&(n=r.shift(),i.push({value:n,type:r[0].replace(te,` `)}),o=o.slice(n.length)),ue)(r=S.expr.match[a].exec(o))&&(!c[a]||(r=c[a](r)))&&(n=r.shift(),i.push({value:n,type:a,matches:r}),o=o.slice(n.length));if(!n)break}return t?o.length:o?A(e):M(e,s).slice(0)}var he={ATTR:function(e){return e[1]=pe(e[1]),e[3]=pe(e[3]||e[4]||e[5]||``),e[2]===`~=`&&(e[3]=` `+e[3]+` `),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),e[1].slice(0,3)===`nth`?(e[3]||A(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*(e[3]===`even`||e[3]===`odd`)),e[5]=+(e[7]+e[8]||e[3]===`odd`)):e[3]&&A(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return ue.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||``:n&&de.test(n)&&(t=me(n,!0))&&(t=n.indexOf(`)`,n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}};function N(e){for(var t=0,n=e.length,r=``;t<n;t++)r+=e[t].value;return r}function P(e,t,n,r,i,a,o){var s=0,c=e.length,l=n==null;if(m(n)===`object`)for(s in i=!0,n)P(e,t,s,n[s],!0,a,o);else if(r!==void 0&&(i=!0,typeof r!=`function`&&(o=!0),l&&(o?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(S(e),n)})),t))for(;s<c;s++)t(e[s],n,o?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):c?t(e[0],n):a}var ge=/[^\x20\t\r\n\f]+/g;S.fn.extend({attr:function(e,t){return P(this,S.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){S.removeAttr(this,e)})}}),S.extend({attr:function(e,t,n){var r,i,a=e.nodeType;if(!(a===3||a===8||a===2)){if(e.getAttribute===void 0)return S.prop(e,t,n);if((a!==1||!S.isXMLDoc(e))&&(i=S.attrHooks[t.toLowerCase()]),n!==void 0){if(n===null||n===!1&&t.toLowerCase().indexOf(`aria-`)!==0){S.removeAttr(e,t);return}return i&&`set`in i&&(r=i.set(e,n,t))!==void 0?r:(e.setAttribute(t,n),n)}return i&&`get`in i&&(r=i.get(e,t))!==null?r:(r=e.getAttribute(t),r??void 0)}},attrHooks:{},removeAttr:function(e,t){var n,r=0,i=t&&t.match(ge);if(i&&e.nodeType===1)for(;n=i[r++];)e.removeAttribute(n)}}),E&&(S.attrHooks.type={set:function(e,t){if(t===`radio`&&C(e,`input`)){var n=e.value;return e.setAttribute(`type`,t),n&&(e.value=n),t}}});var F=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;function _e(e,t){return t?e===`\0`?`�`:e.slice(0,-1)+`\\`+e.charCodeAt(e.length-1).toString(16)+` `:`\\`+e}S.escapeSelector=function(e){return(e+``).replace(F,_e)};var ve=n.sort,I=n.splice,ye;function L(e,t){if(e===t)return ye=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(n=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1,n&1?e==_||e.ownerDocument==_&&S.contains(_,e)?-1:t==_||t.ownerDocument==_&&S.contains(_,t)?1:0:n&4?-1:1)}S.uniqueSort=function(e){var t,n=[],r=0,i=0;if(ye=!1,ve.call(e,L),ye){for(;t=e[i++];)t===e[i]&&(r=n.push(i));for(;r--;)I.call(e,n[r],1)}return e},S.fn.uniqueSort=function(){return this.pushStack(S.uniqueSort(i.apply(this)))};var be,xe,R,Se,Ce,we=0,Te=0,Ee=oe(),z=oe(),De=oe(),Oe=RegExp(T+`+`,`g`),ke=RegExp(`^`+D+`$`),Ae=S.extend({needsContext:RegExp(`^`+T+`*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(`+T+`*((?:-\\d)?\\d*)`+T+`*\\)|)(?=[^-]|$)`,`i`)},ue),je=/^(?:input|select|textarea|button)$/i,Me=/^h\d$/i,Ne=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,Pe=function(){U()},Fe=Be(function(e){return e.disabled===!0&&C(e,`fieldset`)},{dir:`parentNode`,next:`legend`});function B(e,t,n,r){var i,a,s,c,l,u,d,f=t&&t.ownerDocument,p=t?t.nodeType:9;if(n||=[],typeof e!=`string`||!e||p!==1&&p!==9&&p!==11)return n;if(!r&&(U(t),t||=R,Ce)){if(p!==11&&(l=Ne.exec(e))){if(i=l[1]){if(p===9)return(s=t.getElementById(i))&&o.call(n,s),n;if(f&&(s=f.getElementById(i))&&S.contains(t,s))return o.call(n,s),n}else if(l[2])return o.apply(n,t.getElementsByTagName(e)),n;else if((i=l[3])&&t.getElementsByClassName)return o.apply(n,t.getElementsByClassName(i)),n}if(!De[e+` `]&&(!ee||!ee.test(e))){if(d=e,f=t,p===1&&(re.test(e)||ne.test(e))){for(f=O.test(e)&&se(t.parentNode)||t,(f!=t||E)&&((c=t.getAttribute(`id`))?c=S.escapeSelector(c):t.setAttribute(`id`,c=S.expando)),u=me(e),a=u.length;a--;)u[a]=(c?`#`+c:`:scope`)+` `+N(u[a]);d=u.join(`,`)}try{return o.apply(n,f.querySelectorAll(d)),n}catch{De(e,!0)}finally{c===S.expando&&t.removeAttribute(`id`)}}}return Je(e.replace(te,`$1`),t,n,r)}function Ie(e){return e[S.expando]=!0,e}function V(e){return function(t){return C(t,`input`)&&t.type===e}}function Le(e){return function(t){return(C(t,`input`)||C(t,`button`))&&t.type===e}}function Re(e){return function(t){return`form`in t?t.parentNode&&t.disabled===!1?`label`in t?`label`in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&Fe(t)===e:t.disabled===e:`label`in t?t.disabled===e:!1}}function H(e){return Ie(function(t){return t=+t,Ie(function(n,r){for(var i,a=e([],n.length,t),o=a.length;o--;)n[i=a[o]]&&(n[i]=!(r[i]=n[i]))})})}function U(e){var t,n=e?e.ownerDocument||e:_;n==R||n.nodeType!==9||(R=n,Se=R.documentElement,Ce=!S.isXMLDoc(R),E&&_!=R&&(t=R.defaultView)&&t.top!==t&&t.addEventListener(`unload`,Pe))}for(be in B.matches=function(e,t){return B(e,null,null,t)},B.matchesSelector=function(e,t){if(U(e),Ce&&!De[t+` `]&&(!ee||!ee.test(t)))try{return ae.call(e,t)}catch{De(t,!0)}return B(t,R,null,[e]).length>0},S.expr={cacheLength:50,createPseudo:Ie,match:Ae,find:{ID:function(e,t){if(t.getElementById!==void 0&&Ce){var n=t.getElementById(e);return n?[n]:[]}},TAG:function(e,t){return t.getElementsByTagName===void 0?t.querySelectorAll(e):t.getElementsByTagName(e)},CLASS:function(e,t){if(t.getElementsByClassName!==void 0&&Ce)return t.getElementsByClassName(e)}},relative:{">":{dir:`parentNode`,first:!0}," ":{dir:`parentNode`},"+":{dir:`previousSibling`,first:!0},"~":{dir:`previousSibling`}},preFilter:he,filter:{ID:function(e){var t=pe(e);return function(e){return e.getAttribute(`id`)===t}},TAG:function(e){var t=pe(e).toLowerCase();return e===`*`?function(){return!0}:function(e){return C(e,t)}},CLASS:function(e){var t=Ee[e+` `];return t||(t=RegExp(`(^|`+T+`)`+e+`(`+T+`|$)`))&&Ee(e,function(e){return t.test(typeof e.className==`string`&&e.className||e.getAttribute!==void 0&&e.getAttribute(`class`)||``)})},ATTR:function(e,t,n){return function(r){var i=S.attr(r,e);return i==null?t===`!=`:t?(i+=``,t===`=`?i===n:t===`!=`?i!==n:t===`^=`?n&&i.indexOf(n)===0:t===`*=`?n&&i.indexOf(n)>-1:t===`$=`?n&&i.slice(-n.length)===n:t===`~=`?(` `+i.replace(Oe,` `)+` `).indexOf(n)>-1:t===`|=`?i===n||i.slice(0,n.length+1)===n+`-`:!1):!0}},CHILD:function(e,t,n,r,i){var a=e.slice(0,3)!==`nth`,o=e.slice(-4)!==`last`,s=t===`of-type`;return r===1&&i===0?function(e){return!!e.parentNode}:function(t,n,c){var l,u,d,f,p,m=a===o?`previousSibling`:`nextSibling`,h=t.parentNode,g=s&&t.nodeName.toLowerCase(),_=!c&&!s,v=!1;if(h){if(a){for(;m;){for(d=t;d=d[m];)if(s?C(d,g):d.nodeType===1)return!1;p=m=e===`only`&&!p&&`nextSibling`}return!0}if(p=[o?h.firstChild:h.lastChild],o&&_){for(u=h[S.expando]||(h[S.expando]={}),l=u[e]||[],f=l[0]===we&&l[1],v=f&&l[2],d=f&&h.childNodes[f];d=++f&&d&&d[m]||(v=f=0)||p.pop();)if(d.nodeType===1&&++v&&d===t){u[e]=[we,f,v];break}}else if(_&&(u=t[S.expando]||(t[S.expando]={}),l=u[e]||[],f=l[0]===we&&l[1],v=f),v===!1)for(;(d=++f&&d&&d[m]||(v=f=0)||p.pop())&&!((s?C(d,g):d.nodeType===1)&&++v&&(_&&(u=d[S.expando]||(d[S.expando]={}),u[e]=[we,v]),d===t)););return v-=i,v===r||v%r===0&&v/r>=0}}},PSEUDO:function(e,t){var n=S.expr.pseudos[e]||S.expr.setFilters[e.toLowerCase()]||A(`unsupported pseudo: `+e);return n[S.expando]?n(t):n}},pseudos:{not:Ie(function(e){var t=[],n=[],r=qe(e.replace(te,`$1`));return r[S.expando]?Ie(function(e,t,n,i){for(var a,o=r(e,null,i,[]),s=e.length;s--;)(a=o[s])&&(e[s]=!(t[s]=a))}):function(e,i,a){return t[0]=e,r(t,null,a,n),t[0]=null,!n.pop()}}),has:Ie(function(e){return function(t){return B(e,t).length>0}}),contains:Ie(function(e){return e=pe(e),function(t){return(t.textContent||S.text(t)).indexOf(e)>-1}}),lang:Ie(function(e){return ke.test(e||``)||A(`unsupported lang: `+e),e=pe(e).toLowerCase(),function(t){var n;do if(n=Ce?t.lang:t.getAttribute(`xml:lang`)||t.getAttribute(`lang`))return n=n.toLowerCase(),n===e||n.indexOf(e+`-`)===0;while((t=t.parentNode)&&t.nodeType===1);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===Se},focus:function(e){return e===R.activeElement&&R.hasFocus()&&!!(e.type||e.href||~e.tabIndex)},enabled:Re(!1),disabled:Re(!0),checked:function(e){return C(e,`input`)&&!!e.checked||C(e,`option`)&&!!e.selected},selected:function(e){return E&&e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!S.expr.pseudos.empty(e)},header:function(e){return Me.test(e.nodeName)},input:function(e){return je.test(e.nodeName)},button:function(e){return C(e,`input`)&&e.type===`button`||C(e,`button`)},text:function(e){return C(e,`input`)&&e.type===`text`},first:H(function(){return[0]}),last:H(function(e,t){return[t-1]}),eq:H(function(e,t,n){return[n<0?n+t:n]}),even:H(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:H(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:H(function(e,t,n){for(var r=n<0?n+t:n>t?t:n;--r>=0;)e.push(r);return e}),gt:H(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}},S.expr.pseudos.nth=S.expr.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})S.expr.pseudos[be]=V(be);for(be in{submit:!0,reset:!0})S.expr.pseudos[be]=Le(be);function ze(){}ze.prototype=S.expr.pseudos,S.expr.setFilters=new ze;function Be(e,t,n){var r=t.dir,i=t.next,a=i||r,o=n&&a===`parentNode`,s=Te++;return t.first?function(t,n,i){for(;t=t[r];)if(t.nodeType===1||o)return e(t,n,i);return!1}:function(t,n,c){var l,u,d=[we,s];if(c){for(;t=t[r];)if((t.nodeType===1||o)&&e(t,n,c))return!0}else for(;t=t[r];)if(t.nodeType===1||o){if(u=t[S.expando]||(t[S.expando]={}),i&&C(t,i))t=t[r]||t;else if((l=u[a])&&l[0]===we&&l[1]===s)return d[2]=l[2];else if(u[a]=d,d[2]=e(t,n,c))return!0}return!1}}function Ve(e){return e.length>1?function(t,n,r){for(var i=e.length;i--;)if(!e[i](t,n,r))return!1;return!0}:e[0]}function He(e,t,n){for(var r=0,i=t.length;r<i;r++)B(e,t[r],n);return n}function Ue(e,t,n,r,i){for(var a,o=[],s=0,c=e.length,l=t!=null;s<c;s++)(a=e[s])&&(!n||n(a,r,i))&&(o.push(a),l&&t.push(s));return o}function We(e,t,n,r,i,a){return r&&!r[S.expando]&&(r=We(r)),i&&!i[S.expando]&&(i=We(i,a)),Ie(function(a,c,l,u){var d,f,p,m,h=[],g=[],_=c.length,v=a||He(t||`*`,l.nodeType?[l]:l,[]),y=e&&(a||!t)?Ue(v,h,e,l,u):v;if(n?(m=i||(a?e:_||r)?[]:c,n(y,m,l,u)):m=y,r)for(d=Ue(m,g),r(d,[],l,u),f=d.length;f--;)(p=d[f])&&(m[g[f]]=!(y[g[f]]=p));if(a){if(i||e){if(i){for(d=[],f=m.length;f--;)(p=m[f])&&d.push(y[f]=p);i(null,m=[],d,u)}for(f=m.length;f--;)(p=m[f])&&(d=i?s.call(a,p):h[f])>-1&&(a[d]=!(c[d]=p))}}else m=Ue(m===c?m.splice(_,m.length):m),i?i(null,c,m,u):o.apply(c,m)})}function Ge(e){for(var t,n,r,i=e.length,a=S.expr.relative[e[0].type],o=a||S.expr.relative[` `],c=+!!a,l=Be(function(e){return e===t},o,!0),u=Be(function(e){return s.call(t,e)>-1},o,!0),d=[function(e,n,r){var i=!a&&(r||n!=xe)||((t=n).nodeType?l(e,n,r):u(e,n,r));return t=null,i}];c<i;c++)if(n=S.expr.relative[e[c].type])d=[Be(Ve(d),n)];else{if(n=S.expr.filter[e[c].type].apply(null,e[c].matches),n[S.expando]){for(r=++c;r<i&&!S.expr.relative[e[r].type];r++);return We(c>1&&Ve(d),c>1&&N(e.slice(0,c-1).concat({value:e[c-2].type===` `?`*`:``})).replace(te,`$1`),n,c<r&&Ge(e.slice(c,r)),r<i&&Ge(e=e.slice(r)),r<i&&N(e))}d.push(n)}return Ve(d)}function Ke(e,t){var n=t.length>0,r=e.length>0,i=function(i,a,s,c,l){var u,d,f,p=0,m=`0`,h=i&&[],g=[],_=xe,v=i||r&&S.expr.find.TAG(`*`,l),y=we+=_==null?1:Math.random()||.1;for(l&&(xe=a==R||a||l);(u=v[m])!=null;m++){if(r&&u){for(d=0,!a&&u.ownerDocument!=R&&(U(u),s=!Ce);f=e[d++];)if(f(u,a||R,s)){o.call(c,u);break}l&&(we=y)}n&&((u=!f&&u)&&p--,i&&h.push(u))}if(p+=m,n&&m!==p){for(d=0;f=t[d++];)f(h,g,a,s);if(i){if(p>0)for(;m--;)h[m]||g[m]||(g[m]=w.call(c));g=Ue(g)}o.apply(c,g),l&&!i&&g.length>0&&p+t.length>1&&S.uniqueSort(c)}return l&&(we=y,xe=_),h};return n?Ie(i):i}function qe(e,t){var n,r=[],i=[],a=z[e+` `];if(!a){for(t||=me(e),n=t.length;n--;)a=Ge(t[n]),a[S.expando]?r.push(a):i.push(a);a=z(e,Ke(i,r)),a.selector=e}return a}function Je(e,t,n,r){var i,a,s,c,l,u=typeof e==`function`&&e,d=!r&&me(e=u.selector||e);if(n||=[],d.length===1){if(a=d[0]=d[0].slice(0),a.length>2&&(s=a[0]).type===`ID`&&t.nodeType===9&&Ce&&S.expr.relative[a[1].type]){if(t=(S.expr.find.ID(pe(s.matches[0]),t)||[])[0],t)u&&(t=t.parentNode);else return n;e=e.slice(a.shift().value.length)}for(i=Ae.needsContext.test(e)?0:a.length;i--&&(s=a[i],!S.expr.relative[c=s.type]);)if((l=S.expr.find[c])&&(r=l(pe(s.matches[0]),O.test(a[0].type)&&se(t.parentNode)||t))){if(a.splice(i,1),e=r.length&&N(a),!e)return o.apply(n,r),n;break}}return(u||qe(e,d))(r,t,!Ce,n,!t||O.test(e)&&se(t.parentNode)||t),n}U(),S.find=B,B.compile=qe,B.select=Je,B.setDocument=U,B.tokenize=me;function W(e,t,n){for(var r=[],i=n!==void 0;(e=e[t])&&e.nodeType!==9;)if(e.nodeType===1){if(i&&S(e).is(n))break;r.push(e)}return r}function Ye(e,t){for(var n=[];e;e=e.nextSibling)e.nodeType===1&&e!==t&&n.push(e);return n}var Xe=S.expr.match.needsContext,Ze=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function Qe(e){return e[0]===`<`&&e[e.length-1]===`>`&&e.length>=3}function $e(e,t,n){return typeof t==`function`?S.grep(e,function(e,r){return!!t.call(e,r,e)!==n}):t.nodeType?S.grep(e,function(e){return e===t!==n}):typeof t==`string`?S.filter(t,e,n):S.grep(e,function(e){return s.call(t,e)>-1!==n})}S.filter=function(e,t,n){var r=t[0];return n&&(e=`:not(`+e+`)`),t.length===1&&r.nodeType===1?S.find.matchesSelector(r,e)?[r]:[]:S.find.matches(e,S.grep(t,function(e){return e.nodeType===1}))},S.fn.extend({find:function(e){var t,n,r=this.length,i=this;if(typeof e!=`string`)return this.pushStack(S(e).filter(function(){for(t=0;t<r;t++)if(S.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)S.find(e,i[t],n);return r>1?S.uniqueSort(n):n},filter:function(e){return this.pushStack($e(this,e||[],!1))},not:function(e){return this.pushStack($e(this,e||[],!0))},is:function(e){return!!$e(this,typeof e==`string`&&Xe.test(e)?S(e):e||[],!1).length}});var et,tt=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,nt=S.fn.init=function(e,t){var n,r;if(!e)return this;if(e.nodeType)return this[0]=e,this.length=1,this;if(typeof e==`function`)return et.ready===void 0?e(S):et.ready(e);if(n=e+``,Qe(n))n=[null,e,null];else if(typeof e==`string`)n=tt.exec(e);else return S.makeArray(e,this);if(n&&(n[1]||!t))if(n[1]){if(t=t instanceof S?t[0]:t,S.merge(this,S.parseHTML(n[1],t&&t.nodeType?t.ownerDocument||t:_,!0)),Ze.test(n[1])&&S.isPlainObject(t))for(n in t)typeof this[n]==`function`?this[n](t[n]):this.attr(n,t[n]);return this}else return r=_.getElementById(n[2]),r&&(this[0]=r,this.length=1),this;else if(!t||t.jquery)return(t||et).find(e);else return this.constructor(t).find(e)};nt.prototype=S.fn,et=S(_);var rt=/^(?:parents|prev(?:Until|All))/,it={children:!0,contents:!0,next:!0,prev:!0};S.fn.extend({has:function(e){var t=S(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(S.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,a=[],o=typeof e!=`string`&&S(e);if(!Xe.test(e)){for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(o?o.index(n)>-1:n.nodeType===1&&S.find.matchesSelector(n,e))){a.push(n);break}}return this.pushStack(a.length>1?S.uniqueSort(a):a)},index:function(e){return e?typeof e==`string`?s.call(S(e),this[0]):s.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(S.uniqueSort(S.merge(this.get(),S(e,t))))},addBack:function(e){return this.add(e==null?this.prevObject:this.prevObject.filter(e))}});function at(e,t){for(;(e=e[t])&&e.nodeType!==1;);return e}S.each({parent:function(e){var t=e.parentNode;return t&&t.nodeType!==11?t:null},parents:function(e){return W(e,`parentNode`)},parentsUntil:function(e,t,n){return W(e,`parentNode`,n)},next:function(e){return at(e,`nextSibling`)},prev:function(e){return at(e,`previousSibling`)},nextAll:function(e){return W(e,`nextSibling`)},prevAll:function(e){return W(e,`previousSibling`)},nextUntil:function(e,t,n){return W(e,`nextSibling`,n)},prevUntil:function(e,t,n){return W(e,`previousSibling`,n)},siblings:function(e){return Ye((e.parentNode||{}).firstChild,e)},children:function(e){return Ye(e.firstChild)},contents:function(e){return e.contentDocument!=null&&r(e.contentDocument)?e.contentDocument:(C(e,`template`)&&(e=e.content||e),S.merge([],e.childNodes))}},function(e,t){S.fn[e]=function(n,r){var i=S.map(this,t,n);return e.slice(-5)!==`Until`&&(r=n),r&&typeof r==`string`&&(i=S.filter(r,i)),this.length>1&&(it[e]||S.uniqueSort(i),rt.test(e)&&i.reverse()),this.pushStack(i)}});function ot(e){var t={};return S.each(e.match(ge)||[],function(e,n){t[n]=!0}),t}S.Callbacks=function(e){e=typeof e==`string`?ot(e):S.extend({},e);var t,n,r,i,a=[],o=[],s=-1,c=function(){for(i||=e.once,r=t=!0;o.length;s=-1)for(n=o.shift();++s<a.length;)a[s].apply(n[0],n[1])===!1&&e.stopOnFalse&&(s=a.length,n=!1);e.memory||(n=!1),t=!1,i&&(a=n?[]:``)},l={add:function(){return a&&(n&&!t&&(s=a.length-1,o.push(n)),(function t(n){S.each(n,function(n,r){typeof r==`function`?(!e.unique||!l.has(r))&&a.push(r):r&&r.length&&m(r)!==`string`&&t(r)})})(arguments),n&&!t&&c()),this},remove:function(){return S.each(arguments,function(e,t){for(var n;(n=S.inArray(t,a,n))>-1;)a.splice(n,1),n<=s&&s--}),this},has:function(e){return e?S.inArray(e,a)>-1:a.length>0},empty:function(){return a&&=[],this},disable:function(){return i=o=[],a=n=``,this},disabled:function(){return!a},lock:function(){return i=o=[],!n&&!t&&(a=n=``),this},locked:function(){return!!i},fireWith:function(e,n){return i||(n||=[],n=[e,n.slice?n.slice():n],o.push(n),t||c()),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!r}};return l};function st(e){return e}function ct(e){throw e}function G(e,t,n,r){var i;try{e&&typeof(i=e.promise)==`function`?i.call(e).done(t).fail(n):e&&typeof(i=e.then)==`function`?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n(e)}}S.extend({Deferred:function(t){var n=[[`notify`,`progress`,S.Callbacks(`memory`),S.Callbacks(`memory`),2],[`resolve`,`done`,S.Callbacks(`once memory`),S.Callbacks(`once memory`),0,`resolved`],[`reject`,`fail`,S.Callbacks(`once memory`),S.Callbacks(`once memory`),1,`rejected`]],r=`pending`,i={state:function(){return r},always:function(){return a.done(arguments).fail(arguments),this},catch:function(e){return i.then(null,e)},pipe:function(){var e=arguments;return S.Deferred(function(t){S.each(n,function(n,r){var i=typeof e[r[4]]==`function`&&e[r[4]];a[r[1]](function(){var e=i&&i.apply(this,arguments);e&&typeof e.promise==`function`?e.promise().progress(t.notify).done(t.resolve).fail(t.reject):t[r[0]+`With`](this,i?[e]:arguments)})}),e=null}).promise()},then:function(t,r,i){var a=0;function o(t,n,r,i){return function(){var s=this,c=arguments,l=function(){var e,l;if(!(t<a)){if(e=r.apply(s,c),e===n.promise())throw TypeError(`Thenable self-resolution`);l=e&&(typeof e==`object`||typeof e==`function`)&&e.then,typeof l==`function`?i?l.call(e,o(a,n,st,i),o(a,n,ct,i)):(a++,l.call(e,o(a,n,st,i),o(a,n,ct,i),o(a,n,st,n.notifyWith))):(r!==st&&(s=void 0,c=[e]),(i||n.resolveWith)(s,c))}},u=i?l:function(){try{l()}catch(e){S.Deferred.exceptionHook&&S.Deferred.exceptionHook(e,u.error),t+1>=a&&(r!==ct&&(s=void 0,c=[e]),n.rejectWith(s,c))}};t?u():(S.Deferred.getErrorHook&&(u.error=S.Deferred.getErrorHook()),e.setTimeout(u))}}return S.Deferred(function(e){n[0][3].add(o(0,e,typeof i==`function`?i:st,e.notifyWith)),n[1][3].add(o(0,e,typeof t==`function`?t:st)),n[2][3].add(o(0,e,typeof r==`function`?r:ct))}).promise()},promise:function(e){return e==null?i:S.extend(e,i)}},a={};return S.each(n,function(e,t){var o=t[2],s=t[5];i[t[1]]=o.add,s&&o.add(function(){r=s},n[3-e][2].disable,n[3-e][3].disable,n[0][2].lock,n[0][3].lock),o.add(t[3].fire),a[t[0]]=function(){return a[t[0]+`With`](this===a?void 0:this,arguments),this},a[t[0]+`With`]=o.fireWith}),i.promise(a),t&&t.call(a,a),a},when:function(e){var t=arguments.length,n=t,r=Array(n),a=i.call(arguments),o=S.Deferred(),s=function(e){return function(n){r[e]=this,a[e]=arguments.length>1?i.call(arguments):n,--t||o.resolveWith(r,a)}};if(t<=1&&(G(e,o.done(s(n)).resolve,o.reject,!t),o.state()===`pending`||typeof(a[n]&&a[n].then)==`function`))return o.then();for(;n--;)G(a[n],s(n),o.reject);return o.promise()}});var lt=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;S.Deferred.exceptionHook=function(t,n){t&&lt.test(t.name)&&e.console.warn(`jQuery.Deferred exception`,t,n)},S.readyException=function(t){e.setTimeout(function(){throw t})};var K=S.Deferred();S.fn.ready=function(e){return K.then(e).catch(function(e){S.readyException(e)}),this},S.extend({isReady:!1,readyWait:1,ready:function(e){(e===!0?--S.readyWait:S.isReady)||(S.isReady=!0,!(e!==!0&&--S.readyWait>0)&&K.resolveWith(_,[S]))}}),S.ready.then=K.then;function q(){_.removeEventListener(`DOMContentLoaded`,q),e.removeEventListener(`load`,q),S.ready()}_.readyState===`loading`?(_.addEventListener(`DOMContentLoaded`,q),e.addEventListener(`load`,q)):e.setTimeout(S.ready);var J=/-([a-z])/g;function ut(e,t){return t.toUpperCase()}function dt(e){return e.replace(J,ut)}function ft(e){return e.nodeType===1||e.nodeType===9||!+e.nodeType}function pt(){this.expando=S.expando+ pt.uid++}pt.uid=1,pt.prototype={cache:function(e){var t=e[this.expando];return t||(t=Object.create(null),ft(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if(typeof t==`string`)i[dt(t)]=n;else for(r in t)i[dt(r)]=t[r];return n},get:function(e,t){return t===void 0?this.cache(e):e[this.expando]&&e[this.expando][dt(t)]},access:function(e,t,n){return t===void 0||t&&typeof t==`string`&&n===void 0?this.get(e,t):(this.set(e,t,n),n===void 0?t:n)},remove:function(e,t){var n,r=e[this.expando];if(r!==void 0){if(t!==void 0)for(Array.isArray(t)?t=t.map(dt):(t=dt(t),t=(t in r)?[t]:t.match(ge)||[]),n=t.length;n--;)delete r[t[n]];(t===void 0||S.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return t!==void 0&&!S.isEmptyObject(t)}};var Y=new pt,X=new pt,mt=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ht=/[A-Z]/g;function gt(e){return e===`true`?!0:e===`false`?!1:e===`null`?null:e===+e+``?+e:mt.test(e)?JSON.parse(e):e}function _t(e,t,n){var r;if(n===void 0&&e.nodeType===1)if(r=`data-`+t.replace(ht,`-$&`).toLowerCase(),n=e.getAttribute(r),typeof n==`string`){try{n=gt(n)}catch{}X.set(e,t,n)}else n=void 0;return n}S.extend({hasData:function(e){return X.hasData(e)||Y.hasData(e)},data:function(e,t,n){return X.access(e,t,n)},removeData:function(e,t){X.remove(e,t)},_data:function(e,t,n){return Y.access(e,t,n)},_removeData:function(e,t){Y.remove(e,t)}}),S.fn.extend({data:function(e,t){var n,r,i,a=this[0],o=a&&a.attributes;if(e===void 0){if(this.length&&(i=X.get(a),a.nodeType===1&&!Y.get(a,`hasDataAttrs`))){for(n=o.length;n--;)o[n]&&(r=o[n].name,r.indexOf(`data-`)===0&&(r=dt(r.slice(5)),_t(a,r,i[r])));Y.set(a,`hasDataAttrs`,!0)}return i}return typeof e==`object`?this.each(function(){X.set(this,e)}):P(this,function(t){var n;if(a&&t===void 0)return n=X.get(a,e),n!==void 0||(n=_t(a,e),n!==void 0)?n:void 0;this.each(function(){X.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){X.remove(this,e)})}}),S.extend({queue:function(e,t,n){var r;if(e)return t=(t||`fx`)+`queue`,r=Y.get(e,t),n&&(!r||Array.isArray(n)?r=Y.set(e,t,S.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t||=`fx`;var n=S.queue(e,t),r=n.length,i=n.shift(),a=S._queueHooks(e,t);i===`inprogress`&&(i=n.shift(),r--),i&&(t===`fx`&&n.unshift(`inprogress`),delete a.stop,i.call(e,function(){S.dequeue(e,t)},a)),!r&&a&&a.empty.fire()},_queueHooks:function(e,t){var n=t+`queueHooks`;return Y.get(e,n)||Y.set(e,n,{empty:S.Callbacks(`once memory`).add(function(){Y.remove(e,[t+`queue`,n])})})}}),S.fn.extend({queue:function(e,t){var n=2;return typeof e!=`string`&&(t=e,e=`fx`,n--),arguments.length<n?S.queue(this[0],e):t===void 0?this:this.each(function(){var n=S.queue(this,e,t);S._queueHooks(this,e),e===`fx`&&n[0]!==`inprogress`&&S.dequeue(this,e)})},dequeue:function(e){return this.each(function(){S.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||`fx`,[])},promise:function(e,t){var n,r=1,i=S.Deferred(),a=this,o=this.length,s=function(){--r||i.resolveWith(a,[a])};for(typeof e!=`string`&&(t=e,e=void 0),e||=`fx`;o--;)n=Y.get(a[o],e+`queueHooks`),n&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var vt=`[+-]?(?:\\d*\\.|)\\d+(?:[eE][+-]?\\d+|)`,yt=RegExp(`^(?:([+-])=|)(`+vt+`)([a-z%]*)$`,`i`),bt=[`Top`,`Right`,`Bottom`,`Left`];function xt(e,t){return e=t||e,e.style.display===`none`||e.style.display===``&&S.css(e,`display`)===`none`}var St=/^[a-z]/,Ct=/^(?:Border(?:Top|Right|Bottom|Left)?(?:Width|)|(?:Margin|Padding)?(?:Top|Right|Bottom|Left)?|(?:Min|Max)?(?:Width|Height))$/;function wt(e){return St.test(e)&&Ct.test(e[0].toUpperCase()+e.slice(1))}function Tt(e,t,n,r){var i,a,o=20,s=r?function(){return r.cur()}:function(){return S.css(e,t,``)},c=s(),l=n&&n[3]||(wt(t)?`px`:``),u=e.nodeType&&(!wt(t)||l!==`px`&&+c)&&yt.exec(S.css(e,t));if(u&&u[3]!==l){for(c/=2,l||=u[3],u=+c||1;o--;)S.style(e,t,u+l),(1-a)*(1-(a=s()/c||.5))<=0&&(o=0),u/=a;u*=2,S.style(e,t,u+l),n||=[]}return n&&(u=+u||+c||0,i=n[1]?u+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=u,r.end=i)),i}var Et=/^-ms-/;function Dt(e){return dt(e.replace(Et,`ms-`))}var Ot={};function kt(e){var t,n=e.ownerDocument,r=e.nodeName,i=Ot[r];return i||(t=n.body.appendChild(n.createElement(r)),i=S.css(t,`display`),t.parentNode.removeChild(t),i===`none`&&(i=`block`),Ot[r]=i,i)}function At(e,t){for(var n,r,i=[],a=0,o=e.length;a<o;a++)r=e[a],r.style&&(n=r.style.display,t?(n===`none`&&(i[a]=Y.get(r,`display`)||null,i[a]||(r.style.display=``)),r.style.display===``&&xt(r)&&(i[a]=kt(r))):n!==`none`&&(i[a]=`none`,Y.set(r,`display`,n)));for(a=0;a<o;a++)i[a]!=null&&(e[a].style.display=i[a]);return e}S.fn.extend({show:function(){return At(this,!0)},hide:function(){return At(this)},toggle:function(e){return typeof e==`boolean`?e?this.show():this.hide():this.each(function(){xt(this)?S(this).show():S(this).hide()})}});var jt=function(e){return S.contains(e.ownerDocument,e)||e.getRootNode(Mt)===e.ownerDocument},Mt={composed:!0};ie.getRootNode||(jt=function(e){return S.contains(e.ownerDocument,e)});var Nt=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,Pt={thead:[`table`],col:[`colgroup`,`table`],tr:[`tbody`,`table`],td:[`tr`,`tbody`,`table`]};Pt.tbody=Pt.tfoot=Pt.colgroup=Pt.caption=Pt.thead,Pt.th=Pt.td;function Z(e,t){var r=e.getElementsByTagName===void 0?e.querySelectorAll===void 0?[]:e.querySelectorAll(t||`*`):n.slice.call(e.getElementsByTagName(t||`*`));return t===void 0||t&&C(e,t)?S.merge([e],r):r}var Ft=/^$|^module$|\/(?:java|ecma)script/i;function It(e,t){for(var n=0,r=e.length;n<r;n++)Y.set(e[n],`globalEval`,!t||Y.get(t[n],`globalEval`))}var Lt=/<|&#?\w+;/;function Rt(e,t,r,i,a){for(var o,s,c,l,u,d,f=t.createDocumentFragment(),p=[],h=0,_=e.length;h<_;h++)if(o=e[h],o||o===0)if(m(o)===`object`&&(o.nodeType||g(o)))S.merge(p,o.nodeType?[o]:o);else if(!Lt.test(o))p.push(t.createTextNode(o));else{for(s||=f.appendChild(t.createElement(`div`)),c=(Nt.exec(o)||[``,``])[1].toLowerCase(),l=Pt[c]||n,d=l.length;--d>-1;)s=s.appendChild(t.createElement(l[d]));s.innerHTML=S.htmlPrefilter(o),S.merge(p,s.childNodes),s=f.firstChild,s.textContent=``}for(f.textContent=``,h=0;o=p[h++];){if(i&&S.inArray(o,i)>-1){a&&a.push(o);continue}if(u=jt(o),s=Z(f.appendChild(o),`script`),u&&It(s),r)for(d=0;o=s[d++];)Ft.test(o.type||``)&&r.push(o)}return f}function Q(e){return e.type=(e.getAttribute(`type`)!==null)+`/`+e.type,e}function zt(e){return(e.type||``).slice(0,5)===`true/`?e.type=e.type.slice(5):e.removeAttribute(`type`),e}function Bt(e,t,n,r){t=a(t);var i,o,s,c,l,u,d=0,f=e.length,p=f-1,m=t[0];if(typeof m==`function`)return e.each(function(i){var a=e.eq(i);t[0]=m.call(this,i,a.html()),Bt(a,t,n,r)});if(f&&(i=Rt(t,e[0].ownerDocument,!1,e,r),o=i.firstChild,i.childNodes.length===1&&(i=o),o||r)){for(s=S.map(Z(i,`script`),Q),c=s.length;d<f;d++)l=i,d!==p&&(l=S.clone(l,!0,!0),c&&S.merge(s,Z(l,`script`))),n.call(e[d],l,d);if(c)for(u=s[s.length-1].ownerDocument,S.map(s,zt),d=0;d<c;d++)l=s[d],Ft.test(l.type||``)&&!Y.get(l,`globalEval`)&&S.contains(u,l)&&(l.src&&(l.type||``).toLowerCase()!==`module`?S._evalUrl&&!l.noModule&&S._evalUrl(l.src,{nonce:l.nonce,crossOrigin:l.crossOrigin},u):y(l.textContent,l,u))}return e}var Vt=/^(?:checkbox|radio)$/i,Ht=/^([^.]*)(?:\.(.+)|)/;function Ut(){return!0}function Wt(){return!1}function Gt(e,t,n,r,i,a){var o,s;if(typeof t==`object`){for(s in typeof n!=`string`&&(r||=n,n=void 0),t)Gt(e,s,n,r,t[s],a);return e}if(r==null&&i==null?(i=n,r=n=void 0):i??(typeof n==`string`?(i=r,r=void 0):(i=r,r=n,n=void 0)),i===!1)i=Wt;else if(!i)return e;return a===1&&(o=i,i=function(e){return S().off(e),o.apply(this,arguments)},i.guid=o.guid||=S.guid++),e.each(function(){S.event.add(this,t,i,r,n)})}S.event={add:function(e,t,n,r,i){var a,o,s,c,l,u,d,f,p,m,h,g=Y.get(e);if(ft(e))for(n.handler&&(a=n,n=a.handler,i=a.selector),i&&S.find.matchesSelector(ie,i),n.guid||=S.guid++,(c=g.events)||(c=g.events=Object.create(null)),(o=g.handle)||(o=g.handle=function(t){return S!==void 0&&S.event.triggered!==t.type?S.event.dispatch.apply(e,arguments):void 0}),t=(t||``).match(ge)||[``],l=t.length;l--;)s=Ht.exec(t[l])||[],p=h=s[1],m=(s[2]||``).split(`.`).sort(),p&&(d=S.event.special[p]||{},p=(i?d.delegateType:d.bindType)||p,d=S.event.special[p]||{},u=S.extend({type:p,origType:h,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&S.expr.match.needsContext.test(i),namespace:m.join(`.`)},a),(f=c[p])||(f=c[p]=[],f.delegateCount=0,(!d.setup||d.setup.call(e,r,m,o)===!1)&&e.addEventListener&&e.addEventListener(p,o)),d.add&&(d.add.call(e,u),u.handler.guid||(u.handler.guid=n.guid)),i?f.splice(f.delegateCount++,0,u):f.push(u))},remove:function(e,t,n,r,i){var a,o,s,c,l,u,d,f,p,m,h,g=Y.hasData(e)&&Y.get(e);if(!(!g||!(c=g.events))){for(t=(t||``).match(ge)||[``],l=t.length;l--;){if(s=Ht.exec(t[l])||[],p=h=s[1],m=(s[2]||``).split(`.`).sort(),!p){for(p in c)S.event.remove(e,p+t[l],n,r,!0);continue}for(d=S.event.special[p]||{},p=(r?d.delegateType:d.bindType)||p,f=c[p]||[],s=s[2]&&RegExp(`(^|\\.)`+m.join(`\\.(?:.*\\.|)`)+`(\\.|$)`),o=a=f.length;a--;)u=f[a],(i||h===u.origType)&&(!n||n.guid===u.guid)&&(!s||s.test(u.namespace))&&(!r||r===u.selector||r===`**`&&u.selector)&&(f.splice(a,1),u.selector&&f.delegateCount--,d.remove&&d.remove.call(e,u));o&&!f.length&&((!d.teardown||d.teardown.call(e,m,g.handle)===!1)&&S.removeEvent(e,p,g.handle),delete c[p])}S.isEmptyObject(c)&&Y.remove(e,`handle events`)}},dispatch:function(e){var t,n,r,i,a,o,s=Array(arguments.length),c=S.event.fix(e),l=(Y.get(this,`events`)||Object.create(null))[c.type]||[],u=S.event.special[c.type]||{};for(s[0]=c,t=1;t<arguments.length;t++)s[t]=arguments[t];if(c.delegateTarget=this,!(u.preDispatch&&u.preDispatch.call(this,c)===!1)){for(o=S.event.handlers.call(this,c,l),t=0;(i=o[t++])&&!c.isPropagationStopped();)for(c.currentTarget=i.elem,n=0;(a=i.handlers[n++])&&!c.isImmediatePropagationStopped();)(!c.rnamespace||a.namespace===!1||c.rnamespace.test(a.namespace))&&(c.handleObj=a,c.data=a.data,r=((S.event.special[a.origType]||{}).handle||a.handler).apply(i.elem,s),r!==void 0&&(c.result=r)===!1&&(c.preventDefault(),c.stopPropagation()));return u.postDispatch&&u.postDispatch.call(this,c),c.result}},handlers:function(e,t){var n,r,i,a,o,s=[],c=t.delegateCount,l=e.target;if(c&&!(e.type===`click`&&e.button>=1)){for(;l!==this;l=l.parentNode||this)if(l.nodeType===1&&!(e.type===`click`&&l.disabled===!0)){for(a=[],o={},n=0;n<c;n++)r=t[n],i=r.selector+` `,o[i]===void 0&&(o[i]=r.needsContext?S(i,this).index(l)>-1:S.find(i,this,null,[l]).length),o[i]&&a.push(r);a.length&&s.push({elem:l,handlers:a})}}return l=this,c<t.length&&s.push({elem:l,handlers:t.slice(c)}),s},addProp:function(e,t){Object.defineProperty(S.Event.prototype,e,{enumerable:!0,configurable:!0,get:typeof t==`function`?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(e){return e[S.expando]?e:new S.Event(e)},special:S.extend(Object.create(null),{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return Vt.test(t.type)&&t.click&&C(t,`input`)&&Kt(t,`click`,!0),!1},trigger:function(e){var t=this||e;return Vt.test(t.type)&&t.click&&C(t,`input`)&&Kt(t,`click`),!0},_default:function(e){var t=e.target;return Vt.test(t.type)&&t.click&&C(t,`input`)&&Y.get(t,`click`)||C(t,`a`)}},beforeunload:{postDispatch:function(e){e.result!==void 0&&e.preventDefault()}}})};function Kt(e,t,n){if(!n){Y.get(e,t)===void 0&&S.event.add(e,t,Ut);return}Y.set(e,t,!1),S.event.add(e,t,{namespace:!1,handler:function(e){var n,r=Y.get(this,t);if(e.isTrigger&1&&this[t]){if(r.length)(S.event.special[t]||{}).delegateType&&e.stopPropagation();else if(r=i.call(arguments),Y.set(this,t,r),this[t](),n=Y.get(this,t),Y.set(this,t,!1),r!==n)return e.stopImmediatePropagation(),e.preventDefault(),n&&n.value}else r.length&&(Y.set(this,t,{value:S.event.trigger(r[0],r.slice(1),this)}),e.stopPropagation(),e.isImmediatePropagationStopped=Ut)}})}S.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},S.Event=function(e,t){if(!(this instanceof S.Event))return new S.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented?Ut:Wt,this.target=e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&S.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[S.expando]=!0},S.Event.prototype={constructor:S.Event,isDefaultPrevented:Wt,isPropagationStopped:Wt,isImmediatePropagationStopped:Wt,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ut,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ut,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ut,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},S.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,char:!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:!0},S.event.addProp),S.each({focus:`focusin`,blur:`focusout`},function(e,t){function n(e){var t=S.event.fix(e);t.type=e.type===`focusin`?`focus`:`blur`,t.isSimulated=!0,t.target===t.currentTarget&&Y.get(this,`handle`)(t)}S.event.special[e]={setup:function(){if(Kt(this,e,!0),E)this.addEventListener(t,n);else return!1},trigger:function(){return Kt(this,e),!0},teardown:function(){if(E)this.removeEventListener(t,n);else return!1},_default:function(t){return Y.get(t.target,e)},delegateType:t}}),S.each({mouseenter:`mouseover`,mouseleave:`mouseout`,pointerenter:`pointerover`,pointerleave:`pointerout`},function(e,t){S.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,a=e.handleObj;return(!i||i!==r&&!S.contains(r,i))&&(e.type=a.origType,n=a.handler.apply(this,arguments),e.type=t),n}}}),S.fn.extend({on:function(e,t,n,r){return Gt(this,e,t,n,r)},one:function(e,t,n,r){return Gt(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,S(e.delegateTarget).off(r.namespace?r.origType+`.`+r.namespace:r.origType,r.selector,r.handler),this;if(typeof e==`object`){for(i in e)this.off(i,t,e[i]);return this}return(t===!1||typeof t==`function`)&&(n=t,t=void 0),n===!1&&(n=Wt),this.each(function(){S.event.remove(this,e,n,t)})}});var qt=/<script|<style|<link/i;function Jt(e,t){return C(e,`table`)&&C(t.nodeType===11?t.firstChild:t,`tr`)&&S(e).children(`tbody`)[0]||e}function Yt(e,t){var n,r,i,a=Y.get(e,`events`);if(t.nodeType===1){if(a)for(n in Y.remove(t,`handle events`),a)for(r=0,i=a[n].length;r<i;r++)S.event.add(t,n,a[n][r]);X.hasData(e)&&X.set(t,S.extend({},X.get(e)))}}function Xt(e,t,n){for(var r,i=t?S.filter(t,e):e,a=0;(r=i[a])!=null;a++)!n&&r.nodeType===1&&S.cleanData(Z(r)),r.parentNode&&(n&&jt(r)&&It(Z(r,`script`)),r.parentNode.removeChild(r));return e}S.extend({htmlPrefilter:function(e){return e},clone:function(e,t,n){var r,i,a,o,s=e.cloneNode(!0),c=jt(e);if(E&&(e.nodeType===1||e.nodeType===11)&&!S.isXMLDoc(e))for(o=Z(s),a=Z(e),r=0,i=a.length;r<i;r++)C(o[r],`textarea`)&&(o[r].defaultValue=a[r].defaultValue);if(t)if(n)for(a||=Z(e),o||=Z(s),r=0,i=a.length;r<i;r++)Yt(a[r],o[r]);else Yt(e,s);return o=Z(s,`script`),o.length>0&&It(o,!c&&Z(e,`script`)),s},cleanData:function(e){for(var t,n,r,i=S.event.special,a=0;(n=e[a])!==void 0;a++)if(ft(n)){if(t=n[Y.expando]){if(t.events)for(r in t.events)i[r]?S.event.remove(n,r):S.removeEvent(n,r,t.handle);n[Y.expando]=void 0}n[X.expando]&&(n[X.expando]=void 0)}}}),S.fn.extend({detach:function(e){return Xt(this,e,!0)},remove:function(e){return Xt(this,e)},text:function(e){return P(this,function(e){return e===void 0?S.text(this):this.empty().each(function(){(this.nodeType===1||this.nodeType===11||this.nodeType===9)&&(this.textContent=e)})},null,e,arguments.length)},append:function(){return Bt(this,arguments,function(e){(this.nodeType===1||this.nodeType===11||this.nodeType===9)&&Jt(this,e).appendChild(e)})},prepend:function(){return Bt(this,arguments,function(e){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var t=Jt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return Bt(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return Bt(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;(e=this[t])!=null;t++)e.nodeType===1&&(S.cleanData(Z(e,!1)),e.textContent=``);return this},clone:function(e,t){return e??=!1,t??=e,this.map(function(){return S.clone(this,e,t)})},html:function(e){return P(this,function(e){var t=this[0]||{},n=0,r=this.length;if(e===void 0&&t.nodeType===1)return t.innerHTML;if(typeof e==`string`&&!qt.test(e)&&!Pt[(Nt.exec(e)||[``,``])[1].toLowerCase()]){e=S.htmlPrefilter(e);try{for(;n<r;n++)t=this[n]||{},t.nodeType===1&&(S.cleanData(Z(t,!1)),t.innerHTML=e);t=0}catch{}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return Bt(this,arguments,function(t){var n=this.parentNode;S.inArray(this,e)<0&&(S.cleanData(Z(this)),n&&n.replaceChild(t,this))},e)}}),S.each({appendTo:`append`,prependTo:`prepend`,insertBefore:`before`,insertAfter:`after`,replaceAll:`replaceWith`},function(e,t){S.fn[e]=function(e){for(var n,r=[],i=S(e),a=i.length-1,s=0;s<=a;s++)n=s===a?this:this.clone(!0),S(i[s])[t](n),o.apply(r,n);return this.pushStack(r)}});var Zt=RegExp(`^(`+vt+`)(?!px)[a-z%]+$`,`i`),Qt=/^--/;function $t(t){var n=t.ownerDocument.defaultView;return n||=e,n.getComputedStyle(t)}function en(e,t,n){var r,i,a={};for(i in t)a[i]=e.style[i],e.style[i]=t[i];for(i in r=n.call(e),t)e.style[i]=a[i];return r}function tn(e,t,n){var r,i=Qt.test(t);return n||=$t(e),n&&(r=n.getPropertyValue(t)||n[t],i&&r&&(r=r.replace(te,`$1`)||void 0),r===``&&!jt(e)&&(r=S.style(e,t))),r===void 0?r:r+``}var nn=[`Webkit`,`Moz`,`ms`],rn=_.createElement(`div`).style;function an(e){for(var t=e[0].toUpperCase()+e.slice(1),n=nn.length;n--;)if(e=nn[n]+t,e in rn)return e}function on(e){return e in rn?e:an(e)||e}var sn,cn,ln=_.createElement(`table`);function un(){if(!(!ln||!ln.style)){var t,n=_.createElement(`col`),r=_.createElement(`tr`),i=_.createElement(`td`);if(ln.style.cssText=`position:absolute;left:-11111px;border-collapse:separate;border-spacing:0`,r.style.cssText=`box-sizing:content-box;border:1px solid;height:1px`,i.style.cssText=`height:9px;width:9px;padding:0`,n.span=2,ie.appendChild(ln).appendChild(n).parentNode.appendChild(r).appendChild(i).parentNode.appendChild(i.cloneNode(!0)),ln.offsetWidth===0){ie.removeChild(ln);return}t=e.getComputedStyle(r),cn=E||Math.round(parseFloat(e.getComputedStyle(n).width))===18,sn=Math.round(parseFloat(t.height)+parseFloat(t.borderTopWidth)+parseFloat(t.borderBottomWidth))===r.offsetHeight,ie.removeChild(ln),ln=null}}S.extend(p,{reliableTrDimensions:function(){return un(),sn},reliableColDimensions:function(){return un(),cn}});var dn={position:`absolute`,visibility:`hidden`,display:`block`},fn={letterSpacing:`0`,fontWeight:`400`};function pn(e,t,n){var r=yt.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||`px`):t}function mn(e,t,n,r,i,a){var o=+(t===`width`),s=0,c=0,l=0;if(n===(r?`border`:`content`))return 0;for(;o<4;o+=2)n===`margin`&&(l+=S.css(e,n+bt[o],!0,i)),r?(n===`content`&&(c-=S.css(e,`padding`+bt[o],!0,i)),n!==`margin`&&(c-=S.css(e,`border`+bt[o]+`Width`,!0,i))):(c+=S.css(e,`padding`+bt[o],!0,i),n===`padding`?s+=S.css(e,`border`+bt[o]+`Width`,!0,i):c+=S.css(e,`border`+bt[o]+`Width`,!0,i));return!r&&a>=0&&(c+=Math.max(0,Math.ceil(e[`offset`+t[0].toUpperCase()+t.slice(1)]-a-c-s-.5))||0),c+l}function hn(e,t,n){var r=$t(e),i=(E||n)&&S.css(e,`boxSizing`,!1,r)===`border-box`,a=i,o=tn(e,t,r),s=`offset`+t[0].toUpperCase()+t.slice(1);if(Zt.test(o)){if(!n)return o;o=`auto`}return(o===`auto`||E&&i||!p.reliableColDimensions()&&C(e,`col`)||!p.reliableTrDimensions()&&C(e,`tr`))&&e.getClientRects().length&&(i=S.css(e,`boxSizing`,!1,r)===`border-box`,a=s in e,a&&(o=e[s])),o=parseFloat(o)||0,o+mn(e,t,n||(i?`border`:`content`),a,r,o)+`px`}S.extend({cssHooks:{},style:function(e,t,n,r){if(!(!e||e.nodeType===3||e.nodeType===8||!e.style)){var i,a,o,s=Dt(t),c=Qt.test(t),l=e.style;if(c||(t=on(s)),o=S.cssHooks[t]||S.cssHooks[s],n!==void 0){if(a=typeof n,a===`string`&&(i=yt.exec(n))&&i[1]&&(n=Tt(e,t,i),a=`number`),n==null||n!==n)return;a===`number`&&(n+=i&&i[3]||(wt(s)?`px`:``)),E&&n===``&&t.indexOf(`background`)===0&&(l[t]=`inherit`),(!o||!(`set`in o)||(n=o.set(e,n,r))!==void 0)&&(c?l.setProperty(t,n):l[t]=n)}else return o&&`get`in o&&(i=o.get(e,!1,r))!==void 0?i:l[t]}},css:function(e,t,n,r){var i,a,o,s=Dt(t);return Qt.test(t)||(t=on(s)),o=S.cssHooks[t]||S.cssHooks[s],o&&`get`in o&&(i=o.get(e,!0,n)),i===void 0&&(i=tn(e,t,r)),i===`normal`&&t in fn&&(i=fn[t]),n===``||n?(a=parseFloat(i),n===!0||isFinite(a)?a||0:i):i}}),S.each([`height`,`width`],function(e,t){S.cssHooks[t]={get:function(e,n,r){if(n)return S.css(e,`display`)===`none`?en(e,dn,function(){return hn(e,t,r)}):hn(e,t,r)},set:function(e,n,r){var i,a=$t(e),o=r&&S.css(e,`boxSizing`,!1,a)===`border-box`,s=r?mn(e,t,r,o,a):0;return s&&(i=yt.exec(n))&&(i[3]||`px`)!==`px`&&(e.style[t]=n,n=S.css(e,t)),pn(e,n,s)}}}),S.each({margin:``,padding:``,border:`Width`},function(e,t){S.cssHooks[e+t]={expand:function(n){for(var r=0,i={},a=typeof n==`string`?n.split(` `):[n];r<4;r++)i[e+bt[r]+t]=a[r]||a[r-2]||a[0];return i}},e!==`margin`&&(S.cssHooks[e+t].set=pn)}),S.fn.extend({css:function(e,t){return P(this,function(e,t,n){var r,i,a={},o=0;if(Array.isArray(t)){for(r=$t(e),i=t.length;o<i;o++)a[t[o]]=S.css(e,t[o],!1,r);return a}return n===void 0?S.css(e,t):S.style(e,t,n)},e,t,arguments.length>1)}});function gn(e,t,n,r,i){return new gn.prototype.init(e,t,n,r,i)}S.Tween=gn,gn.prototype={constructor:gn,init:function(e,t,n,r,i,a){this.elem=e,this.prop=n,this.easing=i||S.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=a||(wt(n)?`px`:``)},cur:function(){var e=gn.propHooks[this.prop];return e&&e.get?e.get(this):gn.propHooks._default.get(this)},run:function(e){var t,n=gn.propHooks[this.prop];return this.options.duration?this.pos=t=S.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):gn.propHooks._default.set(this),this}},gn.prototype.init.prototype=gn.prototype,gn.propHooks={_default:{get:function(e){var t;return e.elem.nodeType!==1||e.elem[e.prop]!=null&&e.elem.style[e.prop]==null?e.elem[e.prop]:(t=S.css(e.elem,e.prop,``),!t||t===`auto`?0:t)},set:function(e){S.fx.step[e.prop]?S.fx.step[e.prop](e):e.elem.nodeType===1&&(S.cssHooks[e.prop]||e.elem.style[on(e.prop)]!=null)?S.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},S.easing={linear:function(e){return e},swing:function(e){return .5-Math.cos(e*Math.PI)/2},_default:`swing`},S.fx=gn.prototype.init,S.fx.step={};var _n,vn,yn=/^(?:toggle|show|hide)$/,bn=/queueHooks$/;function xn(){vn&&(_.hidden===!1&&e.requestAnimationFrame?e.requestAnimationFrame(xn):e.setTimeout(xn,13),S.fx.tick())}function Sn(){return e.setTimeout(function(){_n=void 0}),_n=Date.now()}function Cn(e,t){var n,r=0,i={height:e};for(t=+!!t;r<4;r+=2-t)n=bt[r],i[`margin`+n]=i[`padding`+n]=e;return t&&(i.opacity=i.width=e),i}function wn(e,t,n){for(var r,i=(Dn.tweeners[t]||[]).concat(Dn.tweeners[`*`]),a=0,o=i.length;a<o;a++)if(r=i[a].call(n,t,e))return r}function Tn(e,t,n){var r,i,a,o,s,c,l,u,d=`width`in t||`height`in t,f=this,p={},m=e.style,h=e.nodeType&&xt(e),g=Y.get(e,`fxshow`);for(r in n.queue||(o=S._queueHooks(e,`fx`),o.unqueued??(o.unqueued=0,s=o.empty.fire,o.empty.fire=function(){o.unqueued||s()}),o.unqueued++,f.always(function(){f.always(function(){o.unqueued--,S.queue(e,`fx`).length||o.empty.fire()})})),t)if(i=t[r],yn.test(i)){if(delete t[r],a||=i===`toggle`,i===(h?`hide`:`show`))if(i===`show`&&g&&g[r]!==void 0)h=!0;else continue;p[r]=g&&g[r]||S.style(e,r)}if(c=!S.isEmptyObject(t),!(!c&&S.isEmptyObject(p)))for(r in d&&e.nodeType===1&&(n.overflow=[m.overflow,m.overflowX,m.overflowY],l=g&&g.display,l??=Y.get(e,`display`),u=S.css(e,`display`),u===`none`&&(l?u=l:(At([e],!0),l=e.style.display||l,u=S.css(e,`display`),At([e]))),(u===`inline`||u===`inline-block`&&l!=null)&&S.css(e,`float`)===`none`&&(c||(f.done(function(){m.display=l}),l??=(u=m.display,u===`none`?``:u)),m.display=`inline-block`)),n.overflow&&(m.overflow=`hidden`,f.always(function(){m.overflow=n.overflow[0],m.overflowX=n.overflow[1],m.overflowY=n.overflow[2]})),c=!1,p)c||(g?`hidden`in g&&(h=g.hidden):g=Y.set(e,`fxshow`,{display:l}),a&&(g.hidden=!h),h&&At([e],!0),f.done(function(){for(r in h||At([e]),Y.remove(e,`fxshow`),p)S.style(e,r,p[r])})),c=wn(h?g[r]:0,r,f),r in g||(g[r]=c.start,h&&(c.end=c.start,c.start=0))}function En(e,t){var n,r,i,a,o;for(n in e)if(r=Dt(n),i=t[r],a=e[n],Array.isArray(a)&&(i=a[1],a=e[n]=a[0]),n!==r&&(e[r]=a,delete e[n]),o=S.cssHooks[r],o&&`expand`in o)for(n in a=o.expand(a),delete e[r],a)n in e||(e[n]=a[n],t[n]=i);else t[r]=i}function Dn(e,t,n){var r,i,a=0,o=Dn.prefilters.length,s=S.Deferred().always(function(){delete c.elem}),c=function(){if(i)return!1;for(var t=_n||Sn(),n=Math.max(0,l.startTime+l.duration-t),r=1-(n/l.duration||0),a=0,o=l.tweens.length;a<o;a++)l.tweens[a].run(r);return s.notifyWith(e,[l,r,n]),r<1&&o?n:(o||s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:S.extend({},t),opts:S.extend(!0,{specialEasing:{},easing:S.easing._default},n),originalProperties:t,originalOptions:n,startTime:_n||Sn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=S.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)l.tweens[n].run(1);return t?(s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l,t])):s.rejectWith(e,[l,t]),this}}),u=l.props;for(En(u,l.opts.specialEasing);a<o;a++)if(r=Dn.prefilters[a].call(l,e,u,l.opts),r)return typeof r.stop==`function`&&(S._queueHooks(l.elem,l.opts.queue).stop=r.stop.bind(r)),r;return S.map(u,wn,l),typeof l.opts.start==`function`&&l.opts.start.call(e,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),S.fx.timer(S.extend(c,{elem:e,anim:l,queue:l.opts.queue})),l}S.Animation=S.extend(Dn,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return Tt(n.elem,e,yt.exec(t),n),n}]},tweener:function(e,t){typeof e==`function`?(t=e,e=[`*`]):e=e.match(ge);for(var n,r=0,i=e.length;r<i;r++)n=e[r],Dn.tweeners[n]=Dn.tweeners[n]||[],Dn.tweeners[n].unshift(t)},prefilters:[Tn],prefilter:function(e,t){t?Dn.prefilters.unshift(e):Dn.prefilters.push(e)}}),S.speed=function(e,t,n){var r=e&&typeof e==`object`?S.extend({},e):{complete:n||t||typeof e==`function`&&e,duration:e,easing:n&&t||t&&typeof t!=`function`&&t};return S.fx.off?r.duration=0:typeof r.duration!=`number`&&(r.duration in S.fx.speeds?r.duration=S.fx.speeds[r.duration]:r.duration=S.fx.speeds._default),(r.queue==null||r.queue===!0)&&(r.queue=`fx`),r.old=r.complete,r.complete=function(){typeof r.old==`function`&&r.old.call(this),r.queue&&S.dequeue(this,r.queue)},r},S.fn.extend({fadeTo:function(e,t,n,r){return this.filter(xt).css(`opacity`,0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=S.isEmptyObject(e),a=S.speed(t,n,r),o=function(){var t=Dn(this,S.extend({},e),a);(i||Y.get(this,`finish`))&&t.stop(!0)};return o.finish=o,i||a.queue===!1?this.each(o):this.queue(a.queue,o)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return typeof e!=`string`&&(n=t,t=e,e=void 0),t&&this.queue(e||`fx`,[]),this.each(function(){var t=!0,i=e!=null&&e+`queueHooks`,a=S.timers,o=Y.get(this);if(i)o[i]&&o[i].stop&&r(o[i]);else for(i in o)o[i]&&o[i].stop&&bn.test(i)&&r(o[i]);for(i=a.length;i--;)a[i].elem===this&&(e==null||a[i].queue===e)&&(a[i].anim.stop(n),t=!1,a.splice(i,1));(t||!n)&&S.dequeue(this,e)})},finish:function(e){return e!==!1&&(e||=`fx`),this.each(function(){var t,n=Y.get(this),r=n[e+`queue`],i=n[e+`queueHooks`],a=S.timers,o=r?r.length:0;for(n.finish=!0,S.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=a.length;t--;)a[t].elem===this&&a[t].queue===e&&(a[t].anim.stop(!0),a.splice(t,1));for(t=0;t<o;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),S.each([`toggle`,`show`,`hide`],function(e,t){var n=S.fn[t];S.fn[t]=function(e,r,i){return e==null||typeof e==`boolean`?n.apply(this,arguments):this.animate(Cn(t,!0),e,r,i)}}),S.each({slideDown:Cn(`show`),slideUp:Cn(`hide`),slideToggle:Cn(`toggle`),fadeIn:{opacity:`show`},fadeOut:{opacity:`hide`},fadeToggle:{opacity:`toggle`}},function(e,t){S.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),S.timers=[],S.fx.tick=function(){var e,t=0,n=S.timers;for(_n=Date.now();t<n.length;t++)e=n[t],!e()&&n[t]===e&&n.splice(t--,1);n.length||S.fx.stop(),_n=void 0},S.fx.timer=function(e){S.timers.push(e),S.fx.start()},S.fx.start=function(){vn||(vn=!0,xn())},S.fx.stop=function(){vn=null},S.fx.speeds={slow:600,fast:200,_default:400},S.fn.delay=function(t,n){return t=S.fx&&S.fx.speeds[t]||t,n||=`fx`,this.queue(n,function(n,r){var i=e.setTimeout(n,t);r.stop=function(){e.clearTimeout(i)}})};var On=/^(?:input|select|textarea|button)$/i,kn=/^(?:a|area)$/i;S.fn.extend({prop:function(e,t){return P(this,S.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[S.propFix[e]||e]})}}),S.extend({prop:function(e,t,n){var r,i,a=e.nodeType;if(!(a===3||a===8||a===2))return(a!==1||!S.isXMLDoc(e))&&(t=S.propFix[t]||t,i=S.propHooks[t]),n===void 0?i&&`get`in i&&(r=i.get(e,t))!==null?r:e[t]:i&&`set`in i&&(r=i.set(e,n,t))!==void 0?r:e[t]=n},propHooks:{tabIndex:{get:function(e){var t=e.getAttribute(`tabindex`);return t?parseInt(t,10):On.test(e.nodeName)||kn.test(e.nodeName)&&e.href?0:-1}}},propFix:{for:`htmlFor`,class:`className`}}),E&&(S.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),S.each([`tabIndex`,`readOnly`,`maxLength`,`cellSpacing`,`cellPadding`,`rowSpan`,`colSpan`,`useMap`,`frameBorder`,`contentEditable`],function(){S.propFix[this.toLowerCase()]=this});function An(e){return(e.match(ge)||[]).join(` `)}function jn(e){return e.getAttribute&&e.getAttribute(`class`)||``}function Mn(e){return Array.isArray(e)?e:typeof e==`string`&&e.match(ge)||[]}S.fn.extend({addClass:function(e){var t,n,r,i,a,o;return typeof e==`function`?this.each(function(t){S(this).addClass(e.call(this,t,jn(this)))}):(t=Mn(e),t.length?this.each(function(){if(r=jn(this),n=this.nodeType===1&&` `+An(r)+` `,n){for(a=0;a<t.length;a++)i=t[a],n.indexOf(` `+i+` `)<0&&(n+=i+` `);o=An(n),r!==o&&this.setAttribute(`class`,o)}}):this)},removeClass:function(e){var t,n,r,i,a,o;return typeof e==`function`?this.each(function(t){S(this).removeClass(e.call(this,t,jn(this)))}):arguments.length?(t=Mn(e),t.length?this.each(function(){if(r=jn(this),n=this.nodeType===1&&` `+An(r)+` `,n){for(a=0;a<t.length;a++)for(i=t[a];n.indexOf(` `+i+` `)>-1;)n=n.replace(` `+i+` `,` `);o=An(n),r!==o&&this.setAttribute(`class`,o)}}):this):this.attr(`class`,``)},toggleClass:function(e,t){var n,r,i,a;return typeof e==`function`?this.each(function(n){S(this).toggleClass(e.call(this,n,jn(this),t),t)}):typeof t==`boolean`?t?this.addClass(e):this.removeClass(e):(n=Mn(e),n.length?this.each(function(){for(a=S(this),i=0;i<n.length;i++)r=n[i],a.hasClass(r)?a.removeClass(r):a.addClass(r)}):this)},hasClass:function(e){var t,n,r=0;for(t=` `+e+` `;n=this[r++];)if(n.nodeType===1&&(` `+An(jn(n))+` `).indexOf(t)>-1)return!0;return!1}}),S.fn.extend({val:function(e){var t,n,r,i=this[0];return arguments.length?(r=typeof e==`function`,this.each(function(n){var i;this.nodeType===1&&(i=r?e.call(this,n,S(this).val()):e,i==null?i=``:typeof i==`number`?i+=``:Array.isArray(i)&&(i=S.map(i,function(e){return e==null?``:e+``})),t=S.valHooks[this.type]||S.valHooks[this.nodeName.toLowerCase()],(!t||!(`set`in t)||t.set(this,i,`value`)===void 0)&&(this.value=i))})):i?(t=S.valHooks[i.type]||S.valHooks[i.nodeName.toLowerCase()],t&&`get`in t&&(n=t.get(i,`value`))!==void 0?n:(n=i.value,n??``)):void 0}}),S.extend({valHooks:{select:{get:function(e){var t,n,r,i=e.options,a=e.selectedIndex,o=e.type===`select-one`,s=o?null:[],c=o?a+1:i.length;for(r=a<0?c:o?a:0;r<c;r++)if(n=i[r],n.selected&&!n.disabled&&(!n.parentNode.disabled||!C(n.parentNode,`optgroup`))){if(t=S(n).val(),o)return t;s.push(t)}return s},set:function(e,t){for(var n,r,i=e.options,a=S.makeArray(t),o=i.length;o--;)r=i[o],(r.selected=S.inArray(S(r).val(),a)>-1)&&(n=!0);return n||(e.selectedIndex=-1),a}}}}),E&&(S.valHooks.option={get:function(e){return e.getAttribute(`value`)??An(S.text(e))}}),S.each([`radio`,`checkbox`],function(){S.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=S.inArray(S(e).val(),t)>-1}}});var Nn=/^(?:focusinfocus|focusoutblur)$/,Pn=function(e){e.stopPropagation()};S.extend(S.event,{trigger:function(t,n,r,i){var a,o,s,c,l,d,f,p,m=[r||_],g=u.call(t,`type`)?t.type:t,v=u.call(t,`namespace`)?t.namespace.split(`.`):[];if(o=p=s=r||=_,!(r.nodeType===3||r.nodeType===8)&&!Nn.test(g+S.event.triggered)&&(g.indexOf(`.`)>-1&&(v=g.split(`.`),g=v.shift(),v.sort()),l=g.indexOf(`:`)<0&&`on`+g,t=t[S.expando]?t:new S.Event(g,typeof t==`object`&&t),t.isTrigger=i?2:3,t.namespace=v.join(`.`),t.rnamespace=t.namespace?RegExp(`(^|\\.)`+v.join(`\\.(?:.*\\.|)`)+`(\\.|$)`):null,t.result=void 0,t.target||=r,n=n==null?[t]:S.makeArray(n,[t]),f=S.event.special[g]||{},!(!i&&f.trigger&&f.trigger.apply(r,n)===!1))){if(!i&&!f.noBubble&&!h(r)){for(c=f.delegateType||g,Nn.test(c+g)||(o=o.parentNode);o;o=o.parentNode)m.push(o),s=o;s===(r.ownerDocument||_)&&m.push(s.defaultView||s.parentWindow||e)}for(a=0;(o=m[a++])&&!t.isPropagationStopped();)p=o,t.type=a>1?c:f.bindType||g,d=(Y.get(o,`events`)||Object.create(null))[t.type]&&Y.get(o,`handle`),d&&d.apply(o,n),d=l&&o[l],d&&d.apply&&ft(o)&&(t.result=d.apply(o,n),t.result===!1&&t.preventDefault());return t.type=g,!i&&!t.isDefaultPrevented()&&(!f._default||f._default.apply(m.pop(),n)===!1)&&ft(r)&&l&&typeof r[g]==`function`&&!h(r)&&(s=r[l],s&&(r[l]=null),S.event.triggered=g,t.isPropagationStopped()&&p.addEventListener(g,Pn),r[g](),t.isPropagationStopped()&&p.removeEventListener(g,Pn),S.event.triggered=void 0,s&&(r[l]=s)),t.result}},simulate:function(e,t,n){var r=S.extend(new S.Event,n,{type:e,isSimulated:!0});S.event.trigger(r,null,t)}}),S.fn.extend({trigger:function(e,t){return this.each(function(){S.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return S.event.trigger(e,t,n,!0)}});var Fn=e.location,In={guid:Date.now()},Ln=/\?/;S.parseXML=function(t){var n,r;if(!t||typeof t!=`string`)return null;try{n=new e.DOMParser().parseFromString(t,`text/xml`)}catch{}return r=n&&n.getElementsByTagName(`parsererror`)[0],(!n||r)&&S.error(`Invalid XML: `+(r?S.map(r.childNodes,function(e){return e.textContent}).join(`
`):t)),n};var Rn=/\[\]$/,zn=/\r?\n/g,Bn=/^(?:submit|button|image|reset|file)$/i,Vn=/^(?:input|select|textarea|keygen)/i;function Hn(e,t,n,r){var i;if(Array.isArray(t))S.each(t,function(t,i){n||Rn.test(e)?r(e,i):Hn(e+`[`+(typeof i==`object`&&i?t:``)+`]`,i,n,r)});else if(!n&&m(t)===`object`)for(i in t)Hn(e+`[`+i+`]`,t[i],n,r);else r(e,t)}S.param=function(e,t){var n,r=[],i=function(e,t){var n=typeof t==`function`?t():t;r[r.length]=encodeURIComponent(e)+`=`+encodeURIComponent(n??``)};if(e==null)return``;if(Array.isArray(e)||e.jquery&&!S.isPlainObject(e))S.each(e,function(){i(this.name,this.value)});else for(n in e)Hn(n,e[n],t,i);return r.join(`&`)},S.fn.extend({serialize:function(){return S.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=S.prop(this,`elements`);return e?S.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!S(this).is(`:disabled`)&&Vn.test(this.nodeName)&&!Bn.test(e)&&(this.checked||!Vt.test(e))}).map(function(e,t){var n=S(this).val();return n==null?null:Array.isArray(n)?S.map(n,function(e){return{name:t.name,value:e.replace(zn,`\r
`)}}):{name:t.name,value:n.replace(zn,`\r
`)}}).get()}});var Un=/%20/g,Wn=/#.*$/,Gn=/([?&])_=[^&]*/,Kn=/^(.*?):[ \t]*([^\r\n]*)$/gm,qn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Jn=/^(?:GET|HEAD)$/,Yn=/^\/\//,Xn={},Zn={},Qn=`*/*`,$n=_.createElement(`a`);$n.href=Fn.href;function er(e){return function(t,n){typeof t!=`string`&&(n=t,t=`*`);var r,i=0,a=t.toLowerCase().match(ge)||[];if(typeof n==`function`)for(;r=a[i++];)r[0]===`+`?(r=r.slice(1)||`*`,(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function tr(e,t,n,r){var i={},a=e===Zn;function o(s){var c;return i[s]=!0,S.each(e[s]||[],function(e,s){var l=s(t,n,r);if(typeof l==`string`&&!a&&!i[l])return t.dataTypes.unshift(l),o(l),!1;if(a)return!(c=l)}),c}return o(t.dataTypes[0])||!i[`*`]&&o(`*`)}function nr(e,t){var n,r,i=S.ajaxSettings.flatOptions||{};for(n in t)t[n]!==void 0&&((i[n]?e:r||={})[n]=t[n]);return r&&S.extend(!0,e,r),e}function rr(e,t,n){for(var r,i,a,o,s=e.contents,c=e.dataTypes;c[0]===`*`;)c.shift(),r===void 0&&(r=e.mimeType||t.getResponseHeader(`Content-Type`));if(r){for(i in s)if(s[i]&&s[i].test(r)){c.unshift(i);break}}if(c[0]in n)a=c[0];else{for(i in n){if(!c[0]||e.converters[i+` `+c[0]]){a=i;break}o||=i}a||=o}if(a)return a!==c[0]&&c.unshift(a),n[a]}function ir(e,t,n,r){var i,a,o,s,c,l={},u=e.dataTypes.slice();if(u[1])for(o in e.converters)l[o.toLowerCase()]=e.converters[o];for(a=u.shift();a;)if(e.responseFields[a]&&(n[e.responseFields[a]]=t),!c&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),c=a,a=u.shift(),a){if(a===`*`)a=c;else if(c!==`*`&&c!==a){if(o=l[c+` `+a]||l[`* `+a],!o){for(i in l)if(s=i.split(` `),s[1]===a&&(o=l[c+` `+s[0]]||l[`* `+s[0]],o)){o===!0?o=l[i]:l[i]!==!0&&(a=s[0],u.unshift(s[1]));break}}if(o!==!0)if(o&&e.throws)t=o(t);else try{t=o(t)}catch(e){return{state:`parsererror`,error:o?e:`No conversion from `+c+` to `+a}}}}return{state:`success`,data:t}}S.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Fn.href,type:`GET`,isLocal:qn.test(Fn.protocol),global:!0,processData:!0,async:!0,contentType:`application/x-www-form-urlencoded; charset=UTF-8`,accepts:{"*":Qn,text:`text/plain`,html:`text/html`,xml:`application/xml, text/xml`,json:`application/json, text/javascript`},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:`responseXML`,text:`responseText`,json:`responseJSON`},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":S.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?nr(nr(e,S.ajaxSettings),t):nr(S.ajaxSettings,e)},ajaxPrefilter:er(Xn),ajaxTransport:er(Zn),ajax:function(t,n){typeof t==`object`&&(n=t,t=void 0),n||={};var r,i,a,o,s,c,l,u,d,f,p=S.ajaxSetup({},n),m=p.context||p,h=p.context&&(m.nodeType||m.jquery)?S(m):S.event,g=S.Deferred(),v=S.Callbacks(`once memory`),y=p.statusCode||{},b={},x={},C=`canceled`,w={readyState:0,getResponseHeader:function(e){var t;if(l){if(!o)for(o={};t=Kn.exec(a);)o[t[1].toLowerCase()+` `]=(o[t[1].toLowerCase()+` `]||[]).concat(t[2]);t=o[e.toLowerCase()+` `]}return t==null?null:t.join(`, `)},getAllResponseHeaders:function(){return l?a:null},setRequestHeader:function(e,t){return l??(e=x[e.toLowerCase()]=x[e.toLowerCase()]||e,b[e]=t),this},overrideMimeType:function(e){return l??(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(l)w.always(e[w.status]);else for(t in e)y[t]=[y[t],e[t]];return this},abort:function(e){var t=e||C;return r&&r.abort(t),T(0,t),this}};if(g.promise(w),p.url=((t||p.url||Fn.href)+``).replace(Yn,Fn.protocol+`//`),p.type=n.method||n.type||p.method||p.type,p.dataTypes=(p.dataType||`*`).toLowerCase().match(ge)||[``],p.crossDomain==null){c=_.createElement(`a`);try{c.href=p.url,c.href=c.href,p.crossDomain=$n.protocol+`//`+$n.host!=c.protocol+`//`+c.host}catch{p.crossDomain=!0}}if(tr(Xn,p,n,w),p.data&&p.processData&&typeof p.data!=`string`&&(p.data=S.param(p.data,p.traditional)),l)return w;for(d in u=S.event&&p.global,u&&S.active++===0&&S.event.trigger(`ajaxStart`),p.type=p.type.toUpperCase(),p.hasContent=!Jn.test(p.type),i=p.url.replace(Wn,``),p.hasContent?p.data&&p.processData&&(p.contentType||``).indexOf(`application/x-www-form-urlencoded`)===0&&(p.data=p.data.replace(Un,`+`)):(f=p.url.slice(i.length),p.data&&(p.processData||typeof p.data==`string`)&&(i+=(Ln.test(i)?`&`:`?`)+p.data,delete p.data),p.cache===!1&&(i=i.replace(Gn,`$1`),f=(Ln.test(i)?`&`:`?`)+`_=`+ In.guid+++f),p.url=i+f),p.ifModified&&(S.lastModified[i]&&w.setRequestHeader(`If-Modified-Since`,S.lastModified[i]),S.etag[i]&&w.setRequestHeader(`If-None-Match`,S.etag[i])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&w.setRequestHeader(`Content-Type`,p.contentType),w.setRequestHeader(`Accept`,p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+(p.dataTypes[0]===`*`?``:`, `+Qn+`; q=0.01`):p.accepts[`*`]),p.headers)w.setRequestHeader(d,p.headers[d]);if(p.beforeSend&&(p.beforeSend.call(m,w,p)===!1||l))return w.abort();if(C=`abort`,v.add(p.complete),w.done(p.success),w.fail(p.error),r=tr(Zn,p,n,w),!r)T(-1,`No Transport`);else{if(w.readyState=1,u&&h.trigger(`ajaxSend`,[w,p]),l)return w;p.async&&p.timeout>0&&(s=e.setTimeout(function(){w.abort(`timeout`)},p.timeout));try{l=!1,r.send(b,T)}catch(e){if(l)throw e;T(-1,e)}}function T(t,n,o,c){var d,f,_,b,x,C=n;l||(l=!0,s&&e.clearTimeout(s),r=void 0,a=c||``,w.readyState=t>0?4:0,d=t>=200&&t<300||t===304,o&&(b=rr(p,w,o)),!d&&S.inArray(`script`,p.dataTypes)>-1&&S.inArray(`json`,p.dataTypes)<0&&(p.converters[`text script`]=function(){}),b=ir(p,b,w,d),d?(p.ifModified&&(x=w.getResponseHeader(`Last-Modified`),x&&(S.lastModified[i]=x),x=w.getResponseHeader(`etag`),x&&(S.etag[i]=x)),t===204||p.type===`HEAD`?C=`nocontent`:t===304?C=`notmodified`:(C=b.state,f=b.data,_=b.error,d=!_)):(_=C,(t||!C)&&(C=`error`,t<0&&(t=0))),w.status=t,w.statusText=(n||C)+``,d?g.resolveWith(m,[f,C,w]):g.rejectWith(m,[w,C,_]),w.statusCode(y),y=void 0,u&&h.trigger(d?`ajaxSuccess`:`ajaxError`,[w,p,d?f:_]),v.fireWith(m,[w,C]),u&&(h.trigger(`ajaxComplete`,[w,p]),--S.active||S.event.trigger(`ajaxStop`)))}return w},getJSON:function(e,t,n){return S.get(e,t,n,`json`)},getScript:function(e,t){return S.get(e,void 0,t,`script`)}}),S.each([`get`,`post`],function(e,t){S[t]=function(e,n,r,i){return(typeof n==`function`||n===null)&&(i||=r,r=n,n=void 0),S.ajax(S.extend({url:e,type:t,dataType:i,data:n,success:r},S.isPlainObject(e)&&e))}}),S.ajaxPrefilter(function(e){for(var t in e.headers)t.toLowerCase()===`content-type`&&(e.contentType=e.headers[t]||``)}),S._evalUrl=function(e,t,n){return S.ajax({url:e,type:`GET`,dataType:`script`,cache:!0,async:!1,global:!1,scriptAttrs:t.crossOrigin?{crossOrigin:t.crossOrigin}:void 0,converters:{"text script":function(){}},dataFilter:function(e){S.globalEval(e,t,n)}})},S.fn.extend({wrapAll:function(e){var t;return this[0]&&(typeof e==`function`&&(e=e.call(this[0])),t=S(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){for(var e=this;e.firstElementChild;)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(e){return typeof e==`function`?this.each(function(t){S(this).wrapInner(e.call(this,t))}):this.each(function(){var t=S(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=typeof e==`function`;return this.each(function(n){S(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(e){return this.parent(e).not(`body`).each(function(){S(this).replaceWith(this.childNodes)}),this}}),S.expr.pseudos.hidden=function(e){return!S.expr.pseudos.visible(e)},S.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},S.ajaxSettings.xhr=function(){return new e.XMLHttpRequest};var ar={0:200};S.ajaxTransport(function(e){var t;return{send:function(n,r){var i,a=e.xhr();if(a.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(i in e.xhrFields)a[i]=e.xhrFields[i];for(i in e.mimeType&&a.overrideMimeType&&a.overrideMimeType(e.mimeType),!e.crossDomain&&!n[`X-Requested-With`]&&(n[`X-Requested-With`]=`XMLHttpRequest`),n)a.setRequestHeader(i,n[i]);t=function(e){return function(){t&&(t=a.onload=a.onerror=a.onabort=a.ontimeout=null,e===`abort`?a.abort():e===`error`?r(a.status,a.statusText):r(ar[a.status]||a.status,a.statusText,(a.responseType||`text`)===`text`?{text:a.responseText}:{binary:a.response},a.getAllResponseHeaders()))}},a.onload=t(),a.onabort=a.onerror=a.ontimeout=t(`error`),t=t(`abort`);try{a.send(e.hasContent&&e.data||null)}catch(e){if(t)throw e}},abort:function(){t&&t()}}});function or(e){return e.scriptAttrs||!e.headers&&(e.crossDomain||e.async&&S.inArray(`json`,e.dataTypes)<0)}S.ajaxSetup({accepts:{script:`text/javascript, application/javascript, application/ecmascript, application/x-ecmascript`},converters:{"text script":function(e){return S.globalEval(e),e}}}),S.ajaxPrefilter(`script`,function(e){e.cache===void 0&&(e.cache=!1),or(e)&&(e.type=`GET`)}),S.ajaxTransport(`script`,function(e){if(or(e)){var t,n;return{send:function(r,i){t=S(`<script>`).attr(e.scriptAttrs||{}).prop({charset:e.scriptCharset,src:e.url}).on(`load error`,n=function(e){t.remove(),n=null,e&&i(e.type===`error`?404:200,e.type)}),_.head.appendChild(t[0])},abort:function(){n&&n()}}}});var sr=[],cr=/(=)\?(?=&|$)|\?\?/;S.ajaxSetup({jsonp:`callback`,jsonpCallback:function(){var e=sr.pop()||S.expando+`_`+ In.guid++;return this[e]=!0,e}}),S.ajaxPrefilter(`jsonp`,function(t,n,r){var i,a,o,s=t.jsonp!==!1&&(cr.test(t.url)?`url`:typeof t.data==`string`&&(t.contentType||``).indexOf(`application/x-www-form-urlencoded`)===0&&cr.test(t.data)&&`data`);return i=t.jsonpCallback=typeof t.jsonpCallback==`function`?t.jsonpCallback():t.jsonpCallback,s?t[s]=t[s].replace(cr,`$1`+i):t.jsonp!==!1&&(t.url+=(Ln.test(t.url)?`&`:`?`)+t.jsonp+`=`+i),t.converters[`script json`]=function(){return o||S.error(i+` was not called`),o[0]},t.dataTypes[0]=`json`,a=e[i],e[i]=function(){o=arguments},r.always(function(){a===void 0?S(e).removeProp(i):e[i]=a,t[i]&&(t.jsonpCallback=n.jsonpCallback,sr.push(i)),o&&typeof a==`function`&&a(o[0]),o=a=void 0}),`script`}),S.ajaxPrefilter(function(t,n){typeof t.data!=`string`&&!S.isPlainObject(t.data)&&!Array.isArray(t.data)&&!(`processData`in n)&&(t.processData=!1),t.data instanceof e.FormData&&(t.contentType=!1)}),S.parseHTML=function(t,n,r){if(typeof t!=`string`&&!Qe(t+``))return[];typeof n==`boolean`&&(r=n,n=!1);var i,a;return n||=new e.DOMParser().parseFromString(``,`text/html`),i=Ze.exec(t),a=!r&&[],i?[n.createElement(i[1])]:(i=Rt([t],n,a),a&&a.length&&S(a).remove(),S.merge([],i.childNodes))},S.fn.load=function(e,t,n){var r,i,a,o=this,s=e.indexOf(` `);return s>-1&&(r=An(e.slice(s)),e=e.slice(0,s)),typeof t==`function`?(n=t,t=void 0):t&&typeof t==`object`&&(i=`POST`),o.length>0&&S.ajax({url:e,type:i||`GET`,dataType:`html`,data:t}).done(function(e){a=arguments,o.html(r?S(`<div>`).append(S.parseHTML(e)).find(r):e)}).always(n&&function(e,t){o.each(function(){n.apply(this,a||[e.responseText,t,e])})}),this},S.expr.pseudos.animated=function(e){return S.grep(S.timers,function(t){return e===t.elem}).length},S.offset={setOffset:function(e,t,n){var r,i,a,o,s,c,l,u=S.css(e,`position`),d=S(e),f={};u===`static`&&(e.style.position=`relative`),s=d.offset(),a=S.css(e,`top`),c=S.css(e,`left`),l=(u===`absolute`||u===`fixed`)&&(a+c).indexOf(`auto`)>-1,l?(r=d.position(),o=r.top,i=r.left):(o=parseFloat(a)||0,i=parseFloat(c)||0),typeof t==`function`&&(t=t.call(e,n,S.extend({},s))),t.top!=null&&(f.top=t.top-s.top+o),t.left!=null&&(f.left=t.left-s.left+i),`using`in t?t.using.call(e,f):d.css(f)}},S.fn.extend({offset:function(e){if(arguments.length)return e===void 0?this:this.each(function(t){S.offset.setOffset(this,e,t)});var t,n,r=this[0];if(r)return r.getClientRects().length?(t=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if(S.css(r,`position`)===`fixed`)t=r.getBoundingClientRect();else{for(t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;e&&e!==n.documentElement&&S.css(e,`position`)===`static`;)e=e.offsetParent||n.documentElement;e&&e!==r&&e.nodeType===1&&S.css(e,`position`)!==`static`&&(i=S(e).offset(),i.top+=S.css(e,`borderTopWidth`,!0),i.left+=S.css(e,`borderLeftWidth`,!0))}return{top:t.top-i.top-S.css(r,`marginTop`,!0),left:t.left-i.left-S.css(r,`marginLeft`,!0)}}},offsetParent:function(){return this.map(function(){for(var e=this.offsetParent;e&&S.css(e,`position`)===`static`;)e=e.offsetParent;return e||ie})}}),S.each({scrollLeft:`pageXOffset`,scrollTop:`pageYOffset`},function(e,t){var n=t===`pageYOffset`;S.fn[e]=function(r){return P(this,function(e,r,i){var a;if(h(e)?a=e:e.nodeType===9&&(a=e.defaultView),i===void 0)return a?a[t]:e[r];a?a.scrollTo(n?a.pageXOffset:i,n?i:a.pageYOffset):e[r]=i},e,r,arguments.length)}}),S.each({Height:`height`,Width:`width`},function(e,t){S.each({padding:`inner`+e,content:t,"":`outer`+e},function(n,r){S.fn[r]=function(i,a){var o=arguments.length&&(n||typeof i!=`boolean`),s=n||(i===!0||a===!0?`margin`:`border`);return P(this,function(t,n,i){var a;return h(t)?r.indexOf(`outer`)===0?t[`inner`+e]:t.document.documentElement[`client`+e]:t.nodeType===9?(a=t.documentElement,Math.max(t.body[`scroll`+e],a[`scroll`+e],t.body[`offset`+e],a[`offset`+e],a[`client`+e])):i===void 0?S.css(t,n,s):S.style(t,n,i,s)},t,o?i:void 0,o)}})}),S.each([`ajaxStart`,`ajaxStop`,`ajaxComplete`,`ajaxError`,`ajaxSuccess`,`ajaxSend`],function(e,t){S.fn[t]=function(e){return this.on(t,e)}}),S.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return arguments.length===1?this.off(e,`**`):this.off(t,e||`**`,n)},hover:function(e,t){return this.on(`mouseenter`,e).on(`mouseleave`,t||e)}}),S.each(`blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu`.split(` `),function(e,t){S.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),S.proxy=function(e,t){var n,r,a;if(typeof t==`string`&&(n=e[t],t=e,e=n),typeof e==`function`)return r=i.call(arguments,2),a=function(){return e.apply(t||this,r.concat(i.call(arguments)))},a.guid=e.guid=e.guid||S.guid++,a},S.holdReady=function(e){e?S.readyWait++:S.ready(!0)},S.expr[`:`]=S.expr.filters=S.expr.pseudos,typeof define==`function`&&define.amd&&define(`jquery`,[],function(){return S});var lr=e.jQuery,ur=e.$;return S.noConflict=function(t){return e.$===S&&(e.$=ur),t&&e.jQuery===S&&(e.jQuery=lr),S},t===void 0&&(e.jQuery=e.$=S),S}var t=e(window,!0),n=/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);function r(e){var t,n=RegExp(`(^| )`+e+`=([^;]*)(;|$)`);return(t=document.cookie.match(n))?unescape(t[2]):null}function i(e,t){var n=new Date;n.setTime(n.getTime()+300*24*60*60*1e3),document.cookie=e+`=`+t+`; expires=`+n.toGMTString()}function a(e){let t=e.parent(),n=t[0].getBoundingClientRect(),r=e[0].getBoundingClientRect();if(!(r.top>=n.top&&r.bottom<=n.bottom)){let e=t.scrollTop()+(r.bottom-n.bottom);t[0].scrollTop=e}}var o={setItem(e,t){try{if(!t)return this.removeItem(e);let n=t;return typeof t==`object`&&(n=JSON.stringify(t)),localStorage.setItem(e,n),!0}catch(e){return console.error(`存储数据失败:`,e),!1}},getItem(e,t=null){try{let n=localStorage.getItem(e);return n?n[0]===`{`||n[0]===`[`?JSON.parse(n):n:t}catch(e){return console.error(`获取数据失败:`,e),t}},removeItem(e){try{return localStorage.removeItem(e),!0}catch(e){return console.error(`移除数据失败:`,e),!1}},clearAll(){try{return localStorage.clear(),!0}catch(e){return console.error(`清除所有数据失败:`,e),!1}}};function s(e){return typeof e==`object`?e==null||e==null?``:JSON.stringify(e):e}function c(e){return e==null||e==null?``:JSON.stringify(e)}function l(e){return e.valueOf?`/Date(`+e.valueOf()+`)/`:e}function u(e){var t={};for(var n in e)t[n]=e[n];return t}function d(e){return e>0||(e=1e3),new Promise(t=>{setTimeout(t,e)})}async function f(e){for(;!e();)await d(1)}function p(e){return e.substring(0,1)!=`{`&&(e=`{`+e+`}`),Function(`return `+e)()}function m(e){return Function(`return `+e)()}function h(e){var t;return window.DOMParser?t=new DOMParser().parseFromString(e,`text/xml`):(t=new ActiveXObject(`Microsoft.XMLDOM`),t.async=`false`,t.loadXML(e)),$(t.documentElement)}var g={MaxUploadFileLength:1048576*30};function _(e){return encodeURIComponent(e)}var v={setCookie:function(e,t,n){var r=e+`=`+escape(t);if(n){var i=new Date;i.setTime(i.getTime()+n*60*1e3),r+=`; expires=`+i.toGMTString()}document.cookie=r},getCookie:function(e){return document.cookie.length>0&&(begin=document.cookie.indexOf(e+`=`),begin!=-1)?(begin+=e.length+1,end=document.cookie.indexOf(`;`,begin),end==-1&&(end=document.cookie.length),unescape(document.cookie.substring(begin,end))):``},delCookie:function(e){if(this.getCookie(e)){var t=new Date;t.setYear(1e3),document.cookie=e+`=;`+t.toGMTString()}}},y=`零一二三四五六七八九`,b=[``,`十`,`百`,`千`,`万`,`亿`],x=[``,`万`,`亿`];function S(e){if(!e)return`零`;for(var t=``,n=0,r=0;e;){var i=e%10;n&&(n%4==0&&r!=3?(t=x[n/4]+t,r=3):i&&r!=2&&(t=b[n%4]+t,r=2)),i?((i!=1||e>10||n%4!=1)&&(t=y[i]+t),r=1):r==1&&(t=y[i]+t,r=0),e=parseInt(e/10),n++}return t}function C(e){if(!e)return``;var t=[];return e>=1e4&&(t.push(parseInt(e/1e4)+`两<hiy>黄金</hiy>`),e%=1e4),e>100&&(t.push(parseInt(e/100)+`两<wht>白银</wht>`),e%=100),e>0&&t.push(e+`个<yel>铜板</yel>`),t.join(``)}function w(e,t,n){if(e){var r=[];if($.isPlainObject(t)){for(var i in t)t[i]&&r.push(i+`=`+_(s(t[i])));e=e+`?`+r.join(`&`)}else if(typeof t==`function`)n=t;else if($.isArray(t)){for(var a=0;a<t.length;a++)r.push(_(s(t[a])));e=e+`/`+r.join(`/`)}return E({url:`/`+e,callBack:n,type:`get`})}}function T(e,t,n){var r=JSON.stringify(t);return E({url:`/`+e,data:r,callBack:n,type:`post`})}async function E(e){let{url:t,data:n,type:r=`post`,callBack:i,dataType:a=`json`}=e,o={method:r.toUpperCase(),credentials:`include`,headers:{"Content-Type":`application/json; charset=UTF-8`}};n&&(o.body=n);let s=await fetch(t,o);if(s.status===404)throw Error(`404 Not Found`);i(a===`json`?await s.json():await s.text())}function ee(){if(arguments.length==0)return new Date;if(arguments.length==1){var e=arguments[0].split(`-`);return new Date(e[0],parseInt(e[1])-1,e[2])}else return new Date(arguments[0],arguments[1],arguments[2])}function te(e,t){for(var n=e.find(`input`),r=0;r<n.length;r++){var i=$(n[r]).val(),a=!1;if(t){for(var o=0;o<t.length;o++)if(t[o]==i){a=!0;continue}}a?$(n[r]).prop(`checked`,!0):$(n[r]).removeProp(`checked`)}}Array.prototype.Remove=function(e){for(var t=this.length,n=0;n<t;n++)if(this[n]==e)return this.splice(n,1),this;return this},Array.prototype.RemoveAt=function(e){for(var t=0;t<this.length;t++)e(this[t])&&(this.splice(t,1),t--)},Array.prototype.Has=function(e){for(var t=this.length,n=0;n<t;n++)if(this[n]==e)return!0;return!1},Array.prototype.Map=function(e){for(var t=this.length,n=[],r=0;r<t;r++){var i=e(this[r]);i&&n.push(i)}return n},Array.prototype.First=function(e){for(var t=this.length,n=0;n<t;n++){var r=this[n];if(e(r))return r}return null},Array.prototype.Where=function(e){for(var t=this.length,n=[],r=0;r<t;r++){var i=this[r];e(i)&&n.push(i)}return n},Date.prototype.AddDays=function(e){return this.setDate(this.getDate()+e),this},Date.prototype.AddMonths=function(e){return this.setMonth(this.getMonth()+e),this},Date.prototype.ToDateString=function(){var e=this.getMonth()+1;e<10&&(e=`0`+e);var t=this.getDate();return t<10&&(t=`0`+t),this.getFullYear()+`-`+e+`-`+t},Date.prototype.AddYears=function(e){return this.setFullYear(this.getFullYear()+e),this};var D={ProxyHost:`/`,isMobile:n,GetUserCookie:r,SetCookie:i,checkScroll:a,storage:o,Json2Str:s,Json2Str2:c,Date2Str:l,Clone:u,Sleep:d,Wait:f,Str2Json:p,Str2Json2:m,Str2XML:h,Settings:g,encode:_,CookieHelper:v,C_STR:y,C_STR2:b,C_STR3:x,to_c:S,moneyToStr:C,Get:w,Post:T,Request:E,ToDate:ee,CheckInputs:te},ne=!1,re=!1,O=null,ie=null,ae=null,oe=`u`,se=`p`;function ce(e,t){ne||(ie=e,console.log(`重新连接`,O==null?`未连接`:`已连接`),pe(),O=new he(e.ip,e.port),ne=!0,O.OnError=e=>{ne=!1,e&&(e.isTrusted&&(e=`服务器没有响应，请稍后重试`),M(`<strong>连接失败：</strong>`+e))},O.OnConnect=()=>{ne=!1,!t&&!Process.player?(M(`正在获取角色列表...`),ue(r(oe)+` `+r(se))):ue(t?r(oe)+` `+r(se)+` `+t+` `+e.ID:r(oe)+` `+r(se)+` `+Process.player)},O.OnClose=()=>{if(ne=!1,re){re=!1;return}O.Connected()||(Process.player?(Process.clear(),k(`<red>你的连接中断了...</red>`)):setTimeout(()=>{j($(`#slist_panel`))},3e3))},O.OnData=fe,O.OnMessage=k,O.Connect())}function le(){return O?O.Connected():!1}function ue(e){if(!ne){if(!O||!O.Connected())return ae=e,k(`<red>连接中断，正在重新连线...</red>`),ce(ie);Dialog.extend.record(e),O.Send(e)}}function de(){ae&&=(ue(ae),null)}function k(e){Dialog.extend.message_filter(e)||(Process.message.push(e),Process.message.scroll2end(),Dialog.extend.trigger(e))}function fe(e){if(!Dialog.extend.data_filter(e)){var t=Process[e.type];t&&t(e),Dialog.extend.process(e)}}function pe(){O&&O.Connected()&&O.Destroy(),O=null}function A(e,t){$(e).focus().parent().find(`.input-error`).remove(),$(`<div class='input-error'>`+t+`</div>`).insertAfter(e)}function j(e,t){for(var n,r=$(`.login-content`).children(),i=0;i<r.length;i++)if($(r[i]).css(`display`)!=`none`){n=$(r[i]);break}n||=$(`#login_panel`),n.animate({opacity:0},`fast`,function(){n.hide(),e==`.container`?$(`.login-content`).hide():$(`.login-content`).show(),e&&(e=$(e),e.show(),e.css(`opacity`,`0`),e.animate({opacity:1},`slow`,t))})}function M(e,t){for(var n=$(`.login-content`).children(),r=0;r<n.length;r++)$(n[r]).css(`display`)!=`none`&&!$(n[r]).is(`.signinfo`)&&$(n[r]).hide();$(`#loader`).css(`opacity`,1).show().find(`#loader_msg`).html(e)}var me=0,he=class{constructor(e,t){this.IP=e,this.Port=t}Connect(e){try{location.protocol,this.ws=new WebSocket(`ws://`+this.IP+`:`+this.Port),this.ws.onopen=this.OnConnect,this.ws.onclose=this.OnClose.bind(this),this.ws.onerror=this.OnError,this.ws.onmessage=this.OnReceived.bind(this),this.index=me++}catch(e){this.OnError&&this.OnError(e)}}OnReceived(e){if(!(!e||!e.data)){var t=e.data;if(t[0]==`{`||t[0]==`[`){var n=Function(`return `+t+`;`);this.OnData(n())}else this.OnMessage(t)}}Send(e){try{this.ws.send(e)}catch(e){k(e)}}Destroy(){this.ws.onclose=null,this.ws.close()}Close(){this.ws.close()}Connected(){return this.ws&&this.ws.readyState==1}},N={DEFAULT:{onOK:function(){},footer:!0,btn_text:`确认`},Show:function(e){this.Init(),this.Parameter=Object.assign({},this.DEFAULT,e),this.content.empty().append(this.Parameter.content),this.element.show(),this.Parameter.footer?(this.btn.show(),this.btn.find(`.btn-text`).html(this.Parameter.btn_text)):this.btn.hide(),this.isShow=!0},Close:function(e){N.isShow&&(N.element.hide(),N.isShow=!1,!e&&this.Parameter.onCancle&&this.Parameter.onCancle())},Init:function(){this._init||=(this.element=$(`<div class="dialog-confirm" style="display:none;">
        <div class="dialog-content"></div>
        <span class="dialog-btn btn-ok"><span class="glyphicon glyphicon-ok-circle btn-icon"></span><span
                class="btn-text">确认</span></span>
    </div>`).appendTo(document.body),this.content=this.element.find(`.dialog-content`),this.btn=this.element.find(`.dialog-btn`),this.element.on(`click`,`.btn-ok`,function(e){if(N.Parameter.content===N.count_element){var t=N.count_element.find(`input`),n=parseInt(t.val());n.toString()==`NaN`&&(n=0),n>N.max_count&&(n=N.max_count),N.Parameter.onOK(n)}else N.Parameter.onOK();return N.Close(!0),!1}),this.element.on(`click`,`.btn`,function(e){var t=N.max_count||1e3,n=$(e.target),r=parseInt(n.attr(`ac`)),i=n.parent().find(`input`),a=parseInt(i.val());return a.toString()==`NaN`&&(a=0),r==-10?a-=10:r==10?(a==1&&(a=0),a+=10):a=r==1?t:1,a<1?a=1:a>t&&(a=t),i.val(a),!1}),!0)},Process:function(e){var t=e[1],n=``;t==`dc`&&(t=e[3],n=e.splice(1,2),n=n[0]+` `+n[1]+` `);var r=this[`Show_`+t];r&&r.call(this,e,n)},get_countelement:function(e,t){return this.count_element||=$(`<div  class="confirm-count"><span class="btn" ac="0">最少</span><span ac="-10" class="btn">减10</span><input type="text" value="1" /><span class="btn"  ac="10" >加10</span><span class="btn" ac="1" >最多</span></div>`),e?this.count_element.find(`input`).val(e):this.count_element.find(`input`).val(1),t&&=parseInt(t),this.max_count=t||1e3,this.count_element},Show_shop:function(e,t){var n=e[2];if(!n)return;var r=Dialog.shop.get_item(n);if(!r)return;let i=e[3]?parseInt(e[3]):-1;this.Show({content:this.get_countelement(1,i==-1?9999:i),btn_text:`购买`+r.name,onOK:function(e){e>0&&SendCommand(`shop `+n+` `+e)}})},Show_buy:function(e){var t=e[3];if(t){var n=parseInt(e[2]);this.Show({content:this.get_countelement(1,n==-1?9999:n),btn_text:`购买`,onOK:function(n){n>0&&SendCommand(`buy `+n+` `+t+` from `+e[5])}})}},Show_greet:function(e){this.Show({content:this.get_countelement(1,99),btn_text:`送花`,onOK:function(e){e>0&&SendCommand(`greet `+e)}})},Show_sell:function(e){var t=e[3];t&&this.Show({content:this.get_countelement(e[2],e[2]),btn_text:`卖出`,onOK:function(n){n>0&&SendCommand(`sell `+n+` `+t+` to `+e[5])}})},Show_store:function(e){var t=e[3];if(t){if(e[2]==1)return SendCommand((Dialog.list.is_bookshelf?`sj `:``)+`store `+t);this.Show({content:this.get_countelement(e[2],e[2]),btn_text:`存入`,onOK:function(e){e>0&&SendCommand((Dialog.list.is_bookshelf?`sj `:``)+`store `+e+` `+t)}})}},Show_fenjie:function(e,t){var n=e[2];if(n){var r=Dialog.pack.isShow?Dialog.pack.get_item(n):Dialog.pack2.get_item(n);if(r){if(r.name.indexOf(`★`)==-1)return SendCommand(`fenjie `+n);this.Show({content:`是否确认分解`+r.name+`？`,btn_text:`确认分解`,onOK:function(){SendCommand(t+`fenjie `+n)}})}}},Show_qu:function(e){var t=e[2];if(t){var n=Dialog.list.find_item(3,t);if(n){if(n.count===1)return SendCommand((Dialog.list.is_bookshelf?`sj `:``)+`qu 1 `+t);this.Show({content:this.get_countelement(n.count,n.count),btn_text:`取出`,onOK:function(e){e>0&&SendCommand((Dialog.list.is_bookshelf?`sj `:``)+`qu `+e+` `+t)}})}}},Show_drop:function(e,t){var n=e[3];if(n){var r=Dialog.pack.isShow?Dialog.pack.get_item(n):Dialog.pack2.get_item(n);r&&this.Show({content:e[2]==1?`是否确认丢掉`+r.name+`？`:this.get_countelement(e[2],e[2]),btn_text:`丢掉`,onOK:function(r){if(e[2]==1)return SendCommand(t+`drop `+n);r>0&&SendCommand(t+`drop `+r+` `+n)}})}},Show_give:function(e,t){var n=e[4];if(n){var r=Dialog.pack2.get_item(n);if(r){if(r.count==1)return SendCommand(t+`give `+Process.player+` 1 `+n);this.Show({content:this.get_countelement(r.count,r.count),btn_text:`拿来`,onOK:function(e){e>0&&SendCommand(t+`give `+Process.player+` `+e+` `+n)}})}}},Show_trade_add:function(e){e&&this.Show({content:this.get_countelement(e.count,e.count),btn_text:`确定`,onOK:function(t){if(t>0){var n=Util.Clone(e);n.count=t,Dialog.trade.add_trade(n)}}})},Show_fangqi:function(e,t){var n=e[2];if(n){var r=t?Dialog.master.skills[n]:Dialog.skills.skills[n];r&&this.Show({content:`是否确认放弃技能`+r.name+`？`,onOK:function(){SendCommand(t+`fangqi `+n)}})}},Show_combine:function(e,t){var n=e[2];if(n){var r=Dialog.pack.get_item(n);if(r){var i=parseInt(e[3]);if(i){var a=parseInt(r.count/i);if(a==1)return SendCommand(`combine `+n);this.Show({content:this.get_countelement(a),btn_text:`合成`,onOK:function(e){e>0&&SendCommand(t+`combine `+n+` `+e)}})}}}},Show_pay:function(){SendCommand(`pay 0 `+(/mobile/i.test(navigator.userAgent)?`m`:`c`))}},P={Elemes:[],Show:function(e){var t=[`<div class='warn-dialog'>`];t.push(`<div class='warn-content'>`),t.push(e.content),t.push(`</div>`),t.push(`<div class='item-commands'>`);for(var n=0;n<e.cmds.length;n++){var r=e.cmds[n];t.push(`<span cmd='`),t.push(r.cmd),t.push(`'>`),t.push(r.name),t.push(`</span>`)}t.push(`</div>`);var i=$(t.join(``)).appendTo(`.bottom-bar`);this.Elemes.push(i),this.Settop();var a=this.Close.bind(this,i);e.time&&window.setTimeout(a,e.time),i.on(`click`,`span`,a)},Close:function(e){this.Elemes.indexOf(e)>-1&&(e.remove(),this.Elemes.Remove(e),this.Settop())},Settop:function(){for(var e=$(`.bottom-bar`).height()+8,t=0;t<P.Elemes.length;t++){var n=P.Elemes[t];n.css(`bottom`,e),e+=n.height()+14}}},ge={footer:[[`属性`,null],[`详细`,null],[`称号`,null]],selectIndex:0,onData:function(e){if(console.log(e),this.data=e,this.init_elem(),Dialog.titleElement.html(e.name),Dialog.icon(`user`),e.titles)this.titles=e.titles,this.create_titles();else{e.id&&e.id!=this.uid&&(this.uid=e.id,this.uid==Process.player?Dialog.footerElement.find(`.footer-item:eq(2)`).show():Dialog.footerElement.find(`.footer-item:eq(2)`).hide());for(var t=$(e.name?this.footer[0][1]:this.footer[1][1]).find(`span`),n=0;n<t.length;n++){var r=$(t[n]),i=r.attr(`data-prop`);i&&r.html(e[i]||0)}}},init:function(){this.footer[0][1]=$(this.template_score),this.footer[1][1]=$(this.template_score2),this.footer[2][1]=$(this.template_title),Dialog.injectStyle(this.css)},init_elem:function(){if(Dialog.init(),Dialog.curItem=`score`,!this.isShow){Dialog.footer(``);for(var e=0;e<this.footer.length;e++)$(`<span class='footer-item `+(this.selectIndex==e?`select`:``)+`' for='`+e+`'>`+this.footer[e][0]+`</span>`).appendTo(Dialog.footerElement);this.isShow=!0,this.footerChanged(this.selectIndex)}},show:function(e){e||(this.selectIndex?this.selectIndex==1?SendCommand(`score2`):SendCommand(`score title`):SendCommand(`score`),this.init_elem())},close:function(){this.footer[this.selectIndex][1].remove(),Dialog.footer(``),this.isShow=!1},footerChanged:function(e){e=parseInt(e),this.footer[this.selectIndex][1].remove(),this.selectIndex=e;var t=$(this.footer[this.selectIndex][1]).appendTo(Dialog.contentElement.empty());e==1?this.uid&&Process.player!=this.uid?SendCommand(`score2 `+this.uid):SendCommand(`score2`):e==2&&(this.titles||SendCommand(`score title`),t.on(`click`,`.btn-noused`,function(e){var t=$(e.target);t.is(`red`)&&(t=t.parent());for(var n=parseInt(t.attr(`index`)),r=0;r<this.titles.length;r++)r==n?this.titles[r].use=!this.titles[r].use:this.titles[r].use=!1;SendCommand(`title `+n),this.create_titles()}.bind(this)))},create_titles:function(){for(var e=$(`.dialog-titles`),t=[],n=0;n<this.titles.length;n++)t.push(`<div class='title-item`,this.titles[n].use?` selected`:``,`'>`),t.push(this.titles[n].title),t.push(`<span class='btn-noused' index='`),t.push(n),t.push(`'>`),t.push(this.titles[n].use?`<red>取消</red>`:`使用`),t.push(`</span>`),t.push(`</div>`);e.html(t.length?t.join(``):`<div class='empty'>你还没有获得任何称号</div>`)},template_score:`
<div class="dialog-score" cellpadding="0" cellspacing="1">
            <div class="score-section">
                <span class="title">
                    <hic>【性别】</hic>
                </span><span data-prop="gender" class="value"></span>
                <span class="title">
                    <hic>【等级】</hic>
                </span><span data-prop="level" class="value"></span><br />
                <span class="title">
                    <hic>【年龄】</hic>
                </span><span data-prop="age" style="width:10em;" class="value">14</span><br />
                <span class="title">
                    <hic>【经验】</hic>
                </span>
                <hic><span data-prop="exp" class="value">0</span></hic>
                <span class="title">
                    <hic>【潜能】</hic>
                </span>
                <hic><span data-prop="pot" class="value">0</span></hic>
            </div>
            <div class="score-section">
                <div><span class="title">
                        <hig>【气血】</hig>
                    </span>
                    <hig><span data-prop="hp" class="value"
                            style="text-align:right">0</span><span>&nbsp;/&nbsp;</span><span class="value"
                            data-prop="max_hp">0</span></hig>
                </div>
                <div><span class="title">
                        <hig>【内力】</hig>
                    </span>
                    <hig><span data-prop="mp" class="value"
                            style="text-align:right">0</span><span>&nbsp;/&nbsp;</span><span class="value"
                            data-prop="max_mp">0</span></hig>
                </div>
                <span class="title" style="width:6em;">
                    <hic>【内力上限】</hic>
                </span>
                <hic><span data-prop="limit_mp" class="value">0</span></hic><br />
                <span class="title" style="width:6em;">
                    <hic>【精力】</hic>
                </span>
                <hic><span data-prop="jingli" class="value">0</span></hic>
            </div>
            <div class="score-section">
                <span class="title">
                    <hiy>【臂力】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="str">0</span></hiy>
                    <NOR> (+<span data-prop="str_add">0</span>)</NOR>
                </span>
                <span class="title">
                    <hiy>【根骨】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="con">0</span></hiy>
                    <NOR>(+<span data-prop="con_add">0</span>)</NOR>
                </span><br />
                <span class="title">
                    <hiy>【身法】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="dex">0</span></hiy>
                    <NOR>(+<span data-prop="dex_add">0</span>)</NOR>
                </span>
                <span class="title">
                    <hiy>【悟性】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="int">0</span></hiy>
                    <NOR>(+<span data-prop="int_add">0</span>)</NOR>
                </span><br />
                <span class="title">
                    <hiy>【容貌】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="per">0</span></hiy>
                </span>
            </div>
            <div class="score-section">
                <span class="title">
                    <hic>【攻击】</hic>
                </span>
                <hic><span data-prop="gj" class="value">0</span></hic>
                <span class="title">
                    <hic>【防御】</hic>
                </span>
                <hic><span data-prop="fy" class="value">0</span></hic><br />
                <span class="title">
                    <hic>【命中】</hic>
                </span>
                <hic><span data-prop="mz" class="value">0</span></hic>
                <span class="title">
                    <hic>【躲闪】</hic>
                </span>
                <hic><span data-prop="ds" class="value">0</span></hic><br />
                <span class="title">
                    <hic>【招架】</hic>
                </span>
                <hic><span data-prop="zj" class="value">0</span></hic>
                <span class="title">
                    <hic>【暴击】</hic>
                </span>
                <hic><span data-prop="bj" class="value">0</span></hic><br />
                <span class="title" style="width:6em;">
                    <hic>【攻击速度】</hic>
                </span>
                <hic><span data-prop="gjsd" class="value">0</span></hic>
            </div>
            <div class="score-section">
                <span class="title">
                    <hic>【门派】</hic>
                </span>
                <hic><span data-prop="family" class="value">无门无派</span></hic><br />
                <span class="title">
                    <hic>【师傅】</hic>
                </span>
                <hic><span data-prop="master" class="value">无</span></hic><br />
                <span class="title">
                    <hic>【功绩】</hic>
                </span>
                <hic><span data-prop="gongji" class="value">0</span></hic><br />
            </div>
        </div>`,template_score2:`     <div class="dialog-score2">
            <span class="title">
                <hic>【最终伤害】</hic>
            </span>
            <hic>
                <span data-prop="add_sh" class="value">0</span>
            </hic>
            <br />
            <span class="title">
                <hic>【忽视防御】</hic>
            </span>
            <hic>
                <span data-prop="diff_fy" class="value">0</span>
            </hic><br />

            <span class="title">
                <hic>【暴击伤害】</hic>
            </span>
            <hic>
                <span data-prop="add_bj" class="value">0</span>
            </hic>
            <br />

            <span class="title">
                <hic>【伤害减免】</hic>
            </span>
            <hic>
                <span data-prop="diff_sh" class="value">0</span>
            </hic>
            <br />
            <span class="title">
                <hic>【暴击抵抗】</hic>
            </span>
            <hic>
                <span data-prop="diff_bj" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【释放时间减少】</hic>
            </span>
            <hic>
                <span data-prop="releasetime" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【忙乱时间】</hic>
            </span>
            <hic>
                <span data-prop="busy" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【忽视忙乱】</hic>
            </span>
            <hic>
                <span data-prop="diff_busy" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【冷却时间减少】</hic>
            </span>
            <hic>
                <span data-prop="distime" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【内力消耗减少】</hic>
            </span>
            <hic>
                <span data-prop="expend_mp" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【负面抵抗】</hic>
            </span>
            <hic>
                <span data-prop="downside_per" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【打坐效率】</hic>
            </span>
            <hic>
                <span data-prop="dazuo_per" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【学习效率】</hic>
            </span>
            <hic>
                <span data-prop="study_per" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【练习效率】</hic>
            </span>
            <hic>
                <span data-prop="lianxi_per" class="value">0</span>
            </hic>
        </div>`,template_title:`      <div class="dialog-titles">
        </div>
`},F={DIRS:[`west`,`north`,`south`,`east`,`northwest`,`southwest`,`northeast`,`southeast`,`down`,`up`,`westdown`,`northdown`,`southdown`,`eastdown`,`westup`,`northup`,`southup`,`eastup`,`enter`,`out`],REG:/<(\w+)>(.+)<\/\w+>/,CreateExitsMap:function(e,t,n){var r=n.split(`-`);r.length>1&&(n=r[r.length-1]),n=n.replace(/\(.*?\)/,``);var i=30,a=70,o=60,s=20,c=i+10,l=(t-o)/2,u=10,d={};for(var f in e.north&&e.up&&(e.north_2=e.up,delete e.up),e.south&&e.down&&(e.south_2=e.down,delete e.down),e)f.indexOf(`south`)>-1||f==`down`||f==`out`?d.s=!0:(f.indexOf(`north`)>-1||f==`up`||f==`enter`)&&(d.n=!0);d.s&&(c+=i),d.n&&(c+=i,u+=i);var p=[];for(var f in p.push(`<svg style="margin-left:-2em" height="`+c+`" width="`+t+`">`),p.push(`<rect x="`+l+`" y="`+u+`"  fill="dimgrey" stroke-width="1" stroke="gray" `),p.push(`width="`+o+`" height="`+s+`"></rect>`),p.push(` <text x="`+(l+30)+`" y="`+(u+14)+`"  text-anchor="middle" style="font-size:12px;" `),this.pushName(p,n,!0),e){var m,h,g;switch(f){case`west`:case`westup`:case`westdown`:m=[l-(a-o),u+s/2],h=[l,u+s/2],g=[l-a,u];break;case`east`:case`eastup`:case`eastdown`:m=[l+o,u+s/2],h=[l+a,u+s/2],g=[l+a,u];break;case`south`:case`southup`:case`southdown`:case`down`:m=[l+o/2,u+s],h=[l+o/2,u+i],g=[l,u+i];break;case`north`:case`northup`:case`northdown`:case`up`:m=[l+o/2,u],h=[l+o/2,u-(i-s)],g=[l,u-i];break;case`northwest`:m=[l-a+o,u-i+s],h=[l,u],g=[l-a,u-i];break;case`northeast`:case`north_2`:case`enter`:m=[l+a,u-i+s],h=[l+o,u],g=[l+a,u-i];break;case`southeast`:case`south_2`:m=[l+a,u+i],h=[l+o,u+s],g=[l+a,u+i];break;case`southwest`:case`out`:m=[l-a+o,u+i],h=[l,u+s],g=[l-a,u+i];break}var _=e[f];f==`south_2`?f=`down`:f==`north_2`&&(f=`up`),p.push(`<rect x="`+g[0]+`" y="`+g[1]+`" dir="`+f+`" fill="#232323" stroke-width="1" stroke="gray" `),p.push(`width="`+o+`" height="`+s+`"></rect>`),p.push(` <text x="`+(g[0]+30)+`" y="`+(g[1]+14)+`" dir="`+f+`" text-anchor="middle" style="font-size:12px;"`),this.pushName(p,_,!1),m&&(p.push(`<line  stroke="gray" `),p.push(` x1='`+m[0]+`' y1='`+m[1]+`' x2='`+h[0]+`' y2='`+h[1]+`'`),f.indexOf(`up`)>-1||f.indexOf(`down`)>-1?(p.push(` stroke-dasharray='5,5'`),p.push(` stroke-width='10'`)):p.push(` stroke-width='1'`),p.push(`></line >`))}return p.push(`</svg>`),p.join(``)},colors:{hig:`#00FF00`,hir:`#FF0000`,him:`#FF00FF`,hic:`#00FFFF`,hiy:`#FFFF00`,red:`#800000`,wht:`#C0C0C0`,mag:`#800080`,red:`#800000`,hiw:`#FFFFFF`,gre:`#008000`,blu:`#000080`,hib:`#0000FF`},GetColor:function(e,t){return this.colors[e.toLowerCase()]||`dimgrey`},ShowMap:function(e,t){if(e){this.CurMapID=t;var n=[],r=this.getMinPos(e),i=0-r.minX,a=0-r.minY,o=50,s=100,c=60,l=20,u=$(`.map-panel`);this.MapWidth=(r.maxX+i+1)*s;var d=0,f=u.width();if(this.MapWidth<f&&(d=(f-this.MapWidth)/2,this.MapWidth=f),this.MapHeight=(r.maxY+a+1)*o,!(this.MapWidth<0||this.MapHeight<0)){var p=/^([a-z]{1,2})(\d)?([d|l])?$/;n.push(`<svg class="map" height="`+this.MapHeight+`" width="`+this.MapWidth+`">`);for(var m=0;m<e.length;m++){n.push(`<rect class='map-room' rm='`+e[m].id+`' `);var h=(e[m].p[0]+i)*s+d+20,g=(e[m].p[1]+a)*o+20;n.push(`x='`+h+`' y='`+g+`'`),n.push(` fill="dimgrey" stroke-width="1" stroke="gray" `),n.push(`width="`+c+`" height="`+l+`"></rect>`);var _=e[m].exits;if(_)for(var v=0;v<_.length;v++){p.test(_[v]);var y=RegExp.$2?parseInt(RegExp.$2):1,b,x;switch(RegExp.$1){case`w`:b=[h-(s-c)-s*(y-1),g+l/2],x=[h,g+l/2];break;case`e`:b=[h+c,g+l/2],x=[h+s+s*(y-1),g+l/2];break;case`s`:b=[h+c/2,g+l],x=[h+c/2,g+o+o*(y-1)];break;case`n`:b=[h+c/2,g],x=[h+c/2,g-(o-l)-o*(y-1)];break;case`nw`:b=[h-y*s+c,g-y*o+l],x=[h,g];break;case`ne`:b=[h+c,g],x=[h+y*s,g-(o-l)];break;case`se`:b=[h+c,g+l],x=[h+y*s,g+y*o];break;case`sw`:b=[h,g+l],x=[h-(s-c)-s*(y-1),g+y*o];break}b&&(n.push(`<line  stroke="gray" `),n.push(` x1='`+b[0]+`' y1='`+b[1]+`' x2='`+x[0]+`' y2='`+x[1]+`'`),RegExp.$3&&n.push(` stroke-dasharray='5,5'`),RegExp.$3==`l`?n.push(` stroke-width='10'`):n.push(` stroke-width='1'`),n.push(`></line >`))}n.push(` <text x="`+(h+30)+`" y="`+(g+14)+`" text-anchor="middle" style="font-size:12px;" `),this.pushName(n,e[m].n,!0)}n.push(`</svg>`),u.html(n.join(``)),this.MapContent=$(`svg`),this.IsShow||(this.IsShow=!0,$(`.map-panel`).slideDown(`fast`)),this.SetRoom(this.Room)}}},pushName:function(e,t,n){var r=this.REG.exec(t);r?(e.push(`  fill="`+this.GetColor(r[1])+`"`),e.push(`>`+r[2]+`</text>`)):(e.push(` fill="`),e.push(n?`#232323`:`dimgrey`),e.push(`">`+t+`</text>`))},getMinPos:function(e){for(var t={minX:99999,minY:99999,maxX:0,maxY:0},n=0;n<e.length;n++){var r=e[n].p[0],i=e[n].p[1];r<t.minX&&(t.minX=r),r>t.maxX&&(t.maxX=r),i<t.minY&&(t.minY=i),i>t.maxY&&(t.maxY=i)}return t},State:0,ZoomState:100,Buffer:{},HideItem:function(){this.State==0&&(this.State=1,$(`.room_desc`).slideUp(`fast`))},ShowItem:function(){this.State==1&&(this.State=0,$(`.room_desc`).slideDown(`fast`))},ZoomIn:function(e){if(!e.zoom){this.ZoomState/=e.zoom,this.ZoomState>200&&(this.ZoomState=200),this.ZoomState<80&&(this.ZoomState=80);var t=this.MapWidth*this.ZoomState/100,n=this.MapHeight*this.ZoomState/100;this.MapContent.attr(`viewBox`,`0,0,`+t+`,`+n)}},SetRoom:function(e){if(this.Room=e,this.IsShow){this.CurRoomItem&&(this.CurRoomItem.attr(`fill`,`dimgrey`),this.CurRoomItem.attr(`stroke`,`gray`)),this.CurRoomItem=null;var t=this.MapContent.find(`rect[rm='`+e.path+`']`);if(t.length){this.CurRoomItem=t,this.CurRoomItem.attr(`fill`,`#bebebe`),this.CurRoomItem.attr(`stroke`,`gray`);var n=[t.attr(`x`),t.attr(`y`),t.attr(`width`),t.attr(`height`)],r=document.querySelector(`.map-panel`),i=r.offsetHeight,a=r.offsetWidth;r.scrollTop=n[1]-(i-n[3])/2,r.scrollLeft=n[0]-(a-n[2])/2}var o=e.path.substr(0,e.path.lastIndexOf(`/`));if(o!=this.CurMapID){if(this.Buffer[o])return this.ShowMap(this.Buffer[o],o);SendCommand(`map `+o)}}},LoadMap:function(){if(this.IsShow)return this.IsShow=!1,$(`.map-panel`).slideUp(`fast`);var e=this.Room;if(e){var t=e.path.substr(0,e.path.lastIndexOf(`/`));if(t==this.CurMapID){$(`.map-panel`).slideDown(`fast`),this.IsShow=!0;return}if(this.Buffer[t])return this.ShowMap(this.Buffer[t],t);SendCommand(`map `+t)}},SetMapBuffer:function(e,t){this.Buffer[t]=e},UpdateMap:function(e,t){var n=this.Buffer[e];if(n){if(!t.id){this.Buffer[e]=null,this.CurMapID==e&&(this.CurMapID=null);return}for(var r=0;r<n.length;r++)if(n[r].id==t.id){n[r].n=t.n||n[r].n,n[r].p=t.p||n[r].p,n[r].exits=t.exits||n[r].exits;break}e==this.CurMapID&&this.ShowMap(n,e)}}},_e={onData:function(e){Dialog.title(e.title||`地图`)},init:function(){},show:function(){Dialog.init();var e=F.Room.name,t=e.indexOf(`-`);t>-1&&(e=e.substr(0,t)),Dialog.title(e),Dialog.footer(``),this.element=$(`.map`),Dialog.contentElement.append(this.element),Dialog.icon(`map-marker`),Dialog.iconElement.attr(`class`,`dialog-icon glyphicon glyphicon-map-marker`)},hide:function(){this.element.remove(),$(`.map-panel`).children().length==0&&this.element.appendTo(`.map-panel`)},close:function(){this.hide()}},ve={left:[`west`,`westup`,`westdown`],right:[`east`,`eastup`,`eastdown`],up:[`north`,`northup`,`northdown`,`up`],down:[`south`,`southup`,`southdown`,`down`],leftup:[`northwest`],leftdown:[`southwest`],rightup:[`northeast`],rightdown:[`southeast`]},I={is_running:!1,run:async function(e){this.is_running=!0;try{let t=e.split(`;`);for(let e of t)await this.run_one(e)}catch(e){console.log(`扩展执行失败：`,e)}this.is_running=!1},var_reg:/^@(\w+)(?:\(([^)]*)\))?$/,run_one:async function(e){let t=e.split(` `),n=t[0],r=this.actions.def;n[0]===`#`&&(n=n.substring(1),r=this.actions[n]??this.actions.def);let i=[[]],a=null;for(let e=1;e<t.length&&i.length;e++)a=t[e],a[0]===`@`?await this.push_paras(i,a):i.map(e=>e.push(a));for(let e of i)await r(e,n)},push_paras:async function(e,t){let n=t.match(this.var_reg);if(!n)throw Error(`<cyn>错误的参数格式`+t+`</cyn>`);let r=n[1],i=n[2]?n[2].split(`,`).map(e=>e.trim()):[],a=this.vars[r];if(!a)throw Error(`<cyn>无效参数`+t+`</cyn>`);let o=await a(...i);if(!o)return e.length=0;if(!Array.isArray(o))return e.map(e=>e.push(o));if(!o.length)return e.length=0;let s=e.length;for(let t=1;t<o.length;t++)for(let n=0;n<s;n++)e.push([...e[n],o[t]]);for(let t=0;t<s;t++)e[t].push(o[0])},actions:{def:function(e,t){e.length?SendCommand(t+` `+e.join(` `)):SendCommand(t)},wait:function(e){return D.Sleep(parseInt(e[0]))},action:async function(e){let t=parseInt(e[0]);if(!(t>=0&&t<10))return;let n=$(`.room-commands`).children().eq(t).attr(`cmd`);n&&I.run(n)},pfm:function(e){let t=parseInt(e[0]);if(!(t>=0&&t<10))return SendCommand(`perform `+e[0]);let n=$(`.combat-commands`).children().eq(t).attr(`pid`);n&&I.run(`perform `+n)},menu:function(e){let t=e[0];t&&HandlerMenuCommand(t)},msg:function(e){e.length>0&&ReceiveMessage(e.join(``))}},vars:{me:function(){return Process.player},dir:function(e){let t=ve[e];if(t){for(let e of t)if(Process.room_exits[e])return e}},npc:function(...e){let t=Process.cur_room,n=[];for(let r of t.items)if(r&&r.hp>0&&!r.p){if(!e||!e.length)n.push(r.id);else for(let t of e)if(r.name.indexOf(t)>-1){n.push(r.id);break}}return n},item:function(...e){let t=Process.cur_room,n=[];for(let r of t.items)if(r){if(!e||!e.length)n.push(r.id);else for(let t of e)if(r.name.indexOf(t)>-1){n.push(r.id);break}}return n},id:function(){let e=I.LAST_OBJ;return e?e.id:``},obj:function(e){let t=I.LAST_OBJ;if(!(!e||!t))return t[e]},pack:function(...e){let t=Dialog.pack.isShow?Dialog.pack.items:Dialog.pack2.items;if(!t)return;let n=[];for(let r of t)for(let t of e)if(r.name.indexOf(t)>-1){n.push(r.id);break}return n},goods:function(...e){let t=Dialog.list.selllist;if(!t)return;let n=[];for(let r of t)for(let t of e)if(r.name.indexOf(t)>-1){n.push(r.id);break}return n},input:function(){let e={btn_text:`确定`,min:0,max:0};for(let t=0;t<arguments.length;t++){let n=arguments[t];typeof n==`string`?e.btn_text=n:e.max>0?e.min=n:e.max=n}return e.content=N.get_countelement(e.min||1,e.max||9999),new Promise((t,n)=>{e.onOK=t,e.onCancle=n,N.Show(e)})},mat:function(e){let t=I.lAST_MATCHES;if(t)return t[e]},data:function(e){if(!(!e||!I.LAST_DATA))return I.LAST_DATA[e]},master:function(){return Dialog.master.master},dc:function(){return Dialog.master.isShow?`dc `+Dialog.master.master:Dialog.pack2.command_before}},helper:{actions:[`#wait 100：等待100毫秒执行`,`#msg 你好：输出提示消息`,`#menu score，打开对话框`,`#action (0-9)，执行动作栏对应位置的操作`,`#pfm (0-9)，释放对应位置的绝招`,`持续增加`],vars:[`@dir(left)：获取当前房间左边方向的出口命令`,`@npc(小二)：获取当前房间的npc ID，无参数返回所有npc`,`@item：获取当前房间所有物品ID，参数匹配名称`,`@id：当前正在操作的道具，技能，NPC等的ID`,`持续增加`],paras:[`参数用来判断所在位置的数据属性，比如地图的参数，有name,type,index`,`name(扬州)：名称里包含扬州二字的地图`,`index(>3)：索引大于3的地图`]}},ye={groups:[{name:`移动`,items:[{name:`左`,key:null,cmd:`#go @dir(left)`},{name:`右`,key:null,cmd:`#go @dir(right)`},{name:`上`,key:null,cmd:`#go @dir(up)`},{name:`下`,key:null,cmd:`#go @dir(down)`},{name:`左上`,key:null,cmd:`#go @dir(leftup)`},{name:`左下`,key:null,cmd:`#go @dir(leftdown)`},{name:`右上`,key:null,cmd:`#go @dir(rightup)`},{name:`右下`,key:null,cmd:`#go @dir(rightdown)`}]},{name:`菜单`,items:[{name:`属性`,key:null,cmd:`#menu score`},{name:`背包`,key:null,cmd:`#menu pack`},{name:`技能`,key:null,cmd:`#menu skills`},{name:`任务`,key:null,cmd:`#menu tasks`},{name:`商城`,key:null,cmd:`#menu shop`},{name:`社交`,key:null,cmd:`#menu message`},{name:`排行`,key:null,cmd:`#menu stats`},{name:`设置`,key:null,cmd:`#menu setting`},{name:`动作`,key:null,cmd:`#menu showcombat`},{name:`活动`,key:null,cmd:`#menu events`},{name:`聊天`,key:null,cmd:`#menu showchat`},{name:`停止`,key:null,cmd:`#menu stopstate`},{name:`江湖`,key:null,cmd:`#menu jh`}]}],setting:null,show:function(e){this.element=e,this.init(),e.on(`click`,`.skey-item`,this.item_clicked),document.body.addEventListener(`keydown`,this.record_press)},hide:function(){document.body.removeEventListener(`keydown`,this.record_press)},close:function(){document.body.removeEventListener(`keydown`,this.record_press)},record_press:function(e){let t=Dialog.keys.select_item;if(!t)return;let n=Dialog.keys.get_item(t.attr(`sid`));if(!n)return;if(e.keyCode===8||e.keyCode===27)return Dialog.keys.save_setting(n,null),t.find(`.skey-key`).html(``);let r=Dialog.keys.get_key_code(e);Dialog.keys.save_setting(n,r),t.find(`.skey-key`).html(n.key),e.preventDefault(),e.stopPropagation()},get_key_code:function(e){let t=e.code;if(e.ctrlKey){if(e.key===`Control`)return;t=`Ctrl+`+t}if(e.altKey){if(e.key===`Alt`)return;t=`Alt+`+t}if(e.shiftKey){if(e.key===`Shift`)return;t=`Shift+`+t}return t},save_setting:function(e,t){if(e.key=t,this.setting||={},!t)t=this.id2keys[e.id],t&&delete this.setting[t],delete this.id2keys[e.id];else if(t){if(this.setting[t]){if(this.setting[t]===e.id)return;let n=this.get_item(this.setting[t]);n&&(n.key=null,this.element.find(`.skey-item[sid="`+n.id+`"]>.skey-key`).html(``))}this.setting[t]=e.id}D.storage.setItem(`keys`,this.setting)},get_item:function(e){this.groups.length===2&&this.init();let t=e.split(`_`),n=Dialog.keys.groups[parseInt(t[0])];if(n)return n.items[parseInt(t[1])]},default_keys:{KeyW:`0_2`,KeyA:`0_0`,KeyR:`0_6`,KeyD:`0_1`,KeyS:`0_3`,KeyQ:`0_4`},init_key:function(){if(!this.load_storage&&!D.isMobile&&(this.load_storage=!0,this.setting=D.storage.getItem(`keys`),window.addEventListener(`keydown`,this.keypress),this.id2keys={},this.setting))for(let e in this.setting)this.id2keys[this.setting[e]]=e},keypress:function(e){if(e.target!==document.body)return;let t=Dialog.keys.setting;if(!t)return;let n=Dialog.keys.get_key_code(e);if(t[n]){let r=Dialog.keys.get_item(t[n]);r&&(I.run(r.cmd),e.preventDefault())}},item_clicked:function(){let e=Dialog.keys.select_item;e&&e.removeClass(`selected`),Dialog.keys.select_item=$(this).addClass(`selected`)},init:function(){if(this.groups.length>2)return;let e=this.id2keys||{},t=null,n=0;for(let r of this.groups){for(let i=0;i<r.items.length;i++)t=n+`_`+i,r.items[i].id=t,r.items[i].key=e[t];n++}let r={name:`动作栏`,items:[]};for(let n=0;n<12;n++)t=`2_`+n,r.items.push({name:`栏位`+(n+1),id:t,cmd:`#action `+n,key:e[t]});this.groups.push(r),r={name:`技能栏`,items:[]};for(let n=0;n<12;n++)t=`3_`+n,r.items.push({name:`栏位`+(n+1),id:t,cmd:`#pfm `+n,key:e[t]});this.groups.push(r),this.element&&this.create_html()},create_html:function(){let e=[],t=0,n=0;for(let r of this.groups){e.push(`<h3>`,r.name,`</h3>`),n=0;for(let t of r.items)e.push(`<div class="skey-item" sid="`,t.id,`">`),e.push(`<div class="skey-name">`,t.name,`</div>`),e.push(`<div class="skey-key">`,t.key,`</div>`),e.push(`</div>`),n++;t++}this.element.html(e.join(``))}},L={keep_msg:0,show_hpnum:0,show_hp:0,item_autoheight:0,item_firstme:0,hide_roomdesc:0,exits_dir:0,show_sa:0,show_command:0,fontsize:`0.875rem`,font:``,no_spmsg:0,fontcolor:`#008000`,backcolor:`black`,auto_showcombat:0,auto_sortitem:0,auto_hideroom:0,show_roomitem:0,fullscreen:0,channel_chat:1,channel_tm:1,channel_fam:1,channel_es:1,ban_pk:0,off_plist:0,combat_wrap:0,combat_size:`1em`,dialog_size:`1em`,menu_size:`1em`,action_wrap:0,off_hp:0,show_damage:0,no_master:0,no_team:0,no_load:!0,load:function(e){if(Dialog.keys.init_key(),Dialog.extend.init_extend(),e)for(var t in e)t!=`fullscreen`&&(this.set_prop(t,e[t]),this[t]=e[t])},set_prop:function(e,t){switch(e){case`fontsize`:$(`.container`).css(`font-size`,t),$(`.dialog-confirm`).css(`font-size`,t);break;case`font`:t===`none`&&(t=``),$(`.container`).css(`font-family`,t);break;case`combat_size`:$(`.content-bottom`).css(`font-size`,t);break;case`dialog_size`:$(`.dialog`).css(`font-size`,t);break;case`show_sa`:Combat.refActions();break;case`menu_size`:$(`.bottom-bar`).css(`font-size`,t);break;case`fontcolor`:$(document.body).css(`color`,t);break;case`backcolor`:$(document.body).css(`background-color`,t);break;case`hide_roomdesc`:t?$(`.room_desc`).hide():$(`.room_desc`).show();break;case`exits_dir`:Process.exits();break;case`off_hp`:t?$(`.item-status`).hide():$(`.item-status`).show();break;case`combat_wrap`:t?$(`.combat-commands`).addClass(`combat-wrap`):$(`.combat-commands`).removeClass(`combat-wrap`);break;case`action_wrap`:t?$(`.room-commands`).addClass(`combat-wrap`):$(`.room-commands`).removeClass(`combat-wrap`);break;case`item_autoheight`:t?$(`.room_items`).removeAttr(`style`):$(`.room_items`).attr(`style`,`max-height: 8rem; overflow-y: auto;`);break;case`item_firstme`:if(t==1){var n=$(`.room_items>.room-item[itemid='`+Process.player+`']`);$(`.room_items`).prepend(n)}break;case`show_hp`:Combat.IsShow||(t==1?$(`.room-item>.item-status`).show():$(`.room-item>.item-status`).hide());break;case`show_hpnum`:Process.cur_room&&Process.items(Process.cur_room);break;case`show_damage`:$(`.item-damage`).remove();break;case`fullscreen`:t?L.launchFullScreen():L.exitFullscreen();break;case`show_command`:Process.itemsElement.find(`.item-commands`).remove();break;case`no_spmsg`:t?Process.ChannelElement.hide():Process.ChannelElement.show();break}},save:function(e,t){this[e]=t,this.set_prop(e,t),SendCommand(`setting `+e+` `+t)},launchFullScreen:function(e){e||=document.documentElement,e.requestFullscreen?e.requestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullscreen?e.webkitRequestFullscreen():e.msRequestFullscreen&&e.msRequestFullscreen()},exitFullscreen:function(){document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen&&document.webkitExitFullscreen()}},be={footer:[[`显示`,`setting`],[`<yel>高级</yel>`,`custom`],[`快捷键`,`keys`],[`扩展`,`extend`]],selectitem:null,init:function(){if(!this.settingElement){D.isMobile&&this.footer.splice(2,1),this.settingElement=$(xe),this.extendElement=$(Ce),this.keysElement=$(Se),this.customElement=$(R),Dialog.injectStyle(we);for(var e=$(`.setting>.setting-item`),t=0;t<e.length;t++){var n=$(e[t]),r=n.attr(`for`);if(r){var i=L[r];switch(r){case`fontsize`:this.select_color(n.find(`.color-item`),i,`fontSize`);break;case`font`:this.select_color(n.find(`.color-item`),i,`fontFamily`);break;case`fontcolor`:this.select_color(n.find(`.color-item`),i,`backgroundColor`);break;case`backcolor`:this.select_color(n.find(`.color-item`),i,`backgroundColor`);break;case`combat_size`:case`menu_size`:case`dialog_size`:this.select_value(n.find(`.color-item`),i);break;case`auto_pfm`:case`auto_pfm2`:i&&(n.find(`.switch `).addClass(`on`),n.find(`.switch-text`).html(`开`),$(`#`+r).show().val(i));break;case`auto_work`:i&&(n.find(`.switch `).addClass(`on`),n.find(`.switch-text`).html(`开`),$(`#`+r).show().val(i==1?``:i));break;default:i==1&&(n.find(`.switch `).addClass(`on`),n.find(`.switch-text`).html(`开`));break}}}}},show:function(){if(!this.isShow){this.footerChanged(`setting`),Dialog.icon(`cog`),Dialog.title(`设置`),Dialog.footerElement.empty();for(var e=0;e<this.footer.length;e++){var t=$(`<span class='footer-item' for='`+this.footer[e][1]+`'>`+this.footer[e][0]+`</span>`).appendTo(Dialog.footerElement);e==0&&t.addClass(`select`)}this.isShow=!0}},select_color:function(e,t,n){for(var r=0;r<e.length;r++)e[r].style[n]==t?$(e[r]).addClass(`select`):$(e[r]).removeClass(`select`)},select_value:function(e,t){for(var n=0;n<e.length;n++)$(e[n]).attr(`value`)==t?$(e[n]).addClass(`select`):$(e[n]).removeClass(`select`)},footerChanged:function(e){let t=this[e+`Element`];if(!t||t===this.selectitem)return this.child?.command(e);this.selectitem&&this.selectitem.remove(),this.selectitem=t,this.child&&this.child.hide(),this.child=null,e==`setting`?(this.selectitem.on(`click`,`.switch`,this.switchClick),this.selectitem.on(`click`,`.color-item`,this.colorClick)):e==`custom`?(this.selectitem.on(`click`,`.switch`,this.switchClick),this.selectitem.on(`click`,`.setting-ok`,this.save_custom)):(this.child=Dialog[e],this.child.show(this.selectitem)),this.selectitem.appendTo(Dialog.contentElement)},helpClick:function(){switch($(this).attr(`action`)){case`tologin`:break;case`torole`:O.Close(),j(`#role_panel`,function(){Process.player=null,Process.clear()});break;case`toserver`:Process.player=null,O.Close();break;default:break}},close_help:function(){this.frame&&=(this.frame.remove(),this.selectitem.removeClass(`help-detl`),null)},hide:function(){if(this.child&&this.child.hide()===!1)return!1;this.close()},close:function(){this.child?.close(),this.selectitem?.remove(),this.isShow=!1,this.selectitem=null,this.child=null},save_custom:function(){if($(`.dialog-custom>.setting-item[for='auto_pfm']>.switch`).is(`.on`)){var e=$(`#auto_pfm`).val();if(!e)return k(`<hir>你没有设置自动出招的绝招。</hir>`);if(e.length>300)return k(`<hir>你设置的出招过长。</hir>`);L.save(`auto_pfm`,e)}if($(`.dialog-custom>.setting-item[for='auto_pfm2']>.switch`).is(`.on`)){var e=$(`#auto_pfm2`).val();if(!e)return k(`<hir>你没有设置自动反击的绝招。</hir>`);if(e.length>300)return k(`<hir>你设置的出招过长。</hir>`);L.save(`auto_pfm2`,e)}if($(`.dialog-custom>.setting-item[for='auto_work']>.switch`).is(`.on`)){var e=$(`#auto_work`).val();if(e&&e.length>400)return k(`<hir>你设置的过长。</hir>`);L.save(`auto_work`,e||1)}k(`<hic>设置已保存。</hic>`)},get_pfms:function(e){if(!Combat.Skills)return k(`<hir>你没有可用的绝招设置。</hir>`);for(var t=[],n=0;n<Combat.Skills.length;n++)t.length>0&&t.push(`,`),t.push(Combat.Skills[n].id);$(`#`+e).val(t.join(``)),k(`已预设置为你默认的绝招(未保存)，你可以修改为适合你的出招顺序后点击保存`)},switchClick:function(e){var t=$(this),n=t.parent().attr(`for`),r=0;switch(t.is(`.on`)?(t.removeClass(`on`),t.find(`.switch-text`).html(`关`)):(t.addClass(`on`),t.find(`.switch-text`).html(`开`),r=1),n){case`auto_pfm`:case`auto_pfm2`:r?($(`#`+n).show(),Dialog.setting.get_pfms(n),L[n]=0):($(`#`+n).hide(),L.save(n,0));break;case`auto_work`:r?$(`#`+n).show():($(`#`+n).hide(),L.save(n,0));break;default:L.save(n,r);break}return e.cancelable=!0,!1},COLORS:{"rgb(255, 255, 255)":`#fff`,"rgb(189, 195, 199)":`#bdc3c7`,"rgb(0, 128, 0)":`#008000`},colorClick:function(){var e=$(this);if(!e.is(`.select`)){var t=e.parent();t.children().removeClass(`select`),e.addClass(`select`);var n=t.closest(`.setting-item`).attr(`for`);if(n){var r=``;switch(n){case`combat_size`:case`dialog_size`:case`menu_size`:r=e.attr(`value`);break;case`fontsize`:r=e[0].style.fontSize;break;case`fontcolor`:r=Dialog.setting.COLORS[e[0].style.backgroundColor]??``;break;case`backcolor`:r=e[0].style.backgroundColor;break;case`font`:r=e[0].style.fontFamily,r||=`none`;break}L.save(n,r)}}}},xe=`
 <div class="setting dialog-setting">

            <h3>房间信息</h3>
            <div class="setting-item" for="hide_roomdesc">
                <span class="title">
                    不显示房间描述
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="exits_dir">
                <span class="title">
                    出口描述使用方向描述
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_command">
                <span class="title">
                    在房间列出NPC或道具的可用命令
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="show_roomitem">
                <span class="title">
                    在命令栏列出房间内的可用物品
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="item_firstme">
                <span class="title">
                    自己始终显示在房间物品第一列
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="keep_msg">
                <span class="title">
                    切换房间时不清空上房间信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_move">
                <span class="title">
                    不显示玩家进出房间描述
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_plist">
                <span class="title">
                    隐藏玩家列表(只显示自己和NPC)
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_spmsg">
                <span class="title">
                    聊天信息不分开显示
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="auto_sortitem">
                <span class="title">
                    按品质自动排列背包和技能
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_message">
                <span class="title">
                    不显示其他玩家或NPC的房间消息(基本忽略所有战斗，动作描述，慎用)
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_sa">
                <span class="title">
                    动作栏显示快捷操作
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <h3>战斗信息</h3>

            <div class="setting-item" for="auto_showcombat">
                <span class="title">
                    战斗时自动打开战斗面板
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="auto_hideroom">
                <span class="title">
                    战斗时自动隐藏房间信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_combatmsg">
                <span class="title">
                    不显示其他玩家的战斗信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_mcmsg">
                <span class="title">
                    不显示自己的普通战斗信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="action_wrap">
                <span class="title">
                    动作栏允许换行
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="combat_wrap">
                <span class="title">
                    技能栏允许换行
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="show_hpnum">
                <span class="title">
                    显示血量为数字
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_hp">
                <span class="title">
                    关闭血条显示
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_damage">
                <span class="title">
                    显示伤害统计
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <h3>基本设置</h3>
            <div class="setting-item" for="fullscreen">
                <span class="title">
                    全屏显示
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="font">
                <span class="title">
                    字体(仅浏览器)
                </span>
                <span class="color-list">
                    <span class="color-item">默</span>
                    <span class="color-item" style="font-family:宋体;">宋</span>
                    <span class="color-item" style="font-family:楷体;">楷</span>
                    <span class="color-item" style="font-family:隶书;">隶</span>
                </span>
            </div>
            <div class="setting-item" for="fontsize">
                <span class="title">
                    字体大小
                </span>
                <span class="color-list">
                    <span class="color-item" style="font-size:0.75rem;">字</span>
                    <span class="color-item" style="font-size:0.875rem;">字</span>
                    <span class="color-item" style="font-size:1rem;">字</span>
                    <span class="color-item" style="font-size:1.25rem;">字</span>
                </span>
            </div>

            <div class="setting-item" for="fontcolor">
                <span class="title">
                    正常字体颜色
                </span>
                <span class="color-list">
                    <span class="color-item select" style="background-color:#008000"></span>
                    <span class="color-item" style="background-color:#ffffff"></span>
                    <span class="color-item" style="background-color:#bdc3c7"></span>
                </span>
            </div>
            <div class="setting-item" for="combat_size">
                <span class="title">
                    底部操作栏大小
                </span>
                <span class="color-list">
                    <span class="color-item" value="0.8em">0.8</span>
                    <span class="color-item" value="0.9em">0.9</span>
                    <span class="color-item" value="1em">x1</span>
                    <span class="color-item" value="1.2em">x1.2</span>
                </span>
            </div>
            <div class="setting-item" for="dialog_size">
                <span class="title">
                    顶部窗口大小
                </span>
                <span class="color-list">
                    <span class="color-item" value="0.8em">0.8</span>
                    <span class="color-item" value="0.9em">0.9</span>
                    <span class="color-item" value="1em">x1</span>
                    <span class="color-item" value="1.2em">x1.2</span>
                </span>
            </div>
            <div class="setting-item" for="menu_size">
                <span class="title">
                    菜单栏大小
                </span>
                <span class="color-list">
                    <span class="color-item" value="0.8em">0.8</span>
                    <span class="color-item" value="0.9em">0.9</span>
                    <span class="color-item" value="1em">x1</span>
                    <span class="color-item" value="1.2em">x1.2</span>
                </span>
            </div>
            <h3>游戏设置</h3>
            <div class="setting-item" for="no_master">
                <span class="title">
                    不接受玩家拜师
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_team">
                <span class="title">
                    不接受玩家组队邀请
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="hide_equip">
                <span class="title">
                    隐藏自己的装备
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_cus">
                <span class="title">
                    允许其他玩家查看自己的自创武功
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_fight">
                <span class="title">
                    不接受比试
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="ban_pk">
                <span class="title">
                    PK保护
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <h3>频道设置 </h3>
            <div class="setting-item" for="off_chat">
                <span class="title">
                    屏蔽公共频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_fam">
                <span class="title">
                    屏蔽门派频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_es">
                <span class="title">
                    屏蔽全区频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_pty">
                <span class="title">
                    屏蔽帮派频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
        </div>
`,R=`  <div class="setting dialog-custom">

            <div class="setting-item" for="auto_pfm">
                <span class="title">
                    当你击杀玩家或NPC时，自动出招
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <textarea class="settingbox hide" spellcheck="false" id="auto_pfm"></textarea>
            <div class="setting-item" for="auto_pfm2">
                <span class="title">
                    当你被玩家击杀时，自动反击
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <textarea class="settingbox hide" spellcheck="false" id="auto_pfm2"></textarea>
            <div class="setting-item" for="auto_work">
                <span class="title">
                    当你学习，练习，打坐中断后，自动去挖矿或以下操作
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <textarea class="settingbox hide" spellcheck="false" id="auto_work"></textarea>

            <div class="setting-item" for="auto_get">
                <span class="title">
                    当你击杀NPC后自动拾取战利品
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <!-- <div class="setting-item" for="extend">
                <span class="title">
                    自定义操作按钮
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <textarea class="settingbox hide" spellcheck="false" id="extend"></textarea> -->

            <button class="setting-ok">保存设置</button>
        </div>`,Se=` <div class="setting dialog-skeys"></div>`,Ce=` <div class="setting dialog-extend"></div>`,we=`
.setting {
    padding-bottom: 0.625em;
    height: 30em;
}

.setting-item {
    line-height: 2em;
    padding-left: 1em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
    display: flex;
    flex-direction: row;
}

.setting-item>.title {
    margin-right: 0.625em;
    flex: 1;
    text-align: left;
    white-space: initial;
}

.setting-item>.color-list {

    margin-right: 1em;
}
.color-list>.color-item {
    width: 3em;
    height: 1.25em;
    display: inline-block;
    border: 2px solid #cecece;
    line-height: 1.25em;
    text-align: center;
    border-radius: 1em;
    box-sizing: content-box;
}

.color-list>.select {
    border-color: #ff0000;
}
.setting-item>.button {
    flex: 0;
    background-color: #222;
    padding-left: 1em;
    padding-right: 1em;
    border-left: 1px solid gray;
}

.setting-item>.button:active {
    background-color: #111;
}


.setting>h3 {
    color: #C0C0C0;
    border-bottom: 1px solid #343434;
    padding-bottom: 0.5em;
}

.setting>.settingbox {
    margin-left: 0.625em;
    border: 1px solid gray;
    background-color: transparent;
    color: unset;
    resize: none;
    width: 98%;
    height: 3rem;
}

.setting>.setting-ok {
    border: 1px solid gray;
    background-color: transparent;
    color: unset;
    width: 5rem;
    height: 1.7rem;
    margin-top: 1rem;
    margin-bottom: 3rem;
}

.dialog-skeys {
    height: 30em;
    overflow-y: auto;
}


.dialog-skeys>.selected {
    border-left-color: #00FF00;
    color: #00FF00;
}



.extend-list {
    margin-top: 0.5em;
    height: 30em;
    text-align: center;
}

.extend-list>.buttons {
    text-align: center;
}

.extend-list>.buttons>button {
    margin: 0.5em;
    color: gray;
    background-color: #111;
    line-height: 2em;
}


.extend-add {
    display: flex;
    flex-direction: column;
    margin-top: 0.5em;
    height: 30em;
}


.extend-row {
    line-height: 2em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    border-top: 1px solid #222;
    border-bottom: 1px solid #222;
    border-right: 1px solid transparent;
}

.extend-row>.extend-input {
    flex: 1;
    border: none;
    outline: none;
    background-color: black;
    color: #cecece;
    padding-left: 1em;
}

.extend-row>input {
    height: 2em;
}

.extend-row>textarea {
    height: 100%;
    resize: none
}

.extend-row>.extend-menus {
    display: flex;
    flex-direction: column;
}

.extend-row>.extend-row-header {
    width: 8em;
    text-align: center;
}

.extend-help {
    padding-inline-start: 0.5em;
    width: 100%;
    text-align: center;
    color: gray;
    flex: 1;
    overflow: auto;
    list-style-position: inside;
    text-align: left;
    white-space: normal;
    line-height: 1.5em;
}

.extend-menus>.switch {
    margin-top: 1em;
    width: 7em;
    margin-left: 0.5em;
}

.extend-menus>button {
    margin: 1em 0px;
    color: gray;
    background-color: #111;
}

.skey-item {
    line-height: 2em;
    padding-left: 1em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
    display: flex;
    flex-direction: row;
}

.skey-item>.skey-name {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: gray;
    overflow: hidden;
}

.skey-item>.skey-key {
    background-color: #222;
    width: 7em;
    text-align: center;
}

.switch {
    display: inline-block;
    position: relative;
    height: 2em;
    width: 5em;
    line-height: 2em;
    border-radius: 1em;
    background: #222;
    cursor: pointer;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    vertical-align: middle;
    text-align: center;
}

.switch>.switch-button {
    position: absolute;
    left: 0px;
    height: 2em;
    width: 2em;
    border-radius: 1em;
    background: gray;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    -webkit-transition: 0.3s;
    left: 0px;
}

.switch>.switch-text {
    color: #898989;
    margin-left: 0.625em;
}

.on {
    background-color: #008000;
}

.on>.switch-button {
    right: 0px;
    left: auto;
    background-color: #eee;
}

.on>.switch-text {
    margin-right: 0.625em;
    margin-left: 0px;
    color: #eee;
}
`,Te={types:[{name:`自定义快捷操作`,value:`button`,for:[{name:`动作栏`,value:`action`},{name:`地图`,value:`map`},{name:`背包道具`,value:`pack`},{name:`技能`,value:`skill`},{name:`师父/随从技能`,value:`mskill`},{name:`房间物体`,value:`item`}]}],init:function(e){if(e.on(`click`,`[ecmd]`,this.onButtonClick),e.on(`click`,`.setting-item`,this.onClickRow),e.on(`click`,`.switch`,this.switchClick),e.on(`change`,`select`,this.selectChanged),this.element)return;this.element=e;let t=[];t.push(`<div class="extend-list">`),this.append_settings(t),t.push(`</div>`),this.append_edit(t),e.html(t.join(``)),this.edit_elem=this.element.find(`.extend-add`),this.list_elem=this.element.find(`.extend-list`)},refresh_list:function(){let e=[];this.append_settings(e),this.list_elem.html(e.join(``))},append_settings:function(e){let t=this.setting,n=0;for(let r of t)e.push(this.create_item(r,n++))},action_types:{button:`快捷操作`,trigger:`触发器`,filter:`过滤器`},regex:{message:!0,fmessage:!0},for_types:{map:`地图`,action:`动作栏`,pack:`背包道具`,skill:`技能`,item:`房间物体`,mskill:`师父/随从技能`,message:`文本`,data:`事件`,fmessage:`文本`,fdata:`事件`},create_item:function(e,t){let n=[];n.push(`<div class="setting-item" sid="`,t++,`">`),n.push(`<div class="title">`),n.push(this.for_types[e.for],this.action_types[e.type],`【`,e.name,`】`),n.push(`</div>`);let r=!1;return e.on&&e.on[Process.player]&&(r=!0),n.push(`<span class="switch `,r?`on`:``,`"><span class="switch-button"></span><span class="switch-text">开</span></span>`),n.push(`</div>`),n.join(``)},selectChanged:function(){let e=$(this);if(e.attr(`prop`)!==`type`){let t=e.val();e.parent().next().find(`.extend-row-header`).html(Dialog.extend.regex[t]?`正则表达式`:`可选参数`);return}let t=e.val(),n=null;for(let e of Dialog.extend.types)if(t===e.value){n=e.for;break}if(!n)return;e=e.parent().next().find(`select`);let r=[];for(let e of n)r.push(`<option value="`,e.value,`">`,e.name,`</option>`);e.html(r.join(``))},switchClick:function(){let e=$(this),t=e.find(`.switch-text`),n=t.text()!==`开始记录`,r=!1;if(e.is(`.on`)?(e.removeClass(`on`),n&&t.html(`关`)):(e.addClass(`on`),n&&t.html(`开`),r=!0),!n)r?(Dialog.close(),Dialog.extend.start_record()):Dialog.extend.stop_record();else{let t=Dialog.extend.setting[e.parent().attr(`sid`)];t&&(t.on||={},r?t.on[Process.player]=1:delete t.on[Process.player],Dialog.extend.save_extend(t))}return!1},start_record:function(){this.is_record||(this.is_record=!0,this.prev_time=0,this.record_cmds=[],k(`<hic>开始记录你的操作命令。</hic>`),Process.state({state:`正在记录你的操作命令`}))},excluded:{score:!0,score2:!0,pack:!0,cha:!0,tasks:!0,message:!0,relation:!0,shop:!0,team:!0,jh:!0},excluded_check:[e=>e.startsWith(`jh`)&&e.indexOf(`start`)<0,e=>e.startsWith(`stats`),e=>e.startsWith(`map`),e=>e.startsWith(`look`)],record:function(e){if(!this.is_record||this.excluded[e])return;for(let t of this.excluded_check)if(t(e))return;let t=Date.now();this.prev_time>0&&this.record_cmds.push(`#wait `+(t-this.prev_time)),this.record_cmds.push(e),this.prev_time=t},stop_record:function(){this.is_record&&(this.is_record=!1,k(`<cyn>已停止记录你的操作命令。</cyn>`),this.edit_elem.find(`.switch`).removeClass(`on`),this.record_cmds.length>0&&(Dialog.show(`setting`),Dialog.setting.footerChanged(3),this.edit_elem.show(),this.list_elem.hide(),this.edit_elem.find(`textarea`).val(this.record_cmds.join(`;`)),Process.state()))},helper:`<li ecmd='show_actions'>可用命令参考</li><li ecmd='show_vars'>可用变量参考</li><li ecmd='show_paras'>参数用法参考</li>`,append_edit:function(e){e.push(`<div class="extend-add hide">`),e.push(`<div class="extend-row">`),e.push(`<input  prop="name" class="extend-input"/>`),e.push(`<div class='extend-row-header'>提示/描述/说明</div>`),e.push(`</div>`),e.push(`<div class="extend-row">`),e.push(`<select prop="type" class="extend-input">`);for(let t of this.types)e.push(`<option value="`,t.value,`">`,t.name,`</option>`);e.push(`</select><div class='extend-row-header'>扩展类型</div>`),e.push(`</div>`);let t=this.types[0];e.push(`<div class="extend-row">`),e.push(`<select prop="for" class="extend-input">`);for(let n of t.for)e.push(`<option value="`,n.value,`">`,n.name,`</option>`);e.push(`</select><div class='extend-row-header'>可用选项</div>`),e.push(`</div>`),e.push(`<div class="extend-row">`),e.push(`<input  prop="paras" class="extend-input"/>`),e.push(`<div class='extend-row-header'>可选参数</div>`),e.push(`</div>`),e.push(`<div class="extend-row flex-1">`),e.push(`<textarea   prop="content"  class="extend-input"></textarea>`),e.push(`<div class='extend-row-header extend-menus'>`),e.push(`<span class="switch"> <span class="switch-button"> </span><span class="switch-text">开始记录</span></span>`),e.push(`<ul class='extend-help'>`),e.push(this.helper),e.push(`</ul><button ecmd='save'>保存</button>`),e.push(`</div></div>`),e.push(`</div>`)},onClickRow:function(){var e=$(this),t=Dialog.extend.setting[e.attr(`sid`)];t&&(Dialog.extend.selected_item=t,Dialog.extend.edit_button||(Dialog.extend.edit_button=$(`<div class="buttons"><button ecmd="edit">编辑</button><button ecmd="up">上移</button><button ecmd="down">下移</button><button ecmd="remove">移除</button></div>`)),Dialog.extend.edit_button.insertAfter(e))},show:function(e){this.init(e),this.footer_buttons||=$(`<div class="obj-money"><span for="import" class="footer-item">导入</span><span for="export" class="footer-item">导出</span><span for="add" class="footer-item">添加扩展</span></div>`),Dialog.footerElement.append(this.footer_buttons)},command:function(e){let t=this[`cmd_`+e];t&&t.call(this)},cmd_import:function(){if(!this.fileinput){let e=$(`<input type="file" style="display:none"  accept=".json" />`)[0];document.body.appendChild(e),this.fileinput=e,e.addEventListener(`change`,function(e){let t=e.target.files[0];if(!t)return k(`<red>未选择扩展文件。</red>`);if(t.name.split(`.`).pop().toLowerCase()!==`json`&&![`application/json`,`text/json`,`text/plain`].includes(t.type))return e.target.value=``,k(`<red>请选择有效的JSON文件！</red>`);let n=new FileReader;n.onload=function(e){try{let t=JSON.parse(e.target.result);Dialog.extend.setting=t.items,Dialog.extend.refresh_list(),Dialog.extend.save_extend(),k(`<cyn>扩展文件加载成功。</cyn>`)}catch(e){console.error(`JSON解析错误：`,e),k(`<red>扩展文件加载失败。</red>`)}},n.onerror=function(){console.error(`文件读取错误：`,n.error),k(`<red>扩展文件读取失败。</red>`)},n.readAsText(t,`utf-8`)})}this.fileinput.click()},cmd_export:function(){try{let e={id:Process.player,version:`0.1`,items:Dialog.extend.setting},t=JSON.stringify(e,null,2);if(window.android&&typeof window.android.saveJsonFile==`function`)window.android.saveJsonFile(`武神扩展.json`,t),k(`<cyn>扩展导出为本地文件【武神扩展.json】。</cyn>`);else{let e=new Blob([t],{type:`application/json;charset=utf-8`}),n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.style.display=`none `,r.download=`武神扩展.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n),k(`<cyn>扩展导出为本地文件【武神扩展.json】。</cyn>`)}}catch(e){console.error(`保存JSON文件失败：`,e),alert(`文件保存失败，请重试！`)}},hide:function(){if(this.is_record&&this.stop_record(),this.list_elem.is(`.hide`))return this.list_elem.removeClass(`hide`),this.edit_elem.addClass(`hide`),!1;this.footer_buttons.remove()},close:function(){},default_extend:[{name:`<red>全部击杀</red>`,type:`button`,for:`action`,content:`kill @npc`},{name:`<gre>全部拾取</gre>`,type:`button`,for:`action`,content:`get all from @item(尸体)`},{name:`<gre>返回武庙</gre>`,type:`button`,for:`map`,paras:`name(扬州)`,content:`jh fam 0 start;go north;go north;go west`},{name:`练习到指定等级`,type:`button`,for:`skill`,content:`lianxi @id @input`},{name:`学习到指定等级`,type:`button`,for:`mskill`,content:`xue @input @id from @master`}],init_extend:function(){this.setting||=D.storage.getItem(`extends`)??this.default_extend,this.init_extend_group()},init_extend_group:function(){this.groups={};for(let e of this.setting)this.init_extend_item(e)},save_extend:function(){D.storage.setItem(`extends`,this.setting),this.init_extend_group(),Combat.refActions()},init_extend_item:function(e){let t=this.groups[e.for];t||=this.groups[e.for]=[];let n=e.content;e.on===!0&&(e.on={},e.on[Process.player]=1),!(!n||!e.on||!e.on[Process.player])&&(n[0]!==`#`&&(n=`#`+n),t.push({name:e.name,extend:!0,check:this.regex[e.for]?this.match(e.paras):this.condtion(e.paras),cmd:n}))},match:function(e){try{return e?this.express.match.bind(this,new RegExp(e)):null}catch(e){return console.error(e),null}},exp_reg:/(\w+)\((>=|<=|!=|>|<)?(.+?)\)/g,condtion:function(e){if(!e)return null;let t=null,n=[];for(;t=this.exp_reg.exec(e);){let e=t[1],r=t[2],i=t[3];if(!e||!i)return null;if(r){let t=this.express[r];if(!t)return null;n.push(t.bind(this,e,i))}else i[0]===`/`&&i[i.length-1]===`/`?n.push(this.express.match_prop.bind(this,e,new RegExp(i.substring(1,i.length-1)))):n.push(this.express.def.bind(this,e,i))}return n.length>0?n:null},express:{">=":function(e,t,n){return n[e]>=parseInt(t)},">":function(e,t,n){return n[e]>parseInt(t)},"<":function(e,t,n){return n[e]<parseInt(t)},"<=":function(e,t,n){return n[e]<=parseInt(t)},"=":function(e,t,n){return n[e]=parseInt(t)},"!=":function(e,t,n){return n[e]!=parseInt(t)},match:function(e,t){let n=e.exec(t);return n?(SCRIPT.lAST_MATCHES=n,!0):!1},match_prop:function(e,t,n){let r=n[e];return!r||!t?!1:t.test(r)},def:function(e,t,n){let r=n[e];return typeof r==`number`?r===parseInt(t):typeof r==`boolean`?r&&r.toString()===t:r&&r.indexOf(t)>-1}},query:function(e,t){let n=[];return this.append(n,e,t),n},append:function(e,t,n){let r=this.groups[t];if(r)for(let t of r)this.check_para(t,n)&&e.push(t)},message_filter:function(e){},data_filter:function(){},trigger:function(e){if(!this.groups)return;let t=this.groups.message;if(t)for(let n of t)n.check&&n.check(e)&&SCRIPT.run(n.cmd)},process:function(e){if(!this.groups)return;let t=this.groups.data;if(t)for(let n of t)this.check_para(n,e)&&(SCRIPT.LAST_DATA=e,SCRIPT.run(n.cmd))},check_para:function(e,t){if(!e.check)return!0;for(let n of e.check)if(!n(t))return!1;return!0},onButtonClick:function(){let e=$(this).attr(`ecmd`).split(`_`),t=e[0];e[0]=$(this);let n=Dialog.extend[`cmd_`+t];n&&n.apply(Dialog.extend,e)},cmd_add:function(){this.edit_elem.removeClass(`hide`),this.list_elem.addClass(`hide`),this.edit_elem.attr(`sid`,`-1`);let e=this.edit_elem.find(`input, textarea`);for(let t of e)$(t).val(``)},cmd_up:function(){this.cmd_move(-1)},cmd_down:function(){this.cmd_move(1)},cmd_move:function(e){let t=this.selected_item;if(!t)return;let n=this.setting.indexOf(t),r=this.setting.indexOf(t)+e;r<0||r>=this.setting.length||(this.setting.splice(n,1),this.setting.splice(r,0,t),this.refresh_list(),this.save_extend())},cmd_edit:function(){let e=this.selected_item;if(!e)return;this.edit_elem.show(),this.list_elem.hide(),this.edit_elem.attr(`sid`,this.setting.indexOf(e));let t=this.edit_elem.find(`input, textarea, select`);for(let n of t){let t=$(n).val(),r=e[n.getAttribute(`prop`)];r!==t&&$(n).val(r).change()}},cmd_save:function(){let e=parseInt(this.edit_elem.attr(`sid`)),t=this.edit_elem.find(`input, textarea, select`),n={};for(let e of t)n[e.getAttribute(`prop`)]=e.value;if(!n.name)return this.show_error(`name`);if(!n.type)return this.show_error(`type`);if(!n.content)return this.show_error(`content`);if(n.paras&&(Dialog.extend.regex[n.for]?n.check=this.match(n.paras):n.check=this.condtion(n.paras),!n.check))return this.show_error(`paras`);this.hide(),$(this.create_item(n,this.setting.length)).appendTo(this.list_elem),e<0?this.setting.push(n):(n.on=this.setting[e].on,this.setting[e]=n,this.refresh_list()),this.save_extend()},cmd_remove:function(){let e=this.selected_item;e&&(this.setting.Remove(e),this.refresh_list(),this.save_extend())},show_error:function(e){let t=this.element.find(`[prop="`+e+`"]`).parent();t.addClass(`error-shake`),setTimeout(()=>{t.removeClass(`error-shake`)},1500)},cmd_show:function(e,t){let n=SCRIPT.helper[t];if(!n)return;let r=[];for(let e=0;e<n.length;e++)r.push(`<li>`,n[e],`</li>`);let i=e.parent();i.html(r.join(``)),i.next().html(`返回`).attr(`ecmd`,`return`)},cmd_return:function(e){e.html(`保存`).attr(`ecmd`,`save`).prev().html(this.helper)}},Ee={footer:[[`全部`,``],[`世界`,`chat`],[`队伍`,`tm`],[`门派`,`fam`],[`全区`,`es`],[`帮派`,`pty`],[`系统`,`sys`]],isScroll:!0,last_click:0,show:function(){if(Date.now()-this.last_click>500){this.last_click=Date.now();return}if(!Dialog.channel.isShow){Dialog.select(`channel`),Dialog.icon(`comment`),Dialog.title(``),Dialog.footer(``);for(var e=0;e<Dialog.channel.footer.length;e++){var t=$(`<span class='footer-item channel-item' for='`+Dialog.channel.footer[e][1]+`'>`+Dialog.channel.footer[e][0]+`</span>`).appendTo(Dialog.footerElement);e==0&&t.addClass(`select`)}Dialog.contentElement.html(``).append(Process.ChannelElement.addClass(`channel-dialog`)),Dialog.channel.isShow=!0,Dialog.channel.scrollBottom()}},hide:function(){Dialog.channel.footerChanged(``),Process.ChannelElement.removeClass(`channel-dialog`).insertBefore(`.content-message`),this.scrollBottom(),this.isShow=!1},close:function(){this.hide()},scrollBottom:function(){Process.channel.scroll2end()},footerChanged:function(e){if(Dialog.channel.select_item!=e){Dialog.channel.select_item=e,Process.channel.clear();for(var t=0;t<this.datas.length;t++){var n=this.datas[t];(!e||n[0]==e)&&Process.channel.push(n[1])}Process.channel.scroll2end()}},datas:[],createElement:function(e,t){var n=`hic`,r=``;switch(e.ch){case`tm`:n=`hig`,r=`队伍`;break;case`fam`:n=`hiy`,r=e.fam||`门派`;break;case`rumor`:n=`him`,r=`谣言`,e.name=`某人`;break;case`sys`:n=`hir`,r=`系统`,e.name=``;break;case`es`:n=`hio`,r=e.server,e.uid=null;break;case`pty`:n=`hiz`,r=`帮派`;break;default:r=[`闲聊`,`闲聊`,`闲聊`,`<hiy>宗师</hiy>`,`<HIZ>武圣</HIZ>`,`<hio>武帝</hio>`,`<ord>武神</ord>`][e.lv],e.lv6&&(r=[`<ord>武神</ord>`,`<ord>剑神</ord>`,`<ord>刀皇</ord>`,`<ord>兵主</ord>`,`<ord>战神</ord>`][e.lv6]);break}var i=[`<`,n,`>【`];i.push(r),i.push(`】`),e.name&&(i.push(`<span`),e.uid&&i.push(` cmd='look3 `+e.uid+`'`),i.push(`>`),i.push(e.name),i.push(`</span>：`)),i.push(e.content);var a=i.join(``);return this.datas.length>800&&(this.datas.length=0,this.datas.splice(0,200)),e.ch==`rumor`&&(e.ch=`sys`),this.datas.push([e.ch,a]),this.select_item&&this.select_item!=e.ch?``:a}},z={IsShow:!1,Skills:null,actions:null,room_actions:null,object_actions:null,Scroll:function(e){let t=$(this)[0];t.scrollLeft+=e.originalEvent.deltaY},Show:function(){if(z.IsShow)return z.Hide();this.object_actions||SendCommand(`actions`),z.IsShow=!0,L.off_hp||$(`.room-item>.item-status`).show(),$(`.combat-panel`).removeClass(`hide`),this.refActions(),Process.message.scroll2end()},Hide:function(){z.IsShow=!1,L.off_hp||$(`.room-item>.item-status`).hide(),$(`.combat-panel`).addClass(`hide`)},ShowRoomCommands:function(e){this.room=e,this.room_actions=e.commands,z.IsShow&&this.refActions()},def_actions:[{cmd:`dazuo`,name:`打坐`},{cmd:`liaoshang`,name:`疗伤`}],refActions:function(){let e=[...this.def_actions];this.actions=e,this.room&&Dialog.extend.append(e,`action`,this.room),this.create_actions()},ShowActions:function(e){this.object_actions=e.actions??[],this.refActions(),e.skills&&this.ShowPFM(e)},ShowPFM:function(e){this.Skills=e.skills||[],this.create_skillItems(e.skills)},append_items:function(e,t){if(e)for(let n of e)n.elem=$(`<span class='act-item' cmd='${n.cmd}'>${n.name}</span>`).appendTo(t),n.disper>0&&n.elem.css(`backgroundSize`,n.disper+`% 100%`)},create_actions:function(e){var t=$(`.room-commands`).empty();this.append_items(this.actions,t),this.append_items(this.object_actions,t),this.append_items(this.room_actions,t)},DisObj:function(e){if(this.object_actions)for(var t=e.act?e.id:`use `+e.id,n=0;n<this.object_actions.length;n++){var r=this.object_actions[n];if(r.cmd===t){if(e.remove)return this.object_actions.splice(n,1),r.elem.remove();this.ANI_OBJ(r,e.time,e.time)}}},AddObj:function(e,t){if(this.object_actions){for(var n=`use `+e,r=0;r<this.object_actions.length;r++)if(this.object_actions[r].cmd==n)return;this.object_actions.push({cmd:`use `+e,name:t.replace(/\<.+?\>/g,``)}),this.create_actions()}},ANI_OBJ:function(e,t,n){let r=e.elem;if(r){var i=n*100/t;i>0?r.css(`backgroundSize`,i+`% 100%`):(i<0&&(i=0),r.css(`backgroundSize`,`0% 100%`)),e.disper=i,setTimeout(z.ANI_OBJ,1e3,e,t,n-1e3)}},create_skillItems:function(e){var t=$(`.combat-commands`).empty();if(e.length)for(var n=0;n<e.length;n++){var r=[];r.push(`<span class='pfm-item' pid='`+e[n].id+`'>`),r.push(e[n].name),r.push(`</span>`),e[n].elem=$(r.join(``)).appendTo(t)}},ChangeDistime:function(e){for(var t=e.id.replace(`/`,`.`),n=0;n<z.dis_pfms.length;n++)if(z.dis_pfms[n].id==t){z.dis_pfms[n].ani_time+=e.time;break}},ClearDistime:function(e){if(z.dis_pfms)for(var t=e.id?e.id.replace(`/`,`.`):e.id,n=0;n<z.dis_pfms.length;n++)(!t||z.dis_pfms[n].id==t)&&(z.dis_pfms[n].ani_time=0)},redisable:function(){z.dis_pfms=[];for(var e=0;e<z.Skills.length;e++){var t=z.Skills[e];z.dis_pfms.push({id:t.id,distime:t.distime,ani_time:t.distime})}z.time_handler||z.ANI_PFM()},On_Perform:function(e){if(this.Skills){if(e.id===`all`&&!e.rtime)return this.redisable();e.id&&=e.id.replace(`/`,`.`),e.rtime=e.rtime||0,e.distime=e.distime||0,this.dis_pfms||=[];for(var t=0;t<this.dis_pfms.length;t++){if(this.dis_pfms[t].id==e.id){e.id=null,this.dis_pfms[t].distime=e.distime,this.dis_pfms[t].ani_time=e.distime;continue}this.dis_pfms[t].ani_time<e.rtime&&(this.dis_pfms[t].ani_time=e.rtime,this.dis_pfms[t].distime=e.rtime)}e.id&&this.dis_pfms.push({id:e.id,distime:e.distime,ani_time:e.distime}),z.ani_time=z.ani_time??0,e.rtime>z.ani_time&&(z.distime=e.rtime,z.ani_time=e.rtime),this.time_handler||z.ANI_PFM()}},PFM_INTERVAL:300,ANI_PFM:function(){var e=0;z.distime>0&&(e=z.ani_time*100/z.distime);for(var t=0;t<z.Skills.length;t++){for(var n=z.Skills[t],r=e,i=0;i<z.dis_pfms.length;i++)if(z.dis_pfms[i].id==n.id&&z.dis_pfms[i].distime){r=z.dis_pfms[i].ani_time*100/z.dis_pfms[i].distime,r<0?z.dis_pfms.splice(i,1):z.dis_pfms[i].ani_time-=z.PFM_INTERVAL;break}r>0?(r<0&&(r=0),n.elem.css(`backgroundSize`,r+`% 100%`)):n.elem.css(`backgroundSize`,`0% 100%`)}z.ani_time>0||z.dis_pfms.length?z.time_handler=setTimeout(z.ANI_PFM,z.PFM_INTERVAL):z.time_handler=null,z.ani_time-=z.PFM_INTERVAL},StatusChanged:function(e){for(var t=$(`.room-item`),n=0;n<t.length;n++){var r=$(t[n]);if(r.attr(`itemid`)==e.id){this.UpdaeBar(e,`mp`,r),this.UpdaeBar(e,`hp`,r);break}}},UpdaeBar:function(e,t,n){var r=e[t],i=0;if(r!=null){var a=n.find(`.`+t+`>.progress-bar`);if(e[`max_`+t]?(i=e[`max_`+t],a.attr(`max`,i)):i=parseInt(a.attr(`max`)),L.show_hpnum&&t==`hp`&&n.find(`.progress-num`).html(`[`+Process.get_hpnum(r,i)+`<nor>/</nor><hiy>`+i+`</hiy>]`),a.css(`width`,z.CountWidth(r,i)+`%`),L.show_damage&&e.damage&&e.id!=Process.player){var o=0;o=e.damage==-1?parseInt((i-r)*1e3/i)/10:parseInt(e.damage*1e3/i)/10,a=n.find(`.item-damage`),a.length||(a=$(`<span class="item-damage">[<hiy>0%</hiy>]<span>`).appendTo(n.find(`.item-name`))),a.html(`[<hiy>`+o+`%</hiy>]`)}}},CountWidth:function(e,t){if(t==0)return 0;var n=e*100/t;return n>=100?100:n<0?0:n},Perform:function(){var e=$(this);if(!e.is(`disable`)){var t=e.attr(`pid`);t&&SendCommand(`perform `+t)}},STATUS:{},AppendStatusItem:function(e,t,n){var r={elem:t,items:{}};if(n)for(var i=0;i<n.length;i++)this.StatusItem_add(r,n[i]);this.STATUS[e]=r},StatusItemChanged:function(e){var t=z[`StatusItem_`+e.action];t&&t.call(z,this.STATUS[e.id],e)},StatusItem_add:function(e,t){if(e){var n=[];n.push(`<span class="status-item`),t.downside&&n.push(` downside`),n.push(`" sid="`),n.push(t.sid),n.push(`">`),n.push(t.name),t.count!=null&&(n.push(`x`),n.push(t.count)),n.push(`<span class="shadow"></span></span>`),e.items[t.sid]={elem:$(n.join(``)).appendTo(e.elem)[0],name:t.name,count:t.count,duration:t.duration,anitime:t.duration-(t.overtime||0)},t.duration>0&&z.StatusItemANI(e.items[t.sid])}},StatusItem_remove:function(e,t){if(e){var n=t.sid;typeof n==`string`&&(n=[n]);for(var r=0;r<n.length;r++){var i=e.items[n[r]];i&&($(i.elem).remove(),i.handler&&clearTimeout(i.handler),delete e.items[n[r]])}}},StatusItem_refresh:function(e,t){if(e){var n=e.items[t.sid];if(n){n.elem.firstChild;var r=n.elem.lastChild;n.count=t.count,n.elem.innerHTML=n.name+`x`+n.count+r.outerHTML,n.handler&&clearTimeout(n.handler),n.anitime=n.duration,z.StatusItemANI(n)}}},StatusItem_override:function(e,t){var n=e.items[t.sid];n&&(n.handler&&clearTimeout(n.handler),n.anitime=n.duration,z.StatusItemANI(n))},StatusItem_clear:function(e,t){if(e){for(var n in e.items){var r=e.items[n];r&&($(r.elem).remove(),clearTimeout(r.handler))}e.items={}}},StatusItemANI:function(e){var t=e.elem.lastChild,n=e.anitime*100/e.duration;n<0&&(n=0),t.style.right=n+`%`,e.anitime-=1e3,n>0?e.handler=setTimeout(z.StatusItemANI,1e3,e):e.handler=0}},De={close:function(){this.hide(),this.element.remove(),this.isShow=!1,this.skill_element_id=null,this.element.removeClass(`hide-item`)},hide:function(){},init:function(){this.created||(Dialog.injectStyle(Oe),Dialog.injectStyle(ke)),this.created=!0},command_before:``,updateitem:function(e){if(e.money!=null&&(this.money=e.money,this.show_moeny()),e.eq_group!==void 0)this.eq_group=e.eq_group,this.show_moeny();else if(e.eq!=null&&this.items){for(var t=0;t<this.items.length;t++)if(this.items[t].id==e.id){this.eqs[e.eq]=this.items[t],this.items.splice(t,1);break}this.show_items()}else if(e.uneq!=null&&this.items){var n=this.eqs[e.uneq];n.can_eq=1,n.count=1,this.items.push(n),this.eqs[e.uneq]=null,this.show_items()}else if(e.locked>=0){let t=this.get_item(e.id);if(t){t.is_lock=e.locked;let n=this.packElement.find(`[oindex="`+e.id+`"]`);t.is_lock?n.addClass(`lock`):n.removeClass(`lock`)}}else if(e.jldesc){var r=[];r.push(e.jldesc),r.push(`<span class='item-commands'>`),r.push(`<span cmd="`+this.command_before+`jinglian `+e.id+` ok">精炼</span>`),r.push(`<span cmd="`+this.command_before+`jinglian `+e.id+` full">精炼到满级</span>`),r.push(`</span>`),this.show_sub(r.join(``))}else if(e.xqdesc){var r=[];r.push(e.xqdesc),r.push(`<span class='item-commands'>`);for(var t=0;t<e.stones.length;t++){var i=e.stones[t];r.push(`<span cmd="`+this.command_before+`xiangqian `+e.id+` `+i.id+`">镶嵌`+i.name+`</span><br/>`)}r.push(`</span>`),this.show_sub(r.join(``))}else if(e.desc){var r=[];r.push(e.desc),r.push(`<span class='item-commands'>`);var a=e.from;if(a==`eq`)r.push(`<span cmd="`+this.command_before+`uneq `+e.id+`">取消装备</span>`);else if(a==`item`){var o=this.get_item(e.id);I.LAST_OBJ=o,o&&this.create_item_command(o,r,e.commands)}else a==`store`||a==`sj`?r.push(`<span cmd="_confirm qu `+e.id+`">取出</span>`):r.push(`<span cmd="_confirm buy 1 `+e.id+` from `+Dialog.list.seller+`">购买</span>`);r.push(`</span>`),this.show_sub(r.join(``))}else if(e.remove&&this.items){for(var s=this.items,t=0;t<s.length;t++)if(s[t].id==e.id){e.remove>=s[t].count?(s.splice(t,1),z.DisObj(e)):s[t].count-=e.remove;break}if(this.isShow)this.show_items();else return!1}else if(e.name&&this.items){var n=this.get_item(e.id);if(n?(n.count=e.count,n.name=e.name):this.items.push(e),this.isShow)this.show_items();else return!1}else if(e.max_item_count)this.max_count=e.max_item_count,ReceiveMessage((Dialog.pack2.isShow?Dialog.pack2.target_name:`你`)+`的背包容量扩充为`+this.max_count+`。`),this.show_items();else return!1;return!0},get_item:function(e,t){if(t||=this.items,t){for(var n=0;n<t.length;n++)if(t[n]&&t[n].id==e)return t[n]}},show_sub:function(e){this.objelement&&this.objelement.remove();var t=this.packElement;Dialog.list.isShow&&(t=Dialog.list.rightElement),this.objelement=$(`<pre class='obj-desc'>`+e+`</pre>`).appendTo(t.parent()).on(`click`,function(){this.objelement.remove(),this.objelement=null,t.show()}.bind(this)),t.hide()},onData:function(e){if(e.items)this.eqs=this.formatEqs(e.eqs||[]),this.money=e.money,this.eq_group=e.eq_group,this.items=this.formatItems(e.items),this.max_count=e.max_item_count,this.isShow&&(this.show_items(),this.show_moeny());else{if(Dialog.pack2.isShow&&!e.name)return Dialog.pack2.onData(e);if(this.updateitem(e))return}if(!this.isShow){if(Dialog.list.isShow)return Dialog.list.update_pack(e);if(Dialog.trade.isShow)return Dialog.trade.update_pack(e)}},formatPackItem:function(e){return{name:e[0],id:e[1],count:e[2],grade:e[3],unit:e[4],value:e[5],can_eq:e[6],can_use:e[7],can_study:e[8],can_open:e[9],can_combine:e[10],is_lock:e[11],otype:e[12]}},formatItems:function(e){let t=[];for(let n of e)t.push(this.formatPackItem(n));return t},formatEqs:function(e){let t=[];for(let n of e)n?t.push({name:n[0],id:n[1],grade:n[2],can_use:n[3],is_lock:n[4]}):t.push(n);return t},show_moeny:function(){if(!this.isShow)return;let e=D.moneyToStr(this.money),t=[];for(let e=0;e<3;e++)t.push(`<span class="footer-item eq-group`,e===this.eq_group?` select`:``,`" for="`,e+1,`">`,e+1,`</span>`);t.push(`<div class='obj-money'>`),this.packElement.is(`.cleanup`)?(t.push(`<span for='cancle' class='footer-item'>取消</span>`),t.push(`<span for='store' class='footer-item'>自动存仓</span>`),t.push(`<span for='sell' class='footer-item'>清理杂物</span>`),t.push(`<span for='cleanup' class='footer-item'>确定</span></div>`)):(t.push(`你`,e?`身上有`+e:`身上没有任何银两`),t.push(`<span for='cleanup' class='footer-item'>整理包裹</span></div>`)),Dialog.footer(t.join(``))},cleanup_cmds:{cleanup:!0,cancle:!0,store:!0,sell:!0},footerChanged:function(e,t){if(this.cleanup_cmds[e])return this.cleanup(e,t);let n=parseInt(e)-1;n>=0&&n<3&&SendCommand(`eqgroup `+n)},cleanup:function(e,t){let n=this;t.removeClass(`select`),n.packElement.is(`.cleanup`)?(e==`cleanup`?n.packElement.find(`.obj-item>.selected`).each(this.cleanup_item):e==`store`?SendCommand((this.command_before??``)+`store all`):e==`sell`&&SendCommand((this.command_before??``)+`sell all`),n.packElement.removeClass(`cleanup`),this.show_moeny()):(n.packElement.find(`.item-commands`).remove(),n.packElement.addClass(`cleanup`),n.show_items(),this.show_moeny())},cleanup_item:function(e,t){let n=$(t),r=n.parent().attr(`oindex`),i=n.attr(`cmd`);SendCommand(i+` `+r)},show_items:function(){if(this.packElement){this.createItems(),this.create_eqs(),Dialog.icon(`briefcase`);var e=this.target_name||`你`;Dialog.title(this.items&&this.items.length?e+`身上共有`+this.items.length+`/`+this.max_count+`件物品`:e+`身上没有任何东西`)}},init_element:function(){this.element||(this.element=$(`<div class="dialog-pack"><div class="eq-list"><div class="eq-item"><span class="eq-type">武器</span><span class="eq-name"></span></div><div class="eq-item"><span class="eq-type">衣服</span><span class="eq-name"></span></div > <div class="eq-item"><span class="eq-type">鞋</span><span class="eq-name"></span></div> <div class="eq-item"><span class="eq-type">头部</span><span class="eq-name"></span></div> <div class="eq-item"><span class="eq-type">披风</span><span class="eq-name"></span></div> <div class="eq-item"><span class="eq-type">戒指</span><span class="eq-name"></span></div> <div class="eq-item"><span class="eq-type">项链</span><span class="eq-name"></span></div> <div class="eq-item"><span class="eq-type">饰品</span><span class="eq-name"></span></div> <div class="eq-item"><span class="eq-type">护腕</span><span class="eq-name"></span></div><div class="eq-item"><span class="eq-type">腰带</span><span class="eq-name"></span></div><div class="eq-item"><span class="eq-type">暗器</span><span class="eq-name"></span></div></div><div class="obj-list"></div></div>`),this.packElement=this.element.find(`.obj-list`),this.eqElement=this.element.find(`.eq-list`))},show:function(){if(Dialog.isShow||Dialog.show(),this.objelement&&(this.objelement.remove(),this.objelement=null,this.packElement&&this.packElement.show()),this.isShow)return SendCommand(this.items?`pack none`:`pack`);this.isShow=!0,this.init_element(),this.packElement.on(`click`,`.obj-item`,Dialog.pack.item_click),this.eqElement.on(`click`,`.eq-item`,Dialog.pack.eqitem_click),this.packElement.removeClass(`cleanup`),this.element.appendTo(Dialog.contentElement),this.items?(SendCommand(`pack none`),this.show_items()):SendCommand(`pack`)},create_eqs:function(){for(var e=this.eqElement.children(),t=0;t<e.length;t++){var n=this.eqs[t];n?$(e[t]).attr(`class`,`eq-item grade`+n.grade).attr(`oindex`,t).find(`.eq-name`).html(n.name):$(e[t]).attr(`class`,`eq-item empty`).attr(`oindex`,``).find(`.eq-name`).html(``)}},levels:{wht:0,hig:1,hic:2,hiy:3,hiz:4,hio:5,ord:6},sort_items:function(e){if(!e||!L.auto_sortitem)return e;for(var t=[],n=0;n<e.length;n++){for(var r=e[n],i=!1,a=0;a<t.length;a++)if(r.grade<t[a].grade){t.splice(a,0,r),i=!0;break}i||t.push(r)}return t},createItems:function(){if(!this.items)return;var e=Dialog.pack.sort_items(this.items),t=[];let n=this.packElement?.is(`.cleanup`);for(var r=0;r<this.max_count;r++){var i=e[r];i?(t.push(`<div class="obj-item `,i.is_lock?`lock `:``,`grade`,i.grade,`" oindex="`),t.push(i.id),t.push(`">`),t.push(i.name),this.show_type==1?(t.push(`<span class='obj-value'>`),t.push(`每`),t.push(i.unit),t.push(D.moneyToStr(i.value)),t.push(`：`),t.push(i.count),t.push(i.unit),t.push(`</span>`)):i.count>1&&(t.push(`<span class='obj-value'>`),t.push(i.count),t.push(i.unit),t.push(`</span>`)),n&&(i.grade>0&&t.push(`<span cmd='store' class='obj-oper`,i.can_study?` selected`:` `,`'>存仓库</span>`),i.can_combine&&i.count>=i.can_combine&&t.push(`<span cmd='combine' class='obj-oper'>合成</span>`),this.target_name&&t.push(`<span cmd='give `,Process.player,` `,i.count,`' class='obj-oper'>拿来</span>`),i.can_eq&&i.grade>0?(t.push(`<span cmd='sell' class='obj-oper'>卖掉</span>`),t.push(`<span cmd='fenjie' class='obj-oper'>分解</span>`)):i.value>0?t.push(`<span cmd='sell' class='obj-oper'>卖掉</span>`):i.grade||t.push(`<span cmd='drop' class='obj-oper'>丢掉</span>`))):t.push(`<div class="obj-item" oindex="">`),t.push(`</div>`)}this.packElement.html(t.join(``))},create_item_command:function(e,t,n){t.push(`<span cmd="_confirm `+this.command_before+`drop `+e.count+` `+e.id+`">丢掉</span>`),t.push(`<span cmd="lockobj `+e.id+`">`,e.is_lock?`解锁`:`锁定`,`</span>`),e.can_eq&&(t.push(`<span cmd="`+this.command_before+`eq `+e.id+`">装备</span>`),this.command_before||(t.push(`<span cmd="jinglian `+e.id+`">精炼</span>`),t.push(`<span cmd="xiangqian `+e.id+`">镶嵌</span>`),t.push(`<span cmd="shortcut `+e.id+`">设置快速装备</span>`)),t.push(`<span cmd="`+this.command_before+`fenjie `+e.id+`">分解</span>`)),e.can_use&&(t.push(`<span cmd="`+this.command_before+`use `+e.id+`">使用</span>`),!e.can_eq&&!this.command_before&&t.push(`<span cmd="shortcut `+e.id+`">设置快速使用</span>`)),e.can_open&&t.push(`<span cmd="`+this.command_before+`open `+e.id+`">打开</span>`),e.can_study&&t.push(`<span cmd="`+this.command_before+`study `+e.id+`">学习</span>`),e.can_combine&&e.count>=e.can_combine&&t.push(`<span cmd="_confirm `+this.command_before+`combine `+e.id+` `+e.can_combine+`">合成</span>`),this.command_before&&t.push(`<span cmd="_confirm `+this.command_before+`give `+Process.player+` `+e.count+` `+e.id+`">拿来</span>`),n||=[],Dialog.extend.append(n,`pack`,e);for(var r=0;r<n.length;r++)n[r].extend?t.push(`<span cmd="`,n[r].cmd,`">`,n[r].name,`</span>`):t.push(`<span cmd="packitem `,n[r].cmd,` `,e.id,`">`,n[r].name,`</span>`)},item_click:function(e){let t=$(e.target);if(Dialog.pack.packElement.is(`.cleanup`)&&t.is(`.obj-oper`))return Dialog.pack.item_cleanup(t);t=$(this);var n=t.attr(`oindex`);if(n){var r=Dialog.pack.get_item(n);if(Dialog.pack.packElement.find(`.item-commands`).remove(),r){I.LAST_OBJ=r;var i=[`<span class='item-commands'>`];i.push(`<span cmd="checkobj `+r.id+` from item">查看</span>`),Dialog.pack.create_item_command(r,i),i.push(`</span>`),t=$(i.join(``)).insertAfter(t),D.checkScroll(t)}}},eqitem_click:function(){var e=Dialog.pack.eqs[$(this).attr(`oindex`)];e&&SendCommand(`checkobj `+e.id+` from eq`)},item_cleanup:function(e){return e.is(`.selected`)?e.removeClass(`selected`):(e.parent().find(`.selected`).removeClass(`selected`),e.addClass(`selected`)),!1}},Oe=`

.dialog-pack {
    min-width: 360px;
    overflow-x: auto;
    padding-top: 0.5em;
}


.dialog-pack>.obj-list {
    width: 50%;
    display: inline-block;
    overflow-y: auto;
    height: 25.625em;
}


.obj-list>.obj-item {

    margin-left: 0.5em;
}
    
.dialog-pack>.obj-desc {
    padding: 0.25em;
    margin: 0px;
    white-space: pre-wrap;
    width: 45%;
    height: 25.625em;
    display: inline-block;
    float: left;
    overflow-y: auto;
}


.eq-list {
    width: 50%;
    display: inline-block;
    float: left;
}

.eq-list>.eq-item {
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
}

.eq-list>.empty {
    border-color: gray;
    color: gray;
}

.eq-list>.eq-item>.eq-name {
    white-space: nowrap;
    padding-left: 0.3125em;
}

.eq-list>.eq-item>.eq-type {
    background-color: #333;
    color: gray;
    line-height: 1.875em;
    display: inline-block;
    height: 1.875em;
    width: 3em;
    text-align: center;
}

.obj-list>.obj-item {
    background-color: #111;
    line-height: 1.875em;
    min-height: 1.875em;
    padding-left: 0.3125em;

    overflow-x: auto;
    white-space: nowrap;
    margin-bottom: 0.5em;
    border-radius: 4px;
}

.obj-list>.lock:before {
    content: "e033";
    font-family: 'Glyphicons Halflings';
    font-size: 0.8em;
    margin-right: 0.2em;
    color: var(--border-color);

}

.obj-item>.obj-oper {
    float: right;
    margin-right: 0.625em;
    padding-left: 0.5em;
    padding-right: 0.5em;
    line-height: 1.5em;
    background-color: #222;
    border-radius: 0.5em;
    margin-top: 0.2em;
    color: gray;
    display: none;
    cursor: pointer;
    user-select: none;
}

.cleanup>.obj-item>.obj-oper {
    display: inline-block;
}

.cleanup>.obj-item>.selected {
    color: #00FF00;
}



.obj-item>.obj-count,
.obj-item>.obj-value {
    float: right;
    margin-right: 0.625em;
}

.cleanup>.obj-item>.obj-value,
.cleanup>.obj-item>.obj-count {
    display: none;
}


.obj-list>.disabled {
    opacity: 0.5;
}



`,ke=`

.dialog-list {
    width: 100%;
    white-space: nowrap;
    overflow-x: auto;
    padding-top: 0.5em;
    display: flex;
    flex-direction: row;
}

.dialog-list>.otype-list {
    width: 6em;
}

.dialog-list>.otype-list>.otype-item {
    white-space: nowrap;
    line-height: 2em;
    width: 5em;
    text-align: center;
    background-color: #111;
    border-radius: 4px;
    margin-bottom: 0.5em;
    margin-right: 0.5em;
    margin-left: 0.5em;
    text-align: center;
    cursor: pointer;
}

.dialog-list>.otype-list>.select {
    background-color: #222;
    color: #00ff00;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: #00ff00;
}

.dialog-list>.trade-list,
.dialog-list>.obj-list {

    height: 21.25em;
    display: inline-block;
    overflow-y: auto;
    flex: 1;
}


.dialog-list>.obj-desc {
    padding: 0.25em;
    margin: 0px;
    white-space: pre-wrap;
    flex: 1;
    overflow-y: auto;
}

.dialog-list>.trade-list {

    height: 21.25em;
    display: inline-block;
    overflow-y: auto;
    flex: 1;
}
.trade-list>.obj-item {
    background-color: #111;
    line-height: 1.875em;
    min-height: 1.875em;
    padding-left: 0.3125em;

    overflow-x: auto;
    white-space: nowrap;
    margin-bottom: 0.5em;
    border-radius: 4px;
}

.trade-list>.lock:before {
    content: "e033";
    font-family: 'Glyphicons Halflings';
    font-size: 0.8em;
    margin-right: 0.2em;
    color: var(--border-color);

}`,Ae={isShow:!1,selectItem:`.dialog-skills`,init:function(){this.created||Dialog.injectStyle(Ne),this.created=!0},hide:function(){if(this.skill_element)return this.skill_element.remove(),this.skill_element=null,this.element.removeClass(`hide-item`),this.create_footer(),this.skill_element_id=null,!1},close:function(){this.hide(),this.element.remove(),this.isShow=!1,this.skill_element_id=null,this.element.removeClass(`hide-item`)},limit:0,selected_item:-1,showdesc:function(e){if(!this.isShow)return;this.element.find(`.item-commands`).remove(),this.skill_element&&this.skill_element.remove(),this.skill_element=$(`<pre></pre>`).html(e.desc).appendTo(this.element),this.skill_element_id=e.id,this.element.addClass(`hide-item`);let t=[`<div class="item-commands">`];this.master?(t.push(`<span cmd="xue `,e.id,` from `,this.master,`">学习</span>`),this.is_follower&&(t.push(`<span cmd="dc `,this.master,` lingwu `,e.id,`">进阶</span>`),t.push(`<span cmd="dc `,this.master,` fangqi `,e.id,`">遗忘</span>`))):(e.is_custom&&t.push(`<span cmd="zc `,e.id,`">推演</span>`),t.push(`<span cmd="lingwu `,e.id,`">进阶</span>`),t.push(`<span cmd="lingwu2 `,e.id,`">融合</span>`),t.push(`<span cmd="fangqi `,e.id,`">遗忘</span>`)),t.push(`</div>`),Dialog.footer(t.join(``))},footerChanged:function(e,t){if(!(e==this.selected_item&&!t)){if(this.selected_item=e,Dialog.skills.element.find(`.item-commands`).remove(),e==2)return this.books?this.showBooks():SendCommand(`sbook`),this.element.addClass(`dialog-books`);if(this.element.is(`.dialog-books`))return this.element.removeClass(`dialog-books`),this.create_footer(),this.createSkillItems(this.items);e==0?(this.element.find(`.base`).removeClass(`hide`),this.element.find(`.skill`).addClass(`hide`)):e==1&&(this.element.find(`.base`).addClass(`hide`),this.element.find(`.skill`).removeClass(`hide`))}},footers:[`基础`,`特殊`,`书架`],eq_group:0,create_footer:function(e){for(var t=this.footers,n=[],r=0;r<t.length;r++)n.push(`<span class='footer-item`+(r==this.selected_item?` select`:``)+`' for='`+r+`''>`+t[r]+`</span>`);if(!e)for(let e=0;e<3;e++)n.push(`<span class="sk-group`,2-e===this.sk_group?` select`:``,`" group="`,2-e,`">`,3-e,`</span>`);Dialog.footer(n.join(``))},eq_group_click:function(){let e=parseInt($(this).attr(`group`));e>=0&&SendCommand(`skgroup `+e)},updateSkill:function(e){if(this.skills){var t=this.skills[e.id];if(!t)return this.addSkill(t);if(e.name&&(t.name=e.name),e.grade>=0&&e.grade!==t.grade&&(t.grade=e.grade,t.can_enables))for(let n of t.can_enables){let t=this.skills[n];t&&t.enable_skill===e.id&&this.updateSkillItem(t)}if(e.enable){if(t.enable_skill){var n=t.enable_skill;t.enable_skill=null,this.skills[n][e.id]=!1,this.updateSkillItem(this.skills[n])}this.skills[e.enable][e.id]=!0,t.enable_skill=e.enable,this.updateSkillItem(this.skills[e.enable]),this.updateSkillItem(this.skills[e.id])}else if(e.exp!=null||e.level!=null)e.level>=0&&(t.level=e.level),e.exp>=0&&(t.exp=e.exp),e.can_enables&&(t.can_enables=e.can_enables),this.updateSkillItem(t);else if(e.enable==0&&t.enable_skill){var n=t.enable_skill;this.skills[n][e.id]=!1,t.enable_skill=null,this.updateSkillItem(this.skills[n]),this.updateSkillItem(this.skills[e.id])}}},updateSkillItem:function(e){var t=this.element.find(`.skill-item[skid='`+e.id+`']`);if(t){let n=t.css(`display`)===`none`;t.replaceWith(this.createSkillItem(e)),n&&t.hide()}},addSkill:function(e){if(!(!this.items||!e)){if(this.skills[e.id])return this.updateSkill(e);this.items.push(e),this.skills[e.id]=e,this.items=this.sort_items(this.items),this.createSkillItems(this.items)}},format_books:function(e){let t=[];for(let n=0;n<e.length;n++)t.push({name:e[n][0],grade:e[n][1],id:n});return t},onData:function(e){if(e.book)return this.books?(this.books.push({name:e.book[0],grade:e.book[1],id:e.book[2]}),this.isShow&&this.selected_item==2?this.showBooks():void 0):void 0;if(e.books)return this.books=this.format_books(e.books),this.isShow||!Dialog.master.isShow?this.showBooks():Dialog.master.showBooks();if(e.id&&!e.desc)return e.from?this.updateSkill.call(Dialog.master,e):this.updateSkill(e);if(e.item)return Dialog.master.isShow&&Dialog.master.is_follower?this.addSkill.call(Dialog.master,e.item):this.addSkill(e.item);if(!this.isShow&&Dialog.master.isShow)return Dialog.master.onData(e);if(e.desc)return e.id&&this.updateSkill(e),this.showdesc(e);if(e.remove&&this.items){if(e.from&&e.from!==Process.player)return;this.items.Remove(this.skills[e.remove]);for(var t=0;t<this.items.length;t++)this.items[t].enable_skill==e.remove&&(this.items[t].enable_skill=null);return delete this.skills[e.remove],this.skill_element&&this.skill_element_id===e.remove&&this.hide(),this.createSkillItems(this.items)}if(e.items){this.title=e.title,Dialog.title(this.title+`，等级上限`+e.limit+`级`),Dialog.icon(`book`),this.items=this.sort_items(e.items),this.skills={};for(var t=0;t<this.items.length;t++){var n=this.items[t];this.skills[n.id]=n}this.items.length>10&&this.selected_item<0&&this.footerChanged(0),this.createSkillItems(this.items)}e.sk_group>=0&&(this.sk_group=e.sk_group,this.limit=e.limit,this.create_footer()),e.limit>=0&&(this.limit=e.limit,Dialog.title(this.title+`，等级上限`+this.limit+`级`))},show:function(){this.isShow||(this.isShow=!0,this.element||(this.element=$(`<div class="dialog-skills"></div>`),Dialog.footerElement.on(`click`,`.sk-group`,Dialog.skills.eq_group_click)),this.element.on(`click`,`.skill-item`,Dialog.skills.item_click),this.element.appendTo(Dialog.contentElement),this.element.removeClass(`hide-item`),this.items?(SendCommand(`cha none`),Dialog.icon(`book`),this.create_footer()):SendCommand(`cha`))},isEnable:function(e,t){if(!e.can_enables)return!1;for(var n=0;n<e.can_enables.length;n++){var r=t[e.can_enables[n]];if(r&&r.enable_skill==e.id)return!0}return!1},showBooks:function(){var e=[],t=this.sort_items(this.books);for(let n of t)e.push(`<div class="book-item `),e.push(`grade`,n.grade,`" >`),e.push(`<div class="book-name">`,n.name,`</div>`),e.push(`<div class="book-action border-right" cmd="sbook `,n.id,`">查看</div>`),e.push(`<div class="book-action" cmd="study `,n.id,`">学习</div>`),e.push(`</div>`);this.element.html(e.join(``)),this.create_footer(!0)},createSkillItem:function(e,t){t||=this.skills;var n=[];if(n.push(`<div class="skill-item `),n.push(`grade`+e.grade),this.master||(e.can_enables?(n.push(` skill`),this.selected_item==0&&n.push(` hide`)):(n.push(` base`),this.selected_item==1&&n.push(` hide`))),this.isEnable(e,t)&&n.push(` enable`),n.push(`" skid="`+e.id+`">`),n.push(`<span class="glyphicon glyphicon-ok enable-flag"></span>`),n.push(e.name),e.enable_skill&&t){var r=t[e.enable_skill];r&&(n.push(`<span class="enable_skill">已装备：`),n.push(Me(r)),n.push(`</span>`))}return n.push(`<span class="skill-level">`),n.push(e.level),n.push(`级 / `),n.push(e.exp),n.push(`%`),n.push(`&nbsp;`),n.push(Dialog.skills.get_lvdesc(e.level)),n.push(`</span></div>`),n.join(``)},sort_items:function(e){if(!e||!L.auto_sortitem)return e;for(var t=[],n=0;n<e.length;n++){for(var r=e[n],i=!1,a=0;a<t.length;a++)if(r.grade>t[a].grade){t.splice(a,0,r),i=!0;break}i||t.push(r)}return t},createSkillItems:function(e,t){let n=[];for(var r=0;r<e.length;r++)n.push(this.createSkillItem(e[r],t));this.element.html(n.join(``))},level_color:[`wht`,`hig`,`hic`,`hij`,`hiz`,`hio`,`ord`],get_lvdesc:function(e){if(e<1e3)return Dialog.skills.skill_levels[parseInt(e/50)];var t=parseInt((e-1e3)/500);return t>6&&(t=6),Dialog.skills.skill_levels[t+20]},skill_levels:`<BLU>初学乍练</BLU>.<BLU>不知所以</BLU>.<HIB>粗通皮毛</HIB>.<HIB>渐有所悟</HIB>.<YEL>半生不熟</YEL>.<YEL>马马虎虎</YEL>.<HIY>平淡无奇</HIY>.<HIY>触类旁通</HIY>.<HIG>心领神会</HIG>.<HIG>挥洒自如</HIG>.<HIC>驾轻就熟</HIC>.<HIC>出类拔萃</HIC>.<CYN>初入佳境</CYN>.<CYN>神乎其技</CYN>.<MAG>威不可当</MAG>.<HIW>豁然贯通</HIW>.<HIW>超群绝伦</HIW>.<RED>登峰造极</RED>.<WHT>登堂入室</WHT>.<HIM>一代宗师</HIM>.<WHT>超凡入圣</WHT>.<HIO>出神入化</HIO>.<HIO>独步天下</HIO>.<HIR>空前绝后</HIR>.<HIR>旷古绝伦</HIR>.<HIW>深不可测</HIW>.<HIW>返璞归真</HIW>`.split(`.`),item_click:function(){var e=$(this),t=[`<div class='item-commands'>`],n=Dialog.skills.skills[e.attr(`skid`)];if(!n)return;if(t.push(`<span cmd="checkskill `+n.id+`">查看详细</span>`),n.can_enables)for(var r=0;r<n.can_enables.length;r++){var i=Dialog.skills.skills[n.can_enables[r]];i&&(i.enable_skill==n.id?t.push(`<span cmd="enable `+i.id+` none">取消装备`+i.name+`</span>`):t.push(`<span cmd="enable `+i.id+` `+n.id+`">装备`+i.name+`</span>`))}if(n.enable_skill){var a=Dialog.skills.skills[n.enable_skill];a?t.push(`<span cmd="enable `+n.id+` none">取消装备`+a.name+`</span>`):n.enable_skill=null}t.push(`<span cmd="_confirm fangqi `+n.id+`">遗忘</span>`),t.push(`<span cmd="lianxi `+n.id+`">练习</span>`),I.LAST_OBJ=n;let o=Dialog.extend.query(`skill`,n);for(let e of o)t.push(`<span cmd="`,e.cmd,`">`,e.name,`</span>`);t.push(`</div>`),Dialog.skills.element.find(`.item-commands`).remove(),$(t.join(``)).insertAfter(e),D.checkScroll(e.next())}},je=[`wht`,`hig`,`hic`,`hiy`,`him`,`hio`,`ord`];function Me(e){let t=je[e.grade];return`<${t}>${e.name}</${t}>`}var Ne=`
.dialog-skills {
    overflow-y: auto;
    min-height: 15em;
    max-height: 35em;
}

.hide-item {}

.dialog-skills>pre {
    padding: 0px;
    margin: 0px;
    white-space: pre-wrap;
}

.dialog-skills>.skill-item {
    line-height: 2em;
    padding-left: 1.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
}


.hide-item>.skill-item {
    display: none;
}

.dialog-skills>.dialog-books>.skill-item {
    display: none;
}

.dialog-skills>.skill-item>.skill-level {
    float: right;
    margin-right: 0.625em;
}

.dialog-skills>.skill-item>.enable-flag {
    display: none;
    color: var(--border-color);
    line-height: 2em;
}

.dialog-skills>.enable {
    padding-left: 0px;
}

.dialog-skills>.enable>.enable-flag {
    display: inline-block;
    padding-left: 0.25em;
    padding-right: 0.25em;
}

.dialog-skills>.skill-item>.enable_skill {
    margin-left: 0.5em;
}

.dialog-skills>.enable>.item-commands {
    padding-left: 1em;
}

.dialog-skills>.book-item {
    line-height: 2em;
    padding-left: 1.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
    display: flex;
    flex-direction: row;
}

.dialog-skills>.book-item>.book-name {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--border-color);
    overflow: hidden;
}

.dialog-skills>.book-item>.book-action {
    flex: 0;
    background-color: #222;
    padding-left: 1em;
    padding-right: 1em;
}

`,Pe=`

.dialog-tasks {
    max-height: 32em;
    margin-bottom: 0.5em;
    margin-top: 0.5em;
}

.dialog-tasks>.task-item {
    border-radius: 6px;
    background-color: #111111;
    border-left-width: 4px;
    border-left-style: solid;
    position: relative;
    margin-top: 0.5em;
    padding-left: 0.5em;
}

.dialog-tasks>.none {
    border-left-color: #808080
}



.dialog-tasks>.finish {
    border-left-color: #00ff00
}

.dialog-tasks>.over {
    border-left-color: #008080
}

.dialog-tasks>.none>.task-btn {
    border-left-color: #808080;
    color: #808080;
}

.dialog-tasks>.finish>.task-btn {
    border-left-color: #00ff00;
    color: #00ff00;
    background-color: #00ff0033;
}

.dialog-tasks>.over>.task-btn {
    border-left-color: #008080;
    color: #008080;
}

.task-item h3 {
    margin: 0px;
    padding-top: 0.5em;
}

.task-item .task-desc {

    margin: 0;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    white-space: pre-wrap;
}

.task-item>.task-btn {
    width: 4.5em;
    display: inline-block;
    border-left: 1px solid #343434;
    text-align: center;
    font-weight: bold;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.task-item>.task-btn:hover {
    background-color: #222;
}

.dialog-tasks>.task-item>.start {
    color: gray;
}

.dialog-tasks>.task-item>.finish {
    color: #00ff00;
}

.dialog-tasks>.task-item>.over {
    color: #ebebeb;
}
`,Fe={init:function(){Dialog.injectStyle(Pe)},close:function(){this.element.remove(),this.isShow=!1},update_item:function(e){for(var t=0;t<this.items.length;t++)if(this.items[t].id==e.id){e.state?(this.items[t].title=e.title,this.items[t].state=e.state,this.items[t].desc=e.desc):this.items.splice(t,1);break}this.create_items()},onData:function(e){if(e.id)return this.update_item(e);Dialog.title(`任务列表`),Dialog.icon(`exclamation-sign`),this.items=e.items,this.create_items()},show:function(){this.element||=$(`<div class='dialog-tasks'></div>`),SendCommand(`tasks`),!this.isShow&&(this.element.appendTo(Dialog.contentElement),this.isShow=!0)},status_css:[``,`none`,`finish`,`over`],create_items:function(){for(var e=[],t=0;t<this.items.length;t++){var n=this.items[t];e.push(`<div class='task-item flex-row `),e.push(this.status_css[n.state]),e.push(`'><div class='flex-1'><h3>`),e.push(n.title),e.push(`</h3>`),e.push(`<pre class='task-desc'>`),e.push(n.desc),e.push(`</pre></div>`),e.push(`<span class='task-btn flex-0'`),n.state==1?e.push(`>进行中`):n.state==2?(e.push(` cmd="task `),e.push(n.id),e.push(` fin"`),e.push(`>可领取`)):n.state==3&&e.push(`>已完成`),e.push(`</span>`),e.push(`</div>`)}this.element.html(e.join(``)),Dialog.footer(``)}},B={init:function(){Dialog.injectStyle(Ie)},selected_item:0,close:function(){this.element.remove(),this.isShow=!1},onData:function(e){if(e.money){let t=e.money??[0,0];this.money=t[0],this.cash_money=t[1],t.length>2&&(this.footers=[`黄金`,`元宝`,`活动`],this.act_money=t[2],this.act_name=e.mtype??`<hic>积分</hic>`),this.create_footer()}if(e.remove){let t=this.get_item(e.remove);return t&&(t.removed=!0),this.show_items()}if(e.item){let[t,n]=e.item,r=this.get_item(t);r&&(r.count=n,this.show_items());return}e.idx&&(this.idx=e.idx,this.list0=this.format_items(e.selllist[0],0),this.list1=this.format_items(e.selllist[1],1),e.selllist.length>2&&(this.list2=this.format_items(e.selllist[2],2)),this.show_items())},footerChanged:function(e){this.selected_item=parseInt(e),this.show_items(),this.create_footer()},footers:[`黄金`,`元宝`],create_footer:function(){if(this.isShow){for(var e=[],t=0;t<this.footers.length;t++)e.push(`<span class='footer-item`+(t==this.selected_item?` select`:``)+`' for='`+t+`''>`+this.footers[t]+`</span>`);this.selected_item===0?e.push(`<div class="obj-money">`,this.money>0?`你身上有`+D.moneyToStr(this.money):`你身上没有银两`,`</div>`):this.selected_item===1?e.push(`<div class="obj-money">`,this.cash_money>0?`你身上有`+this.cash_money+`<hij>元宝</hij>`:`你身上没有元宝`,`<span cmd="transmoney">账号转入</span></div>`):this.selected_item===2&&e.push(`<div class="obj-money">`,`你身上有`,this.act_money>0?this.act_money:0,this.act_name),Dialog.footer(e.join(``))}},format_items:function(e,t){let n=[];for(let r of e){if(!r)continue;let e={id:r[0],name:r[1],desc:r[2],value:r[3],grade:r[4],discount:r[5]};r[6]&&(e.limit=r[6],e.count=r[7]),e.discount<1&&(t===0?e.price0=`<del>`+e.value+`两黄金</del>`:t===1?e.price0=`<del>`+e.value+`元宝</del>`:t===2&&(e.price0=`<del>`+e.value+this.act_name+`</del>`),e.value*=e.discount),t===0?e.value>=1?e.price=`<hiy>`+e.value+`两黄金</hiy>`:e.price=`<wht>`+e.value*100+`两白银</wht>`:t===1?e.price=`<hij>`+e.value+`元宝</hij>`:t===2&&(e.price=e.value+this.act_name),n.push(e)}return n},show_items:function(){this.isShow&&this.create_items([this.list0,this.list1,this.list2][this.selected_item])},get_item:function(e){if(this.list0){for(let t of this.list0)if(t.id===e)return t}if(this.list1){for(let t of this.list1)if(t.id===e)return t}if(this.list2){for(let t of this.list2)if(t.id===e)return t}},show:function(e){this.element||=$(`<div class='dialog-shop-content'><div class='dialog-shop'></div></div>`),Dialog.title(`商品列表`),Dialog.icon(`shopping-cart`),this.isShow=!0,this.element.appendTo(Dialog.contentElement),this.idx?SendCommand(`shop `+this.idx):SendCommand(`shop`)},create_items:function(e){let t=[];for(let n=0;n<e.length;n++){let r=e[n];if(r.removed){e.splice(n,1),n--;continue}t.push(`<div class='shop-item`),t.push(` grade`,r.grade),t.push(`'><div class='flex-1'><div class='shop-item-title'>`),t.push(`<div class="shop-item-name">`,r.name,`</div>`),r.limit>0&&t.push(`(`,r.count,`/`,r.limit,`)`),t.push(`</div>`),t.push(`<pre class='shop-desc'>`),t.push(r.desc),t.push(`</pre></div>`),t.push(`<div class='shop-btn' `),t.push(`cmd="_confirm shop `,r.id),r.limit>0&&t.push(` `,r.limit-r.count),t.push(`">`),r.price0&&t.push(`&nbsp;`,r.price0,`&nbsp;`),t.push(r.price),t.push(`</div>`),t.push(`</div>`)}this.element.find(`.dialog-shop`).html(t.join(``))}},Ie=`

.dialog-shop-content {
    height: 25em;
}

.dialog-shop {
    max-height: 32em;
    padding-bottom: 0.5em;
    margin-top: 0.5em;
}

.dialog-shop>.shop-item {
    border-radius: 6px;
    background-color: #111111;
    border-left-width: 4px;
    border-left-style: solid;
    position: relative;
    margin-bottom: 0.5em;
    padding-left: 0.5em;
    display: flex;
    flex-direction: row;
}

.shop-item-title {
    display: flex;
    flex-direction: row;
    line-height: 2em;
    place-items: 1em;
}

.shop-item-title>.shop-item-name {
    margin: 0px;
    color: var(--border-color);
    font-weight: bold;
}

.shop-item-title>.discount-tag {

    background: linear-gradient(135deg, #ff3e3e 0%, #ff9100 100%);
    color: white;
    width: 4em;
    font-weight: bold;
    text-align: center;
    border-radius: 0.5em;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}



.dialog-shop>.shop-item .shop-desc {
    margin: 0;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    white-space: pre-wrap;
}

.dialog-shop>.shop-item .shop-label {
    background: linear-gradient(110deg, transparent 0%, rgba(255, 159, 28, 0.8) 50%, transparent 100%);

    animation: shine 3s infinite linear;
    color: #fff;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
}


.dialog-shop>.shop-item>.shop-btn {
    width: 8em;
    display: inline-block;
    border-left: 1px solid var(--border-color);
    text-align: center;
    font-weight: bold;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #222;
    flex-wrap: wrap;
}

.dialog-shop-footer {
    text-align: right;
    padding-right: 0.5em;
}

.dialog-shop-footer>span {
    line-height: 1.8em;
    margin-left: 1em;
    color: #808000;
    display: inline-block;
    padding-right: 1em;
    text-align: center;
    text-decoration: underline;
    border-right: 1px solid #808000;
}

`,V=null,Le=null,Re=null,H=0,U=0,ze=0;function Be(){V||(V=$(`.right-bar>.tool-item`),Le=$(`.br-tool`),Re=$(`.bottom-bar>.tool-item`))}function Ve(){if(Be(),H!=1){if(H==0){for(var e=0;e<V.length;e++)V[e].style.display=``,V[e].style.opacity=0;ze=200,U=0,$(Le).removeClass(`hide-tool`)}else U=100,ze=100,$(Le).addClass(`hide-tool`);window.setTimeout(He.bind(null,H),100),H=1}}function He(e){if(e==0){U+=ze;for(var t=U,n=V.length-1;n>=0&&(t<0?V[n].style.opacity=0:t>100?V[n].style.opacity=1:V[n].style.opacity=t/100,t-=20,!(t<0));n--);U-=30,t<100?window.setTimeout(He.bind(null,e),100):H=2}else{U-=ze;for(var t=U,n=0;n<V.length&&(t<0?V[n].style.opacity=0:t>100?V[n].style.opacity=1:V[n].style.opacity=t/100*1,t+=20,!(t>=100));n++);if(U-=20,t>=0)window.setTimeout(He.bind(null,e),100);else{H=0;for(var n=0;n<V.length;n++)V[n].style.display=`none`}}}function Ue(e,t){Be(),t<0?t=0:t>99&&(t=99);let n=V.filter(`[command='`+e+`']`);n.length||(n=Re.filter(`[command='`+e+`']`)),t?n.find(`.tag`).removeClass(`hide`):n.find(`.tag`).addClass(`hide`)}var We={init:function(){Dialog.injectStyle(Ge)},close:function(){this.element.remove(),this.isShow=!1},hide:function(){if(this.detailID)return this.hide_detail(),!1},hide_detail:function(){this.element.removeClass(`detail`),this.detailID=null,Dialog.footerElement.find(`.item-commands`).empty()},selected_item:0,messages:[],isLoad:!1,unRead:0,onData:function(e){if(e.receive)return this.updateMessageState(e.receive,e.index);if(e.items)return this.createMessageDetail(e.id,e.items);if(e.clear)return this.clear_message(e.clear);if(e.unRead!=null&&(this.unRead=e.unRead),e.messages)for(var t=0;t<e.messages.length;t++)this.addMessage(e.messages[t]);e.message&&(this.isShow||this.unRead++,this.messages&&this.addMessage(e.message),e.message.id==`notice`&&this.showNotice(e.message)),this.element&&this.showMessages(),this.isShow?e.message&&this.element.is(`.detail`)&this.detailID==e.message.id&&this.detailElement.prepend($(this.createMessageDetailItem(e.message.id,e.message.name,e.message))):this.showUnread()},showUnread:function(){this.unRead?Ue(`message`,this.unRead):Ue(`message`,0)},addMessage:function(e){for(let t=0;t<this.messages.length;t++)if(this.messages[t].id==e.id){this.messages[t]=e;return}this.messages.push(e)},clear_message:function(e){for(let t=0;t<this.messages.length;t++){let n=this.messages[t].id;(e===!0&&n!==`notice`||n==e)&&(this.messages.splice(t,1),t--)}this.showMessages(),this.isShow&&this.element.is(`.detail`)&(e===!0||this.detailID==e)&&this.hide_detail()},show:function(e){this.unRead=0,this.showUnread(),!this.isShow&&(this.isShow=!0,Dialog.title(`消息`),Dialog.icon(`envelope`),this.create_footer(),this.footerChanged(this.selected_item),!this.isLoad&&(SendCommand(`message`),this.isLoad=!0))},inner_show:function(){Dialog.title(`消息`),Dialog.icon(`envelope`),this.element.on(`click`,`.message-item`,this.showMessageDetail)},inner_close:function(){this.element.remove(),this.isShow=!1},footers:[`消息`,`队伍`,`关系`,`帮派`],footerElements:[`message`,`team`,`relation`,`party`],create_footer:function(){for(var e=[],t=0;t<this.footers.length;t++)e.push(`<span class='footer-item`+(t==this.selected_item?` select`:``)+`' for='`+t+`''>`+this.footers[t]+`</span>`);e.push(`<dic class="item-commands"></div>`),Dialog.footer(e.join(``))},footerChanged:function(e){this.selected_item=e,Dialog.footerElement.find(`.item-commands`).empty(),this.showChild()},showChild:function(){var e=Dialog[this.footerElements[this.selected_item]];this.selectedChild&&this.selectedChild.inner_close(),e.element||=e.createElement(),Dialog.contentElement.html(e.element),e.inner_show(),this.selectedChild=e},showNotice:function(e){var t=[`
<hiy>系统公告</hiy>
`],n=new Date(e.time);t.push(n.getFullYear()),t.push(`年`),t.push(n.getMonth()+1),t.push(`月`),t.push(n.getDate()),t.push(`日 `),t.push(n.getHours()),t.push(`时`),t.push(n.getMinutes()),t.push(`分
<hic>`),t.push(e.content),t.push(`
</hic>`),ReceiveMessage(t.join(``))},showMessages:function(e){for(var t=[],n=0;n<this.messages.length;n++){var r=this.messages[n];t.push(`<div class='message-item' fromid="`),t.push(r.id),t.push(`"><div class='message-title'>`),t.push(r.name),t.push(`<span class='message-time'>`),t.push(this.getTimedesc(r.time)),t.push(`</span>`),t.push(`</div>`),t.push(`<div class='message-content'>`),t.push(r.content),t.push(`</div>`),t.push(`</div>`)}t.length||t.push(`<div class="empty">暂无新消息</div>`),this.listElement||=this.element.find(`.message-list`),this.listElement.html(t.join(``))},getTimedesc:function(e){var t=new Date,n=new Date(e),r=(t-n)/1e3;if(r<60)return`刚刚`;if(r<3600)return parseInt(r/60)+`分钟前`;if(n.getFullYear()==t.getFullYear()&&n.getMonth()==t.getMonth()){var i=n.getDate()-t.getDate(),a=`今天 `+this.add_zero(n.getHours())+`:`+this.add_zero(n.getMinutes());if(i==0)return a;if(i==1)return`昨天 `+a;if(i==2)return`前天 `+a}var o=n.getMonth()+1+`月`+n.getDate()+`日 `+this.add_zero(n.getHours())+`：`+this.add_zero(n.getMinutes());return t-n>23328e5&&(o+=`<mem>即将过期</mem>`),o},add_zero:function(e){return e<10?`0`+e:e},showMessageDetail:function(){var e=$(this).attr(`fromid`);e&&(SendCommand(`message `+e),Dialog.message.element.addClass(`detail`))},getMessageitem:function(e){for(var t=0;t<this.messages.length;t++)if(this.messages[t].id==e)return this.messages[t]},createMessageDetail:function(e,t){this.detailElement||=this.element.find(`.detail-list`);var n=this.getMessageitem(e);if(!n)return;var r=[];this.detailID=e;for(var i=0;i<t.length;i++){var a=t[i];r.push(this.createMessageDetailItem(e,n.name,a)),a.attach&&a.rec}this.detailElement.html(r.join(``));let o=``;e!==`notice`&&(o=`<span cmd="message delete ${e}">删除</span><span cmd="receive ${e}">领取全部</span>`),Dialog.footerElement.find(`.item-commands`).html(o)},createMessageDetailItem:function(e,t,n){var r=[];if(r.push(`<div class='detail-item' rec='`,n.attach&&!n.rec?1:0,`' fid='`,e,`' index='`+n.index+`'>`),r.push(`<span class='detail-name'>`),r.push(t),r.push(`</span>`),r.push(`<span class='detail-time'>`),r.push(this.getTimedesc(n.time)),r.push(`</span>`),r.push(`<pre class='detail-content'>`),r.push(n.content),r.push(`</pre>`),n.attach){for(var i=0;i<n.attach.length;i++)r.push(`<div class='detail-attach'>`),r.push(n.attach[i].name),r.push(`</div>`);n.rec?r.push(`<div class='detail-rec'>已领取</div>`):r.push(`<div  class='detail-rec' cmd='receive `+e+` `+n.index+`'><hig>领取</hig></div>`)}return r.push(`</div>`),r.join(``)},createElement:function(){return $(`<div class="dialog-message"><div class="message-list"></div><div class="detail-list"></div></div>`)},updateMessageState:function(e,t){this.detailID==e&&this.detailElement.find(`.detail-item[index='`+t+`']>.detail-rec`).html(`已领取`).removeAttr(`cmd`)}},Ge=`

.dialog-message{
    height: 25em;
    max-height: 30em;
}

.dialog-message>.message-list>.empty{
    color: #505050;
    padding-top: 1em;
    text-align: center;
}

.dialog-message>.message-list>.message-item {

    padding-left: 1em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;

}

.dialog-message>.message-list>.message-item>.message-title {
    color: #FFFF00;
    line-height: 2em;
}

.dialog-message>.message-list>.message-item>.message-content {
    white-space: break-spaces;
    word-wrap: break-word;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-bottom: 0.5em;
}

.dialog-message>.message-list>.message-item>.message-title>.message-time {
    float: right;
    margin-right: 0.5em;

}

.detail {
    min-height: 25em;
    max-height: 25em;
}

.detail>.message-list {
    display: none;
}

.dialog-message>.detail-list {
    display: none;
}

.detail>.detail-list {
    display: block;
}


.dialog-team,
.dialog-party,
.dialog-relation {
    height: 25em;
    max-height: 30em;
}

.dialog-team>.empty {
    color: #505050;
    padding-top: 1em;
    text-align: center;
}

.dialog-team>.team-item {
    padding-left: 0.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    background-color: #111;
    line-height: 2em;
    cursor: pointer;
}

.dialog-team>.team-item>.item-commands {
    padding-left: 2em;
}

.dialog-team>.team-item>.team-flag {
    width: 2em;
    display: inline-block;
    text-align: center;
    color: #FFFF00
}

.dialog-team>.team-item>.team-name {
    display: inline-block;
}

.dialog-relation>.relation-item {
    padding-left: 0.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    background-color: #111;
    line-height: 2em;
    display: flex;
    flex-direction: row;
}

.dialog-relation>.relation-item>.relation-desc {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.dialog-relation>.relation-item>.relation-cmd {
    flex: 0;
    background-color: #222;
    padding-left: 1em;
    padding-right: 1em;
    cursor: pointer;
    border-left: 2px solid #111;
}

.detail-item {
    margin-bottom: 0.5em;
    margin-top: 0.5em;
    padding: 0.5em;
    background-color: #111;
    padding-left: 1em;
    border-radius: 4px;
    border-top-width: 2px;
    border-top-style: solid;
    border-top-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    background-color: #111;
}

.detail-item>.detail-name {
    color: #FFFF00;
}

.detail-item>.detail-time {
    margin-left: 1em;
    color: gray;
}

.detail-item>.detail-content {
    white-space: pre-wrap;
}

.detail-item>.detail-rec {
    margin-top: 1em;
    background-color: #222;
    color: gray;
    display: inline-block;
    font-size: 0.8em;
    padding-left: 1em;
    padding-right: 1em;
    border-radius: 1em;
    cursor: pointer;
}

`,Ke=[[`总榜`,``],[`武当派`,`wudang`],[`少林派`,`shaolin`],[`华山派`,`huashan`],[`峨眉派`,`emei`],[`逍遥派`,`xiaoyao`],[`丐帮`,`gaibang`],[`杀手楼`,`shashou`],[`无门无派`,`none`]],qe={footers:[{cmd:`score`,name:`综合榜`,selected_silder:``,silder:Ke},{cmd:`top`,name:`高手榜`,selected_silder:``,silder:Ke},{cmd:`weapon`,name:`兵器谱`,selected_silder:``,silder:[[`武器`,``],[`衣服`,`cloth`],[`鞋`,`shoes`],[`头部`,`head`],[`披风`,`cape`],[`戒指`,`ring`],[`项链`,`necklace`],[`饰品`,`jewels`],[`护腕`,`wrist`],[`腰带`,`waist`],[`暗器`,`throwing`]]},{cmd:`exp`,name:`经验榜`,selected_silder:``,silder:Ke},{cmd:`mp`,name:`内力榜`,selected_silder:``,silder:Ke},{cmd:`money`,name:`富豪榜`,selected_silder:``,silder:Ke}],selectedItem:0,init:function(){Dialog.injectStyle(Je)},close:function(){this.element.remove(),this.isShow=!1},onData:function(e){if(e.close)return Dialog.hide();if(e.tops)return e.top?this.show_desc(`你目前在第`+e.top+`名，积分`+e.sc):this.show_desc(`你目前没有上榜，积分：`+e.sc),this.create_tops(e.tops,e);if(e.weapons)return this.show_desc(``),this.create_weapons(e.weapons);if(e.scores)return this.show_desc(`你目前的评分：`+e.score),this.create_scores(e.scores);if(e.items){this.create_other(e.items,e.st);let t=new Date(e.time);e.fam=e.fam??``,this[`last_`+e.st+e.fam]={items:e.items,time:e.time+6e4,score:e.score},e.score?this.show_desc(`你目前的评分：`+e.score):this.show_desc(`上次更新：`+t.getHours()+`:`+t.getMinutes())}},create_other:function(e,t){for(var n=[],r=0;r<20;r++){n.push(`<div class='top-item`),r<3&&n.push(` top`,r+1),n.push(`' top='`),n.push(r+1),n.push(`'><span class='top-title'>`),n.push(this.top_names[r]),n.push(`、</span>`),n.push(`<span class='top-name'>`);let t=e[r]??[`无`,0];n.push(t[0]),n.push(`</span>`),n.push(`<span class='top-sc'>`),n.push(t[1]),n.push(`</span>`),n.push(`</div>`)}this.container.html(n.join(``))},silderClick:function(){let e=$(this),t=e.attr(`stype`),n=Dialog.stats.selectedItem;n.selected_silder!==t&&(n.selected_silder=t,e.parent().find(`.select`).removeClass(`select`),e.addClass(`select`),Dialog.stats.load_stats())},create_silder:function(e){let t=[];e||=[];let n=this.selectedItem;for(let r of e)t.push(`<div class="stats-silder `,n.selected_silder===r[1]?`select`:``,`" stype="`,r[1],`">`,r[0],`</div>`);this.left_silder.html(t.join(``))},top_names:[`一　`,`二　`,`三　`,`四　`,`五　`,`六　`,`七　`,`八　`,`九　`,`十　`,`十一`,`十二`,`十三`,`十四`,`十五`,`十六`,`十七`,`十八`,`十九`,`二十`],create_scores:function(e,t){for(var n=[],r=0;r<20;r++){n.push(`<div class='top-item scores`),r<3&&n.push(` top`,r+1),n.push(`' top='`),n.push(r+1),n.push(`'><span class='top-title'>`),n.push(this.top_names[r]),n.push(`、</span>`),n.push(`<span class='top-name'>`);let t=e[r]??[`无`,``];n.push(t[0]),n.push(`</span>`),n.push(`<span class='top-sc'>`),n.push(t[1]),n.push(`</span>`),n.push(`</div>`)}this.container.html(n.join(``))},fam_names:{emei:`峨眉第`,wudang:`武当第`,huashan:`华山第`,xiaoyao:`逍遥第`,gaibang:`丐帮第`,shaolin:`少林第`,shashou:`杀手第`,none:`散修第`},create_tops:function(e,t){for(var n=[],r=0;r<e.length;r++)n.push(`<div class='top-item top `),r<3&&n.push(` top`,r+1),n.push(`' top='`),n.push(r+1),n.push(`'><span class='top-title'>`),n.push(t.fam?this.fam_names[t.fam]:`天下第`),n.push(this.top_names[r]),n.push(`</span>`),n.push(`<span class='top-name'>`),n.push(e[r][0]),n.push(`</span>`),n.push(`<span class='top-sc'>`),n.push(e[r][1]),n.push(`</span>`),n.push(`</div>`);this.container.html(n.join(``)),this.top=t.top},create_weapons:function(e){for(var t=[],n=0;n<10;n++){t.push(`<div class='top-item weapon top`),t.push(n+1),t.push(`' top='`),t.push(n+1),t.push(`'><span class='top-title'>`);let r=e[n]??[`无`,``];t.push(this.top_names[n]),t.push(`、</span>`),t.push(`<span class='top-name'>`),t.push(r[0]),t.push(`</span>`),t.push(`<span class='top-sc'>`),t.push(r[1]),t.push(`</span>`),t.push(`</div>`)}this.container.html(t.join(``))},show:function(){this.selectedItem||=this.footers[0],this.load_stats(),this.element||(this.element=$(`<div class='stats-container'><div class='stats-container-left'></div></div>`),this.container=$(`<div class='dialog-stats'></div>`).appendTo(this.element),this.left_silder=this.element.find(`.stats-container-left`),this.create_silder(this.selectedItem.silder)),!this.isShow&&(this.create_footer(),Dialog.icon(`stats`),Dialog.title(this.selectedItem.name),Dialog.contentElement.html(this.element),this.element.on(`click`,`.top-item`,this.itemClick),this.left_silder.on(`click`,`.stats-silder `,this.silderClick),this.isShow=!0)},load_stats:function(){let e=this.selectedItem.cmd,t=this.selectedItem.selected_silder,n=this[`last_`+e+t];if(n&&n.time>Date.now()){let t=new Date(n.time),r=``;return r=n.score?`你目前的评分：`+n.score:`上次更新：`+t.getHours()+`:`+t.getMinutes(),this.show_desc(r),this.create_other(n.items,e)}let r=`stats `+e;t&&(r=r+` `+t),SendCommand(r)},create_footer:function(){for(var e=[],t=0;t<this.footers.length;t++){var n=this.footers[t];e.push(`<span class='footer-item`+(n==this.selectedItem?` select`:``)+`' for='`+t+`''>`+n.name+`</span>`)}e.push(`<span class='stats-span'></span>`),Dialog.footer(e.join(``))},show_desc:function(e){Dialog.footerElement.find(`.stats-span`).html(e)},footerChanged:function(e){var t=this.footers[e];t!=this.selectedItem&&(this.selectedItem=t,Dialog.title(this.selectedItem.name),this.create_silder(this.selectedItem.silder),this.load_stats())},itemClick:function(){var e=$(this),t=parseInt(e.attr(`top`)),n=Dialog.stats.selectedItem.cmd,r=[`<div class='item-commands'>`],i=Dialog.stats.selectedItem.selected_silder;n===`top`?(r.push(`<span cmd="stats `+n+` `+i+` `+t+`">查看</span>`),(!Dialog.stats.top||t<Dialog.stats.top)&&r.push(`<span cmd="biwu `+i+` `+t+`">挑战</span>`),r.push(`<span cmd="reward top `+t+`">查看规则和奖励</span>`)):(r.push(`<span cmd="stats `+n+` `+i+` `+t+`">查看</span>`),r.push(`<span cmd="reward `+n+` `+t+`">查看奖励</span>`)),r.push(`</div>`),Dialog.stats.element.find(`.item-commands`).remove(),$(r.join(``)).insertAfter(e)}},Je=`

.stats-container {
    display: flex;
    flex-direction: row;
    height: 25em;
    margin-top: 0.5em;
}

.stats-container>.stats-container-left {
    overflow-y: auto;
}

.stats-container-left>.stats-silder {
    white-space: nowrap;
    line-height: 2em;
    width: 5em;
    text-align: center;
    background-color: #111;
    border-radius: 4px;
    margin-bottom: 0.5em;
    margin-right: 0.5em;
    margin-left: 0.5em;
    text-align: center;
    cursor: pointer;
}

.stats-container-left>.select {
    background-color: #222;
    color: #00ff00;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: #00ff00;
}

.dialog-stats {
    flex: 1;
    overflow: auto;
}

.dialog-stats>.top-item {
    white-space: nowrap;
    line-height: 2em;
    padding-left: .5em;
    border-radius: 4px;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
    color: inherit;
}

.dialog-stats>.top-item>.top-title {
    display: inline-block;
    font-weight: bold;
    height: 1.875em;
    line-height: 1.875em;
    padding-left: 1em;
    margin-right: 1em;
}

.dialog-stats>.top-item>.top-sc {
    float: right;
    margin-right: 1em;
    line-height: 1.875em;
    font-weight: bold;
    font-style: italic;
}



.dialog-stats>.top1>.top-sc {
    color: #FFA500;
}

.dialog-stats>.top2>.top-sc {
    color: #912CEE;
}

.dialog-stats>.top3>.top-sc {
    color: #FFD700;
}

.dialog-stats>.top-item>.top-name {
    height: 1.875em;
    line-height: 1.875em;
}

.dialog-stats>.top-item>.item-commands {
    padding-left: 3.125em;
}

.stats-span {
    float: right;
    padding-right: 10px;
    color: #C0C0C0;
    line-height: 2.5em;
}
`,W={name:`门派`,items:null,selected_index:0,type:`fam`,onDetail:function(e){var t=this.items[e.index];if(t)return t.type=`门派`,t.desc=e.desc,t.sp=e.sp,t.actions=e.actions,t.skills=e.skills,this.showDetail(t)},showDetail:function(e){var t=[`<pre><hig>`];t.push(e.name),t.push(`</hig>
`),t.push(e.desc),e.sp&&(t.push(`
<hig>特点：`),t.push(e.sp),t.push(`</hig>
`)),this.append_actions(t,e),t.push(`<div class="item-commands"><span cmd="jh fam `+e.index+` start">进入地图</span>`);let n=[];Dialog.extend.append(n,`map`,e);for(let e of n)t.push(`<span cmd="`,e.cmd,`">`,e.name,`</span>`);t.push(`</div>`),e.skills&&t.push(e.skills),t.push(`</pre>`),this.descElement.html(t.join(``)),this.select(e.index)},append_actions:function(e,t){let n=t.actions??[];e.push(`<div class="fb-actions">`);for(let t of n)e.push(`<div class="fb-action">`),e.push(`<span class="action-desc">`,t[2]??``,`</span>`),t[1]&&e.push(`<span class="action-name"  cmd="`,t[0],`">`,t[1],`</span>`),e.push(`</div>`);e.push(`</div>`)},show:function(e,t){for(var n=[],r=0;r<this.items.length;r++){var i=this.items[r];n.push(`<div class="fam-item`),n.push(`" index="`,r,`">`,i.name,`</div>`),i.index=r}e.html(n.join(``)),this.listElement=e,this.descElement=t,this.onClickItem(this.selected_index)},select:function(e){var t=this.listElement.find(`div[index='`+e+`']`);if(t.length&&!t.is(`.selected`)){var n=t[0].offsetTop,r=this.listElement.height();n>r/2&&(n=(r-t.height())/2,this.listElement[0].scrollTop=n),this.selectedItem&&this.selectedItem.removeClass(`selected`),this.selectedItem=t,this.selectedItem.addClass(`selected`),this.selected_index=e}},onClickItem:function(e){let t=this.items[e];t.desc?this.showDetail(t):SendCommand(`jh `+this.type+` `+e),this.select(e)},append_footer:function(){let e=this.items[this.selected_index];Dialog.footerElement.find(`.item-commands`).html(`<span cmd="jh fam ${e.index} start">进入地图</span>`)}},Ye={name:`副本`,type:`fb`,items:null,selected_index:-1,select:W.select,onClickItem:W.onClickItem,onDetail:function(e){var t=this.items[e.index];if(t)return t.type=`副本`,t.desc=e.desc,t.reward=e.reward,t.diffs=e.diffs,t.status=e.status,this.showDetail(t)},update_unlock:function(e){this.unlock=e;for(let t=0;t<this.items.length;t++)this.items[t].unlock=e>=t;this.selected_index<0&&(this.selected_index=e)},show:function(e,t){this.listElement=e,this.descElement=t;for(var n=[`<div class='fb-content'>`],r=0;r<this.items.length;r++){var i=this.items[r];n.push(`<div class="fb-item`),i.unlock||n.push(` lock`),i.index=r,n.push(`" index="`,r,`">`,i.name,`</div>`)}n.join(`</div>`),this.listElement.html(n.join(``)),this.onClickItem(this.selected_index)},show_first:function(e){let t=e.prev().html();t&&ReceiveMessage(t)},fb_models:[`普通`,`<red>困难</red>`,`<cyn>组队</cyn>`],showDetail:function(e){var t=[`<pre>`];if(t.push(e.name),e.unlock?t.push(`
<hig>已解锁</hig>
`):t.push(`
<red>未解锁</red>
`),t.push(e.desc),this.append_status(t,e),e.unlock&&e.diffs){t.push(`<div class="item-commands">`);for(let n=0;n<e.diffs.length;n++)e.diffs[n]&&t.push(`<span cmd="jh fb `,e.index,` start`,n+1,`">`,this.fb_buttons[n],`</span>`);let n=[];Dialog.extend.append(n,`map`,e);for(let e of n)t.push(`<span cmd="`,e.cmd,`">`,e.name,`</span>`);t.push(`</div>`)}t.push(e.reward),t.push(`</pre>`),this.descElement.html(t.join(``)),this.select(e.index)},append_status:function(e,t){let n=t.status??[];if(n.length){e.push(`<div class="fb-actions">`);for(let r=0;r<n.length;r++){let i=n[r];i&&(i[0]===1?(e.push(`<div class="fb-action finshed">`),e.push(`<span class="action-desc">由`,i[1],`首次通过`,`</span>`),e.push(`<span class="action-name" cmd="cr2 `,t.index,` `,r,`">`,this.fb_models[r],`</span>`),e.push(`</div>`)):(e.push(`<div class="fb-action">`),e.push(`<span class="action-desc">该模式尚未完成首杀`,i[1]?`，称号奖励：`+i[1]:``,`</span>`),e.push(`<span class="action-name"  cmd="cr2 `,t.index,` `,r,`">`,this.fb_models[r],`</span>`),e.push(`</div>`)))}e.push(`</div>`)}},fb_buttons:[`进入副本`,`困难模式`,`组队进入`],append_footer:function(){let e=this.items[this.selected_index],t=[];if(e.unlock)for(let n=0;n<e.diffs.length;n++)e.diffs[n]&&t.push(`<span cmd="jh fb `,e.index,` start`,n+1,`">`,this.fb_buttons[n],`</span>`);Dialog.footerElement.find(`.item-commands`).html(t.join(``))}},Xe={name:`禁地`,items:null,type:`ar`,selected_index:0,select:W.select,onClickItem:W.onClickItem,append_status:Ye.append_status,append_actions:W.append_actions,fb_models:[`普通`,`普通`,`组队`],onDetail:function(e){var t=this.items[e.index];if(t)return t.type=`禁地`,t.desc=e.desc,t.actions=e.actions,t.status=e.status,t.reward=e.reward,this.showDetail(t)},update_unlock:function(e){for(let t=0;t<this.items.length;t++)this.items[t].unlock=(e&2**t)!=0},show:function(e,t){var n=[`<div class='fb-content'>`];let r=Math.max(this.items.length,10);for(var i=0;i<r;i++){var a=this.items[i];n.push(`<div class="fb-item`),a?(a.unlock||n.push(` lock`),n.push(`" index="`,i,`">`,a.name,`</div>`),a.index=i):n.push(`">&nbsp;</div>`)}n.join(`</div>`),this.listElement=e,this.descElement=t,this.listElement.html(n.join(``)),this.onClickItem(this.selected_index)},showDetail:function(e){var t=[`<pre>`];if(t.push(e.name),e.unlock?t.push(`
<hig>已解锁</hig>
`):t.push(`
<red>未解锁</red>
`),t.push(e.desc,`
`),this.append_status(t,e),this.append_actions(t,e),e.unlock){t.push(`<div class="item-commands">`),t.push(`<span cmd="jh ar ${e.index} start">进入地图</span>`);let n=[];Dialog.extend.append(n,`map`,e);for(let e of n)t.push(`<span cmd="`,e.cmd,`">`,e.name,`</span>`);t.push(`</div>`)}t.push(e.reward),t.push(`</pre>`),this.descElement.html(t.join(``)),this.select(e.index)},append_footer:function(){let e=this.items[this.selected_index];e.unlock?Dialog.footerElement.find(`.item-commands`).html(`<span cmd="jh ar ${e.index} start">进入地图</span>`):Dialog.footerElement.find(`.item-commands`).empty()}},Ze={fb:Ye,fam:W,ar:Xe},Qe={init:function(){Dialog.injectStyle($e)},close:function(){this.element.remove(),this.isShow=!1},onData:function(e){if(e.close)return Dialog.isShow&&Dialog.hide();if(e.desc)return this.selected_item.onDetail(e);if(e.unlock!==void 0||e.unlock2!==void 0)return this.update_lock(e);if(e.refresh!==void 0&&this.isLoad){let t=Ze[e.t],n=t.items[e.refresh];if(n&&n.desc){n.desc=null;let e=t.items.indexOf(n);t.selected_index==e&&t.onClickItem(e)}return}e.fbs&&(W.items=e.families.map(function(e){return{name:e,unlock:!1}}),Ye.items=e.fbs.map(function(e){return{name:e}}),Xe.items=e.areas.map(function(e){return{name:e,unlock:!1}}),this.selected_item.show(this.listElement,this.descElement))},show:function(){this.isShow||(this.element||=$(`<div class='dialog-fb'><div class='fb-left'></div><div class='fb-right'></div></div>`),this.listElement=this.element.find(`.fb-left`).on(`click`,`.fb-item,.fam-item`,this.item_click),this.descElement=this.element.find(`.fb-right`),Dialog.title(`江湖`),Dialog.icon(`home`),this.element.appendTo(Dialog.contentElement),this.isShow=!0,this.isLoad?SendCommand(`jh fb lock`):(SendCommand(`jh`),this.isLoad=!0,this.selected_item=this.footers[0]),this.create_footer())},selected_item:null,footers:[W,Ye,Xe],create_footer:function(){for(var e=[],t=0;t<this.footers.length;t++){let n=this.footers[t];e.push(`<span class='footer-item`+(n==this.selected_item?` select`:``)+`' for='`+t+`'>`+this.footers[t].name+`</span>`)}e.push(`<div class="item-commands"></div>`),Dialog.footerElement.html(e.join(``))},item_click:function(){var e=$(this);if(e.is(`.selected`))return;let t=e.attr(`index`);t!==void 0&&Dialog.jh.selected_item.onClickItem(t)},update_lock:function(e){e.unlock>=0&&Ye.items&&(Ye.update_unlock(e.unlock),this.selected_item===Ye&&Ye.show(this.listElement,this.descElement)),e.unlock2>=0&&Xe.items&&(Xe.update_unlock(e.unlock2),this.selected_item===Xe&&Xe.show(this.listElement,this.descElement))},footerChanged:function(e){let t=this.footers[e];t!=this.selected_item&&(this.selected_item=t,Dialog.footerElement.find(`.item-commands`).empty(),t.show(this.listElement,this.descElement))}},$e=`


.dialog-fb {
    height: 25.5em;
    overflow-y: hidden;
    display: flex;
    flex-direction: row;
}

.dialog-fb>.fb-left {
    width: 12.5em;
    height: 100%;
    text-align: center;
    margin-top: 0.5em;
    overflow-y: auto;
}

.dialog-fb>.fb-right {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    padding-left: 0.5em;
}

.fb-actions {
    margin-top: 0.5em;
}

.fb-actions>.fb-action {
    line-height: 2em;
    padding-left: 1em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
    display: flex;
    flex-direction: row;
}

.fb-actions>.fb-action>.action-desc {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: gray;
    overflow: hidden;
}

.fb-actions>.fb-action>.action-name {
    flex: 0;
    background-color: #222;
    padding-left: 1em;
    padding-right: 1em;
}

.fb-actions>.fb-action>.action-name:hover {
    background-color: #333;
}

.fb-actions>.finshed {
    border-left-color: #00FF00;
}

.fb-actions>.finshed>.action-desc {
    color: #00FF00;
}

.dialog-fb>.fb-right>pre {
    white-space: pre-wrap;
    margin: 0.5em 0.5em 2em 0.5em;
}

.dialog-fb>.fb-left>.fb-content {
    height: 100%;
    overflow: auto;
}

.dialog-fb>.fb-left>.fb-content>.fb-item {
    line-height: 2em;
    padding-left: 1.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
}


.dialog-fb>.fb-left>.fam-item {
    line-height: 2em;
    padding-left: 0.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
}

.dialog-fb>.fb-left>.fb-content>.line {
    height: 1.25em;
    width: 0px;
    border-left: 1px solid #343434;
    margin-left: auto;
    margin-right: auto;
    margin-top: -1em;
    margin-bottom: -1em;
}

.dialog-fb>.fb-left>.fb-content>.lock {
    border-color: #bebebe;
    color: #bebebe !important;
    opacity: 0.6;
}

.dialog-fb>.fb-left>.fb-content .selected,
.dialog-fb>.fb-left>.selected {
    border-color: #00ff00;
    color: #00ff00;
}

.dialog-fb>.fb-left>.fb-content>.lock:before {
    font-family: 'Glyphicons Halflings';
    content: "\\e033";
    float: left;
    margin-left: 0.25em;
    opacity: 0.6;
}
`,et={init:function(){},createElement:function(){return $(`<div class="dialog-relation"></div>`)},inner_show:function(){SendCommand(`relation`),this.isShow=!0,Dialog.title(`关系`),Dialog.icon(`heart`)},onData:function(e){var t=[];if(t.push(`<div class='relation-item'>`),t.push(`<div class='relation-desc'>`),e.husband?(t.push(`你的丈夫：`),t.push(e.husband)):e.wife?(t.push(`你的妻子：`),t.push(e.wife)):t.push(`你目前没有结婚。`),t.push(`</div>`),(e.wife||e.husband)&&(t.push(`<div class='relation-cmd' cmd='_confirm greet wife'><him>❀送花❀</him></div>`),t.push(`<div class='relation-cmd' cmd='rel marry'>解除关系</div>`)),t.push(`</div>`),t.push(`<div class='relation-item'>`),t.push(`<div class='relation-desc'>`),e.shifu?(t.push(`你的师父：`),t.push(e.shifu)):e.tudi?(t.push(`你的徒弟：`),t.push(e.tudi)):t.push(`你目前没有拜师，也没有收徒。`),t.push(`</div>`),e.shifu?(t.push(`<div class='relation-cmd' cmd='greet master'><hig>请安</hig></div>`),t.push(`<div class='relation-cmd' cmd='rel st'>出师</div>`),t.push(`</div>`)):e.tid&&t.push(`<div class='relation-cmd' cmd='rel st'>解除关系</div>`),t.push(`</div>`),e.st!=null&&(t.push(`<div class='relation-item'><div class='relation-desc'>`),t.push(`当师徒组队完成副本后将获得额外奖励，本周已完成`+e.st+`/10。`,`</div>`),t.push(`<div class='relation-cmd' cmd='team add `,e.tid??e.shifu,`'>邀请组队</div>`),t.push(`</div>`)),e.reward&&(t.push(`<div class='relation-item'>`),t.push(e.reward),t.push(`</div>`)),t.push(`</div>`),e.fls)for(let n of e.fls)n&&(t.push(`<div class='relation-item'>`),t.push(`<div class='relation-desc'>你的家人：`,n[0]),n[2]?(t.push(`，已`,n[2],format_time_span(n[3])),t.push(`</div>`),t.push(`<div class='relation-cmd' cmd='rel `,n[1],` stop'>停止</div>`)):(t.push(`空闲中</div>`),t.push(`<div class='relation-cmd' cmd='rel `,n[1],` caiyao'><hic>采药</hic></div>`),t.push(`<div class='relation-cmd' cmd='rel `,n[1],` diaoyu'><hic>钓鱼</hic></div>`),t.push(`<div class='relation-cmd' cmd='rel `,n[1],` wk'><hic>挖矿</hic></div>`)),t.push(`</div>`));this.element.html(t.join(``))},inner_close:function(){this.element.remove(),this.isShow=!1}},tt={init:function(){},createElement:function(){return $(`<div class="dialog-team"></div>`)},inner_show:function(){SendCommand(`team`),this.isShow=!0,Dialog.title(`队伍`),this.element.on(`click`,`.team-item`,this.clickItem),Dialog.icon(`list`)},items:[],onData:function(e){if(e.items&&(this.items=e.items,e.items.length?this.isCap=e.items[0].id==Process.player:this.isCap=0),e.dismiss&&(this.items.length=0,this.isCap=!1),e.remove){if(!this.items.length)return;for(var t=0;t<this.items.length;t++)if(this.items[t].id==e.remove){this.items.splice(t,1);break}}this.createItems()},inner_close:function(){this.element.remove(),this.isShow=!1},createItems:function(){if(this.element){for(var e=[],t=0;t<this.items.length;t++){var n=this.items[t];e.push(`<div class='team-item' index='`+t+`'>`),e.push(`<span class='team-flag'>`),e.push(t>0?``:`<span class='glyphicon glyphicon-flag'></span>`),e.push(`</span>`),e.push(`<span class='team-title'>`),e.push(n.name),e.push(`</span>`),e.push(`</div>`)}e.length||e.push(`<div class="empty">你还没有加入任何队伍。</div>`),this.element.html(e.join(``))}},clickItem:function(){var e=$(this),t=Dialog.team.items[e.attr(`index`)];if(t){var n=[`<div class='item-commands'>`];n.push(`<span cmd="look3 `+t.id+`">查看</span>`);var r=Dialog.team.items[0].id==Process.player;r&&t.id!=Process.player?n.push(`<span cmd="team remove `+t.id+`">移出队伍</span>`):t.id==Process.player&&n.push(`<span cmd="team out `+t.id+`">退出队伍</span>`),r&&t.id==Process.player&&n.push(`<span cmd="team set">更改分配方式</span>`),n.push(`</div>`),Dialog.team.element.find(`.item-commands`).remove(),$(n.join(``)).appendTo(e)}}},nt=`
.dialog-party>wht {
    display: inline-block;
    height: 15rem;
    line-height: 15rem;
    text-align: center;
    width: 100%;
}

.dialog-party>.dialog-party-add {
    margin-top: 2em;
    text-align: center;
}

.dialog-party>.dialog-party-add>input {
    border: 1px solid gray;
    background-color: transparent;
    color: unset;
    resize: none;
    margin-top: 1em;
    margin-bottom: 1em;
    line-height: 2em;
    border-radius: 0.5em;
    text-align: center;
}

.dialog-party>.party-title {
    font-size: 2rem;
    width: 100%;
    text-align: center;
    height: 2rem;
    line-height: 2rem;
    margin-top: 0.25em;
    margin-bottom: 0.25em;
    opacity: 0.7;
    font-weight: bold;

}

.dialog-party>.party-notice {
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    color: #00FFFF;
    line-height: 2em;
}

.dialog-party>.party-notice>*>span {

    width: 3em;
    display: inline-block;
    padding-right: 0.5em;
}

.dialog-party>.party-title>.party-count {

    font-size: 1rem;
}

.dialog-party>.party-title>*>.glyphicon {

    padding-right: 0.5em;
    float: left;
}

.dialog-party>.party-roles {

    overflow-x: hidden;
    overflow-y: auto;
}

.dialog-party>.party-roles>.party-role,
.dialog-party>.party-item {

    padding-left: 0.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    background-color: #111;
    line-height: 2em;
    cursor: pointer;
}

.dialog-party>.party-item {
    display: flex;
}

.dialog-party>.party-item>.party-item-name {
    padding-left: 0.5em;
    flex: 1;
}

.dialog-party>.party-item>.party-item-sc {

    flex: 0;
    margin-left: 1em;
    margin-right: 1em;
}

.dialog-party>.party-item>.party-item-cmd {
    flex: 0;
    background-color: #222;
    padding-left: 1em;
    padding-right: 1em;
}

.dialog-party>.party-roles>.party-role>.role-level {

    width: 3em;
    display: inline-block;
}

.dialog-party>.party-roles>.party-role>.role-name {
    padding-left: 0.5em;
}

.dialog-party>.party-roles>.party-role>.role-sc {
    float: right;
    padding-right: 0.5rem;

}
`,rt={init:function(){Dialog.injectStyle(nt)},createElement:function(){return $(`<div class="dialog-party"></div>`)},inner_show:function(){SendCommand(`party load`),this.isShow=!0,Dialog.title(``),this.element.on(`click`,`.party-role`,this.show_commands),Dialog.icon(`flag`)},levels:[``,`<hio>帮主<hio>`,`<hiz>副帮主</hiz>`,`<hiy>长老</hiy>`,`<hic>堂主</hic>`,`帮众`],level_roles:[1,20,30,40,50,60],level:5,get_role:function(e){if(this.roles){for(var t=0;t<this.roles.length;t++)if(this.roles[t].id==e)return this.roles[t]}},command:function(e){if(e===`create`){let e=[`<div class="dialog-party-add">`];e.push(`<div>创建帮派需要500两<hiy>黄金</hiy>，请输入帮派名称(2-5字中文)：</div>`),e.push(`<input type="text" ></input>`),e.push(`<div class='item-commands'><span cmd='_party cancle'>取消</span><span cmd='_party create2'>确定</span></div>`),e.push(`</div>`),this.element.html(e.join(``))}else if(e===`cancle`)this.empty(`你还没有加入帮派`);else if(e===`create2`){let e=$(`.dialog-party-add>input`).val();if(!e||e.length>5||e.length<2)return ReceiveMessage(`帮派名字需要是2-5中文字符。`);SendCommand(`party create2 `+e)}},empty:function(e){this.element.html(`<wht>`+e+`</wht><div class='item-commands'><span cmd='_party create'>创建帮派</span><span cmd='party list'>加入帮派</span></div>`)},show_list:function(e){if(!e.list.length)return this.empty(`现在没有已经创建的帮派`);var t=[];for(let n of e.list)t.push(`<div class='party-item'>`),t.push(`<span class='party-item-name'>`),t.push(n[0]),t.push(`</span>`),t.push(`<span class='party-item-sc'>人数：`),t.push(n[1]),t.push(`</span>`),t.push(`<span class='party-item-cmd' cmd='party join `,n[0],`'>加入</span>`),t.push(`</div>`);this.element.html(t.join(``))},onData:function(e){if(e.list)return this.show_list(e);if(!e.name)return this.empty(`你还没有加入帮派`);var t=e;Dialog.title(`帮派【`+t.name+`】 <nor>`+e.roles.length+`/`+this.level_roles[e.level]+`</nor>`);var n=[];t.notice&&(n.push(`<div class='party-notice'>`),n.push(t.notice),n.push(`</div>`)),n.push(`<div class='party-roles'>`);for(var r=0;r<t.roles.length;r++){var i=t.roles[r];i.id==Process.player&&(this.level=i.level),n.push(`<div class='party-role' roleid='`+i.id+`'>`),n.push(`<span class='role-level'>`),n.push(this.levels[i.level]),n.push(`</span>`),n.push(`<span class='role-name'>`),n.push(i.name),n.push(`</span>`),n.push(`<span class='role-sc'>`),n.push(i.sc),n.push(`</span>`),n.push(`</div>`)}n.push(`</div>`),this.roles=e.roles,this.element.html(n.join(``))},show_commands:function(){var e=Dialog.party.get_role($(this).attr(`roleid`));if(e){var t=[`<div class='item-commands'>`];e.id==Process.player?(t.push(`<span cmd="party out">退出帮派</span>`),Dialog.party.level==1&&t.push(`<span cmd="party dissmiss">解散</span>`)):(e.level>Dialog.party.level-1&&e.level>2&&t.push(`<span cmd="party uplevel `+e.id+`">提升为`+Dialog.party.levels[e.level-1]+`</span>`),e.level>Dialog.party.level&&e.level<5&&t.push(`<span cmd="party downlevel `+e.id+`">降级为`+Dialog.party.levels[e.level+1]+`</span>`),Dialog.party.level==1&&e.level==2&&t.push(`<span cmd="party trans `+e.id+`">让位</span>`),e.level>Dialog.party.level&&t.push(`<span cmd="party remove `+e.id+`">开除</span>`),e.online&&t.push(`<span cmd="team add `+e.id+`">邀请组队</span>`)),t.length!=1&&(t.push(`</div>`),Dialog.party.element.find(`.item-commands`).remove(),$(t.join(``)).insertAfter(this))}},inner_close:function(){this.element.remove(),this.isShow=!1}},it={init:function(){Dialog.pack.init()},hide:function(){this.element.remove(),this.isShow=!1},close:function(){this.hide()},onData:function(e){this.isShow||Dialog.show(`trade`),Dialog.title(`和`+e.name+`交易中`),Dialog.pack.items,this.trade_target=e.target,this.trade_list.length=0,Dialog.pack.items?this.update_pack():SendCommand(`pack`),Dialog.pack.isShow=!1,this.create_items(this.leftElement.empty(),this.trade_list,this.max_count)},update_pack:function(e){this.create_items(this.rightElement.empty(),Dialog.pack.items,Dialog.pack.max_count)},max_count:10,trade_list:[],show:function(e){this.isShow||=(Dialog.init(),Dialog.curItem=`trade`,this.element||(this.element=$(`<div class="dialog-list"><div class="obj-list"></div><div class="obj-list"></div></div >`),this.leftElement=$(this.element.children()[0]),this.rightElement=$(this.element.children()[1])),this.leftElement.on(`click`,`.obj-item`,this.left_click),this.rightElement.on(`click`,`.obj-item`,this.right_click),this.element.appendTo(Dialog.contentElement.empty()),this.create_footer(),!0)},create_footer:function(){var e=[`<div class='item-commands'>`];e.push(`<span cmd='_trade ok'>确定</span>`),e.push(`<span  cmd='_trade cancle'>取消</span>`),e.push(`</div>`),Dialog.footer(e.join(``))},confirm:function(e){if(e===`ok`&&this.trade_list.length)for(var t=0;t<this.trade_list.length;t++)SendCommand(`give `+this.trade_target+` `+this.trade_list[t].count+` `+this.trade_list[t].id);Dialog.hide()},create_items:function(e,t,n){var r=[];t=Dialog.pack.sort_items(t);for(var i=0;i<n;i++){var a=t[i];r.push(`<div class="obj-item`),a?(r.push(a.is_lock?` lock`:``,` grade`,a.grade),r.push(`"`),r.push(` oindex='`+a.id+`'>`),r.push(a.name),a.count>1&&(r.push(`<span class='obj-value'>`),r.push(a.count),r.push(a.unit),r.push(`</span>`))):r.push(`">`),r.push(`</div>`)}e.html(r.join(``))},left_click:function(){var e=$(this).attr(`oindex`);if(e){for(var t=null,n=0;n<Dialog.trade.trade_list.length;n++)if(Dialog.trade.trade_list[n].id==e){t=Dialog.trade.trade_list[n];break}if(t)return Dialog.trade.cancle_trade(t),!1}},enable_item:function(e,t){var n=this.rightElement.find(`.obj-item[oindex='`+e.id+`']`);n.length&&(t?n.removeClass(`disabled`):n.addClass(`disabled`))},right_click:function(){var e=$(this);if(!e.is(`.disabled`)){var t=e.attr(`oindex`);if(t){var n=Dialog.pack.get_item(t);if(n)return n.count>1?Confirm.Show_trade_add(n):Dialog.trade.add_trade(n),!1}}},add_trade:function(e){for(var t=0;t<this.trade_list.length;t++)if(e.id==this.trade_list[t].id)return this.trade_list[t].count+=e.count,this.create_items();this.trade_list.push(e),this.create_items(this.leftElement.empty(),this.trade_list,this.max_count),this.enable_item(e,!1)},cancle_trade:function(e){for(var t=0;t<this.trade_list.length;t++)e.id==this.trade_list[t].id&&(this.trade_list.splice(t,1),t--);this.create_items(this.leftElement.empty(),this.trade_list,this.max_count),this.enable_item(e,!0)}},at=`

.dialog-events {
    max-height: 32em;
    margin-bottom: 0.5em;
    margin-top: 0.5em;
}

.dialog-events>.empty {
    text-align: center;
    color: gray;
    margin-bottom: 3em;
    margin-top: 3em;
}

.dialog-events>.event-item {
    border-radius: 6px;
    background-color: #111111;
    border-left-width: 4px;
    border-left-style: solid;
    position: relative;
    margin-top: 0.5em;
    padding-left: 0.5em;
}

.event-item h3 {
    margin: 0px;
    padding-top: 0.5em;
    color: var(--border-color)
}

.event-item .event-desc {
    white-space: pre-wrap;
    margin: 0;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
}

.event-item>.event-btn {
    width: 7em;
    border-left: 1px solid var(--border-color);
    text-align: center;
    font-weight: bold;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--border-color);
}

`,ot={unRead:0,init:function(){Dialog.injectStyle(at)},hide:function(){this.element.remove(),this.isShow=!1},onData:function(e){if(e.close)return Dialog.hide();if(!e.items)return e.finish?this.unRead--:this.unRead++,this.showUnread();this.items=e.items,this.create_items()},showUnread:function(){Ue(`events`,this.unRead)},show:function(){this.element||=$(`<div class='dialog-events'></div>`),SendCommand(`events`),!this.isShow&&(Dialog.title(`活动`),Dialog.icon(`dashboard`),this.unRead=0,this.showUnread(),Dialog.footer(``),this.element.appendTo(Dialog.contentElement),this.isShow=!0)},create_items:function(){let e=[];for(let t=0;t<this.items.length;t++){let[n,r,i,a,o,s]=this.items[t];e.push(`<div class='event-item flex-row `),e.push(`grade`,a),e.push(`'><div class='flex-1'><h3>`),e.push(r),e.push(`</h3>`),e.push(`<pre class='event-desc'>`),e.push(i),o>0&&e.push(`
<mem>`,this.format_time(o),`</mem>`),e.push(`</pre></div>`),e.push(`<span class='event-btn flex-0'`),s?e.push(` cmd='events `,n,`' >`,s):e.push(`>进行中`),e.push(`</span>`),e.push(`</div>`)}e.length||e.push(`<div class="empty">暂无活动</div>`),this.element.html(e.join(``)),Dialog.footer(`<span class="obj-money">共有`+this.items.length+`项活动正在进行</span>`)},format_time:function(e){let t=new Date(e),n=new Date,r=t.getDate(),i=t.getHours(),a=t.getMinutes(),o=[`持续到`];return n.getFullYear()!==t.getFullYear()&&o.push(t.getFullYear(),`年`),n.getMonth()===t.getMonth()?r!==n.getDate()&&o.push(this.format_num(r),`日`):o.push(this.format_num(t.getMonth()+1),`月`,this.format_num(r),`日`),o.push(this.format_num(i),`:`,this.format_num(a)),o.join(``)},format_num:function(e){return e>9?e.toString():`0`+e.toString()}},st=`
.dialog-pms {
    max-height: 32em;
    margin-bottom: 0.5em;
}

.dialog-pms>.empty {
    text-align: center;
    margin-top: 3em;
    margin-bottom: 3em;
    color: gray;
}

.dialog-pms>.pm-item {
    border-radius: 6px;
    background-color: #111111;
    border-left-width: 4px;
    border-left-style: solid;
    border-left-color: gray;
    position: relative;
    padding-left: 0.5em;
    line-height: 2em;
    margin-top: 0.5em;
    cursor: pointer;
}

.dialog-pms>.selected {
    border-left-color: #00ff00;
    background-color: #222;
}

.dialog-pms>.pm-item>.pm-title {
    width: 10em;

}

.dialog-pms>.pm-item>.pm-desc {
    min-width: 10em;
    flex: 1;
}

.dialog-pms>.pm-item>.pm-mem {

    padding-right: 1em;
    color: gray;
    font-size: 0.8em;
}

.dialog-pms>.pm-item>.pm-add {
    width: 4em;
    border-left: 1px solid #343434;
    text-align: center;
    color: #008080
}

.dialog-pms>.pm-item>.pm-add:hover {
    background-color: #333;
}
`;function ct(e){let t=Math.floor(e/1e3);if(t<0&&(t=0),t>3600){let e=Math.floor(t/3600)+`小时`;return t%=3600,e+=Math.floor(t/60)+`分`,e}let n=Math.floor(t/60)+`分`;return t%=60,n+t+`秒`}var G={isShow:!1,curItem:null,score:ge,map:_e,keys:ye,setting:be,extend:Te,channel:Ee,pack:De,skills:Ae,tasks:Fe,shop:B,message:We,stats:qe,jh:Qe,relation:et,team:tt,party:rt,trade:it,events:ot,pm:{init:function(){Dialog.injectStyle(st)},close:function(){this.element.remove(),this.isShow=!1},onData:function(e){e.list?(this.show(),this.create_items(e.list)):e.item&&this.update_item(e.item)},show:function(){(!Dialog.isShow||Dialog.curItem!=`pm`)&&Dialog.show(`pm`),this.element||=$(`<div class='dialog-pms'></div>`),!this.isShow&&(Dialog.title(`拍卖行`),Dialog.icon(`shopping-cart`),Dialog.footer(``),this.element.appendTo(Dialog.contentElement),this.element.on(`click`,`.pm-item`,this.select_item),this.isShow=!0)},select_item:function(){let e=$(this),t=Dialog.pm;t.selected_item&&t.selected_item.removeClass(`selected`),t.selected_item=e,t.selected_item.addClass(`selected`)},update_item:function(e){let t=this.element.find(`.pm-item[oid="`+e[0]+`"]`);t&&t.replaceWith(this.create_item(e))},create_items:function(e){let t=[];for(let n=0;n<e.length;n++)t.push(this.create_item(e[n]));t.length||t.push(`<div class="empty">暂无拍卖</div>`),this.element.html(t.join(``)),Dialog.footer(`<span class="obj-money">共有`+e.length+`项道具正在拍卖</span>`)},create_item:function(e){let t=[],[n,r,i,a,o]=e;return t.push(`<div class='pm-item grade0 flex-row' oid='`,n,`'>`),t.push(`<div class='pm-title' cmd='pm show `,n,`'>`),t.push(r),t.push(`</div>`),t.push(`<div class='pm-desc flex-1'>`),o?t.push(o,`最后出价`,moneyToStr(i)):t.push(`当前价格`,moneyToStr(i)),t.push(`</div>`),t.push(`<div class='pm-mem'>`),t.push(`剩余：`,ct(a),``),t.push(`</div>`),t.push(`<div class='pm-add' cmd='pm add `,n,`'>`),t.push(`出价`),t.push(`</div>`),t.push(`</div>`),t.join(``)},format_num:function(e){return e>9?e.toString():`0`+e.toString()}},pack2:{init:function(){Dialog.pack.init(),this.show_sub=Dialog.pack.show_sub,this.close=Dialog.pack.close,this.get_item=Dialog.pack.get_item,this.create_item_command=Dialog.pack.create_item_command},onData:function(e){this.show(),e.items?(this.eqs=this.formatEqs(e.eqs||[]),this.money=e.money,this.id=e.id,this.command_before=`dc `+this.id+` `,this.items=this.formatItems(e.items),this.target_name=e.name,this.max_count=e.max_item_count,this.show_items(),this.show_moeny()):this.updateitem(e)},show_moeny:function(){if(!this.isShow)return;let e=D.moneyToStr(this.money),t=[];t.push(`<div class='obj-money'>`),this.packElement.is(`.cleanup`)?(t.push(`<span for='cancle' class='footer-item'>取消</span>`),t.push(`<span for='store' class='footer-item'>自动存仓</span>`),t.push(`<span for='sell' class='footer-item'>清理杂物</span>`),t.push(`<span for='cleanup' class='footer-item'>确定</span></div>`)):(t.push(this.target_name,e?`身上有`+e:`身上没有任何银两`),t.push(`<span for='cleanup' class='footer-item'>整理</span></div>`)),Dialog.footer(t.join(``))},cleanup_item:function(e,t){let n=$(t),r=n.parent().attr(`oindex`),i=n.attr(`cmd`);SendCommand(Dialog.pack2.command_before+` `+i+` `+r)},hide:function(){this.element.remove(),this.isShow=!1},show:function(){Dialog.isShow||Dialog.show(`pack2`),this.objelement&&(this.objelement.remove(),this.objelement=null,this.packElement&&this.packElement.show()),!this.isShow&&(this.isShow=!0,this.init_element(),this.packElement.on(`click`,`.obj-item`,this.item_click),this.eqElement.on(`click`,`.eq-item`,this.eqitem_click),this.element.appendTo(Dialog.contentElement))},item_click:function(e){let t=$(e.target);if(Dialog.pack2.packElement.is(`.cleanup`)&&t.is(`.obj-oper`))return Dialog.pack.item_cleanup(t);t=$(this);var n=t.attr(`oindex`);if(n){var r=Dialog.pack2.get_item(n);if(Dialog.pack2.element.find(`.item-commands`).remove(),r){I.LAST_OBJ=r;var i=[`<span class='item-commands'>`];i.push(`<span cmd="`+Dialog.pack2.command_before+` checkobj `+r.id+` from item">查看</span>`),Dialog.pack2.create_item_command(r,i),i.push(`</span>`),t=$(i.join(``)).insertAfter(t),D.checkScroll(t)}}},eqitem_click:function(){var e=Dialog.pack2.eqs[$(this).attr(`oindex`)];e&&SendCommand(Dialog.pack2.command_before+` checkobj `+e.id+` from eq`)}},master:{isShow:!1,init:function(){Dialog.skills.init(),this.createSkillItems=Dialog.skills.createSkillItems,this.createSkillItem=Dialog.skills.createSkillItem,this.updateSkill=Dialog.skills.updateSkill,this.updateSkillItem=Dialog.skills.updateSkillItem,this.showdesc=Dialog.skills.showdesc,this.isEnable=Dialog.skills.isEnable,this.close=Dialog.skills.close},hide:function(){if(this.skill_element)return this.skill_element.remove(),this.skill_element=null,this.element.removeClass(`hide-item`),Dialog.footer(``),!1;this.isShow=!1},onData:function(e){if(e.desc)return this.showdesc(e);if(e.id)return this.updateSkill(e);if(e.books)return this.showBooks();if(e.remove&&e.from===this.master){this.items.Remove(this.skills[e.remove]),this.skills[e.remove];for(var t=0;t<this.items.length;t++)this.items[t].enable_skill==e.remove&&(this.items[t].enable_skill=null);return delete this.skills[e.remove],this.createSkillItems(this.items)}if(!(!e.master&&!e.follower)){Dialog.show(`master`),this.master=e.master||e.follower,this.is_follower=!!e.follower;for(var n={},t=0;t<e.items.length;t++){var r=e.items[t];n[r.id]=r}if(this.skills=n,this.items=e.items,Dialog.title(e.title),Dialog.icon(`book`),this.createSkillItems(e.items,n),e.limit)if(this.is_follower){let t=[`<div class="footer-item select" for="0">`,`技能</div>`];t.push(`<div class="footer-item" for="1">书架</div>`),t.push(`<span class='obj-money'>`,e.target,`目前的技能上限为<HIC>`,e.limit,`</HIC>级</span>`),Dialog.footer(t.join(``))}else Dialog.footer(`<span class='obj-money'>你目前的技能上限为<HIC>`+e.limit+`</HIC>级</span>`)}},create_footer:function(){},selectedItem:0,footerChanged:function(e){if(e=parseInt(e),e!==this.selectedItem)if(this.selectedItem=e,e===0)this.element.removeClass(`dialog-books`),this.createSkillItems(this.items,this.skills);else return Dialog.skills.books?this.showBooks():SendCommand(`sbook`),this.element.addClass(`dialog-books`)},showBooks:function(){if(!(!this.isShow||!this.is_follower)){var e=[],t=Dialog.skills.sort_items(Dialog.skills.books);for(let n of t)e.push(`<div class="book-item `),e.push(`grade`,n.grade,`" >`),e.push(`<div class="book-name">`,n.name,`</div>`),e.push(`<div class="book-action border-right" cmd="sbook `,n.id,`">查看</div>`),e.push(`<div class="book-action" cmd="dc `,Dialog.master.master,` study `,n.id,`">学习</div>`),e.push(`</div>`);this.element.html(e.join(``))}},show:function(){this.isShow||=(this.element||=$(`<div class="dialog-skills"></div >`),this.element.on(`click`,`.skill-item`,this.item_click),this.element.appendTo(Dialog.contentElement),this.element.removeClass(`hide-item`),!0)},item_click:function(){var e=$(this),t=Dialog.master.skills[e.attr(`skid`)];if(!t)return;var n=[`<div class='item-commands'>`];if(n.push(`<span cmd="checkskill `+t.id+` `+Dialog.master.master+`">查看详细</span>`),n.push(`<span cmd="xue `+e.attr(`skid`)+` from `+Dialog.master.master+`">学习</span>`),t.master=1,Dialog.master.is_follower){var r=`dc `+Dialog.master.master;if(n.push(`<span cmd="_confirm `+r+` fangqi `+e.attr(`skid`)+`">遗忘</span>`),n.push(`<span cmd="`+r+` lianxi `+e.attr(`skid`)+`">练习</span>`),t.can_enables)for(var i=0;i<t.can_enables.length;i++){var a=Dialog.master.skills[t.can_enables[i]];a&&(a.enable_skill==t.id?n.push(`<span cmd="`+r+` enable `+a.id+` none">取消装备`+a.name+`</span>`):n.push(`<span cmd="`+r+` enable `+a.id+` `+t.id+`">装备`+a.name+`</span>`))}if(t.enable_skill){var o=Dialog.master.skills[t.enable_skill];o?n.push(`<span cmd="`+r+` enable `+t.id+` none">取消装备`+o.name+`</span>`):t.enable_skill=null}t.master=0}I.LAST_OBJ=t;let s=Dialog.extend.query(`mskill`,t);for(let e of s)n.push(`<span cmd="`,e.cmd,`">`,e.name,`</span>`);n.push(`</div>`),Dialog.master.element.find(`.item-commands`).remove(),$(n.join(``)).insertAfter(e),D.checkScroll(e)}},list:{init:function(){Dialog.pack.init()},hide:function(){this.element.remove(),this.isShow=!1},close:function(){this.hide()},updateitem:function(e){if(e.store){if(!this.stores||!this.isShow)return Dialog.pack.onData({remove:e.store,id:e.id});var t=this.find_item(1,e.id),n=this.find_item(3,e.storeid);t?t.count-=e.store:(t=Object.assign({},n),t.id=e.id,t.count=-e.store,Dialog.pack.items.push(t)),n?n.count+=e.store:(n=Object.assign({},t),n.id=e.storeid,n.count=e.store,this.stores.push(n)),this.store_count=e.sum??this.stores.length,n.count==0&&this.stores.Remove(n),t.count==0&&Dialog.pack.items.Remove(t)}else if(e.sell){var t=this.find_item(2,e.id);if(t)return t.count-=e.sell,this.create_items(this.selllist,this.leftElement,2,this.selllist.length)}this.isstore&&this.isShow&&(this.create_items(this.stores,this.leftElement,3,Math.max(this.max_store_count,100)),Dialog.title(`你的仓库中有`+this.store_count+`/`+this.max_store_count+`件物品`)),this.update_pack(),e.money!=null&&this.show_footer(e.money)},find_item:function(e,t){var n=Dialog.pack.items;e==2?n=this.selllist:e==3&&(n=this.stores);for(var r=0;r<n.length;r++)if(n[r].id==t)return n[r]},formatItems:function(e){let t=[];for(let n of e)t.push({name:n[0],id:n[1],count:n[2],grade:n[3],unit:n[4],value:n[5]});return t},onData:function(e){if(e.id)return this.updateitem(e);var t=e.gongji??e.jungong??e.yaoyuan??e.mvalue;e.selllist?(this.show(),this.isstore=!1,this.gongji=t,this.money_name=null,this.typeElement.hide(),this.selllist=this.formatItems(e.selllist),e.gongji>=0?this.money_name=`门派功绩`:e.jungong>=0?this.money_name=`军功`:e.yaoyuan>=0?this.money_name=`<ord>妖元</ord>`:this.money_name=e.mtype,this.create_items(this.selllist,this.leftElement,2,this.selllist.length),Dialog.titleElement.html(e.title),Dialog.icon(`shopping-cart`),e.seller&&(this.seller=e.seller),this.update_pack()):e.stores&&(this.show(),this.typeElement.show(),this.isstore=!0,this.stores=Dialog.pack.formatItems(e.stores),e.sum>0?(this.typeElement.show(),this.store_count=e.sum):(this.typeElement.hide(),this.store_count=e.stores.length),this.create_items(this.stores,this.leftElement,3,Math.max(e.max_store_count,100)),this.leftElement[0].scrollTop=0,Dialog.titleElement.html(`你的仓库中有`+this.store_count+`/`+e.max_store_count+`件物品`),this.max_store_count=e.max_store_count,Dialog.icon(`lock`),this.update_pack()),t>=0&&(this.gongji=t,this.show_footer(t))},show:function(e){if((!Dialog.isShow||Dialog.curItem!=`list`)&&Dialog.show(`list`),this.rightElement&&(this.rightElement.show(),Dialog.pack.objelement&&Dialog.pack.objelement.remove()),!this.isShow){if(!this.element){this.element=$(`<div class="dialog-list"><div class="otype-list"><div class="otype-item select" otype="0">道具</div><div class="otype-item"  otype="1">秘籍</div><div class="otype-item" otype="2">宝石</div><div class="otype-item" otype="3">资源</div><div class="otype-item" otype="4">装备</div></div><div class="trade-list"></div><div class="obj-list"></div></div >`);var t=this.element.children();this.typeElement=$(t[0]),this.typeElement.hide(),this.leftElement=$(t[1]),this.rightElement=$(t[2])}this.element.on(`click`,`.obj-item`,Dialog.list.item_click),this.element.on(`click`,`.otype-item`,Dialog.list.otype_click),this.element.appendTo(Dialog.contentElement.empty()),this.isShow=!0}},selected_type:0,otype_click:function(){let e=$(this).attr(`otype`),t=parseInt(e),n=Dialog.list;if(!n.stores||t===n.selected_type)return;let r=n.typeElement.children();$(r[n.selected_type]).removeClass(`select`),n.selected_type=parseInt(e),$(r[t]).addClass(`select`),SendCommand(`store `+t)},show_footer:function(e){e=this.money_name?this.gongji:e;let t=this.isstore?`store`:`sell`;if(this.isstore){var n=this.money_name?`你目前有`+e+`<hiy>`+this.money_name+`</hiy>`:`你身上有`+D.moneyToStr(e);Dialog.footerElement.html(`<div class='obj-money'>`+n+`<span cmd='`+t+` all'>存仓库</span></div>`)}else{var n=this.money_name?`你目前有`+e+`<hiy>`+this.money_name+`</hiy>`:`你身上有`+D.moneyToStr(e);Dialog.footerElement.html(`<div class='obj-money'>`+n+`<span cmd='`+t+` all'>清理杂物</span></div>`)}},update_pack:function(){var e=Dialog.pack.items;e?(this.create_items(e,this.rightElement,1,Dialog.pack.max_count),this.show_footer(Dialog.pack.money)):SendCommand(`pack`)},create_items:function(e,t,n,r){var i=[],a=e;(n===1||n===3)&&(a=Dialog.pack.sort_items(e));for(var o=0;o<r;o++){var s=a[o];i.push(`<div class="obj-item`),s?(i.push(s.is_lock?` lock`:``,` grade`,s.grade),i.push(`" obj="`),i.push(s.id),i.push(`" otype="`),i.push(n),i.push(`">`),n===1?(i.push(`<span class="grade`,s.grade,`">`),i.push(s.name),i.push(`</span>`)):i.push(s.name),i.push(`<span class='obj-value'>`),n==2?(i.push(`每`),i.push(s.unit),i.push(this.money_name?s.value+`<hiy>`+this.money_name+`</hiy>`:D.moneyToStr(s.value)),s.count==-1?i.push(`：大量现货`):(i.push(`：剩余`),i.push(s.count),i.push(s.unit))):n===1&&!this.isstore?s.value?(i.push(`每`),i.push(s.unit),i.push(D.moneyToStr(s.value)),i.push(`：`),i.push(s.count),i.push(s.unit)):i.push(`不可出售`):s.count>1&&(i.push(s.count),i.push(s.unit)),i.push(`</span>`)):i.push(`">`),i.push(`</div>`)}t.html(i.join(``))},item_click:function(){var e=$(this),t=e.attr(`obj`),n=e.attr(`otype`),r=Dialog.list.find_item(n,t);if(r){var i=[`<div class='item-commands'>`];Dialog.list.isstore?n==3?(i.push(`<span cmd="checkobj `+t+` from store">查看</span>`),i.push(`<span cmd="_confirm qu `+t+`">取出</span>`)):n==1&&(i.push(`<span cmd="checkobj `+t+` from item">查看</span>`),i.push(`<span cmd="_confirm store `+r.count+` `+t+`">存到仓库</span>`)):n==2?(i.push(`<span cmd="checkobj `+t+` from `+Dialog.list.seller+`">查看</span>`),r.count&&i.push(`<span cmd="_confirm buy `+r.count+` `+t+` from `+Dialog.list.seller+`">购买</span>`)):n==1&&(i.push(`<span cmd="checkobj `+t+` from item">查看</span>`),i.push(`<span cmd="_confirm sell `+r.count+` `+t+` to `+Dialog.list.seller+`">卖掉</span>`)),i.push(`</div>`),Dialog.list.element.find(`.item-commands`).remove(),e=$(i.join(``)).insertAfter(e),D.checkScroll(e)}}},show:function(e,t){if(!e)return;let n=this[e];if(!n)throw Error(`没有`+e);if(n.created||=(n.init(),!0),t)n.onData(t);else{if(this.isShow&&e==this.curItem)return this.hide();this.curItem&&e!=this.curItem&&(G[G.curItem].close&&G[G.curItem].close(),G[G.curItem].isShow=!1,G.contentElement.empty()),this.init(),this.curItem=e,n.show(t),Process.message.scroll2end()}},select:function(e){if(this.isShow&&e==this.curItem)return this.hide();this.curItem&&e!=this.curItem&&(G[G.curItem].close&&G[G.curItem].close(),G[G.curItem].isShow=!1,G.contentElement.empty()),this.init(),this.curItem=e},init:function(){this.isShow||=(this.isInit||=(this.contentElement=$(`.dialog>.dialog-content`),this.titleElement=$(`.dialog>.dialog-header>.dialog-title`),this.iconElement=$(`.dialog>.dialog-header>.dialog-icon`),this.footerElement=$(`.dialog>.dialog-footer`).on(`click`,`.footer-item`,G.footerClick),this.hiddenElement=$(`.hidden-item`),this.element=$(`.dialog`),$(`.dialog>.dialog-header>.dialog-close`).on(`click`,G.hide),!0),$(`.content-room`).addClass(`hide`),this.element.removeClass(`hide`),!0)},hide:function(){G[G.curItem].hide&&G[G.curItem].hide()==0||G.close()},footerClick:function(){var e=$(this);if(!e.is(`.select`)){var t=e.attr(`for`);e.parent().find(`.footer-item.select`).removeClass(`select`),e.addClass(`select`),G[G.curItem].footerChanged(t,e)}},title:function(e){G.titleElement.html(e)},icon:function(e){this.iconElement.attr(`class`,`dialog-icon glyphicon glyphicon-`+e)},footer:function(e){e?this.footerElement.html(e):this.footerElement.empty()},close:function(){G.isShow&&(G.isShow=!1,$(`.content-room`).removeClass(`hide`),G.element.addClass(`hide`))},injectStyle:function(e){let t=document.createElement(`style`);t.textContent=e,document.head.append(t)}},lt={size:3,max:666,container:null,pages:null,count:0,allow_scroll:!0,create:function(e,t=3,n=666){let r=Object.create(this);return r.container=e,r.pages=[],r.size=t,r.max=n,D.isMobile?e.on(`touchend`,this.stopDrag.bind(r)):e.on(`wheel`,this.stopDrag.bind(r)),r.scroll_button=$(`<div class="scroll-flag" style="display:none;"><span class="glyphicon glyphicon-chevron-down"></span></div>`),r.scroll_button.appendTo(e),r.scroll_button.on(`pointerup`,r.start_move.bind(r)),r},stopDrag:function(e){let t=this.is_end();t!==this.allow_scroll&&(this.allow_scroll=t,t&&this.scroll_button.hide())},start_move:function(){this.allow_scroll=!0,this.scroll_button.hide(),this.scroll2end()},push:function(e){let t=this.pages;t.length||t.push($(`<pre></pre>`).appendTo(this.container)),this.count>this.max&&(t.length>=this.size&&t.splice(0,1)[0].remove(),this.count=0,t.push($(`<pre></pre>`).appendTo(this.container))),t[t.length-1].append(e+`
`),this.count++},clear:function(){for(let e of this.pages)e.remove();this.pages.length=0,this.count=0},is_end:function(){let e=this.container[0],t=e.scrollHeight,n=e.clientHeight;return e.scrollTop+n>=t-50},scroll2end:function(){let e=this.container[0];if(!(e.scrollHeight<e.clientHeight)){if(!this.allow_scroll){let e=this.container[0].getBoundingClientRect();return this.scroll_button.show().css(`top`,e.bottom-this.scroll_button.height()-screenTop)}e.scrollTop=e.scrollHeight}}},K=class{constructor(e){this._filePath=e,this.$children=null,this.$parent=null,this.$el=null,this.id=null,this.template=``,this.css=``}filePath(){return this._filePath}mount(e,t){let n=document.createElement(`template`);n.innerHTML=this.render(t),e.append(n.content),this.$el=e.lastElementChild,this.on_mount&&this.on_mount(this.$el),this.$children&&this.$children.forEach(e=>{e.on_mount&&e.on_mount(e.id?document.getElementById(e.id):this.$el)})}render(e){return this.template}_injectStyle(){if(!this.css||this._style_dom)return;let e=document.createElement(`style`);e.textContent=this.css,document.head.append(e),this._style_dom=e}unmount(){this.$el&&this.$el.remove(),this.$el=null,this.on_unmount&&this.on_unmount(),this.$children&&this.$children.forEach(e=>{e.on_unmount&&e.on_unmount()}),this.$parent&&this.$parent.$children&&(this.$parent.$children=this.$parent.$children.filter(e=>e!==this)),this.$parent=null,this.$children=null}destroy(){this.on_destroy&&this.on_destroy(),this._style_dom&&this._style_dom.remove()}insert(e){if(!e)throw Error(`选项不能为空`);typeof e==`string`&&(e={url:e});let t=e.Class;if(!t)throw Error(`组件类不存在`);let n=new t;return this.$children||=[],this.$children.push(n),n.$parent=this,e.id&&(this[`$`+e.id]=n,n.id=e.id),n.render(e)}onCompile(){this._injectStyle()}},q={Login:function(e,t,n){return D.Post(`api/user/login`,{code:e,pwd:t},n)},IsRegistValidation:function(e){return D.Get(`UserAPI/IsRegistValidation`,e)},ValidationImage:function(e){return D.Get(`api/user/validimage`,e)},Regist:function(e,t){return D.Post(`api/user/regist`,e,t)},Enter:function(e,t){return D.Get(`e`,[e],t)},ChangePassword:function(e,t,n,r){return D.Post(`api/user/changepassword`,{oldpwd:e,pwd:t,no:n},r)},LoginOut:function(e){return D.Get(`UserAPI/LoginOut`,e)},GetRoles:function(e,t){return D.Get(`UserAPI/GetRoles`,[e],t)},AddRole:function(e,t){return D.Post(`UserAPI/AddRole`,{player:e},t)},GetUser:function(e){return D.Get(`UserAPI/GetUser`,e)},Search:function(e,t,n,r){return D.Get(`UserAPI/Search`,[e,t,n],r)},ResetPassword:function(e,t){return D.Get(`UserAPI/ResetPassword`,[e],t)},RecoverUser:function(e,t){return D.Get(`UserAPI/RecoverUser`,[e],t)},LoadPlayer:function(e,t,n){return D.Get(`UserAPI/LoadPlayer`,[e,t],n)},GetPhone:function(e){return D.Get(`api/user/getphone`,e)},BindPhone:function(e,t,n,r){return D.Post(`api/user/bindphone`,{code:e,no:t,pwd:n},r)},SendValidateCode:function(e,t){return D.Get(`UserAPI/SendValidateCode`,[e],t)},ResetPasswordByPhone:function(e,t,n,r,i){return D.Post(`api/user/resetpwd`,{name:e,phone:t,vcode:n,pwd:r},i)},NewServer:function(e){return D.Get(`UserAPI/NewServer`,e)},GetServer:function(e){return D.Get(`api/game/servers`,e)}},J=null,ut=class extends K{constructor(){super(),this.template=`
    <div id="slist_panel" class="mypanel" style="display:none">
            <ul>
                <li class="panel_item active">选择你要登录的游戏</li>
                <li class="content">
                    <ul class="server-list"></ul>
                </li>
                <li class="panel_item" command="SelectServer"><span class="glyphicon glyphicon-ok"></span><span
                        style="margin-left:0.5rem">选择服务器</span></li>
                <li class="panel_item" command="ToUpdate"><span class="glyphicon glyphicon-edit"></span><span
                        style="margin-left:0.5rem">修改密码</span></li>
                <li class="panel_item" command="BindPhone"><span class="glyphicon glyphicon-lock"></span><span
                        style="margin-left:0.5rem">绑定手机</span></li>
                <li class="panel_item" command="ReLogin"><span class="glyphicon glyphicon-chevron-left"></span><span
                        style="margin-left:0.5rem">返回登录</span></li>
            </ul>
        </div>
`}showServers(){if(!J){M(`正在获取服务器列表`),q.GetServer(e=>{if(!e||typeof e==`string`){A(`#login_pwd`,`获取服务器列表出错`);return}J=e,this.displayServer(e),this.showServers()});return}var e=J;if(!e||!e.length)j(`#login_panel`),A(`#login_pwd`,`获取服务器列表出错`);else{var t=D.GetUserCookie(`s`),n=t?J[t]:e.length==1?J[0]:null;if(n)return M(`正在连接服务器`),ce(n);j(`#slist_panel`)}}selectServer(){if(J){var e=parseInt($(`.server-list>.select`).attr(`index`));if(!(e>=0&&e<J.length))return N.Show({content:`你没有选择要连接的服务器。`});var t=J[e];t||N.Show({content:`你没有选择要连接的服务器。`}),M(`正在连接服务器`),ce(t),D.SetCookie(`s`,e)}}displayServer(){if(J){var e=location.hostname.startsWith(`127.0.0.1`)||location.hostname.startsWith(`localhost`),t=location.search.startsWith(`?test`);e&&J.push({id:100,name:`本地测试1`,ip:`127.0.0.1`,port:31300});for(var n=[],r=`武神传说2`,i=0;i<J.length;i++)!t&&!e&&J[i].istest||(n.push(`<li class='role-item`),i==0&&n.push(` select`),n.push(`' index='`+i+`'>`),n.push(r),n.push(`&nbsp;&nbsp;`),n.push(J[i].name),J[i].isdef&&n.push(`<span style='color:red;font-size:0.5rem;line-height:2rem;height:2rem;'>&nbsp;（推荐）</span>`),n.push(`</li>`));$(`.server-list`).html(n.join(``)).on(`click`,`li`,function(){var e=$(this);e.is(`.select`)||(e.parent().find(`.select`).removeClass(`select`),e.addClass(`select`))})}}},dt=class extends K{constructor(){super(),this.initReg=!1,this.template=`
     <div id="regist_panel" class="mypanel" style="display:none">
            <ul>
                <li class="panel_item active">注册用户</li>
                <li class="content">
                    <h3>你的用户名</h3>
                    <input type="text" id="regist_name" placeholder="请输入用户名" class="textbox" />
                    <h3>你的密码</h3>
                    <input type="password" id="regist_pwd1" placeholder="请输入密码" class="textbox" />
                    <h3>重复你的密码</h3>
                    <input type="password" id="regist_pwd2" placeholder="请输入密码" class="textbox" />
                    <div id="regist_valpanel">
                        <h3>请输入图片验证码</h3>
                        <div class="validnum-box">
                            <input type="text" id="regist_val" value="" placeholder="请输入图片验证码" class="textbox" />
                            <img src="" class="validnum-img" />
                        </div>
                    </div>
                </li>
                <li class="panel_item" command="Regist"><span class="glyphicon glyphicon-saved"></span><span
                        style="margin-left:0.5rem">确定</span></li>
                <li class="panel_item" command="ToLogin"><span class="glyphicon glyphicon-chevron-left"></span><span
                        style="margin-left:0.5rem">取消</span></li>
            </ul>
        </div>
`}on_mount(){}open(){this.initReg||=(this.GetValidationImage(),$(`.validnum-box>.validnum-img`).on(`click`,()=>this.GetValidationImage()),!0)}regist(){var e=$(`#regist_name`).val().toLowerCase(),t=$(`#regist_pwd1`).val();if(!e)return A(`#regist_name`,`请输入用户名`);if(!/^[a-z0-9]{5,15}$/.test(e))return A(`#regist_name`,`用户名需要是5-10个英文字符`);if(!t)return A(`#regist_pwd1`,`请输入密码`);if(t.length<6||t.length>20)return A(`#regist_pwd1`,`密码长度在6到20之间`);if(t!=$(`#regist_pwd2`).val())return A(`#regist_pwd2`,`重复密码输入不一致，请重新输入`);var n=$(`#regist_val`).val();if(!n)return A(`#regist_valpanel`,`请输入图片中的验证码`);if(n.length!=4)return A(`#regist_valpanel`,`请输入图片中的四位验证码`);let r=0,i=/u(\d+)/.exec(location.pathname);i&&(r=parseInt(i[1]),r>0||(r=0)),M(`正在注册账号`),q.Regist({name:e,pwd:t,valno:n,guider:r},e=>{e.code==1?(M(`注册成功，正在获取服务器列表`),setTimeout(()=>window.location.reload(),500)):(A(`#regist_name`,e.result||`注册失败`),j($(`#regist_panel`)))})}GetValidationImage(){q.ValidationImage(function(e){$(`.validnum-box>.validnum-img`).attr(`src`,`data:image/svg+xml;base64,`+e)})}},ft=`万俟司马上官欧阳夏侯诸葛闻人东方赫连皇甫尉迟公羊澹台公冶宗政濮阳淳于单于太叔申屠公孙仲孙轩辕令狐锺离宇文长孙慕容鲜于闾丘司徒司空丌官司寇子车颛孙端木巫马公西乐正公良拓拔夹谷谷梁梁丘左丘东门西门`,pt=`赵钱孙李周吴郑王冯陈楮卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎`,Y=`世舜丞主产仁仇仓仕仞任伋众伸佐佺侃侪促俟信俣修倝倡倧偿储僖僧僳儒俊伟列则刚创前剑助劭势勘参叔吏嗣士壮孺守宽宾宋宗宙宣实宰尊峙峻崇崈川州巡帅庚战才承拯操斋昌晁暠曹曾珺玮珹琒琛琩琮琸瑎玚璟璥瑜生畴矗矢石磊砂碫示社祖祚祥禅稹穆竣竦综缜绪舱舷船蚩襦轼辑轩子杰榜碧葆莱蒲天乐东钢铎铖铠铸铿锋镇键镰馗旭骏骢骥驹驾骄诚诤赐慕端征坚建弓强彦御悍擎攀旷昂晷健冀凯劻啸柴木林森朴骞寒函高魁魏鲛鲲鹰丕乒候冕勰备宪宾密封山峰弼彪彭旁日明昪昴胜汉涵汗浩涛淏清澜浦澉澎澔瀚瀛灏沧虚豪豹辅辈迈邶合部阔雄霆震韩俯颁颇频颔风飒飙飚马亮仑仝代儋利力劼勒卓哲喆展帝弛弢弩彰征律德志忠思振挺掣旲旻昊昮晋晟晸朕朗段殿泰滕炅炜煜煊炎选玄勇君稼黎利贤谊金鑫辉墨欧有友闻问`,X=`筠柔竹霭凝晓欢霄枫芸菲寒伊亚宜姬舒影荔枝思丽秀娟英华慧巧美娜静淑惠珠翠雅芝玉萍红娥玲芬芳燕彩春菊勤珍贞莉兰凤洁梅琳素云莲真环雪荣妹霞香月莺媛艳瑞凡佳嘉琼桂娣叶璧璐娅琦晶妍茜秋珊莎锦黛青倩婷姣婉娴瑾颖露瑶怡婵雁蓓纨仪荷丹蓉眉君琴蕊薇菁梦岚苑婕馨瑗琰韵融园艺咏卿聪澜纯毓悦昭冰爽琬茗羽希宁欣飘育滢馥`;function mt(e,t){t||=parseInt(Math.random()*2)+1;var n=[];if(t==2){var r=parseInt(Math.random()*ft.length);r%2==1&&--r,n.push(ft[r++]),n.push(ft[r])}else n.push(pt[parseInt(Math.random()*pt.length)]);return e==0?n.push(Y[parseInt(Math.random()*Y.length)]):n.push(X[parseInt(Math.random()*X.length)]),parseInt(Math.random()*4)>1&&(e==0?n.push(Y[parseInt(Math.random()*Y.length)]):n.push(X[parseInt(Math.random()*X.length)])),n.join(``)}function ht(){for(var e=`abcdefghijklmnopqrstuvwxyz`,t=`123456789`,n=[],r=parseInt(Math.random()*3)+3,i=0;i<r;i++)i<3?n.push(e[parseInt(Math.random()*e.length)]):n.push(t[parseInt(Math.random()*t.length)]);return n.join(``)}function gt(){for(var e=20,t=[],n=0;n<4;n++){var r=parseInt(Math.random()*15+1);e>=r?(n==3?r=e:e-=r,t[n]=r):(t[n]=e,e=0)}var i={};return i.str=t[0]+15,i.con=t[1]+15,i.dex=t[2]+15,i.int=t[3]+15,i}function _t(e){switch(e){case`name`:$(`#reg_name`).val(mt(+!$(`#gender_0`).is(`:checked`)));break;case`id`:$(`#reg_id`).val(ht());break;case`prop`:var t=gt();$(`#reg_str`).val(t.str),$(`#reg_con`).val(t.con),$(`#reg_dex`).val(t.dex),$(`#reg_int`).val(t.int);break}}var vt=class extends K{constructor(){super(),this.template=`
     <div id="role_panel" class="mypanel" style="display:none">
            <ul>
                <li class="panel_item active">选择你的角色</li>
                <li class="content">
                    <ul class="role-list"></ul>
                </li>
                <li class="panel_item" command="SelectRole"><span class="glyphicon glyphicon-ok"></span><span
                        style="margin-left:0.5rem">登陆</span></li>
                <li class="panel_item" command="AddRole"><span class="glyphicon glyphicon-plus"></span><span
                        style="margin-left:0.5rem">创建角色</span></li>
                <li class="panel_item" command="DeleteRole"><span class="glyphicon glyphicon-remove"></span><span
                        style="margin-left:0.5rem">删除角色</span></li>
                <li class="panel_item" command="ToServerPanel"><span
                        class="glyphicon glyphicon-chevron-left"></span><span style="margin-left:0.5rem">返回列表</span>
                </li>
                <li class="bottom">
                    <ul class="new-list">
                        <li nid="251026">10月27日重启更新预告</li>
                        <li nid="250928">国庆活动和更新说明</li>
                    </ul>
                </li>
            </ul>
        </div>
`}select(){var e=$(`.role-list>.select`);if(e.length){var t=e.attr(`roleid`);SendCommand(`login `+t),M(`正在进入游戏`,`#role_panel`)}}addRole(){if($(`.role-list>.role-item`).length>4)return N.Show({content:`你只能最多创建五个角色`});j($(`#addrole_panel`)),_t(`name`),_t(`prop`),_t(`id`)}delete(){var e=$(`.role-list>.select`);if(e.length){var t=e.attr(`roleid`);t&&N.Show({content:`是否确认删除角色：`+e.html(),onOK:function(){SendCommand(`deleterole `+t)}})}}},yt=class extends K{constructor(){super(),this.template=`
     <div id="reset_panel" class="mypanel" style="display:none;">
            <ul>
                <li class="panel_item active"><span>重置你的密码</span></li>
                <li class="content">
                    <h3>你的用户名</h3>
                    <input type="text" id="reset_name" value="" placeholder="请输入用户名，如果账号未绑定手机无法重置" class="textbox" />
                    <h3>你绑定的手机</h3>
                    <input type="text" id="reset_phone" placeholder="请输入你的手机号码" class="textbox" />
                    <h3 class="hide">接收到的验证码</h3>
                    <div class="validnum-box hide">
                        <input type="text" id="reset_no" placeholder="请输入六位验证码" class="textbox" />
                        <button class="validnum-btn ">发送验证码</button>
                    </div>
                    <h3>你新的密码</h3>
                    <input type="password" id="reset_pwd1" value="" placeholder="你新的密码" class="textbox" />
                    <h3>重复你的新密码</h3>
                    <input type="password" id="reset_pwd2" value="" placeholder="重复你的新密码" class="textbox" />
                </li>
                <li class="panel_item" command="ResetPwd"><span class="glyphicon glyphicon-edit"></span><span
                        style="margin-left:0.5rem">重置密码</span></li>
                <li class="panel_item" command="ToLogin"><span class="glyphicon glyphicon-chevron-left"></span><span
                        style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`}on_mount(){}reset(){var e=$(`#reset_name`).val();if(!e)return A(`#reset_name`,`请输入用户名`);if(!/^[a-z0-9]{5,15}$/.test(e))return A(`#reset_name`,`用户名格式错误,需要5-15位字母开头的字母，数字或下划线，不区分大小写`);var t=$(`#reset_phone`).val();if(!t)return A(`#reset_phone`,`请输入你的帐号绑定的手机号码`);if(!/^1\d{10}$/.test(t))return A(`#reset_phone`,`手机号码格式错误`);var n=``,r=$(`#reset_pwd1`).val();if(!r)return A(`#reset_pwd1`,`请输入你的新密码`);var i=$(`#reset_pwd2`).val();if(!i)return A(`#reset_pwd2`,`请重复输入你的新密码`);if(i.length<6||i.length>20)return A(`#update_pwd2`,`密码长度在6到20之间`);if(i!=r)return A(`#reset_pwd2`,`两次密码输入不一致`);M(`正在修改密码`,`#reset_panel`),q.ResetPasswordByPhone(e,t,n,r,function(e){e.code?j(`#login_panel`):(A(`#reset_pwd2`,e.result??`重置失败`),j(`#reset_panel`))})}},bt=class extends K{constructor(){super(),this.template=`
      <div id="pwd_panel" class="mypanel" style="display:none;">
            <ul>
                <li class="panel_item active"><span>修改密码</span></li>
                <li class="content">
                    <h3>输入你现在的密码</h3>
                    <input type="password" id="update_pwd1" value="" placeholder="输入你现在的密码" class="textbox" />
                    <div id="pwd_bind" style="display:none">
                        <h3>你绑定的手机</h3>
                        <input type="text" id="pwd_phone" placeholder="请输入你的手机号码" class="textbox" />
                        <h3>绑定的手机尾号</h3>
                        <div class="validnum-box">
                            <input type="text" id="pwd_no" placeholder="请输入四位尾号" class="textbox" />
                            <button class="validnum-btn hide">发送验证码</button>
                        </div>
                    </div>
                    <h3>你新的密码</h3>
                    <input type="password" id="update_pwd2" value="" placeholder="你新的密码" class="textbox" />
                    <h3>重复你的新密码</h3>
                    <input type="password" id="update_pwd3" value="" placeholder="重复你的新密码" class="textbox" />
                </li>
                <li class="panel_item" command="UpdatePwd"><span class="glyphicon glyphicon-edit"></span><span
                        style="margin-left:0.5rem">修改</span></li>
                <li class="panel_item" command="ToServerPanel"><span
                        class="glyphicon glyphicon-chevron-left"></span><span style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`}open(){j(`#pwd_panel`),q.GetPhone(function(e){if(e.code!==1)return A(`#update_pwd1`,`获取绑定的手机号失败`);e.result?($(`#pwd_phone`).prop(`disabled`,!0).val(e.result),$(`#pwd_bind`).show()):($(`#pwd_phone`).prop(`disabled`,!1).val(``),$(`#pwd_bind`).hide())})}update(){$(`#pwd_panel`).find(`.input-error`).remove();var e=$(`#update_pwd1`).val(),t=$(`#update_pwd2`).val(),n=$(`#update_pwd3`).val();if(e.length<6||e.length>20)return A(`#update_pwd1`,`密码长度在6到20之间`);if(t.length<6||t.length>20)return A(`#update_pwd2`,`密码长度在6到20之间`);if(n!=t)return A(`#update_pwd3`,`两次密码输入不一致`);var r;if($(`#pwd_bind`).is(`:visible`)&&(r=$(`#pwd_no`).val(),!r||!/^\d{4}$/.test(r)))return A($(`#pwd_no`).parent(),`请输入你绑定的手机尾号`);M(`正在修改密码`,`#pwd_panel`),q.ChangePassword(e,t,r,function(e){e.code?j($(`#slist_panel`)):(A(`#update_pwd1`,e.result||`修改失败`),j(`#pwd_panel`))})}},xt=class extends K{constructor(){super(),this.template=`
         <div id="bind_panel" class="mypanel" style="display:none;">
            <ul>
                <li class="panel_item active"><span>绑定手机</span></li>
                <li class="content">
                    <h3>你绑定的手机</h3>
                    <input type="text" id="phone_no" placeholder="请输入你的手机号码" class="textbox" />
                    <h3>绑定的手机尾号</h3>
                    <div class="validnum-box">
                        <input type="text" id="phone_valid" placeholder="请输入四位尾号" class="textbox" />
                        <button class="validnum-btn hide">发送验证码</button>
                    </div>
                    <h3>你的密码</h3>
                    <input type="password" id="phone_pwd" placeholder="请输入密码" class="textbox" />
                </li>
                <li class="panel_item" command="CheckValid"><span class="glyphicon glyphicon-edit"></span><span
                        style="margin-left:0.5rem">绑定</span></li>
                <li class="panel_item" command="ToServerPanel"><span
                        class="glyphicon glyphicon-chevron-left"></span><span style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`}bind(){j(`#bind_panel`),q.GetPhone(function(e){if($(`#phone_valid`).val(``),$(`#phone_pwd`).val(``),e.code!==1)return $(`.input-error`).html(e.result);$(`.input-error`).remove();let t=e.result;t?($(`#phone_no`).prop(`disabled`,!0).val(t),$(`#phone_valid`).parent().show().prev().show(),$(`#phone_no`).prev().html(`你已绑定手机，再次验证会取消绑定`),$(`#phone_no`).parent().next().find(`span:last()`).html(`解除绑定`)):($(`#phone_no`).prop(`disabled`,!1).val(``),$(`#phone_no`).prev().html(`你要绑定的手机(不验证，目前仅作为二级密码验证使用)`),$(`#phone_valid`).parent().hide().prev().hide(),$(`#phone_no`).parent().next().find(`span:last()`).html(`绑定`))})}check(){var e=$(`#phone_no`),t=``,n=``;if(e.is(`:disabled`)){if(n=$(`#phone_valid`).val(),!n)return A($(`#phone_valid`).parent(),`请输入你接收到的六位验证码`);if(!/^\d{4}$/.test(n))return A($(`#phone_valid`).parent(),`请输入六位数字的验证码`)}else{if(t=e.val(),!t)return A(`#phone_no`,`请输入你的帐号绑定的手机号码`);if(!/^1\d{10}$/.test(t))return A(`#phone_no`,`手机号码格式错误`)}var r=$(`#phone_pwd`).val();if(!r)return A(`#phone_pwd`,`请重复输入你的新密码`);if(r.length<6||r.length>20)return A(`#phone_pwd`,`密码长度在6到20之间`);q.BindPhone(n,t,r,function(e){e.code<1?(A($(`#phone_valid`).parent(),e.result??`绑定失败`),j(`#bind_panel`)):j(`#role_panel`)})}};window.RefreshInput=_t;var St=class extends K{constructor(){super(),this.template=`


        <div class="mypanel" id="addrole_panel">
            <ul>
                <li class="panel_item active">创建你的角色卡</li>
                <li class="content">
                    <div class="input-error"></div>
                    <div>
                        <h3 class="regist-title-text">你的称呼，2-5个中文字符</h3><span onclick="RefreshInput('name');"
                            class="glyphicon glyphicon-refresh regist-title-ref"></span>
                    </div>
                    <div>
                        <input type="text" placeholder="请输入姓名" id="reg_name" class="textbox" style="width:250px;" />
                    </div>
                    <h3>你的性别</h3>
                    <div>
                        <label><input type="radio" name="role_gander" id="gender_0" checked="checked" />男</label>
                        <label><input type="radio" name="role_gander" />女</label>
                    </div>
                    <div>
                        <h3 class="regist-title-text">你的先天属性</h3><span
                            class="glyphicon glyphicon-refresh regist-title-ref" onclick="RefreshInput('prop');"></span>
                    </div>
                    <table>
                        <tr>
                            <td style="width:5rem">臂力：<span class="glyphicon glyphicon-exclamation-sign"
                                    style="color:#bbbbbb" data-container="body" data-toggle="popover"
                                    data-trigger="hover" data-content="影响人物的攻击力，招架等"></span></td>
                            <td style="width:5rem"><input type="text" id="reg_str" class="hide_txt" value="20" /></td>
                            <td style="width:5rem">根骨：<span class="glyphicon glyphicon-exclamation-sign"
                                    style="color:#bbbbbb" data-container="body" data-toggle="popover"
                                    data-trigger="hover" data-content="影响人物的内力上限，气血，防御等"></span></td>
                            <td><input type="text" id="reg_con" class="hide_txt" value="20" /></td>
                        </tr>
                        <tr>
                            <td style="width:2.5rem">身法：<span class="glyphicon glyphicon-exclamation-sign"
                                    style="color:#bbbbbb" data-container="body" data-toggle="popover"
                                    data-trigger="hover" data-content="影响人物的躲闪，暴击等属性"></span></td>
                            <td style="width:5rem"><input type="text" id="reg_dex" class="hide_txt" value="20" /></td>
                            <td style="width:2.5rem">悟性：<span class="glyphicon glyphicon-exclamation-sign"
                                    style="color:#bbbbbb" data-container="body" data-toggle="popover"
                                    data-trigger="hover" data-content="影响人物对技能的领悟速度等"></span></td>
                            <td style="width:5rem"><input type="text" id="reg_int" class="hide_txt" value="20" /></td>
                        </tr>
                    </table>
                    <div style="margin:0.5rem 0px;color:#999999">需要在15-30之间，并且总和等于80</div>
                </li>
                <li class="panel_item" command="CreateRole"><span class="glyphicon glyphicon-saved"></span><span
                        style="margin-left:0.5rem">创建</span></li>
                <li class="panel_item" command="ToRolePanel"><span class="glyphicon glyphicon-off"></span><span
                        style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`}create(){var e={};if(e.name=$(`#reg_name`).val(),e.gender=$(`#gender_0`).is(`:checked`)?1:2,e.str=parseInt($(`#reg_str`).val()),e.con=parseInt($(`#reg_con`).val()),e.dex=parseInt($(`#reg_dex`).val()),e.int=parseInt($(`#reg_int`).val()),!/^[\u4E00-\u9FA5]{2,5}$/.test(e.name))return A(`#reg_name`,`名称格式错误，只能使用2-5位中文字符`);if(e.str<15||e.str>30)return A(`#reg_name`,`臂力需要在15-30之间`);if(e.con<15||e.con>30)return A(`#reg_name`,`根骨需要在15-30之间`);if(e.dex<15||e.dex>30)return A(`#reg_name`,`身法需要在15-30之间`);if(e.int<15||e.int>30)return A(`#reg_name`,`悟性需要在15-30之间`);if(e.str+e.con+e.dex+e.int!=80)return A(`#reg_name`,`先天属性需要在15-30之间，并且总和等于80`);M(`正在创建角色`,`#addrole_panel`),SendCommand(`createrole `+e.name+` `+e.gender+` `+e.str+` `+e.con+` `+e.dex+` `+e.int)}},Ct=class extends K{constructor(){super(),this.template=`
        <div id="new_panel" class="mypanel" style="display:none">
            <ul>
                <li class="content" style="height:20rem;">
                    <iframe frameborder="0" id="news_frame" width="100%" height="100%"></iframe>
                </li>
                <li class="panel_item" command="ToRolePanel"><span class="glyphicon glyphicon-chevron-left"></span><span
                        style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`}},wt=`data:image/gif;base64,R0lGODlhHgAeAOUAAQAAAAAAmQBmmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgA/ACwAAAAAHgAeAEUGRMCfcEgsGo/IpHJJBDifUIGASa1ar0lodIrter/gsPi3BWu1Uu/ZmR673/C4fE7PrtvY9RNv1bO5eXeAanuDdYeIiWIAACH5BAkKAD8ALAoACgAOAAoARQYlwJ8QQAQIjgLhsMhEJplQI/IXJTqpVes0e81qj17pERu9KptTIQAh+QQJCgA/ACwKAAoAEQAKAEUGK8CfEEAECH+CpOD4KzoBymjz6Ywqp1RrEkuFarnVb7eoFYyJZTD5e3QepUIAIfkECQoAPwAsCgAKABQACgBFBjLAnxBABAiPP4FSgCw6jcml9Pd8Sq/MKlGIVVK1xO7yW+V2yVqxEhxWo51mbLOIjDOFAAAh+QQJCgA/ACwKAAoADgAKAEUGJcCfEEAECI4C4bCIbCaLRmfzB5UeqUzrtWrFErVHrtYblSrJUyEAIfkECQoAPwAsCgAKAAwACgBFBiDAnxAAEBgFwmHxyPwRmVDkMypdUqtXp5U6zXahSW1TCAAh+QQJCgA/ACwKAAoACgAKAEUGGsCfUEAUCIfF5C/JNDaJyydUGpVanc9j1SgEACH5BAkKAD8ALAgACgAMAAoARQYhwJ9QQBQAAMJhcXn8LZ9GJJTYnBarU6z1aKVKs8gkM/wDACH5BAkKAD8ALAYACgAOAAoARQYlwJ9QQBQAjgDhsMhEJplQI/IXJTqpVes0e81qj17pERu9KptTIQAh+QQJCgA/ACwAAAoAFAAKAEUGMsCfUEAUCI8/gBKALDqNyaX093xKr8wqUYhVUrXE7vJb5XbJWrESHFajnWZss4iMM4UAACH5BAkKAD8ALAMACgARAAoARQYrwJ9QQBQIf4Ak4PgrOpXQpbMYjTangmryOtUquU8tmOoFYLPlMdHLdB6hRwAh+QQJCgA/ACwGAAoADgAKAEUGJcCfUEAUAI4A4bCIbCaLRmfzB5UeqUzrtWrFErVHrtYblSrJUyEAIfkECQoAPwAsCAAKAAwACgBFBiDAn1AgABgBwmHxyPwRmVDkMypdUqtXp5U6zXahSW1TCAA7Cg==`,Tt=new ut,Et=class extends K{constructor(){super(),this.template=`
 <div class="login-content">
        <div id="loader" class="loader hide"><img src="${wt}" alt="" /><span id="loader_msg">正在登陆</span></div>
        <div class="error hide"></div>
        <div id="login_panel" class="mypanel" style="display:none;">
            <ul>
                <li class="panel_item active">
                    <span>欢迎登陆</span>
                </li>
                <li class="content">
                    <h3>你的用户名</h3>
                    <input type="text" id="login_name" value="" placeholder="请输入用户名" class="textbox" />
                    <h3>你的密码</h3>
                    <input type="password" id="login_pwd" value="" placeholder="请输入密码" class="textbox" />
                </li>
                <li class="panel_item" command="LoginIn"><span class="glyphicon glyphicon-log-in"></span><span
                        style="margin-left:0.5rem">登陆</span></li>
                <li class="panel_item" command="ToRegist"><span class="glyphicon glyphicon-edit"></span><span
                        style="margin-left:0.5rem">注册</span></li>
                <li class="panel_item" command="Forget"><span class="glyphicon glyphicon-question-sign"></span><span
                        style="margin-left:0.5rem">忘记密码</span></li>
            </ul>
        </div>
`}relogin(){j($(`#login_panel`));var e=new Date;e.setTime(-1e3);for(var t=document.cookie.split(`; `),n=0;n<t.length;n++){var r=t[n].split(`=`);document.cookie=r[0]+`=''; expires=`+e.toGMTString()}}loginIn(){var e=$(`#login_name`).val().toLowerCase(),t=$(`#login_pwd`).val();if(!e)return A(`#login_name`,`请输入用户名`);if(!/^[a-z0-9]{5,15}$/.test(e))return A(`#login_name`,`用户名格式错误,需要5-15位字母开头的字母，数字或下划线，不区分大小写`);if(!t)return A(`#login_pwd`,`请输入密码`);if(t.length<6||t.length>20)return A(`#login_pwd`,`密码长度在6到20之间`);M(`正在登录`,`#login_panel`),q.Login(e,t,e=>{e.code?Tt.showServers():(A(`#login_name`,e.result||`登陆失败`),j(`#login_panel`))})}},Dt=new ut,Ot=new Et,kt=new dt,At=new vt,jt=new yt,Mt=new bt,Nt=new xt,Pt=new St,Z=new Ct;function Ft(){let e=$(this).attr(`nid`);j($(`#new_panel `)),$(`#news_frame`).attr(`src`,`/news/`+e+`.html`)}var It=class extends K{constructor(){super(),this.template=`

        ${Ot.template}

        ${Dt.template}
        ${Nt.template}

        ${Mt.template}
        ${jt.template}
        
       ${kt.template}
       ${At.template}
       ${Z.template}
       ${Pt.template}
        <div class="signinfo">©2017 武神传说 </div>
    </div>
`}on_mount(){if($(`.login-content`).on(`click`,`.panel_item`,e=>this.LoginCommand(e)),$(`.role-list`).on(`click`,`.role-item`,function(){$(this).parent().find(`.select`).removeClass(`select`),$(this).addClass(`select`)}),$(`.new-list>li`).on(`click`,Ft),!D.GetUserCookie(`p`))return $(`#login_panel`).show();Dt.showServers()}LoginCommand(e){switch($(e.currentTarget).attr(`command`)){case`ToRolePanel`:j($(`#role_panel`));break;case`ToServerPanel`:pe(),j($(`#slist_panel`));break;case`ToLogin`:j($(`#login_panel`));break;case`Forget`:j($(`#reset_panel`));break;case`CancleRegist`:j($(`#login_panel`));break;case`Down`:j($(`#download`));break;case`ToRegist`:j($(`#regist_panel`)),kt.open();break;case`Regist`:kt.regist();break;case`SelectServer`:Dt.selectServer();break;case`LoginIn`:Ot.loginIn();break;case`ResetPwd`:jt.reset();break;case`AddRole`:At.addRole();break;case`SelectRole`:At.select();break;case`CreateRole`:Pt.create();break;case`BindPhone`:Nt.bind();break;case`CheckValid`:Nt.check();break;case`UpdatePwd`:Mt.update();break;case`ToUpdate`:Mt.open();break;case`ReLogin`:Ot.relogin();break;case`DeleteRole`:At.delete();break}}},Lt=()=>$(`.content-message`),Rt={append:e=>$(`.content-message`).append(e)},Q={itemsElement:null,contentScroll:!0,message:null,channel:null,relogin(){j(`#login_panel`)},clear:function(){Dialog.pack.items=null,Dialog.skills.items=null,this.state(null)},init:function(){Q.itemsElement=$(`.room_items`),this.message=lt.create($(`.content-message`)),this.ChannelElement=$(`.channel`),this.ChannelElement.on(`click`,Dialog.channel.show.bind(Dialog.channel)),this.channel=lt.create(this.ChannelElement,4,200)},startMoveMessage:function(e){window.addEventListener(`mousemove`,Q.moveMessage),window.addEventListener(`mouseup`,Q.endMoveMessage),Q.mouseY=e.clientY},moveMessage:function(e){let t=Q.mouseY-e.clientY,n=Lt(),r=n[0],i=n.height(),a=r.style.marginBottom;if(a=a?parseInt(a.replace(`px`,``)):0,a+=t,a<0)a=0;else if(a>i*.7)return;r.style.marginBottom=a+`px`,Q.mouseY=e.clientY,e.preventDefault()},endMoveMessage:function(){window.removeEventListener(`mousemove`,Q.moveMessage),window.removeEventListener(`mouseup`,Q.endMoveMessage)},regist:function(e){e.result&&(j(`#addrole_panel`),$(`#addrole_panel .input-error`).html(e.result))},emote:function(e){Q.emotes=e.items||0;for(var t=[],n=0;n<Q.emotes.length;n++)t.push(`<span>`),t.push(Q.emotes[n]),t.push(`</span>`);$(`.channel-emotes`).html(t.join(``))},deleterole:function(e){if(e.result){var t=$(`#role_panel>ul>.content>.role-list>.role-item[roleid='`+e.id+`']`);t.remove();var n=$(`#role_panel>ul>.content>.role-list>.role-item`);t.is(`.select`)&&n.length?$(n[0]).addClass(`select`):n.length||At.addRole()}else Confirm.Show({content:`<span class='input-error'>`+(e.message||`删除失败`)+`</span>`})},cross:function(e){for(var t=null,n=0;n<J.length;n++)J[n].ID==e.sid&&(t=J[n]);t&&(O.ChangeServer=!0,O.Close(),Dialog.pack.items=null,e.cross_type==`duizhan`&&(Dialog.skills.items=null,Dialog.skills.isShow=!1),console.log(`重新连接到`,t.Name),e.pid||Q.die({relive:!0}),ce(t,e.pid))},roles:function(e){var t=e.roles;if(!t.length)At.addRole();else{j(`#role_panel`);for(var n=[],r=0;r<t.length;r++)n.push(`<li class='role-item`),r==0&&n.push(` select`),n.push(`' roleid='`+t[r].id+`'>`),n.push(t[r].title),n.push(`&nbsp;&nbsp;`),n.push(t[r].name),n.push(`</li>`);$(`.role-list`).html(n.join(``))}},loginerror:function(e){$(`.container`).hide(),$(`.login-content`).show(),M(`<strong>登陆失败：</strong>`+e.msg)},login:function(e){Q.player||j(`.container`),Q.player=e.id,Q.level=e.level,L.load(e.setting),de()},levelup:function(e){Q.level=e.level},selectItem:function(e){if($(e.target).is(`.status-item`)){var t=e.target.getAttribute(`sid`);let n=$(e.target).closest(`.room-item`).attr(`itemid`);return t?n===Q.player?ue(`status `+t):ue(`status `+t+` `+n):void 0}var n=$(this).attr(`itemid`);if(console.log(n),n){if(n==Q.player){var r=$(this).find(`.item-name`).html(),i=[{cmd:`look `+n,name:`查看`},{cmd:`dazuo`,name:`打坐`},{cmd:`liaoshang`,name:`疗伤`}];Dialog.team.items&&Dialog.team.items.length&&(i.push({cmd:`team out`,name:`退出队伍`}),Dialog.team.isCap&&(i.push({cmd:`team dismiss`,name:`解散队伍`}),i.push({cmd:`team set`,name:`更改分配方式`}))),Q.item({id:n,name:r,me:1,desc:r,commands:i});return}ue(`select `+n)}},countwidth:function(e,t){var n=e*100/t;return n<0&&(n=0),n>100&&(n=100),n},itemremove:function(e){var t=z.STATUS[e.id];if(t){for(var n in t.items)clearInterval(t.items[n].handler);var r=t.elem.parent();r.next().is(`.item-commands`)&&r.next().remove(),r.remove(),delete z.STATUS[e.id]}Q.cur_room.items.RemoveAt(t=>t.id===e.id)},itemadd:function(e){if(!(L.off_plist&&e.p&&e.id!=Q.player)){var t=e,n=L.item_firstme&&t.id==Q.player?$(Q.create_roomitem(t)).prependTo(Q.itemsElement):$(Q.create_roomitem(t)).appendTo(Q.itemsElement);z.STATUS[e.id]&&Q.itemremove(e),z.AppendStatusItem(t.id,n.find(`.item-status-bar`),t.status),Q.cur_room.items.push(t)}},items:function(e){Q.itemsElement.empty(),z.STATUS={};for(var t=0;t<e.items.length;t++){var n=e.items[t];if(n&&(n.player=n.p,n.m&&(n.type=`师父`,n.master=1),n.f&&(n.type=`随从`,n.follower=1),n.l&&(n.type=`商人`,n.trader=1),!(L.off_plist&&n.p&&n.id!=Q.player))){var r=L.item_firstme&&n.id==Q.player?$(Q.create_roomitem(n)).prependTo(Q.itemsElement):$(Q.create_roomitem(n)).appendTo(Q.itemsElement);z.AppendStatusItem(n.id,r.find(`.item-status-bar`),n.status)}}Q.cur_room||={},Q.cur_room.items=e.items},get_hpnum:function(e,t){var n=e/t;return n>.8?`<hiy>`+e+`</hiy>`:n>.5?`<yel>`+e+`</yel>`:n>.2?`<red>`+e+`</red>`:`<hir>`+e+`</hir>`},create_roomitem:function(e){var t=[];return t.push(`<div class='room-item' itemid='`+e.id+`'>`),e.max_hp&&(t.push(`<div class="item-status"`),(!z.IsShow||L.off_hp)&&t.push(` style="display:none;"`),t.push(`>`),t.push(`<div class="progress hp"><div class="progress-bar" max="`+e.max_hp+`"  style="width:`+Q.countwidth(e.hp,e.max_hp)+`%"></div></div>`),t.push(`<div class="progress mp"><div class="progress-bar" max="`+e.max_mp+`"   style="width:`+Q.countwidth(e.mp,e.max_mp)+`%"></div></div>`),t.push(`</div>`)),t.push(`<span class='item-status-bar'>`),t.push(`</span>`),t.push(`<span class='item-name'>`),t.push(e.name),L.show_hpnum&&e.max_hp&&t.push(`<span class="progress-num">[`+this.get_hpnum(e.hp,e.max_hp)+`<nor>/</nor><hiy>`+e.max_hp+`</hiy>]</span>`),t.push(`</span>`),t.push(`</div>`),t.join(``)},room:function(e){$(`.room_items`).html(``),$(`.room-name`).html(e.name),$(`.room_desc`).html(e.desc),Q.room_name=e.name,L.keep_msg?L.keep_msg&&zt(`你来到了`+e.name+`。`):Q.message.clear(),Q.room_path!=e.path&&(L.show_roomitem&&Q.searchItems(e),z.ShowRoomCommands(e),Q.room_path=e.path,Q.cur_room=e,F.SetRoom(e))},roomHiddenItemsReg:/<\w{3}\scmd=['"](.+?)['"]>(.+?)<\/\w{3}>/g,searchItems:function(e){for(var t=null,n=e.desc;(t=this.roomHiddenItemsReg.exec(n))!==null;)e.commands.push({cmd:t[1],name:t[2]})},exits:function(e){var t=e?e.items:Q.room_exits;if(t)if(Q.room_exits=t,L.exits_dir==1){for(var n=[`这里明显的出口有：`],r=[],i=0;i<F.DIRS.length;i++)t[F.DIRS[i]]&&r.push(F.DIRS[i]);for(var i=0;i<r.length;i++)i>0&&n.push(i==r.length-1?` 和 `:`、`),n.push(`<span class='exits-item' dir='`+r[i]+`'>`+r[i]+`</span>`);r.length?$(`.room_exits`).html(n.join(``)):$(`.room_exits`).html(`<HIK>这里没有明显的出口。<HIK>`)}else $(`.room_exits`).html(F.CreateExitsMap(t,$(`.container`).width(),Q.room_name))},before_click_exits:function(e){var t=$(e.target);t.attr(`dir`)&&(t.is(`rect`)?t.attr(`fill`,`gray`):t.is(`text`)&&t.prev().attr(`fill`,`gray`))},click_exits:function(e){var t=$(e.target),n=t.attr(`dir`);n&&(t.is(`rect`)?t.attr(`fill`,`#232323`):t.is(`text`)&&t.prev().attr(`fill`,`#232323`),ue(`go `+n))},query_rmitem:function(e){for(let t of this.cur_room.items)if(t.id===e)return t},item:function(e){zt(e.desc),e.commands=e.commands??[];let t=Q.query_rmitem(e.id);t&&(e=Object.assign(e,t)),I.LAST_OBJ=e,Dialog.extend.append(e.commands,`item`,e);for(var n=[`<div class='item-commands'>`],r=0;r<e.commands.length;r++)n.push(`<span cmd='`+e.commands[r].cmd+`'>`),n.push(e.commands[r].name),n.push(`</span>`);if(n.push(`</div>`),L.show_command&&z.STATUS[e.id]){Q.itemsElement.find(`.item-commands`).remove();var i=z.STATUS[e.id].elem.parent();return $(n.join(``)).insertAfter(i),Q.message.scroll2end()}zt(n.join(``))},actions:function(e){z.ShowActions(e)},cmds:function(e){if(e.items){var t=[`<div class='item-commands'>`];e.items.length||(e.items=[e.items]);for(var n=0;n<e.items.length;n++)t.push(`<span cmd='`+e.items[n].cmd+`'>`),t.push(e.items[n].name),t.push(`</span>`);t.push(`</div>`),zt(t.join(``))}},map:function(e){F.SetMapBuffer(e.map,e.path),F.ShowMap(e.map,e.path)},updatemap:function(e){F.UpdateMap(e.map,e)},dialog:function(e){Dialog.show(e.dialog,e)},sc:function(e){z.StatusChanged(e)},perform:function(e){z.ShowPFM(e)},disobj:function(e){z.DisObj(e)},changepfm:function(e){z.ChangeDistime(e)},clearDistime:function(e){z.ClearDistime(e)},pay:function(e){if(e.pay===3){zt(`<yel>请打开微信扫描二维码支付：</yel>
`);let t=$(`<div style="width:100%;text-align:center;"><img style="border:solid 2px #808088" src="`+e.url+`"/></div>`);t.children(0).on(`load`,function(){zt(``)}),Rt.append(t)}else window.location.href=e.url},dispfm:function(e){z.On_Perform(e)},status:function(e){z.StatusItemChanged(e)},combat:function(e){e.start&&(L.auto_showcombat==1&&!z.IsShow&&z.Show(),L.auto_hideroom==1&&(L.hide_roomdesc||$(`.room_desc`).hide())),e.end&&L.auto_hideroom==1&&(L.hide_roomdesc||$(`.room_desc`).show())},state:function(e){if(e&&e.state){var t=[`<span class='title'>`+e.state+`</span>`];if(e.commands)for(var n=0;n<e.commands.length;n++)t.push(`<span class='item-command' cmd='`+e.commands[n].cmd+`'>`),t.push(e.commands[n].name),t.push(`</span>`);$(`.state-bar`).html(t.join(``)).css(`visibility`,`visible`),e.no_stop?$(`.state-tool`).hide():$(`.state-tool`).show(),Q.states=e.desc,Q.timer&&clearInterval(Q.timer),Q.states&&Q.states.length&&(typeof Q.states==`string`&&(Q.states=[Q.states]),Q.timer=setInterval(Q.updatestate,e.interval||5e3))}else $(`.state-bar`).empty().css(`visibility`,`hidden`),$(`.state-tool`).hide(),clearInterval(Q.timer)},updatestate:function(){if(Q.states&&le()){var e=Q.states.length;zt(Q.states[parseInt(Math.random()*e)])}},die:function(e){if(e.relive)return Q.state({});Q.state({state:`<hiw>你已经死亡：</hiw>`,no_stop:!0,desc:[`<blk>一股阴冷的气息包围着你。</blk>`,`<blu>朦胧中你好像听到有人在喊：过来吧，过来吧！</blu>`],commands:e.commands,interval:12e3})},warn:function(e){Warn.Show(e)},msg:function(e){var t=Dialog.channel.createElement(e,!L.no_spmsg);t&&(L.no_spmsg?zt(t):(Q.channel.push(t),Q.channel.scroll2end()))},addAction:function(e){z.AddObj(e.id,e.name,e.distime)},removeAction:function(e){z.DisObj({id:e.id,remove:!0})}};function zt(e){Q.message.push(e),Q.message.scroll2end()}var Bt=!1,Vt=class extends K{constructor(){super(),this.template=`
    <div class="container" style="display:none;">
        <div class="dialog hide">
            <div class="dialog-header">
                <span class="dialog-icon glyphicon glyphicon-map-marker"></span>
                <span class="dialog-title"></span>
                <span class="dialog-close glyphicon glyphicon-remove-circle"></span>
            </div>
            <div class="dialog-content"></div>
            <div class="dialog-footer "></div>
        </div>
        <div class="content-room">
            <div class="map-panel"></div>
            <div class="room-title">
                <span class="room-name"></span><span class='glyphicon glyphicon-map-marker map-icon'></span>
            </div>
            <div style="text-indent: 2em;" class="room_desc"></div>
            <div style="text-indent: 2em;" class="room_exits"></div>
            <div class="room_items" style="max-height: 8rem; overflow-y: auto;"></div>
        </div>
        <div class='channel'></div>
        <div class="content-message"></div>
        <div class="tool-bar bottom-bar">
            <span class="state-bar" command="stateinfo" style="visibility:hidden"><span class="title"></span></span>
            <span command="stopstate" class="tool-item state-tool" style="display:none;"><span
                    class="glyphicon glyphicon-off tool-icon"></span><span class="tool-text">停止</span></span>
            <span command="showchat" class="tool-item"><span
                    class="glyphicon glyphicon-volume-down tool-icon"></span><span class="tool-text">聊天</span></span>
            <span command="events" class="tool-item"><span class="glyphicon glyphicon-dashboard tool-icon"></span><span
                    class="tool-text">活动</span><span class="tag hide"></span></span>
            <span command="showcombat" class="tool-item"><span class="glyphicon glyphicon-flash tool-icon"></span><span
                    class="tool-text">动作</span></span>
            <span command="showtool" class="tool-item br-tool hide-tool"></span>
            <div class="tool-bar right-bar">
                <span command="setting" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-cog tool-icon"></span><span class="tool-text">设置</span></span>
                <span class="tool-item" command="jh" style="display:none"><span
                        class="glyphicon glyphicon-home tool-icon"></span><span class="tool-text">江湖</span></span>
                <span command="stats" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-stats tool-icon"></span><span class="tool-text">排行</span></span>
                <span command="message" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-envelope tool-icon"></span><span class="tool-text">社交</span><span
                        class="tag hide"></span></span>
                <span command="shop" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-shopping-cart tool-icon"></span><span
                        class="tool-text">商城</span></span>
                <span command="tasks" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-exclamation-sign tool-icon"></span><span
                        class="tool-text">任务</span><span class="tag hide"></span></span>
                <span command="skills" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-book tool-icon"></span><span class="tool-text">技能</span></span>
                <span command="pack" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-briefcase tool-icon"></span><span class="tool-text">背包</span></span>
                <span class="tool-item" command="score" style="display:none"><span
                        class="glyphicon glyphicon-user tool-icon"></span><span class="tool-text">属性</span></span>
            </div>
        </div>
        <div class="custom-panel"></div>
        <div class="content-bottom">
            <div class="combat-panel hide">
                <div class="room-commands"></div>
                <div class="combat-commands"></div>
            </div>
        </div>
        <div class="chat-panel hide">
            <div class="channel-box" channel="chat">
                <span class="selected" channel="chat">世界</span>
                <span channel="tm">组队</span>
                <span channel="fam">门派</span>
                <span channel="say">房间</span>
                <span channel="es">全区</span>
                <span channel="pty">帮派</span>
                <span channel="emote">表情</span>
            </div>
            <div class="chat-input">
                <input class="sender-box" />
                <span class="glyphicon glyphicon-send sender-btn"></span>
            </div>
            <div class="channel-emotes hide"></div>
        </div>
    </div>
`}on_mount(){$(`.container`).on(`click`,Zt),$(`.channel-box`).on(`click`,`span`,Yt),$(`.combat-commands`).on(`click`,`.pfm-item`,z.Perform).on(`wheel`,z.Scroll),$(`.room-commands`).on(`wheel`,z.Scroll),$(`.sender-box`).on(`keyup`,qt),$(`.room_items`).on(`click`,`.room-item`,Q.selectItem),$(`.bottom-bar`).on(`click`,`.tool-item,.state-bar,.item-command`,Wt),$(`.map-panel`).on(`click`,Ut),$(`.sender-btn`).on(`click`,Jt),$(`.room_exits`).on(`pointerdown`,Q.before_click_exits).on(`pointerup`,Q.click_exits),$(`.room-title>.map-icon`).on(`click`,F.LoadMap.bind(F))}},Ht=0;function Ut(){if(Ht||=0,Date.now()-Ht>500){Ht=Date.now();return}G.show(`map`)}function Wt(e){var t=$(this).attr(`command`);return t?Gt(t):(t=$(this).attr(`cmd`),t&&SendCommand(t),!1)}function Gt(e){switch(e){case`showtool`:Ve();break;case`showchat`:return Kt();case`showcombat`:return z.Show();case`stopstate`:if(G.extend.is_record)return G.extend.stop_record();SendCommand(`state stop`);break;case`stateinfo`:SendCommand(`state info`);break;default:G.show(e);break}return!1}function Kt(){var e=$(`.chat-panel`).toggleClass(`hide`);return e.is(`.hide`)?Bt=!1:(Bt=!0,e.find(`input`).val(``).focus()),!1}function qt(e){e.keyCode==13&&Jt()}function Jt(){var e=$(`.sender-box`).val();if(e){if(e.length>100)return ReceiveMessage(`<hir>你输入的内容太多了。</hir>`);var t=$(`.channel-box`).attr(`channel`);$(`.sender-box`).val(``).focus(),SendCommand(t+` `+e)}}function Yt(){var e=$(this),t=e.attr(`channel`);if(t==`emote`)return Xt();if(!e.is(`.selected`)){var n=e.parent();return n.children().removeClass(`selected`),e.addClass(`selected`),n.attr(`channel`,t),$(`.sender-box`).focus(),!1}}function Xt(){var e=$(`.channel-emotes`);e.is(`.hide`)?(e.removeClass(`hide`),Q.emtoes||(SendCommand(`emote`),Q.emtoes=[],$(`.sender-box`).blur(),e.on(`click`,`span`,function(){var e=$(this).html();$(`.sender-box`).val(`*`+e).focus(),$(`.channel-emotes`).addClass(`hide`)}))):$(`.channel-emotes`).addClass(`hide`)}function Zt(e){var t=$(e.target),n=t.attr(`cmd`);if(n||=t.parent().attr(`cmd`),n){let e=n[0];if(e==`_`){var r=n.split(` `);switch(r[0]){case`_confirm`:N.Process(r);break;case`_setting`:L.save(r[1],r[2]);break;case`_trade`:G.trade.confirm(r[1]);break;case`_close`:P.Close(t);break;case`_hide`:break;case`_closed`:G.hide();case`_party`:G.party.command(r[1]);break}}else e===`#`?I.run(n):(SendCommand(n),!t.closest(`.dialog-fb`).length&&t.closest(`.dialog-content`).length>0&&t.closest(`.item-commands`).remove());return!1}else Bt&&(t.closest(`.chat-panel`).length||($(`.chat-panel`).addClass(`hide`),Bt=!1));N.Close()}window.HandlerMenuCommand=Gt;var Qt=new It,$t=new Vt,en=class extends K{constructor(){super(),this.template=`${Qt.render()}\n${$t.render()}`}on_mount(){Qt.on_mount(),$t.on_mount()}};globalThis.$=t,globalThis.SendCommand=ue,globalThis.ReceiveMessage=k,globalThis.Confirm=N,globalThis.Warn=P,globalThis.Process=Q,globalThis.Dialog=G;function tn(){let e=new en;e.onCompile(),e.mount(document.body),Q.init()}t(tn);