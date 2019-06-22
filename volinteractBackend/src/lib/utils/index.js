const slugifyHelper = require('slugify')

function slugify(text) {
  return slugifyHelper(text, {
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    lower: true,
  })
}

exports.slugify = slugify
