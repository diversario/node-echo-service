const http = require('http')
const os = require('os')
const id = require('crypto').randomBytes(8).toString('hex')

const interfaces = os.networkInterfaces()
const localInterfaces = Object.keys(interfaces).filter(k => /^lo/.test(k))

localInterfaces.forEach(iface => delete interfaces[iface])

Object.keys(interfaces).forEach(iface => {
  interfaces[iface] = interfaces[iface].filter(inner => inner.family == 'IPv4')

  if (!interfaces[iface].length) delete interfaces[iface]
})

http.createServer(function(req, res) {
  res.end(`${JSON.stringify({ id: id, time: new Date(), ifs: interfaces })}\n`)
}).listen(3000)


