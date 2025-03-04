import React from 'react';
import type { EditorView } from 'codemirror';
import { Decoration, type DecorationSet, ViewPlugin, type ViewUpdate, WidgetType } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
const variableRegex = /<%=\s*([^%>]*)\s*%>/g;

// Create a widget type for template variables
class TemplateVariableWidget extends WidgetType {
  constructor(readonly content: string) {
    super();
  }

  toDOM() {
    const span = document.createElement('span');
    span.className = 'template-variable';
    span.textContent = this.content;
    return span;
  }

  eq(other: TemplateVariableWidget) {
    return other.content === this.content;
  }

  ignoreEvent() {
    return false;
  }
}

export const variableDecorations = ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  
  constructor(view: EditorView) {
    this.decorations = this.buildDecorations(view);
  }
  
  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.buildDecorations(update.view);
    }
  }
  
  buildDecorations(view: EditorView) {
    const builder = new RangeSetBuilder<Decoration>();
    const content = view.state.doc.toString();
    
    for (const match of content.matchAll(variableRegex)) {
      const start = match.index!;
      const end = start + match[0].length;
      const varContent = match[1].trim();
      
      // Create a widget decoration that replaces <%= xxx %> with just xxx
      const decoration = Decoration.replace({
        widget: new TemplateVariableWidget(varContent)
      });
      
      builder.add(start, end, decoration);
    }
    
    return builder.finish();
  }
}, {
  decorations: v => v.decorations
});

export const variableTheme = {
  '.template-variable': {
    backgroundColor: '#d8d2fc',
    padding: '3px 8px',
    margin: '2px',
    borderRadius: '4px',
    fontSize: '12px',
  }
}