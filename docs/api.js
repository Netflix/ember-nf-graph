YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "nf-area-stack",
        "nf-column",
        "nf-graph",
        "nf-table",
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
            "description": "A component for grouping and stacking `nf-area` components in an `nf-graph`.\n\nThis component looks at the order of the `nf-area` components underneath it \nand uses the ydata of the next sibling `nf-area` component to determine the bottom \nof each `nf-area` components path to be drawn.\n\n### Example\n\n \t\t{{#nf-graph width=300 height=100}}\n \t\t\t{{#nf-graph-content}}\n \t\t\t\t{{#nf-area-stack}}\n \t\t\t\t\t{{nf-area data=myData xprop=\"time\" yprop=\"high\"}}\n \t\t\t\t\t{{nf-area data=myData xprop=\"time\" yprop=\"med\"}}\n \t\t\t\t\t{{nf-area data=myData xprop=\"time\" yprop=\"low\"}}\n \t\t\t\t{{/nf-area-stack}}\n \t\t\t{{/nf-graph-content}}\n \t\t{{/nf-graph}}"
        }
    ]
} };
});