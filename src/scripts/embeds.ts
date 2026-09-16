if (!document.documentElement.dataset.embedsReady) {
document.documentElement.dataset.embedsReady='true';
document.addEventListener("click", (event) => {
 const button = (event.target as Element).closest<HTMLButtonElement>("button[data-embed-src]");
 if (!button?.dataset.embedSrc) return;
 const frame=document.createElement("iframe");
 frame.src=button.dataset.embedSrc; frame.title="交互代码示例"; frame.loading="lazy";
 frame.referrerPolicy="no-referrer"; frame.style.cssText="width:100%;height:32rem;border:0";
 button.replaceWith(frame);
});

}
