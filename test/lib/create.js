import {Stream} from 'stream'
import {obj as through2} from 'through2'
import test from 'ava'
import create from '../../lib/create'

const streams = {
	unresolved: {
		chain: ['some-missing-stream'],
	},
	resolved: {
		stream: through2(),
	},
}

const plugins = {
	resolved: () => through2(),
}

test('validate arguments', t => {
	t.throws(() => create())
	t.throws(() => create({}))
	t.throws(() => create({}, {}))
	t.throws(() => create({}, {}, {}))
	t.throws(() => create({test: 1}))
	t.throws(() => create({test: 1}, {}))
	t.throws(() => create({test: 1}, {}, {}))
	t.throws(() => create({test: 1}, {test: 1}, {}))
	t.throws(() => create({test: 1}, {}, {test: 1}))
	t.throws(() => create({}, {test: 1}, {test: 1}))
	t.throws(() => create({}, {}, {test: 1}))
})

test('create unresolved chain stream', t => {
	let stream

	const chain1 = [
		'unresolved',
		{resolved: {}},
	]

	const chain2 = [
		'resolved',
		{unresolved: {}},
	]

	stream = create({name: 'test', chain: chain1}, streams, plugins)

	t.is(stream.name, 'test')
	t.deepEqual(stream.chain, chain1)
	t.falsy(stream.stream)

	stream = create({name: 'test', chain: chain2}, streams, plugins)

	t.is(stream.name, 'test')
	t.deepEqual(stream.chain, chain2)
	t.falsy(stream.stream)
})

test('create unresolved merge stream', t => {
	let stream

	const merge1 = [
		'unresolved',
		{resolved: {}},
	]

	const merge2 = [
		'resolved',
		{unresolved: {}},
	]

	stream = create({name: 'test', merge: merge1}, streams, plugins)

	t.is(stream.name, 'test')
	t.deepEqual(stream.merge, merge1)
	t.falsy(stream.stream)

	stream = create({name: 'test', merge: merge2}, streams, plugins)

	t.is(stream.name, 'test')
	t.deepEqual(stream.merge, merge2)
	t.falsy(stream.stream)
})

test('create resolved chain stream', t => {
	let stream

	const chain1 = [
		'resolved',
	]

	const chain2 = [
		{resolved: {}},
	]

	const chain3 = [
		'resolved',
		{resolved: {}},
	]

	stream = create({name: 'test', chain: chain1}, streams, plugins)

	t.is(stream.name, 'test')
	t.truthy(stream.stream instanceof Stream)

	stream = create({name: 'test', chain: chain2}, streams, plugins)

	t.is(stream.name, 'test')
	t.truthy(stream.stream instanceof Stream)

	stream = create({name: 'test', chain: chain3}, streams, plugins)

	t.is(stream.name, 'test')
	t.truthy(stream.stream instanceof Stream)
})

test('create resolved merge stream', t => {
	let stream

	const merge1 = [
		'resolved',
	]

	const merge2 = [
		{resolved: {}},
	]

	const merge3 = [
		'resolved',
		{resolved: {}},
	]

	stream = create({name: 'test', merge: merge1}, streams, plugins)

	t.is(stream.name, 'test')
	t.truthy(stream.stream instanceof Stream)

	stream = create({name: 'test', merge: merge2}, streams, plugins)

	t.is(stream.name, 'test')
	t.truthy(stream.stream instanceof Stream)

	stream = create({name: 'test', merge: merge3}, streams, plugins)

	t.is(stream.name, 'test')
	t.truthy(stream.stream instanceof Stream)
})
