// https://github.com/vercel/next.js/discussions/54152#discussioncomment-7316916

const { resolve } = require('path');
const { createHash } = require('crypto');
const { readFileSync, writeFileSync } = require('fs');
const { globSync } = require('glob');

process.env.NODE_ENV = 'production';
const { basePath, distDir } = require('./next.config');

const MAGIC_STRING = '__this_is_a_placeholder_for_the_inline_scripts__';

// Must be the same as in export.sh
const NEXT_FOLDER = 'next';

console.log('grab all the html files');
const baseDir = resolve(distDir.replace(/^\//, ''));
const htmlFiles = globSync(`${baseDir}/**/*.html`);
htmlFiles.forEach((file) => {
  // grab inline scripts from each html file
  const contents = readFileSync(file).toString();
  const scripts = [];
  const newFile = contents.replace(/<script>(.+?)<\/script>/g, (_, data) => {
    const addMagicString = scripts.length === 0;
    scripts.push(`${data}${data.endsWith(';') ? '' : ';'}`);
    return addMagicString ? MAGIC_STRING : '';
  });

  // early exit if we have no inline scripts
  if (!scripts.length) {
    return;
  }
  console.log(`processing ${file}`);

  // combine all the inline scripts, add a hash, and reference the new file
  console.log('\trewriting');
  const chunk = scripts.join('');
  const hash = createHash('md5').update(chunk).digest('hex');
  writeFileSync(
    `${baseDir}/${NEXT_FOLDER}/static/chunks/chunk.${hash}.js`,
    chunk
  );
  writeFileSync(
    file,
    newFile.replace(
      MAGIC_STRING,
      `<script src="${basePath}/${NEXT_FOLDER}/static/chunks/chunk.${hash}.js" crossorigin=""></script>`
    )
  );
  console.log('\tfinished');
});
