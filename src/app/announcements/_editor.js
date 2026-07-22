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

function collectImageFiles(fileList) {
  return Array.from(fileList ?? []).filter((file) => file.type.startsWith('image/'))
}

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
      drop(event, view) {
        const files = collectImageFiles(event.dataTransfer?.files)
        if (files.length === 0) return false
        event.preventDefault()
        event.stopPropagation()
        onFilesDrop(files, view)
        return true
      },
      paste(event, view) {
        const items = Array.from(event.clipboardData?.items ?? [])
        const files = items
          .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
          .map((item) => item.getAsFile())
          .filter(Boolean)
        if (files.length === 0) return false
        event.preventDefault()
        onFilesDrop(files, view)
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
