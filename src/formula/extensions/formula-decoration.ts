import { type EditorView, ViewPlugin, Decoration, type DecorationSet } from '@codemirror/view';

const formulaPattern = /{{([^{}]*)}}/g;

export const formulaDecorationPlugin = () => ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  
  constructor(view: EditorView) {
    this.decorations = this.createDecorations(view);
  }
  
  update(update: any) {
    if (update.docChanged) {
      this.decorations = this.createDecorations(update.view);
    }
  }
  
  createDecorations(view: EditorView) {
    const decorations = [];
    const { doc } = view.state;
    
    // 遍历所有的 {{ xxx }} 格式文本
    for (let i = 0; i < doc.length; i++) {
      const line = doc.lineAt(i);
      let match: RegExpExecArray | null;
      
      while ((match = formulaPattern.exec(line.text)) !== null) {
        const start = line.from + match.index;
        const end = line.from + match.index + match[0].length;
        
        // 创建公式装饰
        decorations.push(Decoration.mark({
          class: "excel-formula-marker"
        }).range(start, end));
      }
    }
    
    return Decoration.set(decorations);
  }
}, {
  decorations: v => v.decorations
});