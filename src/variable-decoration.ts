// example: https://github.com/codemirror/website/blob/main/site/examples/decoration/placeholder.ts
import { Decoration, type DecorationSet, ViewPlugin, type ViewUpdate, WidgetType, MatchDecorator } from '@codemirror/view';
import { EditorView } from 'codemirror';

// Theme styles for the variables
export const variableTheme = {
  '.cm-variable': {
    background: '#e6f7ff',
    borderRadius: '3px',
    padding: '0 2px',
    color: '#1890ff',
    fontWeight: 'bold',
    border: '1px solid #91d5ff',
    display: 'inline-block', // Make it behave as a block
    useSelect: 'none', // Make it non-selectable
    margin: '0 2px', // Add some space between variables
  },
  '.cm-variable-invalid': {
    borderRadius: '3px',
    padding: '0 2px',
    fontWeight: 'bold',
    border: '1px solid #91d5ff',
    display: 'inline-block', // Make it behave as a block
    useSelect: 'none', // Make it non-selectable
    margin: '0 2px', // Add some space between variables
    background: '#fff1f0',
    color: '#f5222d',
  }
};

// Widget that represents a non-editable variable
class VariableWidget extends WidgetType {
  constructor(readonly variableName: string, readonly isValid: boolean) {
    super();
  }

  eq(other: VariableWidget): boolean {
    return other.variableName === this.variableName;
  }

  toDOM(): HTMLElement {
    const element = document.createElement('span');
    if (!this.isValid) {
      element.className = 'cm-variable-invalid';
    } else {
      element.className = 'cm-variable';
    }
    element.textContent = this.variableName;
    return element;
  }

  ignoreEvent(): boolean {
    return false;
  }
}

const variableMatcher = (mode: 'template' | 'variable', variables?: Record<string, string>) => {
  const variableRegex = mode === 'template' ?  /<%=\s*([^%>]+)\s*%>/g : /{{\s*([^}]+)\s*}}/g;
  return new MatchDecorator({
    regexp: variableRegex,
    decoration: match => {
      const trimMatch1 = match[1].trim();
      const isValid = !!variables && variables[trimMatch1] !== undefined;
      return Decoration.replace({
        widget: new VariableWidget(trimMatch1, isValid),
      })
    }
  })
}

// Create a decoration for variables
export const variableDecorations = (mode: 'template' | 'variable', variables?: Record<string, string>) => ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    get matcher() {
      return variableMatcher(mode, variables);
    }

    constructor(view: EditorView) {
      this.decorations = this.matcher.createDeco(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.matcher.updateDeco(update, this.decorations);
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