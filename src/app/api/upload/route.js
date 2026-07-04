import { v2 as cloudinary } from 'cloudinary'
import { createClient } from '@supabase/supabase-js'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const ALLOWED_FOLDERS = ['hero', 'profiles', 'announcements', 'events', 'problems']

const FOLDER_ROLES = {
  hero: ['executive', 'admin'],
  profiles: ['member', 'executive', 'admin'],
  announcements: ['executive', 'admin'],
  events: ['executive', 'admin'],
  problems: ['executive', 'admin'],
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.slice(7)
  const serviceClient = getServiceClient()

  const { data: { user }, error: authError } = await serviceClient.auth.getUser(token)
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const folder = request.nextUrl.searchParams.get('folder')
  if (!folder || !ALLOWED_FOLDERS.includes(folder)) {
    return Response.json({ error: 'Invalid folder' }, { status: 400 })
  }

  const { data: profile } = await serviceClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !FOLDER_ROLES[folder].includes(profile.role)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 })
  }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `codexperts/${folder}`,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    return Response.json({ url: result.secure_url, publicId: result.public_id })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
