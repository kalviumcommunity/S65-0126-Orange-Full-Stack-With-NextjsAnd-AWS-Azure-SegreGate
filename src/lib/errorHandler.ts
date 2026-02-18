import { NextResponse } from 'next/server';

export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({ level: 'info', message, meta, timestamp: new Date().toISOString() }));
  },
  error: (message: string, meta?: any) => {
    console.error(JSON.stringify({ level: 'error', message, meta, timestamp: new Date().toISOString() }));
  },
};

export function handleError(error: any, context: string) {
  const isProd = process.env.NODE_ENV === 'production';

  const errorResponse = {
    success: false,
    message: isProd ? 'Something went wrong. Please try again later.' : error.message || 'Unknown error',
    ...(isProd ? {} : { stack: error.stack }),
  };

  logger.error(`Error in ${context}`, {
    message: error.message,
    stack: isProd ? 'REDACTED' : error.stack,
  });

  return NextResponse.json(errorResponse, { status: 500 });
}
