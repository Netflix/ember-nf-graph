import Ember from 'ember';
import ScrollAreaActionContext from 'ember-cli-ember-dvc/utils/nf/scroll-area-action-context';

/**
	A component that emits actions and events when scrolled or resized.
	@namespace components
	@class {nf-scroll-area}
*/
export default Ember.Component.extend({
	/**
		The tag name of the component
		@property tagName
		@type {String}
		@default 'div'
	*/
	tagName: 'div',

	classNames: ['nf-scroll-area'],

	/**
		The name of the action to fire when scrolled
		@property scrollAction
		@type {String}
		@default null
	*/
	scrollAction: null,

	/**
		The name of the action to fire when resized
		@property resizeAction
		@type {String}
		@default null
	*/
	resizeAction: null,

	/**
		The name of the action to fire when scrolled *OR* resized
		@property changeAction
		@type {String}
		@default null
	*/
	changeAction: null,

	/**
		The name of the action to fire when the list of child DOM nodes changes
		@property childrenChangedAction
		@type {String}
		@default null
	*/
	childrenChangedAction: null,

	/**
		Gets or sets the scrollTop by percentage (decimal) of
		scrollHeight
		@property scrollTopPercentage
		@type {Number}
	*/
	scrollTopPercentage: function(key, value) {
		if(arguments.length > 1) {
			this._scrollTopPercentage = value;
		}
		return this._scrollTopPercentage;
	}.property().volatile(),

	_childMutationObserver: null,

	_setupChildMutationObserver: function() {
		var handler = function(e) {
			var context = this.createActionContext(e);
		  this.sendAction('childrenChangedAction', context);   
		  this.sendAction('changeAction', context);   
		}.bind(this);

		this._childMutationObserver = new MutationObserver(handler);
		this._childMutationObserver.observe(this.get('element'), { childList: true });

		// trigger initial event
		handler();
	}.on('didInsertElement'),

	_teardownChildMutationObserver: function(){
		if(this._childMutationObserver) {
			this._childMutationObserver.disconnect();
		}
	}.on('willDestroyElement'),

	_updateScrollTop: function(){
		var element = this.get('element');
		if(element) {
			var scrollTop = this.get('scrollTopPercentage') * (element.scrollHeight - this.$().outerHeight());
			this.set('scrollTop', scrollTop);
		}
	}.observes('scrollTopPercentage').on('didInsertElement'),

	/**
		Gets or sets the scrollTop of the area
		@property scrollTop
		@type {Number}
		@default 0
	*/
	scrollTop: function(key, value){
		if(arguments.length > 1) {
			this._scrollTop = value;
		}
		return this._scrollTop;
	}.property().volatile(),

	_updateScroll: function(){
		if(this.get('element')) {
			this.$().scrollTop(this.get('scrollTop'));
		}
	}.observes('scrollTop').on('didInsertElement'),

	/**
		The optional action data to send with the action contextl
		@property actionData
		@type Any
		@default null
	*/
	actionData: null,

	_onScroll: function(e){
		var context = this.createActionContext(e);
		this._scrollTop = e.scrollTop;
		this._scrollTopPercentage = e.scrollTop / e.scrollHeight;
		this.trigger('didScroll', context);
		this.sendAction('scrollAction', context);
		this.sendAction('changeAction', context);
	},

	_onResize: function(e) {
		var context = this.createActionContext(e);
		this._scrollTop = e.scrollTop;
		this._scrollTopPercentage = e.scrollTop / e.scrollHeight;
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
		var elem = this.$();
		var context = {
			width: elem.width(),
			height: elem.height(),
			scrollLeft: elem.scrollLeft(),
			scrollTop: elem.scrollTop(),
			scrollWidth: elem[0].scrollWidth,
			scrollHeight: elem[0].scrollHeight,
			outerWidth: elem.outerWidth(),
			outerHeight: elem.outerHeight()
		};

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