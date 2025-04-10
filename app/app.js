const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')
const util = require('util')
const fs = require('fs')
const path = require('path')

const readdir = util.promisify(fs.readdir)

const helperFunctions = require('../lib/helper-functions')
const fileHelper = require('../lib/file-helper')
const configPaths = require('../config/paths.json')
const idskContentStructure = require('../config/idskContentStructure.json')

// Set up views
const appViews = [
  configPaths.layouts,
  configPaths.views,
  configPaths.examples,
  configPaths.fullPageExamples,
  configPaths.components,
  configPaths.idsk_components,
  configPaths.src,
  configPaths.idsk_src,
  configPaths.node_modules,

  configPaths.uvod,
  configPaths.slovnik
]

module.exports = (options) => {
  const nunjucksOptions = options ? options.nunjucks : {}

  // Configure nunjucks
  const env = nunjucks.configure(appViews, {
    autoescape: true, // output with dangerous characters are escaped automatically
    express: app, // the express app that nunjucks should install to
    noCache: true, // never use a cache and recompile templates each time
    trimBlocks: true, // automatically remove trailing newlines from a block/tag
    lstripBlocks: true, // automatically remove leading whitespace from a block/tag
    watch: true, // reload templates when they are changed. needs chokidar dependency to be installed
    ...nunjucksOptions // merge any additional options and overwrite defaults above.
  })

  // make the function available as a filter for all templates
  env.addFilter('componentNameToMacroName', helperFunctions.componentNameToMacroName)
  env.addFilter('idskComponentNameToMacroName', helperFunctions.idskComponentNameToMacroName)
  env.addGlobal('markdown', require('marked'))

  // Set view engine
  app.set('view engine', 'njk')

  // Disallow search index indexing
  app.use(function (req, res, next) {
    // none - Equivalent to noindex, nofollow
    // noindex - Do not show this page in search results and do not show a
    //   "Cached" link in search results.
    // nofollow - Do not follow the links on this page
    res.setHeader('X-Robots-Tag', 'all')
    next()
  })

  // Set up middleware to serve static assets
  app.use('/public', express.static(configPaths.public))

  app.use('/docs', express.static(configPaths.sassdoc))

  // serve html5-shiv from node modules
  app.use('/vendor/html5-shiv/', express.static('node_modules/html5shiv/dist/'))

  // serve legacy code from node modules
  app.use('/vendor/govuk_template/', express.static('node_modules/govuk_template_jinja/assets/'))
  app.use('/vendor/govuk_frontend_toolkit/assets', express.static('node_modules/govuk_frontend_toolkit/images'))
  app.use('/vendor/govuk_frontend_toolkit/', express.static('node_modules/govuk_frontend_toolkit/javascripts/govuk/'))
  app.use('/vendor/jquery/', express.static('node_modules/jquery/dist'))

  app.use('/assets', express.static(path.join(configPaths.idsk_src, 'assets')))
  app.use('/public/assets', express.static(path.join(configPaths.idsk_src, 'assets')))

  // Turn form POSTs into data that can be used for validation.
  app.use(bodyParser.urlencoded({ extended: true }))

  // Handle the banner component serverside.
  require('./banner.js')(app)

  // Define middleware for all routes
  app.use('*', function (request, response, next) {
    response.locals.legacy = request.query['legacy'] === '1'
    if (response.locals.legacy) {
      response.locals.legacyQuery = '?legacy=1'
    } else {
      response.locals.legacyQuery = ''
    }
    next()
  })

  // Define routes

  // Index page - render the component list template
  app.get('/', async function (req, res) {
    const components = fileHelper.allComponents
    const idskComponents = fileHelper.allIdskComponents
    const examples = await readdir(path.resolve(configPaths.examples))
    const fullPageExamples = fileHelper.fullPageExamples()
    const idskItroductionContent = idskContentStructure.introduction
    const idskPatternsContent = idskContentStructure.patterns
    const idskUsageExamples = idskContentStructure.usageExamples
    const idskComponentsUsageContent = idskContentStructure.componentsUsage

    res.render('index', {
      componentsDirectory: components,
      idskComponentsDirectory: idskComponents,
      examplesDirectory: examples,
      fullPageExamples: fullPageExamples,
      idskItroductionContent: idskItroductionContent,
      idskPatternsContent: idskPatternsContent,
      idskUsageExamples: idskUsageExamples,
      idskComponentsUsageContent: idskComponentsUsageContent
    })
  })

  // Whenever the route includes a :component parameter, read the component data
  // from its YAML file
  app.param('component', function (req, res, next, componentName) {
    res.locals.componentData = fileHelper.getComponentData(componentName)
    next()
  })

  // Whenever the route includes a :component parameter, read the component data
  // from its YAML file
  app.param('custom_component', function (req, res, next, componentName) {
    res.locals.idskComponentData = fileHelper.getIdskComponentData(componentName)
    next()
  })

  // All components view
  app.get('/components/all', function (req, res, next) {
    const components = fileHelper.allComponents

    res.locals.componentData = components.map(componentName => {
      const componentData = fileHelper.getComponentData(componentName)
      const defaultExample = componentData.examples.find(
        example => example.name === 'default'
      )
      return {
        componentName,
        examples: [defaultExample]
      }
    })
    res.render(`all-components`, function (error, html) {
      if (error) {
        next(error)
      } else {
        res.send(html)
      }
    })
  })

  // Component 'README' page
  app.get('/components/:component', function (req, res, next) {
    // make variables available to nunjucks template
    res.locals.componentPath = req.params.component

    res.render('component', function (error, html) {
      if (error) {
        next(error)
      } else {
        res.send(html)
      }
    })
  })

  // Component 'README' page
  app.get('/custom-components/:custom_component', function (req, res, next) {
    // make variables available to nunjucks template
    res.locals.componentPath = req.params.custom_component

    res.render('custom_component', function (error, html) {
      if (error) {
        next(error)
      } else {
        res.send(html)
      }
    })
  })

  // Component example preview
  app.get('/components/:component/:example*?/preview', function (req, res, next) {
    // Find the data for the specified example (or the default example)
    const componentName = req.params.component
    const requestedExampleName = req.params.example || 'default'

    const previewLayout = res.locals.componentData.previewLayout || 'layout'

    const exampleConfig = res.locals.componentData.examples.find(
      example => example.name.replace(/ /g, '-') === requestedExampleName
    )

    if (!exampleConfig) {
      next()
    }

    // Construct and evaluate the component with the data for this example
    const macroName = helperFunctions.componentNameToMacroName(componentName)
    const macroParameters = JSON.stringify(exampleConfig.data, null, '\t')

    res.locals.componentView = env.renderString(
      `{% from '${componentName}/macro.njk' import ${macroName} %}
      {{ ${macroName}(${macroParameters}) }}`
    )

    let bodyClasses = ''
    if (req.query.iframe) {
      bodyClasses = 'app-iframe-in-component-preview'
    }

    res.render('component-preview', { bodyClasses, previewLayout })
  })

  // Component example preview
  app.get('/custom-components/:custom_component/:example*?/preview', function (req, res, next) {
    // Find the data for the specified example (or the default example)

    const componentName = req.params.custom_component
    const requestedExampleName = req.params.example || 'default'

    const previewLayout = res.locals.idskComponentData.previewLayout || 'layout'

    const exampleConfig = res.locals.idskComponentData.examples.find(
      example => example.name.replace(/ /g, '-') === requestedExampleName
    )

    if (!exampleConfig) {
      next()
    }

    // Construct and evaluate the component with the data for this example
    const macroName = helperFunctions.idskComponentNameToMacroName(componentName)
    const macroParameters = JSON.stringify(exampleConfig.data, null, '\t')

    res.locals.componentView = env.renderString(
      `{% from '../../idsk/components/${componentName}/macro.njk' import ${macroName} %}
      {{ ${macroName}(${macroParameters}) }}`
    )

    let bodyClasses = ''
    if (req.query.iframe) {
      bodyClasses = 'app-iframe-in-component-preview'
    }

    res.render('component-preview', { bodyClasses, previewLayout })
  })

  // Example view
  app.get('/examples/:example/:action?', function (req, res, next) {
    // Passing a random number used for the links so that they will be unique and not display as "visited"
    const randomPageHash = (Math.random() * 1000000).toFixed()
    res.render(`${req.params.example}/${req.params.action || 'index'}`, { randomPageHash }, function (error, html) {
      if (error) {
        next(error)
      } else {
        res.send(html)
      }
    })
  })

  // Example view
  app.get('/full-page-examples/:example/:action?', function (req, res, next) {
    // Passing a random number used for the links so that they will be unique and not display as "visited"
    const randomPageHash = (Math.random() * 1000000).toFixed()
    res.render(`${req.params.example}/${req.params.action || 'index'}`, { randomPageHash }, function (error, html) {
      if (error) {
        next(error)
      } else {
        res.send(html)
      }
    })
  })

  // Introduction (Uvod) view
  app.get('/uvod/:content/:action?', function (req, res, next) {
    // Passing a random number used for the links so that they will be unique and not display as "visited"
    const randomPageHash = (Math.random() * 1000000).toFixed()
    res.render(`${req.params.content}/${req.params.action || 'index'}`, { randomPageHash }, function (error, html) {
      if (error) {
        next(error)
      } else {
        res.send(html)
      }
    })
  })

  // shallow content view
  // e.g.:
  // /slovnik
  app.get('/:content/:action?', function (req, res, next) {
    // Passing a random number used for the links so that they will be unique and not display as "visited"
    const randomPageHash = (Math.random() * 1000000).toFixed()
    res.render(`${req.params.content}/${req.params.action || 'index'}`, { randomPageHash }, function (error, html) {
      if (error) {
        next(error)
      } else {
        res.send(html)
      }
    })
  })

  // Full page example views
  require('./full-page-examples.js')(app)

  app.get('/robots.txt', function (req, res) {
    res.type('text/plain')
    res.send('User-agent: *\nDisallow: /')
  })

  return app
}
