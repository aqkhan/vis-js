
// Re-structure the JSON data input to initialize map
// Returns a object with network Nodes and Edges
function structureData(data) {
    let nodes = [];
    let temp = {};
    let edges = [];
    try {
        for (let index = 0; index < data.length; index++) {
            nodes.push({ id: (index + 1), label: data[index].termKey, shape: "circle", x: 0, y: 0, margin: 12, color: { background: ColorLuminance(data[index].ideaRelevance) } });
            temp[data[index].termKey] = (index + 1);
        }

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].edges.length; j++) {
                edges.push({ from: (i + 1), to: temp[data[i].edges[j].to] })
            }
        }
    } catch (err) {
        console.log("Invalid json");
    }

    return {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges),

    };
}

// Initializes the network map
// id: id prop of the html element
// dataset: JSON data input
// readyCallBack: Fired when the map is completely drawn on the canvas 
// callbackFunction: Fired when an interaction with the nodes is registered 

function initialization(id, dataSet, readyCallBack, callbackFunction) {

    let main = structureData(dataSet);
    let nodes = main.nodes;
    let edges = main.edges;
    let container = document.getElementById(id);
    let data = {
        nodes: nodes,
        edges: edges
    };
    // Vis js initialization params
    let options = {
        edges: {
            dashes: [1.5, 3],
            hoverWidth: 0.3,
            font: {
                strokeWidth: 0.3,
            }
        },
        nodes: {
            borderWidth: 0,
            borderWidthSelected: 0,
            color: {
                border: '#3ECFD1',
                background: '#3ECFD1',
                highlight: {
                    border: "#005D5E",
                    background: '#FAFAFA'
                },
                hover: {
                    background: '#005D5E',
                    border: '#3ECFD1'
                }
            },
            font: {
                color: '#fff',
                size: 25,
                face: 'arial',
                background: 'none',
                strokeWidth: 0,
                align: 'center'
            },
        },
        // Enable interactions on hover
        interaction: {
            hover: true,
            dragView: false,
            zoomView: false
        }

    };

    // Initialize network map with vis.Network
    let network = new vis.Network(container, data);
    network.setOptions(options);
    let temp = true;
    // Register drag event on map
    network.on("dragging", function (params) {
        let selectedNodeId = params.nodes[0];
        let node = network.body.nodes[selectedNodeId];
        node.setOptions({
            outline: "none",
            borderWidth: 1,
            borderWidthSelected: 1,
            color: {
                border: '#09321f'
            },
            font: {
                color: '#09321f'
            }
        });
    });

    // Register hover event on nodes
    network.on("hoverNode", function (params) {
        let selectedNodeId = params.node;
        let node = network.body.nodes[selectedNodeId];
        if (temp) {
            node.setOptions({
                font: {
                    size: 30
                }
            });
        }
        if (callbackFunction) {
            callbackFunction({
                type: "hovered",
                key: dataSet[(params.node - 1)].termKey
            });
        }
    });

    // Register event on node blur
    network.on("blurNode", function (params) {
        let selectedNodeId = params.node;
        let node = network.body.nodes[selectedNodeId];
        if (temp) {
            node.setOptions({
                font: {
                    size: 25
                }
            });
        }
    });

    // Register event for node selection
    network.on("selectNode", function (params) {
        let selectedNodeId = params.nodes[0];
        let node = network.body.nodes[selectedNodeId];
        temp = false;
        node.setOptions({
            borderWidth: 0,
            borderWidthSelected: 1,
            color: {
                border: '#09321f'
            },
            font: {
                color: '#09321f'
            }
        });
        if (callbackFunction) {
            callbackFunction({
                type: "clicked",
                key: dataSet[(params.nodes[0] - 1)].termKey
            });
        }
    });

    // Register event for node deselection
    network.on("deselectNode", function (params) {
        let deselectedNodeId = params.previousSelection.nodes[0];
        let node = network.body.nodes[deselectedNodeId];
        temp = true;
        node.setOptions({
            color: {
                border: options.nodes.color.border
            },
            font: {
                color: options.nodes.font.color
            }
        });
    });
    if (readyCallBack) {
        setTimeout(function () {
            readyCallBack();
        }, 0);
    }

    // Updates the JSON input for map network and redraws/reinitializes the map
    updateDataset = (callBackFunc, newDataSet) => {
        if (newDataSet) {
            return initialization(id, newDataSet, callBackFunc);
        } else {
            return initialization(id, dataSet, callBackFunc);
        }

    }

    return {
        updateDataset: updateDataset,
        reDraw: updateDataset
    }
}

