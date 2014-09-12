import Ember from 'ember';
import GraphPosition from '../../../utils/nf/graph-position';
import { module, test } from 'ember-qunit';

module('utils/nf/graph-position');

test('exists', function(){
	ok(typeof GraphPosition === 'function');
});