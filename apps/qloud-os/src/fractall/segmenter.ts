/**
 * Audio Segmenter for Fractal-1
 * 
 * PHASE OMEGA: Splits audio into deterministic segments for streaming
 */

import type { FractalSegment } from './types';
import { LZAbyss } from './lzAbyss';

const SEGMENT_DURATION_MS = 250; // 250ms segments

export class AudioSegmenter {
  /**
   * Segment audio buffer into chunks
   */
  static segmentAudio(
    audioBuffer: AudioBuffer,
    useCompression: boolean = true
  ): {
    segments: Float32Array[];
    segmentTable: FractalSegment[];
  } {
    const sampleRate = audioBuffer.sampleRate;
    const channels = audioBuffer.numberOfChannels;
    const duration = audioBuffer.duration;
    const samplesPerSegment = Math.floor((SEGMENT_DURATION_MS / 1000) * sampleRate);
    const segmentCount = Math.ceil(audioBuffer.length / samplesPerSegment);
    
    const segments: Float32Array[] = [];
    const segmentTable: FractalSegment[] = [];
    let currentOffset = 0;
    
    // Get mono channel (mix all channels)
    const monoData = this.getMonoChannel(audioBuffer);
    
    for (let i = 0; i < segmentCount; i++) {
      const start = i * samplesPerSegment;
      const end = Math.min(start + samplesPerSegment, monoData.length);
      const segmentData = monoData.slice(start, end);
      
      // Apply compression if requested
      let processedData: Float32Array;
      let compressed = false;
      let size = segmentData.length * 4; // 4 bytes per float32
      
      if (useCompression) {
        const filtered = LZAbyss.prefilter(segmentData);
        const compressedData = LZAbyss.compress(filtered);
        if (compressedData.length < size) {
          processedData = segmentData; // Keep original if compression doesn't help
          // In real implementation, store compressed version
        } else {
          processedData = segmentData;
          compressed = true;
        }
      } else {
        processedData = segmentData;
      }
      
      segments.push(processedData);
      
      segmentTable.push({
        index: i,
        offset: currentOffset,
        size: processedData.length * 4,
        timestamp: start / sampleRate,
        compressed,
      });
      
      currentOffset += processedData.length * 4;
    }
    
    return { segments, segmentTable };
  }

  /**
   * Get mono channel from multi-channel audio
   */
  private static getMonoChannel(audioBuffer: AudioBuffer): Float32Array {
    if (audioBuffer.numberOfChannels === 1) {
      return audioBuffer.getChannelData(0);
    }
    
    // Mix all channels to mono
    const length = audioBuffer.length;
    const mono = new Float32Array(length);
    const channelCount = audioBuffer.numberOfChannels;
    
    for (let i = 0; i < length; i++) {
      let sum = 0;
      for (let ch = 0; ch < channelCount; ch++) {
        sum += audioBuffer.getChannelData(ch)[i];
      }
      mono[i] = sum / channelCount;
    }
    
    return mono;
  }

  /**
   * Reconstruct audio from segments
   */
  static reconstructAudio(
    segments: Float32Array[],
    sampleRate: number,
    channels: number
  ): AudioBuffer {
    // Calculate total length
    const totalLength = segments.reduce((sum, seg) => sum + seg.length, 0);
    
    // Create audio buffer
    const audioContext = new AudioContext({ sampleRate });
    const audioBuffer = audioContext.createBuffer(channels, totalLength, sampleRate);
    
    // Copy segments to buffer
    let offset = 0;
    for (const segment of segments) {
      for (let ch = 0; ch < channels; ch++) {
        const channelData = audioBuffer.getChannelData(ch);
        channelData.set(segment, offset);
      }
      offset += segment.length;
    }
    
    return audioBuffer;
  }
}
