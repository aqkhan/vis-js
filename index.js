
// Re-structure the JSON data input to initialize map
// Returns a object with network Nodes and Edges
function structureData(data) {
    let nodes = [];
    let temp = {};
    let edges = [];
    try {
        for (let index = 0; index < data.length; index++) {
            nodes.push({ id: (index + 1), label: breakText(data[index].termKey), shape: "circle", margin: 10, color: { background: ColorLuminance(data[index].ideaRelevance), border: "transparent"  } });
            temp[data[index].termKey] = (index + 1);
        }

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].edges.length; j++) {
                edges.push({ from: (i + 1), to: temp[data[i].edges[j].to], length: detectEdgeLength(breakText(data[i].edges[j].to), breakText(data[i].termKey)) })
            }
        }
    } catch (err) {
        console.log("Invalid json");
    }

    return {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges),

    };
};

function breakText(text) {
    let space = null;
    let main = text.repeat(1);
    for(let i = 0; i<= main.length; i++ ){
        if(text[i] === " "){
            space = i
        }
        if(i%9 === 0 && space){
            if(text[space+1] === " "){
                space = space + 1;
            }
            text = text.replace(text[space], "\n");
            space = null;
        }
    }
    return text;
}

function detectEdgeLength(node1, node2) {
    let node = node1.split("\n");
    let first = node.reduce(function (a, b) { return a.length > b.length ? a : b; });
    node = node2.split("\n");
    let second = node.reduce(function (a, b) { return a.length > b.length ? a : b; });
    let final = first + second;
    return (5 + (final.length * 9));


}

// Initializes the network map
// id: id prop of the html element
// dataset: JSON data input
// readyCallBack: Fired when the map is completely drawn on the canvas
// callbackFunction: Fired when an interaction with the nodes is registered

function initialization(id, dataSet, readyCallBack, callbackFunction) {
    let main = structureData(dataSet);
    let deNodeId = null;
    let nodes = main.nodes;
    let edges = main.edges;
    let container = document.getElementById(id);
    let data = {
        nodes: nodes,
        edges: edges
    };
    // Vis js initialization params
    let options = {
        layout: {
            randomSeed: 3
        },
        edges: {
            dashes: [1.5, 3],
            hoverWidth: 0.3,
            color: "#005D5E",
            font: {
                strokeWidth: 0.3,
            }
        },
        nodes: {
            borderWidth: 1,
            borderWidthSelected: 1,
            color: {
                background: '#3ECFD1',
                highlight: {
                    border: "#005D5E",
                    background: '#FAFAFA'
                },
                hover: {
                    background: '#005D5E',
                    border: '#005D5E'
                }
            },
            font: {
                color: '#fff',
                size: 25,
                face: 'arial',
                background: 'none',
                strokeWidth: 0,
                align: 'center'
            }
        },
        interaction: {
            hover: true,
            dragView: false,
            zoomView: false
        }

    };

    // Initialize network map with vis.Network
    let network = new vis.Network(container, data, options);
    // network.setOptions(options);
    let temp = true;
    // Register drag event on map
    network.on("dragging", function (params) {
        let selectedNodeId = params.nodes[0];
        let node = network.body.nodes[selectedNodeId];
        if(deNodeId !== selectedNodeId){
            deSelectNode(deNodeId);
        }
        deNodeId = selectedNodeId;
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
        deNodeId = selectedNodeId;
        let node = network.body.nodes[selectedNodeId];
        temp = false;
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
        if (callbackFunction) {
            callbackFunction({
                type: "clicked",
                key: dataSet[(params.nodes[0] - 1)].termKey
            });
        }
    });

    // Register event for node deselection
    network.on("deselectNode", function () {
        // let deselectedNodeId = params.previousSelection.nodes[0];
        deSelectNode(deNodeId);

    });
    if (readyCallBack) {
        setTimeout(function () {
            readyCallBack();
        }, 0);
    }

    deSelectNode = (id) => {
        let node = network.body.nodes[id];
        temp = true;
        if(deNodeId){
            node.setOptions({
                color: {
                    border: "transparent"
                },
                font: {
                    color: options.nodes.font.color,
                    size: 25
                }
            });
        }
    };

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
        "termKey": "Nj",
        "edges": [
            {
                "to": "Parsippany Troy Hills"
            }
        ],
        "ideaRelevance": 1
    },
    {
        "termKey": "Cranberry Rd",
        "edges": [
            {
                "to": "Parsippany Troy Hills"
            },
            {
                "to": "shopping experience"
            }
        ],
        "ideaRelevance": 0.8074446810718884
    },
    {
        "termKey": "Parsippany Troy Hills",
        "edges": [],
        "ideaRelevance": 0.7785994867571947
    },
    {
        "termKey": "shoppers",
        "edges": [
            {
                "to": "shopping experience"
            }
        ],
        "ideaRelevance": 0.40760419164479395
    },
    {
        "termKey": "shopping experience",
        "edges": [],
        "ideaRelevance": 0.3451777310089211
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

    mapManager = mapManager.updateDataset(readyAgain, payload);
}

// Redraws the map with current dataset
function reDraw() {
    mapManager = mapManager.reDraw(readyAgain);
}
