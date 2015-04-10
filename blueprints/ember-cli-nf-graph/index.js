/* globals module */
module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'd3', target: '~3.5.3' },
      { name: 'rx-ember', target: '~0.2.3'},
      { name: 'rxjs', target: '~2.4.6'}
    ]);
  }
};