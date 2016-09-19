const Stream = require('stream').Stream
const inspect = require('util').inspect
const resolves = require('./resolves')
const {fromChain, fromMerge} = require('./builder')
const {getChainList, getMergeList} = require('./helpers')

function init(stream, streams, plugins) {
	switch (true) {
		case !stream:
			throw new TypeError('Missing stream')

		case stream instanceof Stream:
			return stream

		case !streams:
			throw new TypeError('Missing streams')

		case !plugins:
			throw new TypeError('Missing plugins')

		default:
			break
	}

	const chain = getChainList(stream)
	if (chain && chain.length) {
		if (resolves(chain, streams, plugins)) {
			stream.stream = fromChain(chain, streams, plugins)
		}

		return stream
	}

	const merge = getMergeList(stream)
	if (merge && merge.length) {
		if (resolves(merge, streams, plugins)) {
			stream.stream = fromMerge(merge, streams, plugins)
		}

		return stream
	}

	throw new TypeError(`Invalid stream: ${inspect(stream)}`)
}
module.exports = init
