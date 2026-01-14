import { useState } from 'react';
import type { Block, BlockType, DocData, DocumentActions, TextStyle } from '../interface/document.interface';

export const useDocumentEngine = (): DocumentActions => {
  const [docData, setDocData] = useState<DocData>({
    title: "Estrategia de Lanzamiento MindVoice Q1",
    emoji: "🚀",
    titleStyle: { bold: true, italic: false },
    coverColor: "bg-gradient-to-r from-indigo-500 to-purple-600",
    tags: ["Prioridad Alta", "Marketing", "IA"],
    blocks: [
      { id: 'b1', type: 'h1', content: 'Visión General del Proyecto', bold: true, italic: false, underline: false },
      { id: 'b2', type: 'p', content: 'Este documento resume las ideas capturadas durante la sesión de brainstorming por voz.', bold: false, italic: false, underline: false },
      { id: 'b3', type: 'h2', content: 'Objetivos Clave', bold: true, italic: false, underline: false },
      { id: 'b4', type: 'todo', content: 'Finalizar integración con Supabase Auth', completed: true, bold: false, italic: false, underline: false },
      { id: 'b5', type: 'todo', content: 'Optimizar latencia de Whisper en el procesamiento de audios largos.', completed: false, bold: false, italic: true, underline: false },
    ]
  });

  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true);

  const updateTitle = (val: string) => setDocData(prev => ({ ...prev, title: val }));
  const updateEmoji = (val: string) => setDocData(prev => ({ ...prev, emoji: val }));
  
  const updateTitleStyle = (key: keyof TextStyle) => setDocData(prev => ({ 
    ...prev, 
    titleStyle: { ...prev.titleStyle, [key]: !prev.titleStyle[key] } 
  }));

  const updateBlock = (id: string, newContent: string) => {
    setDocData(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, content: newContent } : b)
    }));
  };

  const updateBlockType = (id: string, newType: BlockType) => {
    setDocData(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, type: newType } : b)
    }));
  };

  const toggleBlockStyle = (id: string, styleKey: keyof TextStyle) => {
    setDocData(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, [styleKey]: !b[styleKey] } : b)
    }));
  };

  const toggleTodo = (id: string) => {
    setDocData(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, completed: !b.completed } : b)
    }));
  };

  const addBlock = (afterId: string, type: BlockType = 'p') => {
    const newBlock: Block = { 
      id: Math.random().toString(36).substr(2, 9), 
      type, 
      content: '', 
      completed: false,
      bold: false,
      italic: false,
      underline: false
    };
    const index = docData.blocks.findIndex(b => b.id === afterId);
    const newBlocks = [...docData.blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setDocData(prev => ({ ...prev, blocks: newBlocks }));
    setActiveBlockId(newBlock.id);
  };

  const removeBlock = (id: string) => {
    if (docData.blocks.length <= 1) return;
    setDocData(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== id) }));
  };

  return { 
    docData, 
    updateTitle, 
    updateTitleStyle,
    updateEmoji,
    updateBlock, 
    updateBlockType,
    toggleBlockStyle,
    toggleTodo, 
    addBlock, 
    removeBlock,
    activeBlockId,
    setActiveBlockId,
    leftSidebarOpen,
    setLeftSidebarOpen,
    rightSidebarOpen,
    setRightSidebarOpen
  };
};
