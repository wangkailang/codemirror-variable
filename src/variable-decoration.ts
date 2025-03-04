import { Decoration, type DecorationSet, ViewPlugin, type ViewUpdate, WidgetType } from '@codemirror/view';
import type { Range } from '@codemirror/state';
import { EditorView } from 'codemirror';

// Theme styles for the variables
export const variableTheme = {
  '.cm-variable-template': {
    background: '#e6f7ff',
    borderRadius: '3px',
    padding: '0 2px',
    color: '#1890ff',
    fontWeight: 'bold',
    border: '1px solid #91d5ff',
    display: 'inline-block', // Make it behave as a block
  }
};

// Widget that represents a non-editable variable
class VariableWidget extends WidgetType {
  constructor(readonly text: string, readonly variableName: string) {
    super();
  }

  eq(other: VariableWidget): boolean {
    return other.text === this.text && other.variableName === this.variableName;
  }

  toDOM(): HTMLElement {
    const element = document.createElement('span');
    element.className = 'cm-variable-template';
    element.textContent = this.variableName;
    // Make the element non-selectable
    element.style.userSelect = 'none';
    element.style.margin = '0 2px';
    return element;
  }

  ignoreEvent(): boolean {
    return false;
  }
}

// Create a decoration for variables
export const variableDecorations = (mode: 'template' | 'variable') => ViewPlugin.fromClass(
  class {
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
      const decorations: Range<Decoration>[] = [];
      const content = view.state.doc.toString();
      const variableRegex = mode === 'template' ?  /<%=\s*([^%>]+)\s*%>/g : /{{\s*([^}]+)\s*}}/g;
      
      // Find all variable occurrences
      let match: RegExpExecArray | null;
      variableRegex.lastIndex = 0; // Reset regex index
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      while ((match = variableRegex.exec(content)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        const fullMatch = match[0];
        const variableName = match[1].trim();
        
        // Create a replacement decoration with a widget
        decorations.push(
          Decoration.replace({
            widget: new VariableWidget(fullMatch, variableName),
            inclusive: false, // Don't include in selection
            block: false, // This is an inline widget
            side: 1 // Bias to the right, helps with cursor positioning
          }).range(start, end)
        );
      }
      
      return Decoration.set(decorations);
    }
  },
  {
    decorations: v => v.decorations,
    // variable decorations are atomic, so they don't need to be recomputed when the viewport changes
    provide: plugin => EditorView.atomicRanges.of(view => {
      return view.plugin(plugin)?.decorations || Decoration.none;
    })
  }
);