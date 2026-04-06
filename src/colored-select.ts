import {
  SelectRenderable,
  SelectRenderableEvents,
  parseColor,
  type SelectRenderableOptions,
} from "@opentui/core";
import type { RenderContext } from "@opentui/core";

export interface ColoredSelectOption {
  name: string;
  description: string;
  value: { detail: string; color: string };
}

export type ColoredSelectOptions = Omit<SelectRenderableOptions, "options"> & {
  options: ColoredSelectOption[];
};

export function createColoredSelect(
  ctx: RenderContext,
  opts: ColoredSelectOptions,
): SelectRenderable {
  const select = new SelectRenderable(ctx, {
    ...opts,
    options: opts.options as any,
  });

  const self = select as any;

  self.refreshFrameBuffer = function () {
    if (!self.frameBuffer) return;

    const bgColor = self._focused
      ? self._focusedBackgroundColor
      : self._backgroundColor;
    self.frameBuffer.clear(bgColor);

    if (self._options.length === 0) return;

    const contentX = 0;
    const contentY = 0;
    const contentWidth = self.width;
    const contentHeight = self.height;

    const visibleOptions = self._options.slice(
      self.scrollOffset,
      self.scrollOffset + self.maxVisibleItems,
    );

    for (let i = 0; i < visibleOptions.length; i++) {
      const actualIndex = self.scrollOffset + i;
      const option = visibleOptions[i];
      const isSelected = actualIndex === self._selectedIndex;
      const itemY = contentY + i * self.linesPerItem;

      if (itemY + self.linesPerItem - 1 >= contentY + contentHeight) break;

      if (isSelected) {
        const h = self.linesPerItem - self._itemSpacing;
        self.frameBuffer.fillRect(
          contentX,
          itemY,
          contentWidth,
          h,
          self._selectedBackgroundColor,
        );
      }

      const nameContent = `${isSelected ? "▶ " : "  "}${option.name}`;

      const itemColor = option.value?.color
        ? parseColor(option.value.color)
        : null;
      const baseTextColor = self._focused
        ? self._focusedTextColor
        : self._textColor;
      const nameColor =
        itemColor || (isSelected ? self._selectedTextColor : baseTextColor);

      self.frameBuffer.drawText(nameContent, contentX + 1, itemY, nameColor);

      if (
        self._showDescription &&
        itemY + self.fontHeight < contentY + contentHeight
      ) {
        const descColor = isSelected
          ? self._selectedDescriptionColor
          : self._descriptionColor;
        self.frameBuffer.drawText(
          option.description,
          contentX + 3,
          itemY + self.fontHeight,
          descColor,
        );
      }
    }

    if (
      self._showScrollIndicator &&
      self._options.length > self.maxVisibleItems
    ) {
      self.renderScrollIndicatorToFrameBuffer(
        contentX,
        contentY,
        contentWidth,
        contentHeight,
      );
    }
  };

  self.requestRender();

  return select;
}

export { SelectRenderableEvents };
