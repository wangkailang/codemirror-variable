// TemplateEditor.tsx
import React from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { variableDecorations, variableTheme } from './variable-decoration';

interface TemplateEditorProps {
  initialValue: string;
  onChange?: (value: string) => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const viewRef = React.useRef<EditorView | null>(null);
  const initialValueRef = React.useRef(initialValue);

  React.useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        basicSetup,
        variableDecorations,
        EditorView.theme(variableTheme),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        })
      ]
    });

    const view = new EditorView({
      state,
      parent: editorRef.current
    });
    
    // Store the view reference
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  // Update the editor content only when initialValue changes AND differs from editor content
  React.useEffect(() => {
    if (!viewRef.current) return;
    
    const currentContent = viewRef.current.state.doc.toString();
    if (initialValue !== currentContent && initialValue !== initialValueRef.current) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: currentContent.length,
          insert: initialValue
        }
      });
    }
  }, [initialValue]);

  const insertTemplateVariable = () => {
    if (!viewRef.current) return;
    
    // Get the current cursor position (selection)
    const selection = viewRef.current.state.selection.main;
    const cursorPos = selection.empty ? selection.from : selection.from;
    
    // Insert <%= xxx %> at cursor position
    viewRef.current.dispatch({
      changes: {
        from: cursorPos,
        to: cursorPos,
        insert: '<%= xxx %>'
      },
      // Optionally: Position cursor inside the variable
      selection: { anchor: cursorPos + 4, head: cursorPos + 7 }
    });
    
    // Focus the editor after insertion
    viewRef.current.focus();
  };

  return (
    <div>
      <div ref={editorRef} style={{ border: '1px solid #ccc', width: '600px', height: '400px' }} />
      <button onClick={insertTemplateVariable}>+</button>
    </div>
  );
};

export default TemplateEditor;