import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });
}

export function errorResponse(error: unknown, status = 500): NextResponse<ApiResponse> {
  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  // Never log credentials - only log generic error info
  console.error(`API Error: ${message}`);
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}