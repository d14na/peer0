/* Initialize the payload. */
let payload = null

export default function (_parent, _data) {
    if (payload) {
        payload = Buffer.concat([payload, _data])
        // payload = payload + _data
    } else {
        payload = _data
    }

    // console.log('INCOMING =>', _data.length, msg, _data.toString())
    // console.log('msg location', msg['location'])
    // console.log('incoming msg', msg, _data.toString())

    try {
        let decoded = _parent._decode(payload)
        console.log('%d bytes incoming', _data.length, decoded)

        /* Initialize request. */
        let request = null

        /* Retrieve the request id. */
        if (decoded.to !== null) {
            const reqId = decoded.to
            console.log('Decoded reqId', reqId)

            /* Retrieve the request. */
            request = _parent.requests[reqId]
            console.log('Decoded request', request)
        }

        if (decoded.cmd === 'response' && decoded.error) {
            console.error(decoded.error)

            // clear the payload
            payload = null

            // delete the request cmd
            delete request.cmd
        }

        if (decoded.cmd === 'response' && request.cmd === 'handshake') {
            console.info('Handshake completed successfully!')

            // clear the payload
            payload = null
        }

        if (decoded.cmd === 'response' && request.cmd === 'ping') {
            console.info('Ping completed successfully!')

            // clear the payload
            payload = null
        }

        if (decoded.cmd === 'response' && request.cmd === 'getFile') {
            /* Retrieve file type. */
            const fileType = request.innerPath.split('.').pop()

            if (fileType === 'json') {
                let body = JSON.parse(decoded.body)

                console.log('check out my JSON body', body)

                let description = body.description
                console.log('Description', description)
            }

            if (fileType === 'html') {
                let body = decoded.body.toString()

                console.log('check out my HTML body', body)
            }

            // clear the payload
            payload = null
        }

        if (decoded.cmd === 'response' && request.cmd === 'pex') {
            let peers = decoded.peers
            // let peers = JSON.parse(decoded.peers)
            console.log('check out my PEX peers', peers)

            for (let i = 0; i < peers.length; i++) {
                console.log('peer', peers[i].length, peers[i])

                const ipBuffer = Buffer.from(peers[i])

                if (ipBuffer.length === 6) {
                    console.log('#%d IP', i, ipBuffer.slice(0, 4))
                    console.log('#%d Port', i, ipBuffer.slice(-2))

                    const peer = {
                        ip: _parent._parseIp(ipBuffer.slice(0, 4)),
                        port: _parent._parsePort(ipBuffer.slice(-2))
                    }
                    console.log('PEX Peer (buffer)', peer)

                    _parent.hostIp = peer.ip
                    _parent.hostPort = peer.port
                }
            }

            // clear the payload
            payload = null
        }

        if (decoded && payload !== null) {
            console.error('FAILED TO RECOGNIZE -- clearing payload')

            // clear the payload
            payload = null
        }
    } catch (e) {
        console.error('Failed to decode %d bytes of _data', _data.length, e)
    }
}
