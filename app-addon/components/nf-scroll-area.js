import Ember from 'ember';
import ScrollAreaActionContext from '../utils/nf/scroll-area-action-context';

/**
	A component that emits actions and events when scrolled or resized.
	@namespace components
	@class nf-scroll-area
*/
export default Ember.Component.extend({
	/**
		The tag name of the component
		@property tagName
		@type String
		@default 'div'
	*/
	tagName: 'div',

	classNames: ['nf-scroll-area'],

	/**
		The name of the action to fire when scrolled
		@property scrollAction
		@type String
		@default null
	*/
	scrollAction: null,

	/**
		The name of the action to fire when resized
		@property resizeAction
		@type String
		@default null
	*/
	resizeAction: null,

	/**
		The name of the action to fire when scrolled *OR* resized
		@property changeAction
		@type String
		@default null
	*/
	changeAction: null,

	/**
		Gets or sets the height of the scroll area
		@property height
		@type Number
	*/
	height: function(key, value) {
		if(arguments.length > 1) {
			this.$().height(value);
		}
		return this.$().height();
	}.property().volatile(),


	/**
		Gets or sets the width of the scroll area
		@property width
		@type Number
	*/
	width: function(key, value) {
		if(arguments.length > 1) {
			this.$().width(value);
		}
		return this.$().width();
	}.property().volatile(),

	/**
		Gets or sets the scrollTop of the area
		@property scrollTop
		@type Number
		@default 0
	*/
	scrollTop: function(key, value) {
		if(arguments.length > 1) {
			this.$().scrollTop(value);
		}
		return this.$().scrollTop();
	}.property().volatile(),

	/**
		Gets or sets the scrollLeft of the area
		@property scrollLeft
		@type Number
		@default 0
	*/
	scrollLeft: function(key, value) {
		if(arguments.length > 1) {
			this.$().scrollLeft(value);
		}
		return this.$().scrollLeft();
	}.property().volatile(),

	/**
		Gets the scrollHeight of the area
		@property scrollHeight
		@type Number
		@default 0
		@readonly
	*/
	scrollHeight: 0,

	/**
		Gets or sets the outerHeight of the area
		@property outerHeight
		@type Number
		@default 0
	*/
	outerHeight: function(key, value) {
		if(arguments.length > 1) {
			this.$().outerHeight(value);
		}
		return this.$().outerHeight();
	}.property().volatile(),

	/**
		Gets or sets the outerWidth of the area
		@property outerWidth
		@type Number
		@default 0
	*/
	outerWidth: function(key, value) {
		if(arguments.length > 1) {
			this.$().outerWidth(value);
		}
		return this.$().outerWidth();
	}.property().volatile(),

	/**
		The optional action data to send with the action contextl
		@property actionData
		@type Any
		@default null
	*/
	actionData: null,

	_onScroll: function(e){
		var context = this.createActionContext(e);
		this.trigger('didScroll', context);
		this.sendAction('scrollAction', context);
		this.sendAction('changeAction', context);
	},

	_onResize: function(e) {
		var context = this.createActionContext(e);
		this.trigger('didResize', context);
		this.sendAction('resizeAction', context);
		this.sendAction('changeAction', context);
	},

	/**
		Creates an action context to send with an action
		@method createActionContext
		@param e {Event} the original event object if there is one
		@return {utils.nf.scroll-area-action-context}
	*/
	createActionContext: function(e){
		var context = this.getProperties('width', 'height', 'scrollLeft', 'scrollTop', 'scrollWidth', 'scrollHeight', 'outerWidth', 'outerHeight');
		context.data = this.get('actionData');
		context.source = this;
		context.originalEvent = e;
		return ScrollAreaActionContext.create(context);
	},


	_setupElement: function() {
		var elem = this.get('element');
		if(elem) {
			elem.addEventListener('scroll', this._onScroll.bind(this));
			elem.addEventListener('resize', this._onResize.bind(this));
		}
	}.on('didInsertElement'),

	_unsubscribeEvents: function(){
		var elem = this.get('element');
		if(elem) {
			elem.removeEventListener('scroll', this._onScroll);
			elem.removeEventListener('resize', this._onResize);
		}
	}.on('willDestroyElement'),
});