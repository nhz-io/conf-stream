import test from 'ava'
import {CHAINKEY, MERGEKEY, getChainList, getMergeList} from '../../lib/helpers'

module.exports = {
	CHAINKEY, MERGEKEY,
	getChainList, getMergeList,
}

test('CHAINKEY', t => t.is(CHAINKEY, 'chain'))

test('MERGEKEY', t => t.is(MERGEKEY, 'merge'))

test('getChainList', t => t.deepEqual(getChainList({chain: ['test']}), ['test']))

test('getMergeList', t => t.deepEqual(getMergeList({merge: ['test']}), ['test']))
