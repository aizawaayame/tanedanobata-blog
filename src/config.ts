import type { ExpressiveCodeConfig, LicenseConfig, NavBarConfig, ProfileConfig, SiteConfig } from "./types/config";
export const siteConfig: SiteConfig = {
 title: "柚子其实是蜜柑", subtitle: "游戏开发、引擎技术与生活记录", lang: "zh_CN",
 themeColor: { hue: 250, fixed: true },
 banner: { enable: true, src: "/meguru-banner.jpg", position: "center", credit: { enable: false, text: "", url: "" } },
 toc: { enable: true, depth: 3 }, favicon: [{ src: "/meguru-avatar.gif" }],
};
export const navBarConfig: NavBarConfig = { links: [
 { name: "首页", url: "/" }, { name: "笔记", url: "/notes/" }, { name: "归档", url: "/archive/" },
 { name: "关于", url: "/about/" }, { name: "GitHub", url: "https://github.com/aizawaayame", external: true },
] };
export const profileConfig: ProfileConfig = {
 avatar: "/meguru-avatar.gif", name: "柚子其实是蜜柑", bio: "记录游戏开发中的思考，也记录生活。",
 links: [{ name: "GitHub", icon: "fa6-brands:github", url: "https://github.com/aizawaayame" }],
};
// 原站没有声明文章采用 CC 许可；迁移不替作者授予新的许可。
export const licenseConfig: LicenseConfig = { enable: false, name: "", url: "" };
export const expressiveCodeConfig: ExpressiveCodeConfig = { theme: "github-dark" };
