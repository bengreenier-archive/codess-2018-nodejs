const serveStatic = require('serve-static')
const backendAllocator = require('./backend')
const app = backendAllocator()

// serve up the frontend too!
app.use(serveStatic('frontend'))

// then we simply start the server
// using either the environment variable named 'PORT' or the literal number 3000
const server = app.listen(process.env.PORT || 3000, () => {
  const addr = server.address()
  console.log(`started server on [${addr.address}]:${addr.port}`)
})
