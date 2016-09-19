import {Stream} from 'stream'
import test from 'ava'
import through2 from 'through2'
import index from '../index'

test('validate arguments', t => {
	t.throws(() => index())
	t.throws(() => index({}))
	t.throws(() => index({plugins: {}}))
	t.throws(() => index({plugins: {test: {}}}))
	t.throws(() => index({plugins: {test: {}}, streams: {}}))
})

test('create streams', t => {
	const streams = index({
		streams: [
			{name: 'test1', chain: ['test2', 'test3', {test1: {}}]},
			{name: 'test2', chain: ['test3', {test2: {}}]},
			{name: 'test3', chain: [{test3: {}}]},
		],
		plugins: {
			test1: () => through2(),
			test2: () => through2(),
			test3: () => through2(),
		},
	})

	t.truthy(streams.test1.stream instanceof Stream)
	t.truthy(streams.test2.stream instanceof Stream)
	t.truthy(streams.test3.stream instanceof Stream)
})

test('fail on unresolved streams', t =>
	t.throws(() => index({
		streams: [
			{name: 'test1', chain: ['test2', 'test3', {test1: {}}]},
			{name: 'test2', chain: ['test3', {test2: {}}]},
			{name: 'test3', chain: ['test4', {test3: {}}]},
		],
		plugins: {
			test1: () => through2(),
			test2: () => through2(),
			test3: () => through2(),
		},
	}))
)
