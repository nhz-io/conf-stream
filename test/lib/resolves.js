import {obj as through2} from 'through2'
import test from 'ava'
import resolves from '../../lib/resolves'

test('list resolves streams', t => {
	t.truthy(resolves(
		[through2()],
		{},
		{}
	))
})

test('list resolves named streams', t => {
	t.truthy(resolves(
		['test'],
		{test: {stream: through2()}},
		{}
	))
})

test('list resolves named plugins', t => {
	t.truthy(resolves(
		[{test: {}}],
		{},
		{test: () => through2()}
	))
})

test('list resolves streams and plugins', t => {
	t.truthy(resolves(
		['test', {test: {}}],
		{test: {stream: through2()}},
		{test: () => through2()}
	))
})

test('list resolves nested chains', t => {
	t.truthy(resolves(
		[{
			chain: ['test', {test: {}}],
		}],
		{test: {stream: through2()}},
		{test: () => through2()}
	))
})

test('list resolves nested merges', t => {
	t.truthy(resolves(
		[{
			merge: ['test', {test: {}}],
		}],
		{test: {stream: through2()}},
		{test: () => through2()}
	))
})

test('list resolves deep nesting', t => {
	t.truthy(resolves(
		[{chain: [{merge: [{
			chain: ['test', {test: {}}],
		}]}]}],
		{test: {stream: through2()}},
		{test: () => through2()}
	))
})

test('list does not resolve streams', t => {
	t.falsy(resolves(
		['test'],
		{},
		{}
	))

	t.falsy(resolves(
		['test'],
		{test: {}},
		{}
	))
})

test('list does not resolve plugins', t => {
	t.falsy(resolves(
		[{test: {}}],
		{},
		{}
	))
})

test('list does not resolve streams and plugins', t => {
	t.falsy(resolves(
		['test', {test: {}}],
		{},
		{}
	))

	t.falsy(resolves(
		['test', {test: {}}],
		{test: {}},
		{}
	))
})

test('list does not resolve nested chains', t => {
	t.falsy(resolves(
		[{
			chain: ['test', {test: {}}],
		}],
		{},
		{}
	))
})

test('list does not resolve nested merges', t => {
	t.falsy(resolves(
		[{
			merge: ['test', {test: {}}],
		}],
		{test: {}},
		{}
	))
})

test('list does not resolve deep nesting', t => {
	t.falsy(resolves(
		[{chain: [{merge: [{
			chain: ['test', {test: {}}],
		}]}]}],
		{test: {}},
		{},
	))
})
