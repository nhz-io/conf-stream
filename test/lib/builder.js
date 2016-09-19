import {Stream} from 'stream'
import test from 'ava'
import through2 from 'through2'
import builder from '../../lib/builder'

test('rejects unregistred streams', t => {
	t.throws(() => builder({}, {})('test'))
})

test('rejects unresolved streams', t => {
	t.throws(() => builder({test: {}}, {})('test'))
	t.throws(() =>
		builder(
			{test: {stream: 1}},
			{test: () => through2()}
		)('test')
	)
})

test('rejects unregistred plugins', t => {
	t.throws(() => builder({}, {})({chain: [{unregistred: {}}]}))
	t.throws(() =>
		builder(
			{test: {stream: 1}},
			{test: () => through2()}
		)('test')
	)
})

test('rejects unknown streams', t => {
	t.throws(() => builder({}, {})(123))
})

test('recurse on chains', t => {
	t.truthy(
		builder(
			{resolved: {stream: through2()}},
			{resolved: () => through2()}
		)({chain: ['resolved', {resolved: {}}]}) instanceof Stream
	)
})

test('recurse on merges', t => {
	t.truthy(
		builder(
			{resolved: {stream: through2()}},
			{resolved: () => through2()}
		)({merge: ['resolved', {resolved: {}}]}) instanceof Stream
	)
})
