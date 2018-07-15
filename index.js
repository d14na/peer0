// import './shim'

let reqId = null
let requests = []
let payload = null
let cb = null

let net = null
let client = null

exports.hello = function () {
    console.log('Hi! This is a sample log message from Peer Zero.')
    return 'Hi there! My name is Peer Zero. Would you like to play a game?'
}

exports.helloAgain = function () {
    console.log('Hello AGAIN!')
    return 'Hi AGAIN!! My name is Peer Zero. Would you like to play a game?'
}

exports.triple = function (val) {
    return val * 3
}

exports.download = function (_net=null, _client=null) {
    return new Promise((resolve, reject) => {
        cb = resolve

        // cb('PEER IS STILL TALKING via CB!!')
    // return new Promise(function (resolve, reject) {
    //     setTimeout(resolve, 100, 'foo-foo-so-fancy')

        if (_net) {
            net = _net
            console.log('someone sent you net and this is what we got', net)
        }

        // OR, if not shimming via package.json "browser" field:
        // var net = require('react-native-tcp')

        const hostIp = '178.128.8.225'
        const hostPort = 13312
        // const hostIp = '82.217.119.49'
        // const hostPort = 16065

        // var server = net.createServer(function(socket) {
        //     socket.write('excellent!')
        // }).listen(12345)

        const host = {
            host: hostIp,
            port: hostPort
        }
        // setState({ debug: JSON.stringify(host) })

        client = net.createConnection(hostPort, hostIp, () => {
            // 'connect' listener
            console.log('Connected to peer!')
            // setState({ debug: 'Connected to peer!' })

            const pkg = _encode(_handshakePkg())
            client.write(pkg)
        })

        // client.on('connect', function () {
        //     console.info('Connection opened.')
        //     setState({ debug: 'Connection opened.' })
        //
        //     /* Create encoded package. */
        //     // const pkg = _encode(_handshakePkg)
        //
        //     /* Send the handshake. */
        //     // client.write(pkg, function () {
        //     //     console.log('Sent handshake.')
        //     //     // console.log('sent handshake', pkg)
        //     // })
        // })

        client.on('error', function (error) {
            console.log(error)
            // setState({ debug: error.toString() })
        })

        let called = 0
let stop = 0
        client.on('data', function(_data) {
            try {
                if (payload) {
                    payload = Buffer.concat([payload, _data])
                } else {
                    payload = _data
                }

                /* Attempt to decode the data. */
                const decoded = _decode(payload)

                console.log('Message #%d was received [%d bytes]', ++called, _data.length, _data, decoded)
                // setState({ debug: 'received:\n' + _data.length + '\n\n' + JSON.stringify(decoded) })

                if (decoded.body) {
                    payload = null

                    let body = decoded.body.toString()

                    console.log('check out my HTML body', body)
                    cb(body)
                }

if (decoded.protocol === 'v2' && stop === 0) {
    payload = null
    stop = 1

    console.log('lets go grab a file!')
    _getFile()
}
            } catch (e) {
                console.log('Failed to decoded data', e, _data);
            }
        })

        client.on('close', function () {
            console.info('Connection closed.')
            // setState({ debug: 'Connection closed.' })
        })
    })
}

const CONFIG = {
    peerId: '-UT3530-FFFFFFFFFFFF',
    hostIp: '178.128.8.225', // OUR TEST SERVER
    hostPort: 13312
}

const _handshakePkg = () => {
    const cmd = 'handshake'
    const request = { cmd }
    const req_id = _addRequest(request)

    const crypt = null
    const crypt_supported = []
    // const crypt_supported = ['tls-rsa']
    const fileserver_port = 15441
    const protocol = 'v2'
    const port_opened = true
    const peer_id = CONFIG.peerId
    const rev = 2122
    const version = '0.5.6'
    const target_ip = CONFIG.hostIp

    /* Build parameters. */
    const params = {
        crypt,
        crypt_supported,
        fileserver_port,
        protocol,
        port_opened,
        peer_id,
        rev,
        version,
        target_ip
    }

    return { cmd, req_id, params }
}

const _parseIp = (_buf) => {
    const ip = _buf.readUInt8(0) +
        '.' + _buf.readUInt8(1) +
        '.' + _buf.readUInt8(2) +
        '.' + _buf.readUInt8(3)

    return ip
}

const _parsePort = (_buf) => {
    const port = (_buf.readUInt8(1) * 256) + _buf.readUInt8(0)

    return port
}

const _addRequest = (_request) => {
    if (!reqId)
        reqId = 0

    /* Initialize request id (auto-increment). */
    reqId++
    // const reqId = reqId++

    requests[reqId] = _request

    /* Return the request id. */
    return reqId
}

const _encode = (msg) => {
    const msgpack = require('zeronet-msgpack')()
    const encode = msgpack.encode

    return encode(msg)
}

const _decode = (msg) => {
    const msgpack = require('zeronet-msgpack')()
    const decode = msgpack.decode

    return decode(msg)
}

const _getFile = () => {
    const cmd = 'getFile'
    // const innerPath = 'index.html'
    const innerPath = 'content.json'
    // const site = '1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D'
    const site = '1Name2NXVi1RDPDgf5617UoW7xA6YrhM9F'

    const request = { cmd, innerPath, site }

    // const req_id = 1
    const req_id = _addRequest(request) // eslint-disable-line camelcase

    const inner_path = innerPath // eslint-disable-line camelcase
    const location = 0
    const params = { site, inner_path, location }

    const pkg = { cmd, req_id, params }

    /* Send request. */
    client.write(_encode(pkg), function () {
        console.log('Sent request for [ %s ]', inner_path)
    })
}
