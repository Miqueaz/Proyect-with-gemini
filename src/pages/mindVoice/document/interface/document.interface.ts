export type BlockType = 'h1' | 'h2' | 'p' | 'todo';

export interface TextStyle {
  bold: boolean;
  italic: boolean;
  underline?: boolean;
}

export interface Block extends TextStyle {
  id: string;
  type: BlockType;
  content: string;
  completed?: boolean;
}

export interface DocData {
  title: string;
  emoji: string;
  titleStyle: TextStyle;
  coverColor: string;
  tags: string[];
  blocks: Block[];
}

export interface DocumentActions {
  docData: DocData;
  updateTitle: (val: string) => void;
  updateTitleStyle: (key: keyof TextStyle) => void;
  updateEmoji: (val: string) => void;
  updateBlock: (id: string, newContent: string) => void;
  updateBlockType: (id: string, newType: BlockType) => void;
  toggleBlockStyle: (id: string, styleKey: keyof TextStyle) => void;
  toggleTodo: (id: string) => void;
  addBlock: (afterId: string, type?: BlockType) => void;
  removeBlock: (id: string) => void;
  activeBlockId: string | null;
  setActiveBlockId: (id: string | null) => void;
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  rightSidebarOpen: boolean;
  setRightSidebarOpen: (open: boolean) => void;
}
