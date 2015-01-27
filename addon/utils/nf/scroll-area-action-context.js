import Ember from 'ember';

/**
	Action context event object for an nf-scroll-area scroll event.
	@namespace utils.nf
	@class scroll-area-action-context
*/
export default Ember.Object.extend({
	/**
		The scroll top in pixels.
		@property scrollTop
		@type Number
		@default 0
	*/
	scrollTop: 0,

	/**
		The scroll height of the element.
		@property scrollHeight
		@type number
		@default 0
	*/
	scrollHeight: 0,

	/**
		The outer height of the element
		@property outerHeight
		@type Number
		@default 0
	*/
	outerHeight: 0,

	/**
		The scroll left in pixels.
		@property scrollLeft
		@type Number
		@default 0
	*/
	scrollLeft: 0,

	/**
		The scroll width of the element.
		@property scrollWidth
		@type number
		@default 0
	*/
	scrollWidth: 0,

	/**
		The outer width of the element
		@property outerWidth
		@type Number
		@default 0
	*/
	outerWidth: 0,

	/**
		The calculated maximum value for scrollTop in pixels.
		@property scrollTopMax
		@type Number
		@readonly
	*/
	scrollTopMax: function(){
		return this.get('scrollHeight') - this.get('outerHeight');
	}.property('outerHeight', 'scrollHeight'),

	/**
		The calculated percentage, in decimals, of content scrolled.
		@property scrollTopPercentage
		@type Number
		@readonly
	*/
	scrollTopPercentage: function() {
		return this.get('scrollTop') / this.get('scrollTopMax');
	}.property('scrollTop', 'scrollTopMax'),
	
	/**
		The calculated maximum value for scrollTop in pixels.
		@property scrollLeftMax
		@type Number
		@readonly
	*/
	scrollLeftMax: function(){
		return this.get('scrollWidth') - this.get('outerWidth');
	}.property('outerWidth', 'scrollWidth'),

	/**
		The calculated percentage, in decimals, of content scrolled.
		@property scrollLeftPercentage
		@type Number
		@readonly
	*/
	scrollLeftPercentage: function() {
		return this.get('scrollLeft') / this.get('scrollLeftMax');
	}.property('scrollLeft', 'scrollLeftMax'),

	/**
		The component that fired the event
		@property source
		@type Ember.Component
		@default null
	*/
	source: null,

	/**
		The optional data to send with the action
		@property data
		@default null
	*/
	data: null,

	/**
		The original scroll event object
		@property originalEvent
		@type Event
		@default null
	*/
	originalEvent: null,
});