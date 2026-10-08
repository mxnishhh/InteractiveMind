import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { VideoOptimizationMeta } from '@/types';

/**
 * Check if the browser natively supports modern WebCodecs hardware acceleration.
 */
export function canOptimizeVideo(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    typeof window.VideoEncoder === 'function' &&
    typeof window.VideoFrame === 'function' &&
    typeof window.createImageBitmap === 'function'
  );
}

export interface VideoMetadata {
  width: number;
  height: number;
  duration: number;
  posterDataUrl: string;
}

/**
 * Extract video metadata and generate a high-resolution Canvas poster frame.
 */
export async function extractVideoMetadata(videoFile: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const objectUrl = URL.createObjectURL(videoFile);
      video.src = objectUrl;

      const cleanup = () => {
        URL.revokeObjectURL(objectUrl);
        video.remove();
        canvas.remove();
      };

      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('Timed out reading video metadata'));
      }, 15000);

      video.addEventListener('loadedmetadata', () => {
        // Seek to 1s or 10% of duration to get a representative frame
        const seekTime = Math.min(1.0, Math.max(0.1, (video.duration || 1) * 0.1));
        video.currentTime = seekTime;
      });

      video.addEventListener('seeked', () => {
        clearTimeout(timeoutId);
        try {
          const width = video.videoWidth || 1280;
          const height = video.videoHeight || 720;
          const duration = video.duration || 0;

          canvas.width = width;
          canvas.height = height;

          if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);
            const posterDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            cleanup();
            resolve({ width, height, duration, posterDataUrl });
          } else {
            cleanup();
            resolve({ width, height, duration, posterDataUrl: '' });
          }
        } catch (err) {
          cleanup();
          reject(err);
        }
      });

      video.addEventListener('error', () => {
        clearTimeout(timeoutId);
        cleanup();
        reject(new Error('Failed to load video file in browser'));
      });

      video.load();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Calculate scaled dimensions fitting within maxWidth x maxHeight,
 * preserving aspect ratio and ensuring even pixel dimensions.
 */
function calculateTargetDimensions(
  origW: number,
  origH: number,
  maxW: number = 1920,
  maxH: number = 1080
): { width: number; height: number } {
  let w = origW;
  let h = origH;

  if (w > maxW || h > maxH) {
    const ratio = Math.min(maxW / w, maxH / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }

  // Ensure even dimensions for standard H.264 macroblocks (yuv420p requirement)
  w = w - (w % 2);
  h = h - (h % 2);

  return {
    width: Math.max(2, w),
    height: Math.max(2, h),
  };
}

/**
 * Calculate recommended target bitrate based on resolution
 */
function getRecommendedBitrate(width: number, height: number): number {
  const pixels = width * height;
  if (pixels >= 1920 * 1080) {
    return 3_200_000; // ~3.2 Mbps for 1080p
  } else if (pixels >= 1280 * 720) {
    return 2_000_000; // ~2.0 Mbps for 720p
  } else {
    return 1_000_000; // ~1.0 Mbps for SD
  }
}

/**
 * Determine supported H.264 codec string for WebCodecs VideoEncoder
 */
async function getSupportedH264Codec(
  width: number,
  height: number,
  bitrate: number
): Promise<string | null> {
  const candidateCodecs = [
    'avc1.4d4028', // Main Profile, Level 4.0/4.1 (Optimal for 1080p web streaming)
    'avc1.420028', // Baseline Profile, Level 4.0
    'avc1.42e01f', // Baseline Profile, Level 3.1
    'avc1.640028', // High Profile, Level 4.0
  ];

  for (const codec of candidateCodecs) {
    try {
      const support = await VideoEncoder.isConfigSupported({
        codec,
        width,
        height,
        bitrate,
      });
      if (support && support.supported) {
        return codec;
      }
    } catch {
      // Continue to next candidate
    }
  }

  return null;
}

/**
 * Helper to seek video with timeout to prevent hanging
 */
function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    let resolved = false;

    const onSeeked = () => {
      if (!resolved) {
        resolved = true;
        video.removeEventListener('seeked', onSeeked);
        resolve();
      }
    };

    video.addEventListener('seeked', onSeeked, { once: true });
    video.currentTime = time;

    // Failsafe timeout in case seeked event doesn't fire immediately
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        video.removeEventListener('seeked', onSeeked);
        resolve();
      }
    }, 400);
  });
}

export interface VideoOptimizationResult {
  optimizedFile: File;
  posterDataUrl: string;
  metadata: VideoOptimizationMeta;
}

/**
 * Transcode raw/camera video into a web-optimized H.264 FastStart MP4 container.
 * Runs 100% in the client browser with hardware acceleration via WebCodecs & mp4-muxer.
 */
