'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const whatsappNumber = '5569992688660';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      title="Falar com suporte"
    >
      <MessageCircle className="w-7 h-7 text-white" />
      <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Falar com suporte
      </span>
    </a>
  );
}
