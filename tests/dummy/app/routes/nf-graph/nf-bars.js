import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return {
      menuItemStockCount: [
        { x: 0, y: 200 },
        { x: 1, y: 154 },
        { x: 2, y: 130 },
        { x: 3, y: 300 }
      ]
    };
  }
});