const MIME_BY_EXT = {
  md: 'text/markdown',
  markdown: 'text/markdown',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
}

function mimeFromName(name) {
  const ext = name.split('.').pop()?.toLowerCase()
  return MIME_BY_EXT[ext] ?? 'application/octet-stream'
}

export function isZipFile(file) {
  const name = file.name.toLowerCase()
  const type = (file.type || '').toLowerCase()
  return (
    name.endsWith('.zip')
    || type === 'application/zip'
    || type === 'application/x-zip-compressed'
    || type === 'multipart/x-zip'
  )
}

export async function extractFilesFromZip(zipFile) {
  const JSZip = (await import('jszip')).default
  const zip = await JSZip.loadAsync(await zipFile.arrayBuffer())
  const files = []

  for (const entry of Object.values(zip.files)) {
    if (entry.dir) continue
    const basename = entry.name.split('/').pop()
    if (!basename || basename.startsWith('.')) continue
    const blob = await entry.async('blob')
    files.push(new File([blob], basename, { type: mimeFromName(basename) }))
  }

  return files
}
