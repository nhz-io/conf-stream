const util = require('util')
const Stream = require('stream').Stream

const through2 = require('through2')
const merge2 = require('merge2')
const duplex = require('duplexer2')

const {getChainList, getMergeList} = require('./helpers')

function builder(streams, plugins) {
	return stream => {
		/** Grab stream references and resolve to real streams */
		if (typeof stream === 'string') {
			if (!streams[stream]) {
				throw new ReferenceError(`Stream ${stream} is not registered`)
			}
			if (!(streams[stream].stream instanceof Stream)) {
				throw new ReferenceError(`Stream ${stream} is not resolved`)
			}
			stream = streams[stream].stream
		}

		/** Pass real streams trough */
		if (stream instanceof Stream) {
			return stream
		}

		/** Recurse on chains */
		const chain = getChainList(stream)
		if (chain) {
			return fromChain(chain, streams, plugins)
		}

		/** Recurse on merges */
		const merge = getMergeList(stream)
		if (merge) {
			return fromMerge(merge, streams, plugins)
		}

		/** Initialize streams from plugins */
		const name = Object.keys(stream)[0]
		if (name) {
			if (!plugins[name]) {
				throw new ReferenceError(`Plugin ${name} is not registered`)
			}

			/** Initialize plugin */
			return plugins[name](stream[name])
		}

		throw new TypeError(`Unknown stream: ${util.inspect(stream)}`)
	}
}

function fromMerge(list, streams, plugins) {
	const noop = through2()
	return duplex(noop, merge2(...(
		list.map(builder(streams, plugins))
			.map(stream => noop.pipe(stream))
	)))
}

function fromChain(list, streams, plugins) {
	const noop = through2()
	return duplex(noop,
		list.map(builder(streams, plugins))
			.reduce((src, dest) => src.pipe(dest), noop)
	)
}

builder.fromMerge = fromMerge
builder.fromChain = fromChain
builder.builder = builder

module.exports = builder