// Set node colors w.r.t ideaRelevance score
function ColorLuminance(lum) {
    let val = lum * 100;
    if (val <= 25) {
        return "#06B8BB";
    } else if (val <= 50) {
        return "#117E81";
    } else if (val <= 75) {
        return "#117E81";
    } else {
        return "#005D5E";
    }
}
// JSON input object
let payload = [
    {
        "termKey": "lcdtv",
        "edges": [
            {
                "to": "oledtv"
            }
        ],
        "ideaRelevance": 0.1
    },
    {
        "termKey": "oledtv",
        "edges": [],
        "ideaRelevance": 0.2
    },
    {
        "termKey": "backlight",
        "edges": [
            {
                "to": "oledtv"
            },
            {
                "to": "filter"
            },
            {
                "to": "quantumdot"
            },
            {
                "to": "lcdpanel"
            },
            {
                "to": "diode"
            }
        ],
        "ideaRelevance": 0.5
    },
    {
        "termKey": "diode",
        "edges": [],
        "ideaRelevance": 0.2
    },
    {
        "termKey": "lcdpanel",
        "edges": [],
        "ideaRelevance": 0.1
    },
    {
        "termKey": "quantumdot",
        "edges": [],
        "ideaRelevance": 0.1
    },
    {
        "termKey": "filter",
        "edges": [],
        "ideaRelevance": 0.3
    }
];
// Fires when an interaction is registered on a node
function callback({ type, key }) {
    // console.log("type", type);
    // console.log("key", key);
}

// Fires when the map is ready
function ready() {
    console.log("ready");
}

// Fires when the map is redrawn
function readyAgain() {
    console.log("ready again");
}

let mapManager = initialization("mynetwork", payload, ready, callback);

// Redraws the map with new dataset
function reInitialize() {
    let test = [
        {
            "termKey": "loan",
            "ideaRelevance": 0.6543128656662465,
            "edges": [
                {
                    "to": "sale"
                },
                {
                    "to": "mortgage"
                },
                {
                    "to": "page"
                },
                {
                    "to": "advisor"
                }
            ]
        },
        {
            "termKey": "sale",
            "ideaRelevance": 0.640957918439873,
            "edges": [
                {
                    "to": "cart"
                }
            ]
        },
        {
            "termKey": "mortgage",
            "ideaRelevance": 0.5080406486945644,
            "edges": []
        },
        {
            "termKey": "bajaj",
            "ideaRelevance": 0.4627889998678985,
            "edges": []
        },
        {
            "termKey": "page",
            "ideaRelevance": 0.4559591273750656,
            "edges": []
        },
        {
            "termKey": "purchase",
            "ideaRelevance": 0.4464100420237413,
            "edges": []
        },
        {
            "termKey": "item",
            "ideaRelevance": 0.44454711159146404,
            "edges": [
                {
                    "to": "advisor"
                }
            ]
        },
        {
            "termKey": "cart",
            "ideaRelevance": 0.4304156098488393,
            "edges": []
        },
        {
            "termKey": "advisor",
            "ideaRelevance": 0.317821991685191,
            "edges": []
        },
        {
            "termKey": "insurance",
            "ideaRelevance": 0.2609824551752122,
            "edges": [
                {
                    "to": "purchase"
                },
                {
                    "to": "bajaj"
                },
                {
                    "to": "sale"
                }
            ]
        }
    ];

    mapManager = mapManager.updateDataset(readyAgain, test);
}

// Redraws the map with current dataset
function reDraw() {
    mapManager = mapManager.reDraw(readyAgain);
}