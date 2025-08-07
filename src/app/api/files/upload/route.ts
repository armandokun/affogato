import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getServerSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: 'File size should be less than 10MB'
    })
    .refine((file) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type), {
      message: 'File type should be JPEG, PNG, or PDF'
    })
})

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (request.body === null) {
    return new Response('Request body is empty', { status: 400 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as Blob

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const validatedFile = FileSchema.safeParse({ file })

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.issues.map((issue) => issue.message).join(', ')

      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    const fileOriginalName = (formData.get('file') as File).name
    const fileBuffer = await file.arrayBuffer()
    const userId = session.id
    const ext = fileOriginalName.includes('.') ? fileOriginalName.split('.').pop() : ''
    const randomId = globalThis.crypto?.randomUUID
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15)
    const safeFilename = ext ? `${randomId}.${ext}` : randomId
    const filePath = `${userId}/${safeFilename}`

    try {
      const supabase = await createClient()

      const { error } = await supabase.storage
        .from('chat-file-uploads')
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: false
        })

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('chat-file-uploads')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365) // 1 year

      if (signedUrlError) {
        return NextResponse.json({ error: signedUrlError.message }, { status: 500 })
      }

      return NextResponse.json({
        url: signedUrlData.signedUrl,
        name: fileOriginalName,
        contentType: file.type
      })
    } catch {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
  } catch {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
