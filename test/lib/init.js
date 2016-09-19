import test from 'ava'
import through2 from 'through2'
import init from '../../lib/init'

test('validate arguments', t => {
	t.throws(() => init())
	t.throws(() => init({}))
	t.throws(() => init({}, {}))
	t.throws(() => init({}, {}, {}))
	t.throws(() => init({test: 1}))
	t.throws(() => init({test: 1}, {}))
	t.throws(() => init({test: 1}, {}, {}))
	t.throws(() => init({test: 1}, {test: 1}, {}))
	t.throws(() => init({test: 1}, {}, {test: 1}))
	t.throws(() => init({}, {test: 1}, {test: 1}))
	t.throws(() => init({}, {}, {test: 1}))
})

test('passes streams through', t => {
	const stream = through2()
	t.is(init(stream), stream)
})
