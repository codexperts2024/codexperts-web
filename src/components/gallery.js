'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Gallery({ gallery, eventTitle }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index) => {
    setCurrentIndex(index)
    setSelectedImage(gallery[index])
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? gallery.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    setSelectedImage(gallery[newIndex])
  }

  const goToNext = () => {
    const newIndex = currentIndex === gallery.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    setSelectedImage(gallery[newIndex])
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => {
          const newIndex = prev === 0 ? gallery.length - 1 : prev - 1
          setSelectedImage(gallery[newIndex])
          return newIndex
        })
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => {
          const newIndex = prev === gallery.length - 1 ? 0 : prev + 1
          setSelectedImage(gallery[newIndex])
          return newIndex
        })
      } else if (e.key === 'Escape') {
        setSelectedImage(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, gallery])

  if (!gallery || gallery.length === 0) {
    return null
  }

  return (
    <>
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-text-primary font-montserrat mb-6">
          Photos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => openLightbox(index)}
              onKeyDown={(e) => { if (e.key === 'Enter') openLightbox(index) }}
              role="button"
              tabIndex={0}
            >
              <Image
                src={image}
                alt={`${eventTitle} - ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-bg-elevated/0 group-hover:bg-bg-elevated/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-bg-elevated/90 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={(e) => { if (e.key === 'Escape') closeLightbox() }}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-bg-base hover:opacity-80 transition z-10"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goToPrevious() }}
            className="absolute left-4 text-bg-base hover:opacity-80 transition z-10 bg-bg-elevated/50 rounded-full p-2"
            aria-label="Previous"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goToNext() }}
            className="absolute right-4 text-bg-base hover:opacity-80 transition z-10 bg-bg-elevated/50 rounded-full p-2"
            aria-label="Next"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-bg-base text-sm bg-bg-elevated/50 px-3 py-1 rounded-full font-inter">
            {currentIndex + 1} / {gallery.length}
          </div>

          <div
            className="flex items-center justify-center w-full max-w-2xl max-h-[70vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={`${eventTitle} - ${currentIndex + 1}`}
              width={800}
              height={600}
              className="w-full max-w-2xl max-h-[70vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
