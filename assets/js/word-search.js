// Récupérer les éléments
const btn = document.getElementById('word-search-btn');
const modal = document.getElementById('word-search-modal');
const close = document.getElementById('modal-close');

// Ouvrir / fermer la fenêtre
btn.addEventListener('click', () => modal.classList.toggle('show'));
close.addEventListener('click', () => modal.classList.remove('show'));

// Compter en direct
const input = document.getElementById('word-search-input');
const results = document.getElementById('word-search-results');

input.addEventListener('input', () => {
  const term = input.value.toLowerCase().trim();
  const counts = {};
  if (term) {
    poemsIndex.forEach(p => {
      const words = p.content.match(/\b\w+\b/g) || [];
      words.forEach(w => {
const lw = w.toLowerCase();
  if (lw.startsWith(term))     
    counts[lw] = (counts[lw] || 0) + 1;      });
    });
  }
  // Afficher
  results.innerHTML = '';
  Object.entries(counts)
    .sort((a,b)=>b[1]-a[1])
    .forEach(([w,c])=>{
      const p = document.createElement('p');
      p.textContent = `${w} 💕 ${c} mention${c>1?'s':''}`;
      results.appendChild(p);
    });
});
