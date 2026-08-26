import fs from "node:fs";
import path from "node:path";

// 自动从文件系统生成 sidebar，约定：
//   1. 每个专栏目录的 index.md 中链接的出现顺序 = sidebar 顺序
//   2. 条目标题 = 文件 frontmatter.title ?? 首个 H1 ?? 文件名
//   3. frontmatter `sidebar: false` 的文件不在 sidebar 中出现
//   4. 含 index.md 的子目录 = 一个可折叠分组（组标题取自该 index.md，组链接指向该目录路由）
// 新增文章只需：在专栏 index.md 里加一行链接 + 文件本身有个 H1，sidebar 自动更新，无需改 config。

export interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
  collapsed?: boolean;
}

const ROOT = process.cwd();
const EXCLUDE = new Set([
  ".git",
  "node_modules",
  ".vitepress",
  ".github",
  "pic",
  "public",
]);

function readText(p: string): string {
  try {
    return fs.readFileSync(p, "utf-8");
  } catch {
    return "";
  }
}

function parseFrontmatter(raw: string): Record<string, unknown> {
  const fm: Record<string, unknown> = {};
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return fm;
  for (const line of m[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    let v: unknown = line.slice(idx + 1).trim();
    if (v === "true") v = true;
    else if (v === "false") v = false;
    else if (typeof v === "string" && /^-?\d+$/.test(v)) v = Number(v);
    else if (typeof v === "string") v = v.replace(/^["']|["']$/g, "");
    fm[k] = v;
  }
  return fm;
}

function firstH1(raw: string): string | undefined {
  let inFence = false;
  for (const line of raw.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^#\s+(.+?)\s*$/.exec(line);
    if (m) return m[1];
  }
  return undefined;
}

function labelFor(absFile: string, fallback: string): string {
  const raw = readText(absFile);
  const fm = parseFrontmatter(raw);
  const t = fm.title;
  if (typeof t === "string" && t) return t;
  const h1 = firstH1(raw);
  if (h1) return h1.replace(/`/g, "").trim();
  return fallback;
}

function isHidden(absFile: string): boolean {
  const raw = readText(absFile);
  return parseFrontmatter(raw).sidebar === false;
}

function routeFor(absFile: string): string {
  let rel = path.relative(ROOT, absFile).replace(/\\/g, "/");
  const isIndex = /(?:^|\/)index\.md$/.test(rel);
  rel = rel.replace(/\.md$/, "");
  if (rel.endsWith("/index")) rel = rel.slice(0, -"/index".length);
  if (rel === "index") rel = "";
  return "/" + rel + (isIndex && rel !== "" ? "/" : "");
}

// 把 index.md 里的 markdown 链接解析为子项 key（'file:x.md' 或 'dir:x'），
// 嵌套文件链接（如 ./deep/paper.md）也同时为其所在目录注册顺序。
function resolveLink(href: string): string[] {
  if (!href || /^https?:\/\//.test(href) || href.startsWith("#")) return [];
  const [pathPart] = href.split("#");
  if (!pathPart) return [];
  let p = pathPart.replace(/^\.\//, "");
  if (p.startsWith("../") || p.startsWith("/")) return [];
  const keys: string[] = [];
  if (p.endsWith(".md")) {
    keys.push("file:" + p);
    const segs = p.split("/");
    if (segs.length > 1) keys.push("dir:" + segs[0]);
  } else {
    const cleaned = p.replace(/\/$/, "");
    keys.push("dir:" + cleaned);
  }
  return keys;
}

function orderMapFromIndex(dirAbs: string): Map<string, number> {
  const raw = readText(path.join(dirAbs, "index.md"));
  if (!raw) return new Map();
  const map = new Map<string, number>();
  const re = /\[[^\]]+\]\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(raw)) !== null) {
    for (const key of resolveLink(m[1])) {
      if (!map.has(key)) map.set(key, i);
    }
    i++;
  }
  return map;
}

type RawItem = SidebarItem & { _order: number; _name: string };

function buildDir(dirAbs: string): SidebarItem[] {
  const entries = fs.readdirSync(dirAbs, { withFileTypes: true });
  const orderMap = orderMapFromIndex(dirAbs);
  const items: RawItem[] = [];

  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (EXCLUDE.has(e.name) || e.name.startsWith(".")) continue;
    const subAbs = path.join(dirAbs, e.name);
    const subIndex = path.join(subAbs, "index.md");
    let label: string;
    let link: string | undefined;
    if (fs.existsSync(subIndex)) {
      label = labelFor(subIndex, e.name);
      link = routeFor(subIndex);
    } else {
      label = e.name;
      link = undefined;
    }
    const order = orderMap.get("dir:" + e.name) ?? Number.MAX_SAFE_INTEGER;
    const childItems = buildDir(subAbs);
    if (childItems.length === 0 && !link) continue;
    items.push({
      text: label,
      link,
      items: childItems.length ? childItems : undefined,
      collapsed: childItems.length > 0 ? true : undefined,
      _order: order,
      _name: e.name,
    });
  }

  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith(".md")) continue;
    if (e.name === "index.md") continue;
    const fileAbs = path.join(dirAbs, e.name);
    if (isHidden(fileAbs)) continue;
    items.push({
      text: labelFor(fileAbs, e.name.replace(/\.md$/, "")),
      link: routeFor(fileAbs),
      _order: orderMap.get("file:" + e.name) ?? Number.MAX_SAFE_INTEGER,
      _name: e.name,
    });
  }

  items.sort((a, b) => a._order - b._order || a._name.localeCompare(b._name));
  return items.map(({ text, link, items, collapsed }) => ({
    text,
    link,
    items,
    collapsed,
  }));
}

export function autoSidebar(): Record<string, SidebarItem[]> {
  const sidebar: Record<string, SidebarItem[]> = {};
  for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    if (EXCLUDE.has(e.name) || e.name.startsWith(".")) continue;
    const idx = path.join(ROOT, e.name, "index.md");
    if (!fs.existsSync(idx)) continue;
    sidebar["/" + e.name + "/"] = buildDir(path.join(ROOT, e.name));
  }
  return sidebar;
}
