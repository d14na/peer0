# Peer Zero

[![Build Status](https://travis-ci.org/d14na/peer0.png?branch=master)](https://travis-ci.org/d14na/peer0)
[![NPM](https://img.shields.io/npm/v/peer0.svg)](https://www.npmjs.org/package/peer0)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

ZeroNet-related functions implemented in pure JavaScript.

## getFile

> Returns a promise for the file data *(will download from a remote peer to local storage if needed)* for the requested zite.

    const file = await peer0.getFile(ziteAddr, filePath)

## getZiteInfo

> Returns a promise for a summary of information *(read from content.json)* for the requested zite.

    const ziteInfo = await peer0.getZiteInfo(ziteAddr)

1. Title *(required)*
2. Description *(required)*
3. Image Icon *(min: 32px² | max: 1024px²)*
4. Image Banner
5. Screenshots
6. Content Rating
7. Tags *(keywords)*
8. Tagline *(short <200 char description, typically displayed in searches)*
9. Built-in Plugins *(chat, forum, dropbox, etc)*

## Development Roadmap — 2018

* [x] Connect & communicate with ZeroNet peers via TCP.
* [ ] Connect & communicate with Torrent trackers via UDP.
* [ ] Blockchain integrations
    - [x] Bitcoin (BitcoinJS)
    - [x] Ethereum (Ethers.io)
    - [ ] IPFS

## Development Roadmap — 2019

*coming soon...*

Released under the terms of the [MIT LICENSE](LICENSE).
