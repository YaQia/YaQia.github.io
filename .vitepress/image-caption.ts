import type MarkdownIt from "markdown-it";

/**
 * 图片图注 + 居中插件。
 *
 * 用法：![图注文字](图片路径)
 *
 * 「独占一个段落」的图片会被渲染成：
 *   <figure class="image-figure"><img …><figcaption>图注文字</figcaption></figure>
 * 其中：
 * - alt 非空时，alt 作为 <figcaption> 图注显示在图片下方；
 * - alt 为空时（如 ![](./a.svg)），不生成图注；
 * - 两种情况下图片都会由 .image-figure 的样式居中。
 *
 * 夹在句子中间的图片、同一段里多张图片都不受影响，仍按普通行内图片渲染。
 */
export function imageCaption(md: MarkdownIt): void {
  const defaultImage =
    md.renderer.rules.image ??
    ((tokens, idx, options, _env, self) =>
      self.renderToken(tokens, idx, options));

  // 预扫描：把“整段只有一张图片”的图片标记出来，
  // 供下面的 paragraph_open / paragraph_close 判断是否包成 <figure>。
  md.core.ruler.push("image_caption", (state) => {
    for (const token of state.tokens) {
      if (token.type !== "inline" || !token.children) continue;
      const meaningful = token.children.filter(
        (child) => !(child.type === "text" && child.content.trim() === ""),
      );
      if (meaningful.length !== 1 || meaningful[0].type !== "image") continue;
      meaningful[0].meta = { ...(meaningful[0].meta ?? {}), blockImage: true };
    }
    return false;
  });

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const image = tokens[idx];
    const img = defaultImage(tokens, idx, options, env, self);
    if (!image.meta?.blockImage || image.content.trim() === "") return img;
    return `${img}<figcaption>${md.utils.escapeHtml(image.content)}</figcaption>`;
  };

  const defaultParagraphOpen = md.renderer.rules.paragraph_open;
  const defaultParagraphClose = md.renderer.rules.paragraph_close;

  md.renderer.rules.paragraph_open = (tokens, idx, options, env, self) => {
    if (isFigureParagraph(tokens, idx + 1)) {
      return '<figure class="image-figure">\n';
    }
    return defaultParagraphOpen
      ? defaultParagraphOpen(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.paragraph_close = (tokens, idx, options, env, self) => {
    if (isFigureParagraph(tokens, idx - 1)) {
      return "</figure>\n";
    }
    return defaultParagraphClose
      ? defaultParagraphClose(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options);
  };
}

function isFigureParagraph(
  tokens: { type: string; children?: { meta?: { blockImage?: boolean } }[] }[],
  inlineIdx: number,
): boolean {
  const inline = tokens[inlineIdx];
  if (!inline || inline.type !== "inline") return false;
  return Boolean(inline.children?.some((child) => child.meta?.blockImage));
}
