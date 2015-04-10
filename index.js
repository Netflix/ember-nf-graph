/* jshint node: true */
'use strict';

var chalk = require('chalk');

var warningHeader = chalk.white.bgRed;
var warning = chalk.red;

console.log(warningHeader('                                                   '));
console.log(warningHeader(' WARNING: ember-cli-nf-graph is now ember-nf-graph '));
console.log(warningHeader('                                                   '));
console.log(      warning('                                                   '));
console.log(      warning(' to update, uninstall ember-cli-nf-graph and       '));
console.log(      warning(' install ember-nf-graph with NPM:                  '));
console.log(      warning('                                                   '));
console.log(      warning(' npm uninstall -D ember-cli-nf-graph               '));
console.log(      warning(' npm install -D ember-nf-graph                     '));
console.log(      warning('                                                   '));
console.log(      warning(' We realize this might make you sad,               '));
console.log(      warning('        so here is a panda:                        '));
console.log(      warning('                                                   '));
console.log(      warning('            +tt;        iBBi                       '));
console.log(      warning('           XMMMMi      +MMMMt                      '));
console.log(      warning('          .MMMMMB      ;RMMMt                      '));
console.log(      warning('           iRRi,.        ;BB:                      '));
console.log(      warning('            i.             iB,    ;.               '));
console.log(      warning('           X:               BR;    i:              '));
console.log(      warning('          VY    ,;. ,VRRt:  iMB    .B.             '));
console.log(      warning('         ;Mi  :XMMB.YMMMMM+ iMM;    Xt             '));
console.log(      warning('         VMB  BMMMt  iVMMMV XMMi    BR             '));
console.log(      warning('         BMMt.RMMX     ,Vi.iMMMi   ,MM;            '));
console.log(      warning('         XMMMY;YV,.iti,  ;VMMMM+  .XMM;            '));
console.log(      warning('         tMMMMRt;:,XMV,YRMMMMMR: ,BMMMi            '));
console.log(      warning('         ;MMMMMMMMRXi,XMMMMMMM;,tRMMMM;            '));
console.log(      warning('          RMMMMMMMMMMMMMMMMMMRBMMMMMMB             '));
console.log(      warning('          iMMMMMMRiMMMMMMMMMMMMMMMMMMi             '));
console.log(      warning('          .BMMMMMM;MMMMMMMMMMMMMMMMMV              '));
console.log(      warning('           ;MMMMMMYMMMMMMMMMMMMMMMMX.              '));
console.log(      warning('            iMMMMMXMMMMMMMMMBMMMMMY                '));
console.log(      warning('             iRMMMVMMMMMMMMt:RMRY;                 '));
console.log(      warning('               iVV;MMMMMMR;   .                    '));
console.log(      warning('                  :MMMMMi.                         '));
console.log(      warning('                  .XMRt:                           '));
console.log(      warning('                    .                              '));
console.log(      warning('                            source: retrojunkie.com'));

module.exports = {
  name: 'ember-cli-nf-graph',
  
  included: function(app) {
    this._super.included(app);

    app.import('vendor/ember-cli-nf-graph/ember-cli-nf-graph.css');
    app.import(app.bowerDirectory + '/d3/d3.js');
    app.import(app.bowerDirectory + '/rxjs/dist/rx.all.js'); //probably ham fisted.
    app.import(app.bowerDirectory + '/rx-ember/dist/rx-ember.js');
  }
};
