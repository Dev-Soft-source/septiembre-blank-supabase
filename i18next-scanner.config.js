
const fs = require('fs');
const path = require('path');

module.exports = {
  input: [
    'src/**/*.{js,jsx,ts,tsx}',
    // Exclude certain directories
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/i18n/**',
    '!**/node_modules/**'
  ],
  output: './src/i18n/locales',
  options: {
    debug: true,
    func: {
      list: ['t', 'i18next.t', 'i18n.t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      fallbackKey: function(ns, value) {
        return value;
      }
    },
    lngs: ['en'],
    ns: [
      'common',
      'navigation', 
      'booking',
      'dashboard',
      'faq',
      'auth',
      'hotel',
      'forms',
      'filters'
    ],
    defaultLng: 'en',
    defaultNs: 'common',
    defaultValue: '__STRING_NOT_TRANSLATED__',
    resource: {
      loadPath: '{{lng}}.json',
      savePath: '{{lng}}.json',
      jsonIndent: 2,
      lineEnding: '\n'
    },
    nsSeparator: ':',
    keySeparator: '.',
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    }
  },
  transform: function customTransform(file, enc, done) {
    'use strict';
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);
    
    let count = 0;

    // Extract strings from JSX text content
    const jsxTextRegex = />([^<>{}\s][^<>{}]*[^<>{}\s])</g;
    let match;
    while ((match = jsxTextRegex.exec(content)) !== null) {
      const text = match[1].trim();
      if (text && !text.includes('{{') && !text.includes('${') && text.length > 1) {
        parser.set(text, {
          defaultValue: text
        });
        count++;
      }
    }

    // Extract strings from common patterns
    const stringPatterns = [
      /placeholder=["']([^"']+)["']/g,
      /title=["']([^"']+)["']/g,
      /alt=["']([^"']+)["']/g,
      /label=["']([^"']+)["']/g,
      /text=["']([^"']+)["']/g
    ];

    stringPatterns.forEach(pattern => {
      while ((match = pattern.exec(content)) !== null) {
        const text = match[1].trim();
        if (text && text.length > 1) {
          parser.set(text, {
            defaultValue: text
          });
          count++;
        }
      }
    });

    console.log(`Processed ${file.path}: found ${count} strings`);
    done();
  }
};