export async function optimizeVideo(
  videoFile: File,
  onProgress?: (percentage: number, stage: string) => void
): Promise<VideoOptimizationResult> {
  const originalSize = videoFile.size;

  // 1. Analyze video metadata and extract poster frame
  onProgress?.(5, 'Analyzing video metadata...');
  let meta: VideoMetadata;
  try {
    meta = await extractVideoMetadata(videoFile);
  } catch (err) {
    console.warn('Could not extract video metadata, proceeding with defaults:', err);
    meta = { width: 1920, height: 1080, duration: 10, posterDataUrl: '' };
  }

  const duration = Math.max(0.1, meta.duration || 1);
  const targetDims = calculateTargetDimensions(meta.width, meta.height, 1920, 1080);
  const targetBitrate = getRecommendedBitrate(targetDims.width, targetDims.height);

  // If WebCodecs is not supported in this browser, return original with metadata
  if (!canOptimizeVideo()) {
    onProgress?.(100, 'WebCodecs not supported on this device. Using original video.');
    return {
      optimizedFile: videoFile,
      posterDataUrl: meta.posterDataUrl,
      metadata: {
        optimization_status: 'original',
        original_size_bytes: originalSize,
        optimized_size_bytes: originalSize,
        duration_seconds: Math.round(duration * 100) / 100,
        width: meta.width,
        height: meta.height,
      },
    };
  }

  // 2. Determine supported H.264 codec
  const codec = await getSupportedH264Codec(targetDims.width, targetDims.height, targetBitrate);
  if (!codec) {
    onProgress?.(100, 'H.264 hardware encoder not available. Using original video.');
    return {
      optimizedFile: videoFile,
      posterDataUrl: meta.posterDataUrl,
      metadata: {
        optimization_status: 'original',
        original_size_bytes: originalSize,
        optimized_size_bytes: originalSize,
        duration_seconds: Math.round(duration * 100) / 100,
        width: meta.width,
        height: meta.height,
      },
    };
  }

  // 3. Extract and transcode audio if present
  onProgress?.(10, 'Extracting and processing audio track...');
  let audioBuffer: AudioBuffer | null = null;
  let hasAudio = false;
  let audioChannels = 2;
  let audioSampleRate = 44100;

  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await videoFile.slice(0).arrayBuffer();
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    if (audioBuffer && audioBuffer.numberOfChannels > 0) {
      hasAudio = true;
      audioChannels = Math.min(2, audioBuffer.numberOfChannels);
      audioSampleRate = audioBuffer.sampleRate;
    }
    await audioCtx.close();
  } catch (audioErr) {
    // Silent video or unsupported audio container
    hasAudio = false;
  }

  // Check if AudioEncoder supports AAC
  let canEncodeAudio = false;
  if (hasAudio && typeof window.AudioEncoder === 'function') {
    try {
      const audioSupport = await AudioEncoder.isConfigSupported({
        codec: 'mp4a.40.2',
        numberOfChannels: audioChannels,
        sampleRate: audioSampleRate,
        bitrate: 128000,
      });
      canEncodeAudio = Boolean(audioSupport && audioSupport.supported);
    } catch {
      canEncodeAudio = false;
    }
  }

  // 4. Initialize MP4 Muxer with FastStart
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: 'avc',
      width: targetDims.width,
      height: targetDims.height,
    },
    audio: canEncodeAudio
      ? {
          codec: 'aac',
          numberOfChannels: audioChannels,
          sampleRate: audioSampleRate,
        }
      : undefined,
    fastStart: 'in-memory',
    firstTimestampBehavior: 'offset',
  });

  // 5. Initialize Video Encoder
  let videoEncoderError: Error | null = null;
  const videoEncoder = new VideoEncoder({
    output: (chunk, metadata) => {
      muxer.addVideoChunk(chunk, metadata);
    },
    error: (e) => {
      console.error('VideoEncoder error occurred:', e);
      videoEncoderError = e instanceof Error ? e : new Error(String(e));
    },
  });

  videoEncoder.configure({
    codec,
    width: targetDims.width,
    height: targetDims.height,
    bitrate: targetBitrate,
    framerate: 30,
    avc: { format: 'avc' },
  });

  // 6. Encode Audio Chunks if available
  if (canEncodeAudio && audioBuffer) {
    try {
      const audioEncoder = new AudioEncoder({
        output: (chunk, metadata) => {
          muxer.addAudioChunk(chunk, metadata);
        },
        error: (e) => {
          console.error('AudioEncoder error:', e);
        },
      });

      audioEncoder.configure({
        codec: 'mp4a.40.2',
        numberOfChannels: audioChannels,
        sampleRate: audioSampleRate,
        bitrate: 128000,
      });

      const totalSamples = audioBuffer.length;
      const chunkSize = 1024; // Standard AAC frame size
      const channelData: Float32Array[] = [];
      for (let ch = 0; ch < audioChannels; ch++) {
        channelData.push(audioBuffer.getChannelData(ch));
      }

      for (let offset = 0; offset < totalSamples; offset += chunkSize) {
        const currentChunkSize = Math.min(chunkSize, totalSamples - offset);
        const planarData = new Float32Array(currentChunkSize * audioChannels);

        for (let ch = 0; ch < audioChannels; ch++) {
          planarData.set(
            channelData[ch].subarray(offset, offset + currentChunkSize),
            ch * currentChunkSize
          );
        }

        const timestampUs = Math.round((offset / audioSampleRate) * 1_000_000);
        const audioData = new AudioData({
          format: 'f32-planar',
          sampleRate: audioSampleRate,
          numberOfFrames: currentChunkSize,
          numberOfChannels: audioChannels,
          timestamp: timestampUs,
          data: planarData,
        });

        audioEncoder.encode(audioData);
        audioData.close();
      }

      await audioEncoder.flush();
      audioEncoder.close();
    } catch (aErr) {
      console.warn('Non-fatal error encoding audio track:', aErr);
    }
  }

  // 7. Video Frame Extraction and Transcoding Loop
  const video = document.createElement('video');
  const canvas = document.createElement('canvas');
  canvas.width = targetDims.width;
  canvas.height = targetDims.height;
  const ctx = canvas.getContext('2d', { alpha: false });

  video.preload = 'auto';
  video.muted = true;
  video.playsInline = true;

  const videoUrl = URL.createObjectURL(videoFile);
  video.src = videoUrl;

  try {
    await new Promise<void>((resolve, reject) => {
      video.addEventListener('loadeddata', () => resolve(), { once: true });
      video.addEventListener('error', () => reject(new Error('Failed to load video element')), {
        once: true,
      });
      video.load();
    });

    const fps = 30;
    const totalFrames = Math.max(1, Math.ceil(duration * fps));
    const frameIntervalUs = Math.round(1_000_000 / fps);
    const keyframeInterval = fps * 2; // Keyframe every 2 seconds

    for (let frameIdx = 0; frameIdx < totalFrames; frameIdx++) {
      if (videoEncoderError) {
        throw videoEncoderError;
      }

      const currentTimeSec = frameIdx / fps;
      const timestampUs = frameIdx * frameIntervalUs;

      await seekVideo(video, currentTimeSec);

      if (ctx) {
        ctx.drawImage(video, 0, 0, targetDims.width, targetDims.height);
      }

      const isKeyFrame = frameIdx % keyframeInterval === 0;
      const videoFrame = new VideoFrame(canvas, { timestamp: timestampUs });

      videoEncoder.encode(videoFrame, { keyFrame: isKeyFrame });
      videoFrame.close();

      // Report progress: 15% -> 85%
      const progressPercent = 15 + Math.round((frameIdx / totalFrames) * 70);
      if (frameIdx % 5 === 0 || frameIdx === totalFrames - 1) {
        onProgress?.(
          progressPercent,
          `Optimizing video (${frameIdx + 1}/${totalFrames} frames)...`
        );
      }
    }

    // 8. Finalize Video Stream & FastStart Container
    onProgress?.(88, 'Finalizing FastStart container...');
    await videoEncoder.flush();
    videoEncoder.close();

    muxer.finalize();
    const buffer = muxer.target.buffer;
    const optimizedBlob = new Blob([buffer], { type: 'video/mp4' });

    // Clean up temporary DOM & Blob objects
    URL.revokeObjectURL(videoUrl);
    video.remove();
    canvas.remove();

    const cleanBaseName = videoFile.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_');
    const optimizedFile = new File([optimizedBlob], `${cleanBaseName}.mp4`, {
      type: 'video/mp4',
    });

    const optimizedSize = optimizedFile.size;
    onProgress?.(100, 'Video optimization complete!');

    return {
      optimizedFile,
      posterDataUrl: meta.posterDataUrl,
      metadata: {
        optimization_status: 'ready',
        original_size_bytes: originalSize,
        optimized_size_bytes: optimizedSize,
        duration_seconds: Math.round(duration * 100) / 100,
        width: targetDims.width,
        height: targetDims.height,
      },
    };
  } catch (err: any) {
    console.error('Video optimization encountered an error, falling back to original:', err);
    URL.revokeObjectURL(videoUrl);
    video.remove();
    canvas.remove();

    try {
      videoEncoder.close();
    } catch {}

    onProgress?.(100, 'Using original video due to transcode issue.');
    return {
      optimizedFile: videoFile,
      posterDataUrl: meta.posterDataUrl,
      metadata: {
        optimization_status: 'failed',
        original_size_bytes: originalSize,
        optimized_size_bytes: originalSize,
        duration_seconds: Math.round(duration * 100) / 100,
        width: meta.width,
        height: meta.height,
      },
    };
  }
}
