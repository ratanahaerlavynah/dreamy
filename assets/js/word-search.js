// Load poemsIndex from poems-index.html
let poemsIndex = [];

fetch('/poems-index.html')
  .then(res => res.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const nodes = doc.querySelectorAll('#poems-index .poem');
    poemsIndex = Array.from(nodes).map(el => {
      // Insert a space after each block-level child to avoid word merging
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
      let content = '';
      while (walker.nextNode()) {
        content += walker.currentNode.nodeValue + ' ';
      }
      return {
        title: el.dataset.title,
        content: content.trim()
      };
    });    
  });

  // assets/js/word-search.js

// grab elements
const btn       = document.getElementById('word-search-btn');
const modal     = document.getElementById('word-search-modal');
const closeBtn  = document.getElementById('modal-close');
const input     = document.getElementById('word-search-input');
const results   = document.getElementById('word-search-results');

// open/close handlers
btn.addEventListener('click', () => {
  modal.classList.add('show');
  input.focus();
});
closeBtn.addEventListener('click', () => {
  modal.classList.remove('show');
});
closeBtn.addEventListener('touchend', e => {
  e.preventDefault();
  modal.classList.remove('show');
});

// live count as user types
input.addEventListener('input', () => {
  const term = input.value.toLowerCase().trim();
  const counts = {};

  if (term) {
    poemsIndex.forEach(p => {
      const words = p.content.match(/\b\w+\b/g) || [];
      words.forEach(w => {
        const lw = w.toLowerCase();
        if (lw.startsWith(term)) {
          counts[lw] = (counts[lw] || 0) + 1;
        }
      });
    });
  }

  // render
  results.innerHTML = '';
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([word, count]) => {
      const p = document.createElement('p');
p.textContent = `${word} 💕 ${count} mention${count > 1 ? 's' : ''}`;
p.style.margin = '0.25em 0';
p.style.padding = '0.25em 0';
p.style.borderBottom = '1px dotted #ffc0cb';
results.appendChild(p);
    });
});

