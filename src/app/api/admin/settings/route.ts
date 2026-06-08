import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_SETTINGS = {
  storeName: 'Velluto Luxury Store',
  contactEmail: 'boutique@velluto.com',
  contactPhone: '+995 599 12 34 56',
  address: 'Vardisubani, Tbilisi, Georgia',
  socialLinks: {
    instagram: 'https://www.instagram.com/velluto_____/',
    facebook: 'https://facebook.com/velluto',
    pinterest: 'https://pinterest.com/velluto',
  },
  shipping: {
    tbilisiRate: 0,
    regionalRate: 15,
    minFreeShipping: 300,
  },
  tax: {
    vatRate: 18,
    isTaxIncluded: true,
  },
  payments: {
    bankTransfer: true,
    cashOnDelivery: true,
    cardOnDelivery: true,
    bankDetails: 'TBC Bank: GE82TB77364525374839',
  },
  heroImages: [] as string[],
};

export async function GET() {
  try {
    const record = await prisma.storeSettings.findUnique({
      where: { id: 'global' },
    });
    
    if (record && record.data) {
      return NextResponse.json(record.data);
    }
    return NextResponse.json(DEFAULT_SETTINGS);
  } catch (e) {
    console.error('Failed to read settings from DB:', e);
    // Fallback to default if DB fails
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function POST(req: Request) {
  try {
    const settings = await req.json();

    await prisma.storeSettings.upsert({
      where: { id: 'global' },
      update: { data: settings },
      create: { id: 'global', data: settings },
    });

    // Audit log is non-critical — don't let a DB failure block the save
    try {
      await prisma.auditLog.create({
        data: {
          action: 'UPDATE_SETTINGS',
          details: 'Updated global store shipping, tax, payment parameters.',
        },
      });
    } catch (auditErr) {
      console.warn('Audit log write failed (non-critical):', auditErr);
    }

    return NextResponse.json({ success: true, settings });
  } catch (e) {
    console.error('Failed to update store settings in DB:', e);
    return NextResponse.json({ error: 'Failed to update store settings.' }, { status: 500 });
  }
}
