const uuid = require('uuid')
const init = require('./init')

function create(config, streams, plugins) {
	switch (true) {
		case !config || Object.keys(config).length === 0:
			throw new TypeError('Missing config')

		case !streams:
			throw new TypeError('Missing streams')

		case !plugins:
			throw new TypeError('Missing plugins')

		default:
			return init(
				Object.assign({}, config, {name: config.name || uuid.v4()}),
				streams, plugins
			)
	}
}

module.exports = create
