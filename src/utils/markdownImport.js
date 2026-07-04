const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg)$/i

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildImageFileMap(files) {
  const map = new Map()
  for (const file of files) {
    if (!IMAGE_EXT.test(file.name)) continue
    const lower = file.name.toLowerCase()
    map.set(lower, file)
    const stem = lower.replace(/\.[^.]+$/, '')
    map.set(stem, file)
    const base = lower.split('/').pop()
    map.set(base, file)
  }
  return map
}

function dataUriToFile(dataUri, fallbackName = 'image.png') {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/i)
  if (!match) return null
  const mime = match[1]
  const binary = atob(match[2])
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const ext = mime.split('/')[1]?.replace('jpeg', 'jpg') ?? 'png'
  const name = fallbackName.includes('.') ? fallbackName : `${fallbackName}.${ext}`
  return new File([bytes], name, { type: mime })
}

function stripAngleBrackets(value) {
  return value.trim().replace(/^<|>$/g, '')
}

export function normalizeMarkdownTables(md) {
  const lines = []
  for (const line of md.split('\n')) {
    const pipeCount = (line.match(/\|/g) || []).length
    if (!line.includes('|') || pipeCount < 4) {
      lines.push(line)
      continue
    }

    const expanded = line
      .replace(/\|\s*\|/g, '|\n|')
      .replace(/(\|)\s*(:?-{2,}:?)(\|)/g, '$1\n|$2$3')

    for (const part of expanded.split('\n')) {
      const trimmed = part.trim()
      if (trimmed) lines.push(trimmed)
    }
  }
  return lines.join('\n')
}

function htmlTableToMarkdown(tableHtml) {
  if (typeof DOMParser === 'undefined') return tableHtml

  const doc = new DOMParser().parseFromString(tableHtml, 'text/html')
  const table = doc.querySelector('table')
  if (!table) return tableHtml

  const rows = [...table.querySelectorAll('tr')]
  if (rows.length === 0) return tableHtml

  const mdRows = rows.map((row) => {
    const cells = [...row.querySelectorAll('th, td')]
    return `| ${cells.map((cell) => cellToMarkdown(cell)).join(' | ')} |`
  })

  const colCount = Math.max(...rows.map((row) => row.querySelectorAll('th, td').length))
  const separator = `| ${Array(colCount).fill('---').join(' | ')} |`
  if (mdRows.length === 1) mdRows.splice(1, 0, separator)
  else if (!/^\|\s*:?-{2,}/.test(mdRows[1] ?? '')) mdRows.splice(1, 0, separator)

  return mdRows.join('\n')
}

function cellToMarkdown(cell) {
  const images = [...cell.querySelectorAll('img')]
  if (images.length > 0) {
    return images
      .map((img) => {
        const src = img.getAttribute('src') ?? ''
        const alt = img.getAttribute('alt') ?? ''
        return `![${alt}](${src})`
      })
      .join(' ')
  }

  const text = cell.textContent.replace(/\|/g, '\\|').replace(/\n/g, ' ').trim()
  return text
}

export function convertHtmlTablesToMarkdown(md) {
  if (!/<table[\s>]/i.test(md)) return md
  return md.replace(/<table[\s\S]*?<\/table>/gi, (tableHtml) => htmlTableToMarkdown(tableHtml))
}

function parseReferenceDefinitions(md) {
  const defs = new Map()
  const body = md.replace(/^\[([^\]]+)\]:\s*(.+)$/gm, (_, ref, target) => {
    defs.set(ref.trim(), stripAngleBrackets(target))
    return ''
  })
  return { body: body.trim(), defs }
}

export function inlineReferenceImages(md, defs) {
  let result = md
  for (const [ref, url] of defs) {
    if (!url) continue
    const refPattern = new RegExp(`!\\[([^\\]]*)\\]\\[${escapeRegExp(ref)}\\]`, 'g')
    result = result.replace(refPattern, (_, alt) => `![${alt}](${url})`)
  }
  return result
}

export function countUnresolvedImageRefs(md) {
  const inlineRefs = [...md.matchAll(/!\[[^\]]*\]\[([^\]]+)\]/g)]
  const defs = new Map()
  for (const [, ref, target] of md.matchAll(/^\[([^\]]+)\]:\s*(.+)$/gm)) {
    defs.set(ref.trim(), stripAngleBrackets(target))
  }

  let missing = 0
  for (const [, ref] of inlineRefs) {
    const target = defs.get(ref.trim())
    if (!target || (!target.startsWith('http') && !target.startsWith('data:'))) missing += 1
  }
  return missing + countRelativeImageUrls(md)
}

function isResolvedImageUrl(src) {
  return /^(https?:|data:|blob:)/i.test(src.trim())
}

export function countRelativeImageUrls(md) {
  const inline = [...md.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)]
  let missing = 0
  for (const [, src] of inline) {
    if (!isResolvedImageUrl(src)) missing += 1
  }
  const htmlImages = [...md.matchAll(/<img[^>]+src="([^"]+)"/gi)]
  for (const [, src] of htmlImages) {
    if (!isResolvedImageUrl(src)) missing += 1
  }
  return missing
}

export function buildPendingImageMap(files) {
  const map = new Map()
  for (const file of files) {
    if (!IMAGE_EXT.test(file.name)) continue
    map.set(file.name.toLowerCase(), file)
  }
  return map
}

export function guessTitleFromFilename(filename) {
  const base = filename.replace(/\.[^.]+$/, '').trim()
  const withoutNumericPrefix = base.replace(/^\d+[-_.\s]+/, '')
  const cleaned = (withoutNumericPrefix || base).replace(/[-_]+/g, ' ').trim()
  return cleaned || 'Untitled'
}

