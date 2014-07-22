YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "nf-graph",
        "nf-x-axis",
        "nf-y-axis"
    ],
    "modules": [
        "ember-cli-ember-dvc"
    ],
    "allModules": [
        {
            "displayName": "ember-cli-ember-dvc",
            "name": "ember-cli-ember-dvc",
            "description": "A container component for building complex Cartesian graphs.\n\n## Minimal example\n\n      {{#nf-graph width=100 height=50}}\n        {{#nf-graph-content}}\n          {{nf-line data=lineData xprop=\"foo\" yprop=\"bar\"}}\n        {{/nf-graph-content}}\n      {{/nf-graph}}\n\nThe above will create a simple 100x50 graph, with no axes, and a single line\nplotting the data it finds on each object in the array `lineData` at properties\n`foo` and `bar` for x and y values respectively.\n\n## More advanced example\n\n      {{#nf-graph width=500 height=300}}\n        {{#nf-x-axis height=\"50\"}}\n          <text>{{tick.value}}</text>\n        {{/nf-x-axis}}\n  \n        {{#nf-y-axis width=\"120\"}}\n          <text>{{tick.value}}</text>\n        {{/nf-y-axis}}\n  \n        {{#nf-graph-content}}\n          {{nf-line data=lineData xprop=\"foo\" yprop=\"bar\"}}\n        {{/nf-graph-content}}\n      {{/nf-graph}}\n\nThe above example will create a 500x300 graph with both axes visible. The graph will not \nrender either axis unless its component is present."
        }
    ]
} };
});