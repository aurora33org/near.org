import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CarouselNodeView } from "../node-views/CarouselNodeView";

interface CarouselImage {
  src: string;
  alt: string;
}

export const CarouselNode = Node.create({
  name: "carousel",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      images: {
        default: "[]",
        parseHTML: (element) => element.getAttribute("data-images") || "[]",
        renderHTML: (attributes) => ({
          "data-images": attributes.images,
        }),
      },
      slidesPerView: {
        default: 1,
        parseHTML: (element) => {
          const value = element.getAttribute("data-slides-per-view");
          return value ? parseFloat(value) : 1;
        },
        renderHTML: (attributes) => ({
          "data-slides-per-view": attributes.slidesPerView,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="carousel"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "carousel", ...HTMLAttributes }];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CarouselNodeView);
  },
});

export type { CarouselImage };
