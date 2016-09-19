const CHAINKEY = 'chain'
const MERGEKEY = 'merge'

const getChainList = o => o[CHAINKEY] && o[CHAINKEY].slice()

const getMergeList = o => o[MERGEKEY] && o[MERGEKEY].slice()

module.exports = {
	CHAINKEY, MERGEKEY,
	getChainList, getMergeList,
}
