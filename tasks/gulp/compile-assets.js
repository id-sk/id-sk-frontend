'use strict'

const path = require('path')

const gulp = require('gulp')
const configPaths = require('../../config/paths.json')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const merge = require('merge-stream')
const rollup = require('gulp-better-rollup')
const taskArguments = require('./task-arguments')
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')
const eol = require('gulp-eol')
const rename = require('gulp-rename')
const cssnano = require('cssnano')
const sourcemaps = require('gulp-sourcemaps');
const postcsspseudoclasses = require('postcss-pseudo-classes')({
  // Work around a bug in pseudo classes plugin that badly transforms
  // :not(:whatever) pseudo selectors
  blacklist: [':not(', ':disabled)', ':last-child)', ':focus)', ':active)', ':hover)']
})
const replace = require('gulp-replace')

// Compile CSS and JS task --------------
// --------------------------------------

// check if destination flag is dist
const isDist = taskArguments.destination === 'dist' || false

const isPackage = taskArguments.destination === 'package' || false

// Set the destination
const destinationPath = function () {
  // Public & Dist directories do no need namespaced with `govuk`
  if (taskArguments.destination === 'dist' || taskArguments.destination === 'public') {
    return taskArguments.destination
  } else {
    return `${taskArguments.destination}/idsk/`
  }
}

const errorHandler = function (error) {
  // Log the error to the console
  console.error(error.message)

  // Ensure the task we're running exits with an error code
  this.once('finish', () => process.exit(1))
  this.emit('end')
}
// different entry points for both streams below and depending on destination flag
const compileStyleshet = isDist ? configPaths.idsk_src + 'all.scss' : [ configPaths.app + 'assets/scss/app.scss', configPaths.idsk_src + 'core.scss', configPaths.idsk_src + 'extended.scss' ]
const compileOldIeStyleshet = isDist ? configPaths.idsk_src + 'all-ie8.scss' : configPaths.app + 'assets/scss/app-ie8.scss'

gulp.task('scss:compile', () => {
  const compile = gulp.src(compileStyleshet)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(plumber(errorHandler))
    .pipe(sass())
    .pipe(sourcemaps.write({includeContent: false}))
    // minify css add vendor prefixes and normalize to compiled css
    .pipe(gulpif(isDist, postcss([
      autoprefixer,
      cssnano
    ])))
    .pipe(gulpif(!isDist, postcss([
      autoprefixer,
      // Auto-generate 'companion' classes for pseudo-selector states - e.g. a
      // :hover class you can use to simulate the hover state in the review app
      postcsspseudoclasses
    ])))
    .pipe(sourcemaps.write('.'))
    .pipe(gulpif(isDist,
      rename({
        basename: 'idsk-frontend',
        extname: '.min.css'
      })
    ))
    .pipe(replace('\/assets', 'assets'))
    .pipe(gulp.dest(taskArguments.destination + '/'))

  const compileOldIe = gulp.src(compileOldIeStyleshet)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(plumber(errorHandler))
    .pipe(sass())
    .pipe(sourcemaps.write({includeContent: false}))
    // minify css add vendor prefixes and normalize to compiled css
    .pipe(gulpif(isDist, postcss([
      autoprefixer,
      cssnano,
      // transpile css for ie https://github.com/jonathantneal/oldie
      require('oldie')({
        rgba: { filter: true },
        rem: { disable: true },
        unmq: { disable: true },
        pseudo: { disable: true }
      })
    ])))
    .pipe(gulpif(!isDist, postcss([
      autoprefixer,
      require('oldie')({
        rgba: { filter: true },
        rem: { disable: true },
        unmq: { disable: true },
        pseudo: { disable: true }
        // more rules go here
      })
    ])))
    .pipe(sourcemaps.write('.'))
    .pipe(gulpif(isDist,
      rename({
        basename: 'idsk-frontend-ie8',
        extname: '.min.css'
      })
    ))
    .pipe(replace('\/assets', 'assets'))
    .pipe(gulp.dest(taskArguments.destination + '/'))

  let compileLegacy, compileLegacyIE8

  if (!isDist) {
    compileLegacy = gulp.src(path.join(configPaths.app, 'assets/scss/app-legacy.scss'))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(plumber(errorHandler))
      .pipe(sass({
        includePaths: ['node_modules/govuk_frontend_toolkit/stylesheets', 'node_modules']
      }))
      .pipe(sourcemaps.write({includeContent: false}))
      .pipe(postcss([
        autoprefixer,
        // Auto-generate 'companion' classes for pseudo-selector states - e.g. a
        // :hover class you can use to simulate the hover state in the review app
        postcsspseudoclasses
      ]))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(taskArguments.destination + '/'))

    compileLegacyIE8 = gulp.src(path.join(configPaths.app, 'assets/scss/app-legacy-ie8.scss'))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(plumber(errorHandler))
      .pipe(sass({
        includePaths: ['node_modules/govuk_frontend_toolkit/stylesheets', 'node_modules']
      }))
      .pipe(sourcemaps.write({includeContent: false}))
      .pipe(postcss([
        autoprefixer,
        postcsspseudoclasses,
        require('oldie')({
          rgba: { filter: true },
          rem: { disable: true },
          unmq: { disable: true },
          pseudo: { disable: true }
        })
      ]))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(taskArguments.destination + '/'))
  }

  if (isDist) {
    return merge(compile, compileOldIe)
  } else {
    return merge(compile, compileOldIe, compileLegacy, compileLegacyIE8)
  }
})

// Compile js task for preview ----------
// --------------------------------------
gulp.task('js:compile', () => {
  // for dist/ folder we only want compiled 'all.js' file
  const srcFiles = isDist ? configPaths.idsk_src + 'all.js' : configPaths.idsk_src + '**/*.js'

  return gulp.src([
    srcFiles,
    '!' + configPaths.idsk_src + '**/*.test.js'
  ])
    .pipe(gulpif(!isPackage, sourcemaps.init()))
    .pipe(rollup({
      // Used to set the `window` global and UMD/AMD export name.
      name: 'GOVUKFrontend',
      // Legacy mode is required for IE8 support
      legacy: true,
      // UMD allows the published bundle to work in CommonJS and in the browser.
      format: 'umd'
    }))
    .pipe(gulpif(isDist, uglify({
      ie8: true
    })))
    .pipe(gulpif(isDist,
      rename({
        basename: 'idsk-frontend',
        extname: '.min.js'
      })
    ))
    .pipe(eol())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(destinationPath))
})