export function guessTitleFromImport(mdFile, mdText) {
  const heading = mdText.match(/^#\s+(.+)$/m)
  if (heading?.[1]) return heading[1].trim().slice(0, 120)

  const blockquoteLead = mdText.match(/^>\s*([A-Za-z][^\n(]{2,60})/m)
  if (blockquoteLead?.[1]) return blockquoteLead[1].trim()

  return guessTitleFromFilename(mdFile.name)
}

export function applyLocalImagesForPreview(md, pendingImageMap) {
  if (!pendingImageMap?.size) return md
  let result = md
  for (const match of result.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    const src = match[2]
    if (isResolvedImageUrl(src)) continue
    const base = src.split('/').pop()?.toLowerCase()
    const file = base ? pendingImageMap.get(base) : null
    if (!file) continue
    const blobUrl = URL.createObjectURL(file)
    result = result.replace(
      new RegExp(`!\\[([^\\]]*)\\]\\(${escapeRegExp(src)}\\)`, 'g'),
      `![$1](${blobUrl})`,
    )
  }
  return result.replace(/<img([^>]+)src="([^"]+)"/gi, (full, attrs, src) => {
    if (isResolvedImageUrl(src)) return full
    const base = src.split('/').pop()?.toLowerCase()
    const file = base ? pendingImageMap.get(base) : null
    if (!file) return full
    return `<img${attrs}src="${URL.createObjectURL(file)}"`
  })
}

export async function uploadLocalImagesInMarkdown(md, pendingImageMap, uploadImage) {
  if (!uploadImage || !pendingImageMap?.size) return md
  let processed = md
  const uploaded = new Map()

  for (const [, src] of [...processed.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)]) {
    if (isResolvedImageUrl(src)) continue
    const base = src.split('/').pop()?.toLowerCase()
    const file = base ? pendingImageMap.get(base) : null
    if (!file || uploaded.has(base)) continue
    const url = await uploadImage(file)
    uploaded.set(base, url)
    processed = processed.replace(
      new RegExp(`!\\[[^\\]]*\\]\\([^)]*${escapeRegExp(base)}\\)`, 'gi'),
      `![](${url})`,
    )
    processed = processed.replace(
      new RegExp(`src="[^"]*${escapeRegExp(base)}"`, 'gi'),
      `src="${url}"`,
    )
  }

  return processed
}

async function uploadDataUriIfNeeded(target, ref, uploadImage) {
  if (!target.startsWith('data:')) return target
  const file = dataUriToFile(target, ref)
  if (!file) return target
  return uploadImage(file)
}

async function uploadAndReplaceRef(processed, ref, target, imageMap, uploadImage) {
  const trimmed = stripAngleBrackets(target)
  if (!trimmed) return processed

  if (trimmed.startsWith('http')) return processed

  if (trimmed.startsWith('data:')) {
    const url = await uploadDataUriIfNeeded(trimmed, ref, uploadImage)
    return processed.replace(
      new RegExp(`^\\[${escapeRegExp(ref)}\\]:\\s*.+$`, 'm'),
      `[${ref}]: ${url}`,
    )
  }

  const baseName = trimmed.split('/').pop().toLowerCase()
  const stem = baseName.replace(/\.[^.]+$/, '')
  const imgFile = imageMap.get(baseName) || imageMap.get(stem) || imageMap.get(trimmed.toLowerCase())
  if (!imgFile) return processed

  const url = await uploadImage(imgFile)
  return processed.replace(
    new RegExp(`^\\[${escapeRegExp(ref)}\\]:\\s*.+$`, 'm'),
    `[${ref}]: ${url}`,
  )
}

export async function resolveMarkdownWithAssets(mdText, files, uploadImage) {
  let processed = convertHtmlTablesToMarkdown(mdText)
  processed = normalizeMarkdownTables(processed)

  if (!uploadImage) {
    const { body, defs } = parseReferenceDefinitions(processed)
    return inlineReferenceImages(body, defs)
  }

  const imageMap = buildImageFileMap(files)
  const refDefs = [...processed.matchAll(/^\[([^\]]+)\]:\s*(.+)$/gm)]

  for (const [, ref, target] of refDefs) {
    processed = await uploadAndReplaceRef(processed, ref, target, imageMap, uploadImage)
  }

  for (const [name, file] of imageMap) {
    if (!name.includes('.')) continue
    const url = await uploadImage(file)
    const base = name.split('/').pop()
    processed = processed.replace(
      new RegExp(`!\\[[^\\]]*\\]\\([^)]*${escapeRegExp(base)}\\)`, 'gi'),
      `![](${url})`,
    )
    processed = processed.replace(
      new RegExp(`src="[^"]*${escapeRegExp(base)}"`, 'gi'),
      `src="${url}"`,
    )
  }

  const { body, defs } = parseReferenceDefinitions(processed)
  const updatedDefs = new Map(defs)
  for (const [ref, target] of updatedDefs) {
    if (target.startsWith('data:')) {
      const url = await uploadDataUriIfNeeded(target, ref, uploadImage)
      updatedDefs.set(ref, url)
    }
  }

  return inlineReferenceImages(body, updatedDefs)
}

export function pickMarkdownFile(files) {
  return files.find((file) => {
    const name = file.name.toLowerCase()
    return name.endsWith('.md') || name.endsWith('.markdown')
  })
}

export function prepareMarkdownForDisplay(md) {
  if (!md) return md
  let text = convertHtmlTablesToMarkdown(md)
  text = normalizeMarkdownTables(text)
  const { body, defs } = parseReferenceDefinitions(text)
  return inlineReferenceImages(body, defs)
}
