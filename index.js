// Re-structure the JSON data input to initialize map
// Returns a object with network Nodes and Edges
function structureData(data) {
    let nodes = [];
    let temp = {};
    let edges = [];
    try {
        for (let index = 0; index < data.length; index++) {
            nodes.push({ id: (index + 1), label: breakText(data[index].termKey), shape: "circle", margin: 10, color: { border: "transparent"  } });
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
}
function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
// Set node colors w.r.t ideaRelevance score
function addColor(payload) {
    payload.sort(function (a, b) {
        return a.ideaRelevance - b.ideaRelevance
    });
    for (let index = 0; index < payload.length; index++) {
        const element = payload[index];
        // element.color = index === 0 ? '#06B8BB' : index === payload.length - 1 ? '#005D5E' : rgbToHex(6, 184 - index * 10, 187 - index * 10);
        // element.color = rgbToHex(5, 184 - element.termKey.length * 4, 187 - element.termKey.length * 4);
        element.color = "blue";
    }
    return payload;
}
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
function initialization(container, dataSet, readyCallBack, callbackFunction) {
    let main = structureData(addColor(dataSet));
    let nodes = main.nodes;
    let edges = main.edges;
    let data = {
        nodes: nodes,
        edges: edges
    };
    // Vis js initialization params
    let options = {
        layout: {
            randomSeed: 15
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
                background: '#99ccff',
                highlight: {
                    border: "#005D5E",
                    background: '#FAFAFA'
                },
                hover: {
                    background: '#5BBFBA', // background: '#005D5E',
                    border: '#519a95' // border: '#005D5E'
                }
            },
            font: {
                color: '#fff',
                size: 33,
                face: 'arial',
                background: 'none',
                strokeWidth: 0,
                align: 'center'
            }
        },
        physics: {
            enabled: true,
            forceAtlas2Based: {
                gravitationalConstant: -90
            },
            maxVelocity: 146,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: {
                enabled: true,
                iterations: 1000,
                updateInterval: 25
            }
        },
        interaction: {
            hover: true,
            dragView: false,
            zoomView: false,
            dragNodes:true,
        }
    };
    // Initialize network map with vis.Network
    let network = new vis.Network(container, data, options);
    network.dataSet = dataSet;
    network.deNodeId = null;
    // network.setOptions(options);
    let temp = true;
    network.nodes = main.nodes;
    network.edges = main.edges;
    // Register drag event on map
    network.on("dragging", function (params) {
        let selectedNodeId = params.nodes[0];
        let node = network.body.nodes[selectedNodeId];
        if(network.deNodeId !== selectedNodeId){
            deSelectNode(network.deNodeId);
        }
        network.deNodeId = selectedNodeId;
        node.setOptions({
            outline: "none",
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
                    size: 35
                }
            });
        }
        if (callbackFunction) {
            callbackFunction({
                type: "hovered",
                key: network.dataSet[(params.node - 1)].termKey
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
                    size: 33
                }
            });
        }
    });
    // Register event for node selection
    network.on("selectNode", function (params) {
        nodeClickEvent(params);

    });

    // Register dragEnd event on map
    network.on("dragEnd", function (params) {
        nodeClickEvent(params);
    });

    // Register event for node deselection
    network.on("deselectNode", function () {
        // let deselectedNodeId = params.previousSelection.nodes[0];
        deSelectNode(network.deNodeId);
    });
    var nodeClickEvent = function(params) {

      if(params.nodes.length == 0) return;
      let selectedNodeId = params.nodes[0];
      network.deNodeId = selectedNodeId;
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
              color: '#09321f',

          }
      });
      if (callbackFunction) {
          callbackFunction({
              type: "clicked",
              key: network.dataSet[(params.nodes[0] - 1)].termKey
          });
      }
    };
    var deSelectNode = (id) => {
        let node = network.body.nodes[id];
        temp = true;
        if(network.deNodeId){
          node.setOptions({
              color: {
                  border: "transparent"
              },
              font: {
                  color: options.nodes.font.color,
                  size: 33
              }
          });
        }
    };
    // Updates the JSON input for map network and redraws/reinitializes the map
    var updateDataset = (network, newDataSet) => {
      let main2 = structureData(addColor(newDataSet));
      network.dataSet = newDataSet;
      let data2 = {
          nodes: main2.nodes,
          edges: main2.edges
      };
      network.setData(data2);
    }
    if (typeof readyCallBack === "function") {
        setTimeout(function () {
            readyCallBack();
        }, 0);
    }
    network.fit();
    return {
        updateDataset: updateDataset,
        reDraw: updateDataset,
        network,
    }
}
