import { visit } from "unist-util-visit";
export default function rehypeContentAssets() {
 return (tree) => visit(tree,"element",(node) => {
  if (node.tagName === "img") { node.properties.loading="lazy"; node.properties.decoding="async"; }
 });
}
