import React, { useState, useMemo } from 'react';
import { EditorView, minimalSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { variableDecorations, variableTheme } from './variable-decoration';

interface TemplateEditorProps {
  initialValue: string;
  onChange?: (value: string) => void;
  mode?: 'template' | 'variable';
  variables?: Record<string, string>;
}

interface MenuPosition {
  top: number;
  left: number;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ initialValue, onChange, mode = 'template', variables }) => {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const viewRef = React.useRef<EditorView | null>(null);
  const initialValueRef = React.useRef(initialValue);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  const menus = useMemo(() => {
    if (!variables) return [];
    return Object.keys(variables).map((key) => ({
      label: variables[key],
      value: key
    }));
  }
  , [variables]);

  React.useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        minimalSetup,
        variableDecorations(mode, variables),
        EditorView.theme(variableTheme),
        EditorView.updateListener.of((update) => {
          if (update.docChanged || update.selectionSet) {
            const cursor = update.state.selection.main.head;
            const beforeCursor = update.state.sliceDoc(
              Math.max(0, cursor - 1),
              cursor
            );

            if (beforeCursor === "/") {
              const coords = update.view.coordsAtPos(cursor);
              if (coords) {
                setMenuPosition({ top: coords.bottom, left: coords.left });
                setMenuVisible(true);
              }
            } else {
              setMenuVisible(false);
            }
          }
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        }),
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

  const insertTemplateVariable = (value: string, clearSlash?: boolean) => {
    if (!viewRef.current) return;
    
    // Get the current cursor position (selection)
    const selection = viewRef.current.state.selection.main;
    const cursorPos = selection.empty ? selection.from : selection.from;

    const variableText = mode === 'template' ?  `<%= ${value} %>` : `{{${value}}}`;
    const from = clearSlash ? cursorPos - 1 : cursorPos;
    const to = cursorPos;

    // Insert variable at cursor position
    viewRef.current.dispatch({
      changes: {
        from,
        to,
        insert: variableText
      },
      // Position cursor after the inserted variable
      selection: {
        anchor: from + variableText.length,
        head: from + variableText.length
      }
    });
    // Focus the editor after insertion
    viewRef.current.focus();
  };

  return (
    <div>
      <div ref={editorRef} style={{ border: '1px solid #ccc', width: '600px', height: '150px', position: 'relative' }} />
      {menuVisible && menuPosition && (
        <ul
        style={{
          position: "absolute",
          top: menuPosition.top,
          left: menuPosition.left,
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "4px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
          listStyle: "none",
          margin: 0,
          padding: "8px",
          zIndex: 1000,
        }}
      >
        {menus.map((menu) => (
          <li key={menu.value} onClick={(e) => {
            e.preventDefault();
            insertTemplateVariable(menu.value, true);
            setMenuVisible(false);
          }}>
            {menu.label}
          </li>
        ))}
      </ul>
      )}
    </div>
  );
};

export default TemplateEditor;