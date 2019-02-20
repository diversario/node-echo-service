const http = require('http')
const os = require('os')
const url = require('url')
const cp = require('child_process')
const fs = require('fs')
const id = require('crypto').randomBytes(8).toString('hex')

const interfaces = os.networkInterfaces()
const localInterfaces = Object.keys(interfaces).filter(k => /^lo/.test(k))

localInterfaces.forEach(iface => delete interfaces[iface])

Object.keys(interfaces).forEach(iface => {
  interfaces[iface] = interfaces[iface].filter(inner => inner.family == 'IPv4')

  if (!interfaces[iface].length) delete interfaces[iface]
})

http.createServer(function(req, res) {
  res.end(`${JSON.stringify({ name: 'echo', id: id, time: new Date(), ifs: interfaces })}\n`)
}).listen(3000)


http.createServer(function(req, res) {
  res.end(`${JSON.stringify({ name: 'extra', id: id, time: new Date() })}\n`)
}).listen(4000)


http.createServer(function (req, res) {
  const q = url.parse(req.url, true)

  let size = '100M'

  if (q && q.query && q.query.size) size = q.query.size

  const filename = `file-${size}`

  try {
    const stat = fs.statSync(filename)
  } catch (error) {
    cp.spawnSync('truncate', ['-s' , size, `file-${size}`])
  }

  fs.createReadStream(filename).pipe(res)
}).listen(5000)

