// word-search.js
// window.poemsIndex doit déjà être chargé via poems-data.js

// 1) Création du modal si tu ne l'as pas déjà
const btn = document.getElementById('word-search-btn');
const modal = document.getElementById('word-search-modal');
const close = document.getElementById('modal-close');

// Ouvre/ferme le modal
btn.addEventListener('click', () => modal.classList.toggle('show'));
close.addEventListener('click', () => modal.classList.remove('show'));

// 2) Au clic / frappe : compter les mots
document.getElementById('word-search-input')
  .addEventListener('input', function() {
    const term = this.value.toLowerCase().trim();
    const counts = {};
    if (term) {
      poemsIndex.forEach(poem => {
        const words = poem.content.match(/\b\w+\b/g) || [];
        words.forEach(w => {
          if (w.startsWith(term)) {
            counts[w] = (counts[w] || 0) + 1;
          }
        });
      });
    }
    const results = document.getElementById('word-search-results');
    results.innerHTML = '';
    Object.entries(counts)
      .sort((a,b) => b[1]-a[1])
      .forEach(([w,c]) => {
        const p = document.createElement('p');
        p.textContent = `${w} — ${c} occurrence${c>1?'s':''}`;
        results.appendChild(p);
      });
  });
