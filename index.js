const inspect = require('util').inspect
const Stream = require('stream').Stream
const create = require('./lib/create')
const init = require('./lib/init')

function getUnresolved(streams) {
	return (
		Object.keys(streams)
			.filter(name => !(streams[name].stream instanceof Stream))
			.map(name => streams[name])
	)
}

module.exports = config => {
	switch (true) {
		case !config || !Object.keys(config).length:
			throw new TypeError('Missing config')
		case !config.plugins || !Object.keys(config.plugins).length:
			throw new TypeError('Missing plugins')
		case !config.streams || !config.streams.length:
			throw new TypeError('Missing streams')
		default:
			break
	}

	const plugins = Object.assign({}, config.plugins)

	let streams = config.streams.reduce((streams, stream) => {
		stream = create(stream, streams, plugins)
		streams[stream.name] = stream
		return streams
	}, {})

	let unresolved = getUnresolved(streams)
	let count = unresolved.length + 1

	while (unresolved.length && unresolved.length < count) {
		count = unresolved.length
		unresolved.forEach(stream => init(stream, streams, plugins))
		unresolved = getUnresolved(streams)
	}

	if (unresolved.length > 0) {
		throw new Error(`Not all streams got resolved: ${inspect(unresolved)}`)
	}

	return streams
}
