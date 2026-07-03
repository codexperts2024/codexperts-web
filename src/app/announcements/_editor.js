import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { EditorView } from '@codemirror/view'

const customTheme = EditorView.theme({
  '&': { fontSize: '14px', fontFamily: 'var(--font-jetbrains-mono), monospace' },
  '.cm-content': { padding: '12px 0', minHeight: '280px' },
  '.cm-line': { padding: '0 16px' },
  '.cm-gutters': { backgroundColor: '#f6f8fa', borderRight: '1px solid #d0d7de', color: '#656d76', userSelect: 'none' },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 8px', minWidth: '40px', textAlign: 'right' },
  '.cm-activeLine': { backgroundColor: 'rgba(0,0,0,0.03)' },
  '.cm-activeLineGutter': { backgroundColor: 'rgba(0,0,0,0.05)' },
  '.cm-focused': { outline: 'none' },
  '.cm-editor': { borderRadius: '0 0 6px 6px' },
})

export default function MarkdownCodeEditor({ value, onChange, height = '360px', onFilesDrop }) {
  const extensions = [markdown(), customTheme]

  if (onFilesDrop) {
    extensions.push(EditorView.domEventHandlers({
      dragover(event) {
        if (event.dataTransfer?.types?.includes('Files')) {
          event.preventDefault()
          return true
        }
        return false
      },
      drop(event) {
        const files = Array.from(event.dataTransfer?.files ?? [])
        if (files.length === 0) return false
        event.preventDefault()
        event.stopPropagation()
        onFilesDrop(files)
        return true
      },
    }))
  }

  return (
    <CodeMirror
      value={value}
      height={height}
      extensions={extensions}
      onChange={onChange}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        dropCursor: true,
        allowMultipleSelections: false,
        indentOnInput: true,
        syntaxHighlighting: true,
        bracketMatching: false,
        closeBrackets: false,
        autocompletion: false,
        highlightActiveLine: true,
        searchKeymap: false,
        completionKeymap: false,
      }}
    />
  )
}
