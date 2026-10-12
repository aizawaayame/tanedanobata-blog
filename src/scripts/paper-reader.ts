// Delegate to the current article so controls also work after Swup navigation.
function syncEnglishToggle(article: Element) {
	const button = article.querySelector<HTMLButtonElement>("[data-psl-english-toggle]");
	const details = [...article.querySelectorAll<HTMLDetailsElement>("details.psl-english")];
	if (!button || !details.length) return;
	const expanded = details.every((detail) => detail.open);
	button.setAttribute("aria-pressed", String(expanded));
	button.textContent = expanded ? "收起全部英文对照" : "展开全部英文对照";
}

document.addEventListener("click", (event) => {
	const target = event.target;
	if (!(target instanceof Element)) return;
	const button = target.closest("[data-psl-english-toggle], [data-psl-print]");
	const article = button?.closest(".custom-md");
	if (!button || !article) return;
	if (button.hasAttribute("data-psl-print")) {
		window.print();
		return;
	}
	const details = [...article.querySelectorAll<HTMLDetailsElement>("details.psl-english")];
	const expanded = !details.every((detail) => detail.open);
	for (const detail of details) detail.open = expanded;
	syncEnglishToggle(article);
});

document.addEventListener("toggle", (event) => {
	const detail = event.target;
	if (!(detail instanceof HTMLDetailsElement) || !detail.matches(".psl-english")) return;
	const article = detail.closest(".custom-md");
	if (article) syncEnglishToggle(article);
}, true);
