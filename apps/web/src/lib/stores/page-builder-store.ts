'use client';

import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Block, BlockStyle, PageContent } from '@zunapro/types';

const MAX_HISTORY = 50;

interface PageBuilderState {
  blocks: Block[];
  selectedBlockId: string | null;
  hoveredBlockId: string | null;
  history: Block[][];
  historyIndex: number;
  isDirty: boolean;
  devicePreview: 'desktop' | 'tablet' | 'mobile';
  isSaving: boolean;

  // Actions
  setBlocks: (blocks: Block[]) => void;
  addBlock: (block: Block, parentId?: string, index?: number) => void;
  removeBlock: (blockId: string) => void;
  moveBlock: (blockId: string, targetParentId: string | null, targetIndex: number) => void;
  updateBlockProps: (blockId: string, props: Record<string, unknown>) => void;
  updateBlockStyle: (blockId: string, style: Partial<BlockStyle>) => void;
  selectBlock: (blockId: string | null) => void;
  hoverBlock: (blockId: string | null) => void;
  duplicateBlock: (blockId: string) => void;
  undo: () => void;
  redo: () => void;
  setDevicePreview: (device: 'desktop' | 'tablet' | 'mobile') => void;
  setIsSaving: (saving: boolean) => void;
  markClean: () => void;
  getContent: () => PageContent;
  getSelectedBlock: () => Block | null;
}

function generateId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function findBlockById(blocks: Block[], id: string): Block | null {
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.children) {
      const found = findBlockById(block.children, id);
      if (found) return found;
    }
  }
  return null;
}

function removeBlockFromTree(blocks: Block[], id: string): Block[] {
  return blocks
    .filter((b) => b.id !== id)
    .map((b) => ({
      ...b,
      children: b.children ? removeBlockFromTree(b.children, id) : undefined,
    }));
}

function deepCloneBlock(block: Block): Block {
  const cloned: Block = {
    ...block,
    id: generateId(),
    props: JSON.parse(JSON.stringify(block.props)),
    style: block.style ? { ...block.style } : undefined,
    children: block.children?.map(deepCloneBlock),
    visibility: block.visibility ? { ...block.visibility } : undefined,
  };
  return cloned;
}

function insertBlockAtIndex(
  blocks: Block[],
  block: Block,
  parentId: string | null,
  index: number,
): Block[] {
  if (!parentId) {
    const result = [...blocks];
    result.splice(index, 0, block);
    return result;
  }

  return blocks.map((b) => {
    if (b.id === parentId) {
      const children = b.children ? [...b.children] : [];
      children.splice(index, 0, block);
      return { ...b, children };
    }
    if (b.children) {
      return {
        ...b,
        children: insertBlockAtIndex(b.children, block, parentId, index),
      };
    }
    return b;
  });
}

export const usePageBuilderStore: UseBoundStore<StoreApi<PageBuilderState>> = create<PageBuilderState>()(
  immer((set, get) => ({
    blocks: [],
    selectedBlockId: null,
    hoveredBlockId: null,
    history: [[]],
    historyIndex: 0,
    isDirty: false,
    devicePreview: 'desktop',
    isSaving: false,

    setBlocks: (blocks) =>
      set((state) => {
        state.blocks = blocks;
        state.history = [JSON.parse(JSON.stringify(blocks))];
        state.historyIndex = 0;
        state.isDirty = false;
      }),

    addBlock: (block, parentId, index) =>
      set((state) => {
        const newBlock = { ...block, id: block.id || generateId() };
        if (parentId) {
          const parent = findBlockById(state.blocks, parentId);
          if (parent) {
            if (!parent.children) parent.children = [];
            const idx = index ?? parent.children.length;
            parent.children.splice(idx, 0, newBlock);
          }
        } else {
          const idx = index ?? state.blocks.length;
          state.blocks.splice(idx, 0, newBlock);
        }
        pushHistory(state);
      }),

    removeBlock: (blockId) =>
      set((state) => {
        state.blocks = removeBlockFromTree(state.blocks, blockId);
        if (state.selectedBlockId === blockId) {
          state.selectedBlockId = null;
        }
        pushHistory(state);
      }),

    moveBlock: (blockId, targetParentId, targetIndex) =>
      set((state) => {
        const block = findBlockById(state.blocks, blockId);
        if (!block) return;
        const cloned = JSON.parse(JSON.stringify(block));
        state.blocks = removeBlockFromTree(state.blocks, blockId);
        state.blocks = insertBlockAtIndex(
          state.blocks,
          cloned,
          targetParentId,
          targetIndex,
        );
        pushHistory(state);
      }),

    updateBlockProps: (blockId, props) =>
      set((state) => {
        const block = findBlockById(state.blocks, blockId);
        if (block) {
          block.props = { ...block.props, ...props };
          pushHistory(state);
        }
      }),

    updateBlockStyle: (blockId, style) =>
      set((state) => {
        const block = findBlockById(state.blocks, blockId);
        if (block) {
          block.style = { ...block.style, ...style };
          pushHistory(state);
        }
      }),

    selectBlock: (blockId) =>
      set((state) => {
        state.selectedBlockId = blockId;
      }),

    hoverBlock: (blockId) =>
      set((state) => {
        state.hoveredBlockId = blockId;
      }),

    duplicateBlock: (blockId) =>
      set((state) => {
        const block = findBlockById(state.blocks, blockId);
        if (!block) return;
        const cloned = deepCloneBlock(block);

        // Find parent and insert after the block
        const insertAfterInList = (blocks: Block[]): boolean => {
          const index = blocks.findIndex((b) => b.id === blockId);
          if (index !== -1) {
            blocks.splice(index + 1, 0, cloned);
            return true;
          }
          for (const b of blocks) {
            if (b.children && insertAfterInList(b.children)) return true;
          }
          return false;
        };

        insertAfterInList(state.blocks);
        pushHistory(state);
      }),

    undo: () =>
      set((state) => {
        if (state.historyIndex > 0) {
          state.historyIndex--;
          state.blocks = JSON.parse(
            JSON.stringify(state.history[state.historyIndex]),
          );
          state.isDirty = true;
        }
      }),

    redo: () =>
      set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex++;
          state.blocks = JSON.parse(
            JSON.stringify(state.history[state.historyIndex]),
          );
          state.isDirty = true;
        }
      }),

    setDevicePreview: (device) =>
      set((state) => {
        state.devicePreview = device;
      }),

    setIsSaving: (saving) =>
      set((state) => {
        state.isSaving = saving;
      }),

    markClean: () =>
      set((state) => {
        state.isDirty = false;
      }),

    getContent: (): PageContent => ({
      version: 1,
      blocks: get().blocks,
    }),

    getSelectedBlock: () => {
      const { blocks, selectedBlockId } = get();
      if (!selectedBlockId) return null;
      return findBlockById(blocks, selectedBlockId);
    },
  })),
);

function pushHistory(state: PageBuilderState) {
  const snapshot = JSON.parse(JSON.stringify(state.blocks));
  // Remove any future history (after current index)
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(snapshot);
  if (state.history.length > MAX_HISTORY) {
    state.history.shift();
  } else {
    state.historyIndex++;
  }
  state.isDirty = true;
}
