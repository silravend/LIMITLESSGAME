(function(t){function e(e){for(var r,o,u=e[0],s=e[1],c=e[2],m=0,h=[];m<u.length;m++)o=u[m],a[o]&&h.push(a[o][0]),a[o]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(t[r]=s[r]);d&&d(e);while(h.length)h.shift()();return i.push.apply(i,c||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],r=!0,u=1;u<n.length;u++){var s=n[u];0!==a[s]&&(r=!1)}r&&(i.splice(e--,1),t=o(o.s=n[0]))}return t}var r={},a={horse_tron:0},i=[];function o(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=t,o.c=r,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],s=u.push.bind(u);u.push=e,u=u.slice();for(var c=0;c<u.length;c++)e(u[c]);var d=s;i.push([7,"chunk-vendors","chunk-common"]),n()})({5855:function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("f751"),n("097d");var r,a,i=n("2b0e"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("game",{ref:"app",attrs:{symbol:"TRX",num:t.num,amount:t.amount,minAmount:t.minAmount,maxAmount:t.maxAmount,amountStep:t.amountStep,balance:t.balance,gas:t.gas,betLoading:t.betLoading,recordList:t.recordList,myRecordList:t.myRecordList,adRecordList:t.adRecordList,jackpotStart:t.jackpotStart,jackpotEnd:t.jackpotEnd,state:t.state,result:t.result,decimal:1,loading:t.loading,horseList:t.horseList,min:t.min,max:t.max},on:{"update:num":function(e){t.num=e},"update:amount":function(e){t.amount=e},bet:t.betSubmit,ended:t.betEnd,addRecord:t.addRecord}})],1)},u=[],s=(n("a481"),n("768b")),c=(n("ac6a"),n("5d73")),d=n.n(c),m=(n("6b54"),n("e814")),h=n.n(m),f=(n("96cf"),n("3b8d")),p=n("853d"),l=function(t){var e=t.betmask,n=t.modulo,r=void 0===n?100:n,a=t.amount,i=t.address;return Object(p["a"])({method:"get",url:"/api/v1.0/horseracing/tron/getPlaceBetParams",params:{betmask:e,modulo:r,amount:a,address:i}})},b=function(t){return Object(p["a"])({method:"get",url:"/api/v1.0/horseracing/tron/settleBet",params:t})},g=function(){return Object(p["a"])({method:"get",url:"/api/v1.0/horseracing/tron/getBetsAll"})},w=function(t){var e=t.address;return Object(p["a"])({method:"get",url:"/api/v1.0/horseracing/tron/getBetsMe",params:{address:e}})},v=function(){return p["a"].get("/api/v1.0/horseracing/tron/getSuggestBetAmount")},x=function(t){var e=t.winner;return Object(p["a"])({method:"get",url:"/api/v1.0/horseracing/tron/getVideoUrl",params:{winner:e}})},R=function(){return p["a"].get("/api/v1.0/horseracing/tron/getBetsHighRoller")},k=n("9944"),j=n("eaa8"),y=n("232d"),O=n("30b4"),L={data:function(){return{num:95,balance:0,amount:.01,gas:"",betLoading:!1,account:"",recordList:[],myRecordList:[],adRecordList:[],jackpotStart:0,jackpotEnd:0,minAmount:.01,maxAmount:10.02,amountStep:.01,result:{},state:"bet",loading:!0,debug:!1,amountCache:.01,numCache:95,min:1,max:97,horseList:[95,75,48,38,18,10]}},components:{Game:j["a"]},watch:{amount:function(){this.fixAmount()},account:function(){this.getBalance()}},created:function(){var t=Object(f["a"])(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:this.getRecord(),this.getAmoutParams(),this.getHighRoller();case 3:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),mounted:function(){var t=this;setTimeout(Object(f["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if("undefined"!==typeof window.tronWeb){e.next=3;break}return t.$refs["app"].showIntro(),e.abrupt("return");case 3:if(window.tronWeb.defaultAddress.base58){e.next=6;break}return t.$error(t.$t("ay"),5e3),e.abrupt("return");case 6:return e.next=8,window.tronWeb.isConnected();case 8:return t.account=window.tronWeb.defaultAddress.base58,t.getMyRecord(),e.next=12,Object(O["c"])();case 12:return r=e.sent,e.next=15,Object(O["d"])();case 15:if(a=e.sent,r&&a){e.next=18;break}return e.abrupt("return");case 18:t.getJackpot(),setInterval(function(){t.getJackpot()},1e4);case 20:case"end":return e.stop()}},e)})),1e3)},methods:{isMainNet:function(){return window.tronWeb.eventServer.host.indexOf("api.trongrid.io")>-1},getAmoutParams:function(){var t=Object(f["a"])(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,v();case 2:if(e=t.sent,null!==e){t.next=5;break}return t.abrupt("return");case 5:this.amount=e.defaultAmount,this.minAmount=e.defaultAmount,this.maxAmount=e.maxAmount,this.amountStep=e.step;case 9:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),getBalance:function(){var t=Object(f["a"])(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,window.tronWeb.trx.getBalance(this.account);case 2:e=t.sent,this.balance=Object(k["b"])(window.tronWeb.fromSun(e),2),this.loading=!1;case 5:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),getJackpot:function(){var t=Object(f["a"])(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return this.jackpotStart=this.jackpotEnd,t.next=3,r.methods.jackpotSize().call();case 3:e=t.sent,this.jackpotEnd=Object(k["b"])(window.tronWeb.fromSun(e),2);case 5:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),fixAmount:function(){var t=this,e=h()(this.amount);isNaN(e)?this.amount=this.minAmount:(e<this.minAmount?e=this.minAmount:e>this.maxAmount&&(e=this.maxAmount),this.$nextTick(function(){t.amount=e}))},getBetParams:function(){var t=Object(f["a"])(regeneratorRuntime.mark(function t(){var e,n,r=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return e=function(){var t=Object(f["a"])(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return r.amountCache=r.amount,r.numCache=r.num,t.next=4,l({betmask:r.num,amount:r.amount,address:r.account});case 4:if(e=t.sent,null!==e){t.next=8;break}return r.betLoading=!1,t.abrupt("return");case 8:return t.abrupt("return",e);case 9:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}(),t.next=3,e();case 3:n=t.sent;case 4:if(128!=n.v){t.next=10;break}return t.next=7,e();case 7:n=t.sent,t.next=4;break;case 10:return t.abrupt("return",n);case 11:case"end":return t.stop()}},t)}));function e(){return t.apply(this,arguments)}return e}(),settle:function(t,e){b({randomNumber:t,blockNumber:e})},betEnd:function(){this.getBalance(),this.state="bet",this.betLoading=!1},getResult:function(){var t=Object(f["a"])(regeneratorRuntime.mark(function t(e,n){var r,i,o,u,s;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,window.tronWeb.trx.getBlock(h()(n));case 2:return r=t.sent,i="0x"+r.blockID,t.next=6,a.getInfo(e,i).call();case 6:return o=t.sent,u=h()(o[1].toString())||100,s=Object(k["b"])(Object(y["c"])(this.amountCache,this.numCache),2),t.abrupt("return",{sha3Mod100:u,wins:s});case 10:case"end":return t.stop()}},t,this)}));function e(e,n){return t.apply(this,arguments)}return e}(),getVideo:function(){var t=Object(f["a"])(regeneratorRuntime.mark(function t(e){var n,r,a,i;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return n=e.wins,r=e.sha3Mod100,a=this.mapResultHorse({betMask:this.numCache,wins:n,sha3Mod100:r}),t.next=4,x({winner:a});case 4:return i=t.sent,t.abrupt("return",i);case 6:case"end":return t.stop()}},t,this)}));function e(e){return t.apply(this,arguments)}return e}(),manualSettle:function(){var t=Object(f["a"])(regeneratorRuntime.mark(function t(e,n){var r,a,i,o,u;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.getResult(e,n);case 2:return r=t.sent,a=r.sha3Mod100,i=r.wins,o={sha3Mod100:a,wins:a<this.numCache?i:0},t.next=8,this.getVideo(o);case 8:u=t.sent,o.video=u,this.result=o,this.state="result";case 12:case"end":return t.stop()}},t,this)}));function e(e,n){return t.apply(this,arguments)}return e}(),submitVerify:function(){if(this.isMainNet()||this.debug)return window.tronWeb.defaultAddress.base58?!(this.amount>this.balance)||(this.$warn(this.$t("at")),!1):(this.$warn(this.$t("as")),!1);this.$error(this.$t("ax"))},betSubmit:function(){var t=Object(f["a"])(regeneratorRuntime.mark(function t(){var e,n=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(this.submitVerify()){t.next=2;break}return t.abrupt("return");case 2:return this.betLoading=!0,t.next=5,this.getBetParams();case 5:e=t.sent,r.Commit().watch({filters:{commit:e.commit.slice(2)}},function(t,r){if(t)return console.log(t),n.$error(n.$t("av")),void n.betEnd();n.settle(e.id,r.block),n.manualSettle(e.id,r.block)}),r.placeBet(e.betMask,e.modulo,e.commitLastBlock,e.commit,e.r,e.s).send({feeLimit:1e8,callValue:window.tronWeb.toSun(this.amount),shouldPollResponse:!0}).catch(function(t){console.log(t),n.$error(n.$t("av")),n.betEnd()});case 8:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),mapBetHorse:function(t){return this.horseList.indexOf(h()(t))+1},mapResultHorse:function(t){var e=this.mapBetHorse(t.betMask),n=h()(t.sha3Mod100);if(t.wins>0)return e;var r=!0,a=!1,i=void 0;try{for(var o,u=d()(this.horseList.entries());!(r=(o=u.next()).done);r=!0){var c=Object(s["a"])(o.value,2),m=c[0],f=c[1];if(0==m&&n>=f)return 1==e?2:1;if(n<f&&n>=this.horseList[m+1])return m+1}}catch(p){a=!0,i=p}finally{try{r||null==u.return||u.return()}finally{if(a)throw i}}},prefixRecord:function(t){t._update=this.formatDate(t.updatedAt),t._wins=Object(k["b"])(t.wins,2),t._link="https://tronscan.org/#/transaction/".concat(t.betTrx),t._bet=this.mapBetHorse(t.betMask),t._result='<div class="result-num">'.concat(this.mapResultHorse(t),"</div>")},getRecord:function(){var t=Object(f["a"])(regeneratorRuntime.mark(function t(){var e,n=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,g();case 2:if(e=t.sent,null!==e){t.next=5;break}return t.abrupt("return");case 5:e.forEach(function(t){return n.prefixRecord(t)}),this.recordList=e;case 7:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),getMyRecord:function(){var t=Object(f["a"])(regeneratorRuntime.mark(function t(){var e,n=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,w({address:this.account});case 2:if(e=t.sent,null!==e){t.next=5;break}return t.abrupt("return");case 5:e.forEach(function(t){return n.prefixRecord(t)}),this.myRecordList=e;case 7:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),addRecord:function(t){var e=this;t.address==this.account?setTimeout(function(){e.prefixRecord(t),e.recordList.unshift(t),e.myRecordList.unshift(t)},5e4):(this.prefixRecord(t),this.recordList.unshift(t)),this.recordList.length>25&&this.recordList.pop(),this.myRecordList.length>25&&this.myRecordList.pop()},formatDate:function(t){var e=new Date(t),n="".concat(e.getHours(),":").concat(e.getMinutes(),":").concat(e.getSeconds());return n.replace(/(\b\d\b)/g,"0$1")},getHighRoller:function(){var t=Object(f["a"])(regeneratorRuntime.mark(function t(){var e,n=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,R();case 2:if(e=t.sent,null!==e){t.next=5;break}return t.abrupt("return");case 5:e.forEach(function(t){t._lossPer=Object(y["b"])({min:n.min,max:n.max,bet:t.betMask}),t._shortcutAddr=Object(k["a"])(t.address)}),this.adRecordList=e;case 7:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}()}},A=L,S=n("2877"),M=Object(S["a"])(A,o,u,!1,null,null,null),B=M.exports,$=n("7128"),_=n("d5b3"),P=n("68b4");n("8e48");i["default"].config.productionTip=!1,i["default"].use(_["a"]),i["default"].use(P["a"]),new i["default"]({i18n:$["a"],render:function(t){return t(B)}}).$mount("#app")},7:function(t,e,n){t.exports=n("5855")}});