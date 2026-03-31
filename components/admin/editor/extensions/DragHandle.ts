import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, NodeSelection, TextSelection } from "@tiptap/pm/state";
import { DOMSerializer } from "@tiptap/pm/model";

const dragHandlePluginKey = new PluginKey("dragHandle");

export const DragHandle = Extension.create({
  name: "dragHandle",

  addProseMirrorPlugins() {
    let handleEl: HTMLElement | null = null;
    let plusEl: HTMLElement | null = null;
    let wrapperEl: HTMLElement | null = null;
    let currentNodePos: number | null = null;

    const editorRef = this.editor;

    function createHandle() {
      wrapperEl = document.createElement("div");
      wrapperEl.className = "drag-handle-wrapper";
      wrapperEl.contentEditable = "false";

      handleEl = document.createElement("div");
      handleEl.className = "drag-handle";
      handleEl.draggable = true;
      handleEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>`;

      plusEl = document.createElement("div");
      plusEl.className = "drag-handle-plus";
      plusEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;

      wrapperEl.appendChild(handleEl);
      wrapperEl.appendChild(plusEl);

      return wrapperEl;
    }

    function hideHandle() {
      if (wrapperEl) wrapperEl.style.display = "none";
      currentNodePos = null;
    }

    return [
      new Plugin({
        key: dragHandlePluginKey,
        view(view) {
          const wrapper = createHandle();
          document.body.appendChild(wrapper);

          // Track mouse on the entire DOCUMENT — handle is outside ProseMirror
          function onDocMouseMove(e: MouseEvent) {
            if (!wrapperEl) return;

            const editorRect = view.dom.getBoundingClientRect();

            // The valid zone: from left of handle area to right edge of editor,
            // vertically within the editor bounds
            const handleLeft = editorRect.left - 52;
            const inZone =
              e.clientX >= handleLeft &&
              e.clientX <= editorRect.right &&
              e.clientY >= editorRect.top &&
              e.clientY <= editorRect.bottom;

            if (!inZone) {
              hideHandle();
              return;
            }

            // Find which block we're hovering
            const pos = view.posAtCoords({
              left: editorRect.left + 1,
              top: e.clientY,
            });
            if (!pos) { hideHandle(); return; }

            const $pos = view.state.doc.resolve(pos.pos);
            if ($pos.depth < 1) { hideHandle(); return; }

            const nodePos = $pos.before(1);
            const domNode = view.nodeDOM(nodePos);
            if (!domNode || !(domNode instanceof HTMLElement)) { hideHandle(); return; }

            const nodeRect = domNode.getBoundingClientRect();
            currentNodePos = nodePos;
            wrapperEl.style.display = "flex";
            wrapperEl.style.top = `${nodeRect.top + 4}px`;
            wrapperEl.style.left = `${nodeRect.left - 48}px`;
          }

          document.addEventListener("mousemove", onDocMouseMove);

          // Drag start
          handleEl!.addEventListener("dragstart", (e) => {
            if (currentNodePos == null) return;

            const { state } = view;
            const $pos = state.doc.resolve(currentNodePos);
            const node = $pos.nodeAfter;
            if (!node) return;

            const sel = NodeSelection.create(state.doc, currentNodePos);
            view.dispatch(state.tr.setSelection(sel));

            const slice = sel.content();
            const serializer = DOMSerializer.fromSchema(state.schema);
            const fragment = serializer.serializeFragment(slice.content);

            const wrapDiv = document.createElement("div");
            wrapDiv.appendChild(fragment);

            e.dataTransfer!.clearData();
            e.dataTransfer!.setData("text/html", wrapDiv.innerHTML);
            e.dataTransfer!.setData("text/plain", wrapDiv.textContent || "");
            e.dataTransfer!.effectAllowed = "move";

            wrapDiv.style.position = "absolute";
            wrapDiv.style.top = "-10000px";
            document.body.appendChild(wrapDiv);
            e.dataTransfer!.setDragImage(wrapDiv, 0, 0);
            requestAnimationFrame(() => wrapDiv.remove());

            (view as any).dragging = { slice, move: true };
          });

          // Plus button
          plusEl!.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentNodePos == null) return;

            const { state } = view;
            const $pos = state.doc.resolve(currentNodePos);
            const node = $pos.nodeAfter;
            if (!node) return;

            const endOfBlock = currentNodePos + node.nodeSize;
            const tr = state.tr;
            const paragraph = state.schema.nodes.paragraph.create();
            tr.insert(endOfBlock, paragraph);
            tr.setSelection(TextSelection.near(tr.doc.resolve(endOfBlock + 1)));
            view.dispatch(tr);
            view.focus();
            editorRef.commands.insertContent("/");
          });

          return {
            destroy() {
              document.removeEventListener("mousemove", onDocMouseMove);
              wrapper.remove();
            },
          };
        },
      }),
    ];
  },
});
