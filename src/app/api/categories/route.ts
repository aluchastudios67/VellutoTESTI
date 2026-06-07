import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Categories change very infrequently — cache for 1 hour
export const revalidate = 3600;

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    const response = NextResponse.json(categories);
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400',
    );
    return response;
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch categories.' }, { status: 500 });
  }
}
