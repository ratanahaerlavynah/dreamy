---
layout: null
permalink: /assets/js/poems-data.js
---
// Index de tous les poèmes, généré par Jekyll
window.poemsIndex = [
{%- for poem in site.poems -%}
  {
    "title": {{ poem.title | jsonify }},
    "content": {{ poem.content | strip_html | normalize_whitespace | jsonify }}
  }{%- unless forloop.last -%},{%- endunless -%}
{%- endfor -%}
];
