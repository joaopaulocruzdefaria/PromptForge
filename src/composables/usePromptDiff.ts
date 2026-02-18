// src/composables/usePromptDiff.ts
import { ref, computed, type Ref } from "vue";
import DiffMatchPatch from "diff-match-patch";

export interface DiffBlock {
  id: number;
  type: "equal" | "change";
  oldText: string;
  newText: string;
  status: "pending" | "accepted" | "rejected";
  inlineDiffs?: Array<[number, string]>;
}

export function usePromptDiff(originalText: Ref<string>, newText: Ref<string>) {
  const dmp = new DiffMatchPatch();
  const blocks = ref<DiffBlock[]>([]);

  const calculateInlineDiff = (text1: string, text2: string) => {
    const diff = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(diff);
    return diff;
  };

  const computeBlocks = () => {
    if (!originalText.value || !newText.value) {
      blocks.value = [];
      return;
    }

    const a = dmp.diff_linesToChars_(originalText.value, newText.value);
    const diffs = dmp.diff_main(a.chars1, a.chars2, false);
    dmp.diff_charsToLines_(diffs, a.lineArray);
    dmp.diff_cleanupSemantic(diffs);

    const newBlocks: DiffBlock[] = [];
    let currentId = 0;

    for (let i = 0; i < diffs.length; i++) {
      const [type, text] = diffs[i]!;

      if (type === 0) {
        newBlocks.push({
          id: currentId++,
          type: "equal",
          oldText: text,
          newText: text,
          status: "accepted",
        });
      } else {
        let blockOld = "";
        let blockNew = "";

        const nextDiff = diffs[i + 1];

        if (type === -1) {
          blockOld = text;
          if (nextDiff && nextDiff[0] === 1) {
            blockNew = nextDiff[1];
            i++;
          }
        } else if (type === 1) {
          blockNew = text;
        }

        const inlineDiffs = calculateInlineDiff(blockOld, blockNew);

        newBlocks.push({
          id: currentId++,
          type: "change",
          oldText: blockOld,
          newText: blockNew,
          status: "pending",
          inlineDiffs: inlineDiffs,
        });
      }
    }

    blocks.value = newBlocks;
  };

  // Computa diffs simples (raw) para uso geral
  const rawDiffs = computed(() => {
    const diff = dmp.diff_main(originalText.value, newText.value);
    dmp.diff_cleanupSemantic(diff);
    return diff;
  });

  const diffHtml = computed(() => {
    return dmp.diff_prettyHtml(rawDiffs.value);
  });

  // Ações de resolve
  const resolveBlock = (id: number, decision: "accepted" | "rejected") => {
    const block = blocks.value.find((b) => b.id === id);
    if (block) block.status = decision;
  };

  const undoResolution = (id: number) => {
    const block = blocks.value.find((b) => b.id === id);
    if (block) block.status = "pending";
  };

  const pendingCount = computed(
    () => blocks.value.filter((b) => b.type === "change" && b.status === "pending").length
  );

  const mergedResult = computed(() => {
    let finalString = "";
    blocks.value.forEach((block) => {
      if (block.type === "equal") {
        finalString += block.newText;
      } else {
        finalString += block.status === "accepted" ? block.newText : block.oldText;
      }
    });
    return finalString;
  });

  return {
    rawDiffs,
    diffHtml,
    blocks,
    computeBlocks,
    resolveBlock,
    undoResolution,
    pendingCount,
    mergedResult,
  };
}
