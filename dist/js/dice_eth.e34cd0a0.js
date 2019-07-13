(function(e){function t(t){for(var r,u,s=t[0],o=t[1],c=t[2],h=0,m=[];h<s.length;h++)u=s[h],a[u]&&m.push(a[u][0]),a[u]=0;for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(e[r]=o[r]);d&&d(t);while(m.length)m.shift()();return i.push.apply(i,c||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,s=1;s<n.length;s++){var o=n[s];0!==a[o]&&(r=!1)}r&&(i.splice(t--,1),e=u(u.s=n[0]))}return e}var r={},a={dice_eth:0},i=[];function u(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.m=e,u.c=r,u.d=function(e,t,n){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)u.d(n,r,function(t){return e[t]}.bind(null,r));return n},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="https://limitless.ink/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],o=s.push.bind(s);s.push=t,s=s.slice();for(var c=0;c<s.length;c++)t(s[c]);var d=o;i.push([0,"chunk-vendors","chunk-common"]),n()})({0:function(e,t,n){e.exports=n("8490")},8490:function(e,t,n){"use strict";n.r(t);n("dac5"),n("6e26"),n("9604"),n("df67");var r=n("6e6d"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("game",{ref:"app",attrs:{symbol:"ETH",account:e.account,num:e.num,amount:e.amount,introVisible:e.introVisible,isNeedUpdate:e.isNeedUpdate,minAmount:e.minAmount,maxAmount:e.maxAmount,amountStep:e.amountStep,balance:e.balance,gas:e.gas,betLoading:e.betLoading,recordList:e.recordList,myRecordList:e.myRecordList,adRecordList:e.adRecordList,jackpotStart:e.jackpotStart,jackpotEnd:e.jackpotEnd,state:e.state,result:e.result,loading:e.loading,celebrateVisible:e.celebrateVisible,min:e.min,max:e.max},on:{"update:num":function(t){e.num=t},"update:amount":function(t){e.amount=t},"update:introVisible":function(t){e.introVisible=t},"update:intro-visible":function(t){e.introVisible=t},"update:isNeedUpdate":function(t){e.isNeedUpdate=t},"update:is-need-update":function(t){e.isNeedUpdate=t},bet:e.betSubmit,ended:e.betEnd,addRecord:e.addRecord,freeBet:e.freeBet}})],1)},i=[],u=(n("34a3"),n("f763"),n("7e98")),s=(n("4453"),n("f649")),o=n("853d"),c=function(){return o["a"].get("/api/v1.0/dice/ethereum/getSuggestGasPrice")},d=function(e){var t=e.betmask,n=e.modulo,r=void 0===n?100:n,a=e.amount,i=e.address;return Object(o["a"])({method:"get",url:"/api/v1.0/dice/ethereum/getPlaceBetParams",params:{betmask:t,modulo:r,amount:a,address:i}})},h=function(e){return Object(o["a"])({method:"get",url:"/api/v1.0/dice/ethereum/settleBet",params:e})},m=function(){return Object(o["a"])({method:"get",url:"/api/v1.0/dice/ethereum/getBetsAll"})},p=function(e){var t=e.address;return Object(o["a"])({method:"get",url:"/api/v1.0/dice/ethereum/getBetsMe",params:{address:t}})},l=function(){return o["a"].get("/api/v1.0/dice/ethereum/getSuggestBetAmount")},f=function(){return o["a"].get("/api/v1.0/dice/ethereum/getBetsHighRoller")},b=function(e){var t=e.address,n=e.amount,r=void 0===n?1e5:n;return o["a"].get("/api/v1.0/dice/ethereum/addgambler",{params:{address:t,amount:r}})},g=function(e){return o["a"].get("/api/v1.0/dice/ethereum/settleBetFree",{params:e})},v=function(e){var t=e.randomNumber,n=e.hash;return o["a"].get("/api/v1.0/dice/ethereum/getInfo",{params:{randomNumber:t,hash:n}})},x=n("9944"),w=n("08fb"),k=n("232d"),R=n("d34a"),j=new R["a"],y={data:function(){return{num:50,balance:0,amount:.01,gas:"",betLoading:!1,account:"",recordList:[],myRecordList:[],adRecordList:[],jackpotStart:0,jackpotEnd:0,minAmount:.01,maxAmount:10.02,amountStep:.01,result:{},state:"bet",loading:!0,celebrateVisible:!1,min:1,max:97,debug:!1,introVisible:!1,isNeedUpdate:!1}},components:{Game:w["a"]},watch:{amount:function(){this.fixAmount()}},computed:{},created:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:this.getRecord(),this.getAmoutParams(),this.getHighRoller();case 3:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),mounted:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(){var t,n,r,a,i,s=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(j.checkInstalled()){e.next=3;break}return this.introVisible=!0,e.abrupt("return");case 3:return setTimeout(function(){j.checkMainNet()||s.debug?j.checkAddress()||s.$warn(s.$t("as"),5e3):s.$error(s.$t("ax"),5e3)},1500),e.next=6,Object(x["c"])(j.getAccount());case 6:if(t=e.sent,n=Object(u["a"])(t,2),r=n[0],a=n[1],!a){e.next=13;break}return 4001==a.code&&this.$warn(this.$t("au")),e.abrupt("return");case 13:return j.initContract(),this.account=r,this.getBalance(),this.loading=!1,this.getMyRecord(),e.next=20,c();case 20:i=e.sent,this.gas=i.gasPrice,this.getJackpot(),setInterval(function(){s.getJackpot()},1e4);case 24:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),methods:{getAmoutParams:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,l();case 2:if(t=e.sent,null!==t){e.next=5;break}return e.abrupt("return");case 5:this.amount=t.defaultAmount,this.minAmount=t.defaultAmount,this.maxAmount=t.maxAmount,this.amountStep=t.step;case 9:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),getBalance:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,j.getBalance();case 2:this.balance=e.sent;case 3:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),getJackpot:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.jackpotStart=this.jackpotEnd,e.next=3,j.getJackpot();case 3:this.jackpotEnd=e.sent;case 4:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),fixAmount:function(){var e=this,t=parseFloat(this.amount);isNaN(t)?this.amount="0.01":(t<.01?t=.01:t>10.2&&(t=10.2),this.$nextTick(function(){e.amount=t.toFixed(2)}))},getBetParams:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(){var t,n,r=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r.amountCache=r.amount,r.numCache=r.num,e.next=4,d({betmask:r.num,amount:r.amount,address:r.account});case 4:if(t=e.sent,null!==t){e.next=8;break}return r.betLoading=!1,e.abrupt("return");case 8:return e.abrupt("return",t);case 9:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),e.next=3,t();case 3:n=e.sent;case 4:if(28!=n.v){e.next=10;break}return e.next=7,t();case 7:n=e.sent,e.next=4;break;case 10:return e.abrupt("return",n);case 11:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}(),settle:function(e,t){h({randomNumber:e,hash:t})},betEnd:function(){this.getBalance(),this.state="bet",this.betLoading=!1},getResult:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(t,n,r){var a,i,u;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,v({randomNumber:t,hash:n});case 2:return a=e.sent,i=a[1],u=Object(x["b"])(Object(k["b"])(r||this.amountCache,this.numCache)),e.abrupt("return",{sha3Mod100:i,wins:u});case 6:case"end":return e.stop()}},e,this)}));function t(t,n,r){return e.apply(this,arguments)}return t}(),manualSettle:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(t,n,r){var a,i,u,s=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.getResult(t,n,r);case 2:a=e.sent,i=a.sha3Mod100,u=a.wins,this.result={sha3Mod100:i,wins:i<this.numCache?u:0},this.state="wait",this.isNeedUpdate=!0,setTimeout(function(){s.state="result"},5e3);case 9:case"end":return e.stop()}},e,this)}));function t(t,n,r){return e.apply(this,arguments)}return t}(),submitVerify:function(){return 1==window.ethereum.networkVersion||this.debug?window.ethereum.selectedAddress?!(this.amount>this.balance)||(this.$warn(this.$t("at")),!1):(this.$warn(this.$t("as")),!1):(this.$error(this.$t("ax"),5e3),!1)},freeBet:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(){var t,n,r,a,i;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.betLoading=!0,b({address:this.account}),e.next=4,this.getBetParams();case 4:return t=e.sent,e.next=7,Object(x["c"])(j.freeBet(t,this.gas));case 7:if(n=e.sent,r=Object(u["a"])(n,2),a=r[0],i=r[1],!i){e.next=17;break}return console.log("bet err"),console.log(i),i.message.indexOf("User denied")>-1?this.$error(this.$t("au")):this.$error(this.$t("av")),this.betLoading=!1,e.abrupt("return");case 17:g({randomNumber:t.id,hash:a.blockHash}),this.manualSettle(t.id,a.blockHash,j.freeAmount);case 19:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),betSubmit:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(){var t,n,r,a,i;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(this.submitVerify()){e.next=2;break}return e.abrupt("return");case 2:return this.betLoading=!0,e.next=5,this.getBetParams();case 5:return t=e.sent,e.next=8,Object(x["c"])(j.bet(t,this.gas,this.amount));case 8:if(n=e.sent,r=Object(u["a"])(n,2),a=r[0],i=r[1],!i){e.next=18;break}return console.log("bet err"),console.log(i),i.message.indexOf("User denied")>-1?this.$error(this.$t("au")):this.$error(this.$t("av")),this.betLoading=!1,e.abrupt("return");case 18:console.log("commit"),this.settle(t.id,a.blockHash),this.manualSettle(t.id,a.blockHash);case 21:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),prefixRecord:function(e){e._update=this.formatDate(e.updatedAt),e._wins=Object(x["b"])(e.wins),e._link="https://etherscan.io/tx/".concat(e.betTrx),e._bet=e.betMask,e._result='<div class="result-num">'.concat(e.sha3Mod100,"</div>")},getRecord:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(){var t,n=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,m();case 2:if(t=e.sent,null!==t){e.next=5;break}return e.abrupt("return");case 5:t.forEach(function(e){n.prefixRecord(e)}),this.recordList=t;case 7:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),getMyRecord:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(){var t,n=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,p({address:this.account});case 2:if(t=e.sent,null!==t){e.next=5;break}return e.abrupt("return");case 5:t.forEach(function(e){n.prefixRecord(e)}),this.myRecordList=t;case 7:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),addRecord:function(e){console.log(e),this.prefixRecord(e),this.recordList.unshift(e),e.address==this.account&&this.myRecordList.unshift(e),this.recordList.length>20&&this.recordList.pop(),this.myRecordList.length>20&&this.myRecordList.pop()},formatDate:function(e){var t=new Date(e),n="".concat(t.getHours(),":").concat(t.getMinutes(),":").concat(t.getSeconds());return n.replace(/(\b\d\b)/g,"0$1")},getHighRoller:function(){var e=Object(s["a"])(regeneratorRuntime.mark(function e(){var t,n=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,f();case 2:if(t=e.sent,null!==t){e.next=5;break}return e.abrupt("return");case 5:t.forEach(function(e){e._lossPer=Object(k["c"])({min:n.min,max:n.max,bet:e.betMask}),e._shortcutAddr=Object(x["a"])(e.address)}),this.adRecordList=t;case 7:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}()}},O=y,L=n("17cc"),$=Object(L["a"])(O,a,i,!1,null,null,null),A=$.exports,S=n("7128"),B=n("d5b3"),P=n("68b4");n("8e48");r["default"].config.productionTip=!1,r["default"].use(B["a"]),r["default"].use(P["a"]),new r["default"]({i18n:S["a"],render:function(e){return e(A)}}).$mount("#app")}});