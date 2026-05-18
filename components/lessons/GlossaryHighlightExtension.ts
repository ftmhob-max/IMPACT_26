import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { GlossaryTermData } from "./GlossaryTooltip";
import { buildGlossaryRegex } from "./GlossaryTooltip";

const glossaryPluginKey = new PluginKey("glossaryHighlight");

export const GlossaryHighlightExtension = Extension.create<{
  terms: Map<string, GlossaryTermData>;
}>({
  name: "glossaryHighlight",

  addOptions() {
    return { terms: new Map() };
  },

  addProseMirrorPlugins() {
    const { terms } = this.options;
    if (terms.size === 0) return [];

    const termNames = [...terms.keys()].map((k) => {
      // We stored lowercase keys; look up the original term name for the regex
      return terms.get(k)!.term;
    });
    const regex = buildGlossaryRegex(termNames);
    if (!regex) return [];

    return [
      new Plugin({
        key: glossaryPluginKey,
        props: {
          decorations(state) {
            const { doc } = state;
            const decorations: Decoration[] = [];

            doc.descendants((node, pos) => {
              if (!node.isText || !node.text) return;
              const text = node.text;
              regex.lastIndex = 0;
              let match: RegExpExecArray | null;
              while ((match = regex.exec(text)) !== null) {
                const start = pos + match.index;
                const end = start + match[0].length;
                const termKey = match[0].toLowerCase();
                decorations.push(
                  Decoration.inline(start, end, {
                    class: "glossary-term",
                    "data-glossary-term": termKey,
                  })
                );
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
