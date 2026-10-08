import type MarkdownIt from "markdown-it";

/**
 * 图片图注（image caption）插件。
 *
 * 用法：![图注文字](图片路径)
 *
 * 把「独占一个段落、且 alt 文本非空」的图片渲染成：
 *   <figure class="image-figure"><img …><figcaption>图注文字</figcaption></figure>
 *
 * 以下情况不受影响：
 * - alt 为空的图片（如 ![](./a.svg)）：不生成图注；
 * - 夹在句子中间的图片：不生成图注，避免 figcaption 混进段落；
 * - 同一段里有多张图片：不生成图注。
 */
export function imageCaption(md: MarkdownIt): void {
  const defaultImage =
    md.renderer.rules.image ??
    ((tokens, idx, options, _env, self) =>
      self.renderToken(tokens, idx, options));

  // 预扫描：把“整段只有一张、且 alt 非空的图片”标记出来，
  // 供下面的 paragraph_open / paragraph_close 判断是否包成 <figure>。
  md.core.ruler.push("image_caption", (state) => {
    for (const token of state.tokens) {
      if (token.type !== "inline" || !token.children) continue;
      const meaningful = token.children.filter(
        (child) => !(child.type === "text" && child.content.trim() === ""),
      );
      if (meaningful.length !== 1) continue;
      const image = meaningful[0];
      if (image.type === "image" && image.content.trim() !== "") {
        image.meta = { ...(image.meta ?? {}), blockImage: true };
      }
    }
    return false;
  });

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const image = tokens[idx];
    const img = defaultImage(tokens, idx, options, env, self);
    if (!image.meta?.blockImage) return img;
    return `${img}<figcaption>${md.utils.escapeHtml(image.content)}</figcaption>`;
  };

  const defaultParagraphOpen = md.renderer.rules.paragraph_open;
  const defaultParagraphClose = md.renderer.rules.paragraph_close;

  md.renderer.rules.paragraph_open = (tokens, idx, options, env, self) => {
    if (isCaptionedParagraph(tokens, idx + 1)) {
      return '<figure class="image-figure">\n';
    }
    return defaultParagraphOpen
      ? defaultParagraphOpen(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.paragraph_close = (tokens, idx, options, env, self) => {
    if (isCaptionedParagraph(tokens, idx - 1)) {
      return "</figure>\n";
    }
    return defaultParagraphClose
      ? defaultParagraphClose(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options);
  };
}

function isCaptionedParagraph(
  tokens: { type: string; children?: { meta?: { blockImage?: boolean } }[] }[],
  inlineIdx: number,
): boolean {
  const inline = tokens[inlineIdx];
  if (!inline || inline.type !== "inline") return false;
  return Boolean(inline.children?.some((child) => child.meta?.blockImage));
}
