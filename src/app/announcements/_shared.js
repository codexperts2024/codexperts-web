'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Markdown from 'react-markdown'

const MarkdownCodeEditor = dynamic(() => import('./_editor'), { ssr: false })

function IconEdit({ className }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconNoteEdit({ className }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.0002 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2839 19.7822 18.9076C20 18.4802 20 17.921 20 16.8031V14M16 5L10 11V14H13L19 8M16 5L19 2L22 5L19 8M16 5L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconTrash({ className }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 10V17M10 10V17M6 6V17.8C6 18.9201 6 19.4798 6.21799 19.9076C6.40973 20.2839 6.71547 20.5905 7.0918 20.7822C7.5192 21 8.07899 21 9.19691 21H14.8031C15.921 21 16.48 21 16.9074 20.7822C17.2837 20.5905 17.5905 20.2839 17.7822 19.9076C18 19.4802 18 18.921 18 17.8031V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60241 8.15224 4.23486C8.35523 3.74481 8.74432 3.35523 9.23438 3.15224C9.60192 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6447 3.74481 15.8477 4.23486C15.9999 4.6024 16 5.06812 16 6M16 6H18M18 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function formatDate(str) {
  return new Date(str).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
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
  a: ({ href, children }) => <a href={href} className="text-link hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
  img: ({ src, alt }) => <img src={src} alt={alt} className="max-w-full rounded-md my-4" />,
  blockquote: ({ children }) => <blockquote className="border-l-4 border-border pl-4 italic text-text-secondary my-4">{children}</blockquote>,
  code: ({ children, className }) => {
    const isBlock = Boolean(className?.includes('language-'))
    return isBlock
      ? <code className="block bg-bg-layer1 rounded p-4 font-mono text-sm overflow-x-auto my-4">{children}</code>
      : <code className="bg-bg-layer1 rounded px-1 py-0.5 font-mono text-sm">{children}</code>
  },
  hr: () => <hr className="border-border my-6" />,
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
            <IconNoteEdit className="w-6 h-6" />
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

export function PostForm({ form, onChange, onSubmit, onCancel, submitting, editMode = false }) {
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
              <Markdown components={mdComponents}>{form.content}</Markdown>
            ) : (
              <p className="text-text-hint font-inter text-sm italic">Nothing to preview.</p>
            )}
          </div>
        )}
      </div>

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
          <Markdown components={mdComponents}>{post.content}</Markdown>
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
    await onDelete()
    setDeleting(false)
    setShowDeleteModal(false)
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
