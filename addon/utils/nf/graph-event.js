import GraphPosition from './graph-position';

/**
  Event object for graph events
  @namespace utils.nf
  @class graph-event
  @extends graph-position
*/
export default GraphPosition.extend({
  /**
    The original event that triggered this event or action
    @property originalEvent
    @type Event
    @default null
  */
  originalEvent: null,

  /**
    A data value passed with the event
    @property data
    @type any
    @default null
  */
  data: null,
});