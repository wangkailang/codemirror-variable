// example: https://github.com/codemirror/website/blob/main/site/examples/decoration/placeholder.ts
import { Decoration, type DecorationSet, ViewPlugin, type ViewUpdate, WidgetType, MatchDecorator } from '@codemirror/view';
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
    useSelect: 'none', // Make it non-selectable
    margin: '0 2px', // Add some space between variables
  }
};

// Widget that represents a non-editable variable
class VariableWidget extends WidgetType {
  constructor(readonly variableName: string) {
    super();
  }

  eq(other: VariableWidget): boolean {
    return other.variableName === this.variableName;
  }

  toDOM(): HTMLElement {
    const element = document.createElement('span');
    element.className = 'cm-variable-template';
    element.textContent = this.variableName;
    return element;
  }

  ignoreEvent(): boolean {
    return false;
  }
}

const variableMatcher = (mode: 'template' | 'variable') => {
  const variableRegex = mode === 'template' ?  /<%=\s*([^%>]+)\s*%>/g : /{{\s*([^}]+)\s*}}/g;
  return new MatchDecorator({
    regexp: variableRegex,
    decoration: match => Decoration.replace({
      widget: new VariableWidget(match[1]),
    })
  })
}

// Create a decoration for variables
export const variableDecorations = (mode: 'template' | 'variable') => ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = variableMatcher(mode).createDeco(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = variableMatcher(mode).updateDeco(update, this.decorations);
      }
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