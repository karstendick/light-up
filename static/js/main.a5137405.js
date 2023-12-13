(()=>{"use strict";var e={6771:(e,t,d)=>{d.r(t),d.d(t,{default:()=>j});var a,r=d(3426),n=d(1046),u=d(1054),i=d(9385),f=d(885),s=d(4942),l=d(3240),o=d(2629),h=7,c=7;function S(e){return[Math.floor(e/c),e%c]}function v(e,t){return e*c+t}var b=function(e){return e[e.Empty=0]="Empty",e[e.Shaded=1]="Shaded",e[e.Shaded0=2]="Shaded0",e[e.Shaded1=3]="Shaded1",e[e.Shaded2=4]="Shaded2",e[e.Shaded3=5]="Shaded3",e[e.Shaded4=6]="Shaded4",e[e.Xed=7]="Xed",e[e.Lightbulb=8]="Lightbulb",e[e.Lit=9]="Lit",e[e.LitXed=10]="LitXed",e}(b||{}),p=(a={},(0,s.default)((0,s.default)((0,s.default)((0,s.default)((0,s.default)((0,s.default)((0,s.default)((0,s.default)((0,s.default)((0,s.default)(a,b.Empty,"\u2b1c\ufe0f"),b.Shaded,"\u2b1b"),b.Shaded0,"0\ufe0f\u20e3"),b.Shaded1,"1\ufe0f\u20e3"),b.Shaded2,"2\ufe0f\u20e3"),b.Shaded3,"3\ufe0f\u20e3"),b.Shaded4,"4\ufe0f\u20e3"),b.Xed,"\u274c"),b.Lightbulb,"\ud83d\udca1"),b.Lit,"\ud83d\udfe8"),(0,s.default)(a,b.LitXed,"\u274e")),m={".":b.Empty,"=":b.Shaded,0:b.Shaded0,1:b.Shaded1,2:b.Shaded2,3:b.Shaded3,4:b.Shaded4},g="\n....10.\n1......\n0.=.=..\n...=...\n..0.3.=\n......=\n.0=....";var L=[b.Empty,b.Xed,b.Lit,b.LitXed];function y(e,t){var d=function(e,t){var d=S(t.id),a=(0,f.default)(d,2),r=a[0],n=a[1],u=[];return r>0&&u.push(e[v(r-1,n)]),r<h-1&&u.push(e[v(r+1,n)]),n>0&&u.push(e[v(r,n-1)]),n<c-1&&u.push(e[v(r,n+1)]),u}(e,t),a=d.filter((function(e){return e.state===b.Lightbulb})).length;return a-(t.state-b.Shaded0)}function X(){var e=(0,l.useImmer)(function(e){for(var t=e.trim().split("\n"),d=[],a=0;a<t.length;a++)for(var r=t[a],n=0;n<r.length;n++){var u=r[n],i=m[u];d.push({id:n+a*r.length,state:i})}return d}(g)),t=(0,f.default)(e,2),d=t[0],a=t[1],r=(0,l.useImmer)(!1),n=(0,f.default)(r,2),i=n[0],s=n[1];function X(e){return!i&&![b.Shaded,b.Shaded0,b.Shaded1,b.Shaded2,b.Shaded3,b.Shaded4].includes(e.state)}var j=function(e){a((function(t){var d=e.state;switch(e.state){case b.Shaded:case b.Shaded0:case b.Shaded1:case b.Shaded2:case b.Shaded3:case b.Shaded4:return;case b.Lit:d=b.LitXed;break;case b.Empty:d=b.Lightbulb;break;case b.Lightbulb:d=b.Xed;break;case b.Xed:case b.LitXed:d=b.Empty}t[e.id].state=d,t.filter((function(e){return e.state===b.Lit})).forEach((function(e){return t[e.id].state=b.Empty})),t.filter((function(e){return e.state===b.LitXed})).forEach((function(e){return t[e.id].state=b.Xed}));var a=t.filter((function(e){return e.state===b.Lightbulb})).flatMap((function(e){return function(e,t){for(var d=S(t.id),a=(0,f.default)(d,2),r=a[0],n=a[1],u=[],i=r-1;i>=0;i--){var s=e[v(i,n)];if(!L.includes(s.state))break;u.push(s)}for(var l=r+1;l<h;l++){var o=e[v(l,n)];if(!L.includes(o.state))break;u.push(o)}for(var b=n-1;b>=0;b--){var p=e[v(r,b)];if(!L.includes(p.state))break;u.push(p)}for(var m=n+1;m<c;m++){var g=e[v(r,m)];if(!L.includes(g.state))break;u.push(g)}return u}(t,e)}));a.forEach((function(e){[b.Xed,b.LitXed].includes(e.state)?t[e.id].state=b.LitXed:t[e.id].state=b.Lit})),t.forEach((function(e){t[e.id].isError=function(e,t){return!![b.Shaded0,b.Shaded1,b.Shaded2,b.Shaded3,b.Shaded4].includes(t.state)&&y(e,t)>0}(t,e)})),s(function(e){var t=[b.Empty,b.Xed];return!(e.filter((function(e){return t.includes(e.state)})).length>0)&&!e.filter((function(e){return[b.Shaded0,b.Shaded1,b.Shaded2,b.Shaded3,b.Shaded4].includes(e.state)})).map((function(t){return y(e,t)})).some((function(e){return 0!==e}))}(t))}))};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("div",{className:"board_grid",children:d.map((function(e){return(0,o.jsx)("button",{disabled:!X(e),className:"cell "+(e.isError?"cell_error":""),onClick:function(){return j(e)},children:p[e.state]},e.id)}))}),i&&(0,o.jsx)(u.default,{children:"You won!"})]})}function j(){return(0,o.jsx)(o.Fragment,{children:(0,o.jsxs)(i.default,{style:E.container,children:[(0,o.jsx)(u.default,{children:"\ud83d\udca1Light Up\ud83d\udca1"}),(0,o.jsx)(r.default,{style:"auto"}),(0,o.jsx)(X,{})]})})}var E=n.default.create({container:{flex:1,backgroundColor:"#fff",alignItems:"center",justifyContent:"center"}})}},t={};function d(a){var r=t[a];if(void 0!==r)return r.exports;var n=t[a]={exports:{}};return e[a](n,n.exports,d),n.exports}d.m=e,(()=>{var e=[];d.O=(t,a,r,n)=>{if(!a){var u=1/0;for(l=0;l<e.length;l++){for(var[a,r,n]=e[l],i=!0,f=0;f<a.length;f++)(!1&n||u>=n)&&Object.keys(d.O).every((e=>d.O[e](a[f])))?a.splice(f--,1):(i=!1,n<u&&(u=n));if(i){e.splice(l--,1);var s=r();void 0!==s&&(t=s)}}return t}n=n||0;for(var l=e.length;l>0&&e[l-1][2]>n;l--)e[l]=e[l-1];e[l]=[a,r,n]}})(),d.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return d.d(t,{a:t}),t},d.d=(e,t)=>{for(var a in t)d.o(t,a)&&!d.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},d.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),d.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={179:0};d.O.j=t=>0===e[t];var t=(t,a)=>{var r,n,[u,i,f]=a,s=0;if(u.some((t=>0!==e[t]))){for(r in i)d.o(i,r)&&(d.m[r]=i[r]);if(f)var l=f(d)}for(t&&t(a);s<u.length;s++)n=u[s],d.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return d.O(l)},a=self.webpackChunkweb=self.webpackChunkweb||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))})();var a=d.O(void 0,[137],(()=>d(9866)));a=d.O(a)})();
//# sourceMappingURL=main.a5137405.js.map