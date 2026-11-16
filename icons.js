// Simple 24×24 line icons, drawn with currentColor. Use: ICON("gamepad")
window.ICONS = {
  gamepad: '<path d="M6 9h12a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L15 14H9l-1.6 1.8A3 3 0 0 1 2 14v-1a4 4 0 0 1 4-4z"/><path d="M7 11.5v3M5.5 13h3"/><circle cx="16" cy="12" r=".6"/><circle cx="18" cy="14" r=".6"/>',
  plane: '<path d="M2 13l8-2 4-7h2l-2 7 6 1 1.5-2H23l-1 4 1 4h-1.5L20 16l-6 1 2 7h-2l-4-7-8-2z"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.6c2.6.2 4.5 2.2 4.5 4.9"/>',
  cards: '<rect x="3" y="6" width="10" height="14" rx="1.5" transform="rotate(-10 8 13)"/><rect x="11" y="4" width="10" height="14" rx="1.5" transform="rotate(8 16 11)"/>',
  plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v4"/>',
  cherry: '<circle cx="7" cy="17" r="3.5"/><circle cx="16.5" cy="17.5" r="3.5"/><path d="M7 13.5C8 9 11 5 16 3M16.5 14c-.5-4-1-7-.5-11"/>',
  chef: '<path d="M7 14a4 4 0 0 1-.6-7.9A5 5 0 0 1 12 3a5 5 0 0 1 5.6 3.1A4 4 0 0 1 17 14"/><path d="M7 14h10v6H7z"/><path d="M10 17h4"/>',
  building: '<path d="M4 21V5l8-3v19M12 9l8 3v9M2 21h20"/><path d="M7 8h2M7 12h2M7 16h2M15 14h2M15 17h2"/>',
  bike: '<circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5L9 9h5l4.5 7.5M9 9l3 7.5h-6.5M13 5h3l1.5 4"/>',
  bubbles: '<circle cx="8" cy="14" r="5"/><circle cx="17" cy="8" r="3.5"/><circle cx="18" cy="17" r="2"/><path d="M6 12a2.5 2.5 0 0 1 2.5-2"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-7"/><path d="M16 7h4v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  box: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
  shield: '<path d="M12 2l8 3v6c0 5-3.4 9.3-8 11-4.6-1.7-8-6-8-11V5z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  rocket: '<path d="M12 2c3.5 2.5 5 6.5 4.5 11l-2.5 3h-4l-2.5-3C7 8.5 8.5 4.5 12 2z"/><circle cx="12" cy="9" r="1.8"/><path d="M7.5 13L5 16l2.5 1M16.5 13L19 16l-2.5 1M10.5 19l1.5 3 1.5-3"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  flame: '<path d="M12 22c4 0 7-2.8 7-7 0-4-3-6-4-10-2 2-2.5 4-2.5 5.5C11 9 10 7.5 10 6 7 8.5 5 11.5 5 15c0 4.2 3 7 7 7z"/><path d="M12 22c-1.7 0-3-1.3-3-3 0-2 1.5-3 3-5 1.5 2 3 3 3 5 0 1.7-1.3 3-3 3z"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  code: '<path d="M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5"/>',
};
window.ICON = (name, size = 24) =>
  `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${window.ICONS[name] || window.ICONS.code}</svg>`;
