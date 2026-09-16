// biome-ignore lint/suspicious/noShadowRestrictedNames: <toString from mdast-util-to-string>
import { toString } from "mdast-util-to-string";

/* Use the post's first paragraph as the excerpt */
export function remarkExcerpt() {
	return (tree, { data }) => {
		let excerpt = "";
		for (const node of tree.children) {
			if (node.type !== "paragraph") {
				continue;
			}
			excerpt = toString({...node, children: node.children.filter(child => child.type !== "image")});
            if (!excerpt.trim()) continue;
			break;
		}
		data.astro.frontmatter.excerpt = excerpt;
	};
}
