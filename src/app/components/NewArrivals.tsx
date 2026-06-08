'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import Icon from '@/components/ui/AppIcon';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/context/LanguageContext';

interface Product {
  id: string;
  name: string;
  nameKa: string;
  nameRu: string;
  price: number;
  img: string;
  tag?: string;
  rating: number;
}

export default function NewArrivals({ products: initialProducts = [] }: { products?: any[] }) {
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const revealRef = useScrollAnimation();

  const mappedInitial =
    Array.isArray(initialProducts) && initialProducts.length > 0
      ? initialProducts.slice(0, 6).map((p: any) => ({
          id: p.id,
          name: p.name,
          nameKa: p.nameKa,
          nameRu: p.nameRu,
          price: p.price,
          img: p.images?.[0]?.url || '/assets/images/no_image.png',
          tag: p.tag,
          rating: p.rating ?? 5,
        }))
      : [];

  const [products] = useState<Product[]>(mappedInitial);

  const getProdName = (prod: Product) => {
    if (language === 'GE') return prod.nameKa;
    if (language === 'RU') return prod.nameRu;
    return prod.name;
  };

  return (
    <section id="new-arrivals" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Head */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-500">
            {t('handcrafted_luxury')}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">
            {t('new_arrivals')}
          </h2>
          <p className="text-neutral-500 font-light text-sm sm:text-base">
            {t('arrivals_subtitle')}
          </p>
        </div>

        {/* Product Grid */}
        <div ref={revealRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((prod) => (
            <article key={prod.id} className="group relative flex flex-col justify-between">
              {/* Product Image */}
              <div className="aspect-[3/4] bg-neutral-50 rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-md transition-all duration-300">
                <Image
                  src={prod.img}
                  alt={getProdName(prod)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {prod.tag && (
                  <span className="absolute top-4 left-4 bg-neutral-950 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                    {prod.tag}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="pt-6 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-neutral-900 text-base">{getProdName(prod)}</h3>
                  <span className="text-base font-semibold text-neutral-900">
                    {prod.price} {t('gel')}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 text-neutral-800 text-xs">
                  {Array.from({ length: prod.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                  {Array.from({ length: 5 - prod.rating }).map((_, i) => (
                    <span key={i} className="text-neutral-200">
                      ★
                    </span>
                  ))}
                </div>

                {/* Action button */}
                <div className="pt-4">
                  <button
                    onClick={() =>
                      addToCart({
                        id: prod.id,
                        name: prod.name,
                        nameKa: prod.nameKa,
                        nameRu: prod.nameRu,
                        price: prod.price,
                        img: prod.img,
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 border border-neutral-950 text-neutral-950 font-semibold py-2.5 rounded-full hover:bg-neutral-950 hover:text-white transition-all duration-300 text-xs uppercase tracking-wider"
                  >
                    <Icon name="PlusIcon" size={14} />
                    {t('add_to_cart')}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
