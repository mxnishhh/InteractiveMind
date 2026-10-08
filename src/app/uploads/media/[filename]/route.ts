import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';
import { getUploadBaseDir, ALLOWED_MIME_MAP } from '@/lib/media-storage';

export const dynamic = 'force-dynamic';

const MIME_LOOKUP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

/**
 * Validate that the requested filename is a safe, single-segment file name
 * without path traversal characters.
 */
function isValidFilename(filename: string): boolean {
  if (!filename || typeof filename !== 'string') return false;
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\') || filename.includes('\0')) {
    return false;
  }
  // Prevent accessing hidden system files
  if (filename.startsWith('.')) return false;
  return true;
}

/**
 * Shared handler for GET and HEAD requests to serve stored media files
 * with full support for HTTP 206 Partial Content byte-range streaming.
 */
async function handleMediaRequest(
  req: NextRequest,
  { params }: { params: { filename: string } }
): Promise<Response> {
  const { filename } = params;

  if (!isValidFilename(filename)) {
    return new NextResponse('Invalid media path', { status: 400 });
  }

  const baseDir = getUploadBaseDir();
  const filePath = path.resolve(baseDir, filename);

  // Security check: verify resolved path is strictly within baseDir
  if (!filePath.startsWith(baseDir)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  let stat: fs.Stats;
  try {
    stat = await fsPromises.stat(filePath);
    if (!stat.isFile()) {
      return new NextResponse('Media not found', { status: 404 });
    }
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return new NextResponse('Media not found', { status: 404 });
    }
    return new NextResponse('Error accessing media', { status: 500 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = MIME_LOOKUP[ext] || 'application/octet-stream';
  const totalSize = stat.size;

  const baseHeaders: Record<string, string> = {
    'Content-Type': contentType,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
  };

  const rangeHeader = req.headers.get('range');

  // Handle Range Requests (HTTP 206) - essential for video seeking/scrubbing
  if (rangeHeader && rangeHeader.startsWith('bytes=')) {
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const startStr = parts[0]?.trim();
    const endStr = parts[1]?.trim();

    let start = startStr ? parseInt(startStr, 10) : 0;
    let end = endStr ? parseInt(endStr, 10) : totalSize - 1;

    // Suffix byte range: bytes=-500 (last 500 bytes)
    if (!startStr && endStr) {
      start = totalSize - parseInt(endStr, 10);
      end = totalSize - 1;
    }

    // Validate range values
    if (isNaN(start) || isNaN(end) || start < 0 || start >= totalSize || start > end) {
      return new NextResponse(null, {
        status: 416,
        headers: {
          ...baseHeaders,
          'Content-Range': `bytes */${totalSize}`,
        },
      });
    }

    // Clamp end to totalSize - 1
    if (end >= totalSize) {
      end = totalSize - 1;
    }

    const chunkSize = end - start + 1;

    const rangeHeaders = {
      ...baseHeaders,
      'Content-Range': `bytes ${start}-${end}/${totalSize}`,
      'Content-Length': chunkSize.toString(),
    };

    if (req.method === 'HEAD') {
      return new NextResponse(null, {
        status: 206,
        headers: rangeHeaders,
      });
    }

    const nodeStream = fs.createReadStream(filePath, { start, end });
    const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

    return new Response(webStream, {
      status: 206,
      headers: rangeHeaders,
    });
  }

  // Full file request (HTTP 200)
  const fullHeaders = {
    ...baseHeaders,
    'Content-Length': totalSize.toString(),
  };

  if (req.method === 'HEAD') {
    return new NextResponse(null, {
      status: 200,
      headers: fullHeaders,
    });
  }

  const nodeStream = fs.createReadStream(filePath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

  return new Response(webStream, {
    status: 200,
    headers: fullHeaders,
  });
}

export async function GET(
  req: NextRequest,
  context: { params: { filename: string } }
): Promise<Response> {
  return handleMediaRequest(req, context);
}

export async function HEAD(
  req: NextRequest,
  context: { params: { filename: string } }
): Promise<Response> {
  return handleMediaRequest(req, context);
}
