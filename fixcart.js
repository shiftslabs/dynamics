const fs=require("fs");
const p="apps/larry.sfpos/src/pages/sales/POSPage.jsx";
let c=fs.readFileSync(p,"utf8");
const old = 'className={`${cartOpen ? "flex" : "hidden"} fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] min-h-[min(28rem,85dvh)] flex-col overflow-hidden rounded-t-3xl border border-black/[0.08] bg-white shadow-2xl dark:border-white/[0.1] dark:bg-surface-dark lg:sticky lg:top-[3.75rem] lg:flex lg:h-[calc(100dvh-3.75rem)] lg:min-h-0 lg:max-h-none lg:rounded-none lg:rounded-l-2xl lg:border-y-0 lg:border-r-0 lg:border-l lg:shadow-none`}';
const neu = 'className={(cartOpen ? "flex" : "hidden") + " fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] min-h-[min(28rem,85dvh)] flex-col overflow-hidden rounded-t-3xl border border-black/[0.08] bg-white shadow-2xl dark:border-white/[0.1] dark:bg-surface-dark lg:sticky lg:top-[3.75rem] lg:flex lg:h-[calc(100dvh-3.75rem)] lg:min-h-0 lg:max-h-none lg:rounded-none lg:rounded-l-2xl lg:border-y-0 lg:border-r-0 lg:border-l lg:shadow-none"}';
if(c.includes(old)){ c=c.split(old).join(neu); fs.writeFileSync(p,c); console.log("ok"); } else { console.log("no"); }
