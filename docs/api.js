YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "nf-area-stack",
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
            "description": "A component for grouping and stacking `nf-area` components in an `nf-graph`.\n\nThis component looks at the order of the `nf-area` components underneath it \nand uses the ydata of the next sibling `nf-area` component to determine the bottom \nof each `nf-area` components path to be drawn."
        }
    ]
} };
});