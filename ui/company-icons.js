/** Local vector icons; no external font or image download. */
export function companyIcon(name){
 const shapes={
  star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
  shield:'<path d="m12 2 8 3v6c0 5-5 9-8 11-3-2-8-6-8-11V5z"/><path d="m8 12 3 3 5-6"/>',
  building:'<path d="M4 22V3h10v19M14 9h6v13M2 22h20M7 7h4M7 11h4M7 15h4M17 13h1M17 17h1"/>',
  people:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4M16 4a3 3 0 0 1 0 6M18 13a5 5 0 0 1 3 5v3"/>',
  leaf:'<path d="M20 3C7 3 2 7 4 14c2 8 15 7 16-11zM4 21 16 8"/>',
  heart:'<path d="M12 21 3 12C-3 4 8-1 12 7c4-8 15-3 9 5z"/>',
  chart:'<path d="M3 3v18h18M7 17v-5M12 17V8M17 17V5"/>',
  spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3zM20 2v4M18 4h4"/>',
  message:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/>'
 };
 return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(shapes[name]||shapes.star)+'</svg>';
}
