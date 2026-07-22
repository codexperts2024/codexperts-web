'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Markdown from 'react-markdown'

import { IconEdit, IconTrash, IconNew } from '@/components/ui/Icons'
import { sanitizeMarkdownUrl } from '@/utils/sanitizeMarkdownUrl'

const MarkdownCodeEditor = dynamic(() => import('./_editor'), { ssr: false })

export function formatDate(str) {
  return new Date(str).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}

function safeUrlTransform(url) {
  return sanitizeMarkdownUrl(url) ?? ''
}

const mdComponents = {
  h1: ({ children }) => <h1 className="font-montserrat font-bold text-2xl text-text-primary mt-6 mb-3">{children}</h1>,
  h2: ({ children }) => <h2 className="font-montserrat font-semibold text-xl text-text-primary mt-5 mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="font-montserrat font-medium text-lg text-text-primary mt-4 mb-2">{children}</h3>,
  p: ({ children }) => <p className="text-text-primary font-inter text-base leading-[1.7] mb-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 text-text-primary font-inter">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 text-text-primary font-inter">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => {
    const safeHref = sanitizeMarkdownUrl(href)
    if (!safeHref) return <span>{children}</span>
    return (
      <a href={safeHref} className="text-link hover:underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  },
  img: ({ src, alt }) => {
    const safeSrc = sanitizeMarkdownUrl(src)
    if (!safeSrc) return null
    return <img src={safeSrc} alt={alt ?? ''} className="max-w-full rounded-md my-4" />
  },
  blockquote: ({ children }) => <blockquote className="border-l-4 border-border pl-4 italic text-text-secondary my-4">{children}</blockquote>,
  code: ({ children, className }) => {
    const isBlock = Boolean(className?.includes('language-'))
    return isBlock
      ? <code className="block bg-bg-layer1 rounded p-4 font-mono text-sm overflow-x-auto my-4">{children}</code>
      : <code className="bg-bg-layer1 rounded px-1 py-0.5 font-mono text-sm">{children}</code>
  },
  hr: () => <hr className="border-border my-6" />,
}

export function AnnouncementMarkdown({ children }) {
  return (
    <Markdown components={mdComponents} urlTransform={safeUrlTransform}>
      {children}
    </Markdown>
  )
}

export function PageHeader({ isAdmin, onNew }) {
  return (
    <div className="bg-[#F9F9F9] py-8 px-4 sm:px-6">
      <div className="max-w-[900px] mx-auto flex items-center justify-between">
        <h1 className="font-montserrat font-bold text-4xl text-text-primary">Announcements</h1>
        {isAdmin && (
          <button
            onClick={onNew}
            title="New Announcement"
            className="bg-accent text-white p-3 rounded-md hover:bg-accent-hover transition-colors"
          >
            <IconNew className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  )
}

function EditorTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-border bg-[#f6f8fa] px-3 pt-2 rounded-t-md gap-1">
      {['Write', 'Preview'].map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-1.5 text-sm font-inter rounded-t-md transition-colors ${
            activeTab === tab
              ? 'bg-white border border-b-0 border-border text-text-primary font-medium -mb-px pb-2'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export function PostForm({ form, onChange, onSubmit, onCancel, submitting, editMode = false, error = '' }) {
  const [tab, setTab] = useState('Write')

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={e => onChange(prev => ({ ...prev, title: e.target.value }))}
        className="w-full border border-border rounded-md px-3 py-2 text-sm font-inter text-text-primary bg-white focus:outline-none focus:border-border-strong"
      />

      <div className="border border-border rounded-md overflow-hidden">
        <EditorTabs activeTab={tab} onTabChange={setTab} />

        {tab === 'Write' ? (
          <div className="bg-white">
            <MarkdownCodeEditor
              value={form.content}
              onChange={val => onChange(prev => ({ ...prev, content: val ?? '' }))}
            />
          </div>
        ) : (
          <div className="min-h-[360px] bg-white px-6 py-4">
            {form.content.trim() ? (
              <AnnouncementMarkdown>{form.content}</AnnouncementMarkdown>
            ) : (
              <p className="text-text-hint font-inter text-sm italic">Nothing to preview.</p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-error font-inter">{error}</p>
      )}

      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-border-strong rounded-md text-sm font-inter text-text-secondary hover:bg-[#F9F9F9] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={!form.title.trim() || submitting}
          className="px-5 py-2 bg-accent text-white rounded-md text-sm font-medium font-inter hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (editMode ? 'Saving...' : 'Publishing...') : (editMode ? 'Save' : 'Publish')}
        </button>
      </div>
    </div>
  )
}

export function DeleteModal({ onConfirm, onCancel, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <p className="font-inter text-base text-text-primary mb-6">
          Delete this announcement? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-border-strong rounded-md text-sm font-inter text-text-secondary hover:bg-[#F9F9F9] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="px-5 py-2 bg-accent text-white rounded-md text-sm font-medium font-inter hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function PostContent({ post }) {
  return (
    <div className="bg-white py-12 px-4 sm:px-6">
      <div className="max-w-[800px] mx-auto">
        <h2 className="font-montserrat font-bold text-2xl text-text-primary mb-2">{post.title}</h2>
        <p className="text-sm text-text-hint font-inter mb-4">
          {formatDate(post.createdAt)} &middot; {post.authorName}
        </p>
        <div className="border-t border-border mb-8" />
        <div>
          <AnnouncementMarkdown>{post.content}</AnnouncementMarkdown>
        </div>
      </div>
    </div>
  )
}

export function NavRow({ onPrev, onNext, onList, onDelete, onEdit, prevDisabled, nextDisabled, isAdmin }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await onDelete()
      setShowDeleteModal(false)
    } catch {
      // Parent surfaces the error message
    } finally {
      setDeleting(false)
    }
  }

  const btnBase = 'px-4 py-2 border rounded-md text-sm font-inter transition-colors'
  const btnActive = `${btnBase} border-border-strong text-text-secondary hover:bg-[#F9F9F9]`
  const btnDisabled = `${btnBase} border-border text-border-strong cursor-not-allowed`

  return (
    <>
      <div className="py-8 px-4 sm:px-6 border-t border-border">
        <div className="max-w-[800px] mx-auto flex items-start justify-between">
          <button onClick={onPrev} disabled={prevDisabled} className={prevDisabled ? btnDisabled : btnActive}>
            ← Previous
          </button>
          <button onClick={onList} className={btnActive}>List</button>
          <div className="flex flex-col items-end gap-2">
            <button onClick={onNext} disabled={nextDisabled} className={nextDisabled ? btnDisabled : btnActive}>
              Next →
            </button>
            {isAdmin && (
              <div className="flex gap-1">
                <button onClick={onEdit} title="Edit" className="p-1.5 text-text-secondary hover:text-text-primary transition-colors rounded-md hover:bg-[#F9F9F9]">
                  <IconEdit className="w-4 h-4" />
                </button>
                <button onClick={() => setShowDeleteModal(true)} title="Delete" className="p-1.5 text-accent hover:text-accent-hover transition-colors rounded-md hover:bg-accent-bg">
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          deleting={deleting}
        />
      )}
    </>
  )
}
