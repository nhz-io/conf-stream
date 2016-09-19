const Stream = require('stream').Stream

const {getChainList, getMergeList} = require('./helpers')

function resolves(list, streams, plugins) {
	return !list.find(item => {
		if (item instanceof Stream) {
			return false
		}

		if (typeof item === 'string') {
			if (streams[item] && streams[item].stream) {
				return false
			}
		}

		const list = getChainList(item) || getMergeList(item)
		if (list && list.length) {
			return !resolves(list, streams, plugins)
		}

		if (plugins[Object.keys(item)[0]]) {
			return false
		}

		return true
	})
}

module.exports = resolves
