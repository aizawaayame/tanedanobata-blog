import { visit } from "unist-util-visit";
export default function rehypeContentAssets() {
 return (tree) => visit(tree,"element",(node) => {
  if (node.tagName === "a" && typeof node.properties.href === "string" && node.properties.href.startsWith("/")) node.properties.href = node.properties.href.replaceAll("+", "%2B");
  if (node.tagName === "img") { node.properties.loading="lazy"; node.properties.decoding="async"; }
 });
}
