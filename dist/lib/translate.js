(()=>{var r=async()=>await fetch("/translations.json").then(t=>t.json()),c=async(t,n)=>{let e=await r(),a=get(e,t);return eachRight(n,(s,o)=>{a=replace(a,`:${o}`,s)}),a},l=c;})();
//# sourceMappingURL=translate.js.map
