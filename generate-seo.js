#!/usr/bin/env node
/**
 * generate-seo.js
 * Parcourt _poems/*.md et injecte si manquants :
 *  - description : premier extrait de 200 caractères
 *  - tags        : []
 *  - image       : /assets/img/<slug>.png
 *  - permalink   : /poems/<slug>/
 */

import fs      from "fs";
import path    from "path";
import matter  from "gray-matter";

const poemsDir = path.join(process.cwd(), "_poems");

fs.readdirSync(poemsDir)
  .filter(f => f.endsWith(".md"))
  .forEach(file => {
    const filePath = path.join(poemsDir, file);
    const raw       = fs.readFileSync(filePath, "utf8");
    const parsed    = matter(raw);
    const data      = parsed.data;
    let changed     = false;

    // 1) description par premier extrait
    if (!data.description) {
      const excerpt = parsed.content
        .trim()
        .replace(/\n+/g, " ")
        .slice(0, 200)
        .replace(/\s+$/, "") + "…";
      data.description = excerpt;
      changed = true;
    }

    // 2) tags par défaut
    if (!Array.isArray(data.tags)) {
      data.tags = [];
      changed = true;
    }

    // 3) image basé sur le slug
    if (!data.image) {
      const slug = path.basename(file, ".md");
      data.image = `/assets/img/${slug}.png`;
      changed = true;
    }

    // 4) permalink
    if (!data.permalink) {
      const slug = path.basename(file, ".md");
      data.permalink = `/poems/${slug}/`;
      changed = true;
    }

    if (changed) {
      const newFile = matter.stringify(parsed.content, data);
      fs.writeFileSync(filePath, newFile, "utf8");
      console.log(`✅ Mis à jour : ${file}`);
    }
  });
