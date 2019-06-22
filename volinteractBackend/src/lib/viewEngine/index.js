const fs = require('fs')
const ejs = require('ejs')

/*
 * html-minifier is used to compress the final html spitted out by our templating engine (ejs) to small sizes. It also
 * takes care of minifying inline css and javascript.
 * Form more information and api reference: https://www.npmjs.com/package/html-minifier
 * */
const minifyHtml = require('html-minifier').minify

const minifyHtmlOptions = {
  caseSensitive: false,
  collapseBooleanAttributes: false,
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: false,
  preserveLineBreaks: false,
  preventAttributesEscaping: false,
  quoteCharacter: '"',
  removeComments: true,
  removeEmptyAttributes: true,
  sortAttributes: true,
  sortClassName: true,
}

/**
 * - renders an ejs template at params.path (absolute) given params.data
 * @param {object} params
 * @param {string} params.path - absolute path to ejs file
 * @param {object} params.data - the data to render with
 * @param {object} [params.minify=true] - whether to minify
 * @returns {*}
 */
exports.render = async function render(params) {
  const { path: templatePath, data, minify } = params
  const template = await new Promise((resolve, reject) => {
    fs.readFile(templatePath, 'utf8', (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
  const main = {
    ...data,
    filename: templatePath,
  }

  const html = ejs.render(template, main, {
    cache: process.env.NODE_ENV !== 'development',
    filename: templatePath,
  })

  if (!minify) {
    return html
  }
  // return the minified html passed through html-minifier
  return minifyHtml(html, minifyHtmlOptions)
}
