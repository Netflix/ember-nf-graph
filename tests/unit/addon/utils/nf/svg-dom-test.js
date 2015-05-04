import Ember from 'ember';
import { cloneSVG } from 'ember-nf-graph/utils/nf/svg-dom';
import { module, test } from 'qunit';

module('addon/utils/nf/svg-dom');

test('cloneSVG should create a clone, including styles, of an SVG element', assert => {
  var html = `
    <style id="test-styles">
      .my-circle {
        fill: red;
      }
    </style>
    <svg width="100" height="100" id="test-svg">
      <circle cx="10" cy="20" r="5" class="my-circle"/>
    </svg>
  `;

  var div = document.createElement('div');
  div.innerHTML = html;
  document.body.appendChild(div);
  try {
    var svg = document.querySelector('#test-svg');
    var clone = cloneSVG(svg);
    var clonedCircle = Ember.$(clone).select('circle')[0];
    assert.equal(clonedCircle.style.fill, 'red', 'it should inline styles');
    assert.equal(clonedCircle.getAttribute('cx'), '20', 'it could copy properties');
  } finally {
    div.remove();
  }
});