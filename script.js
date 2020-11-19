function Node(id, label, x, y, size) {
    this.id = id;
    this.label = label;
    this.x = x;
    this.y = y;
    this.size = size;
    return { id: id, label: label, x: x, y: y, size: size };
}

function createEdge(airportArr, id, i, j) {
    let src = airportArr[i].id;
    let target = airportArr[j].id;
    let price = Math.floor(Math.random() * 201) + 200;
    return { id: id, source: src, target: target, label: `$${price}` };
}

function getNodePrice(node) {
    return parseInt(node.label.split("$")[1]);
}


// 10-airport system
let s1 = new sigma({
    renderer: {
        container: document.getElementById('ten-node-container'),
        type: 'canvas'
    },
    settings: {
        edgeColor: 'default',
        defaultEdgeColor: '#999',
        sideMargin: 0.2,
        defaultEdgeLabelColor: '#c00',
        defaultEdgeLabelSize: 17,
        font: 'Roboto'
    }
});
let graph = s1.graph;

let tenAirports = [];
let tenAirportsAdj = new Array(10); // Adjacency Matrix
tenAirports.push(Node('n0', 'SEA', 0, 0, 3));
tenAirports.push(Node('n1', 'SFO', 0, 2, 3));
tenAirports.push(Node('n2', 'LAX', 0, 3, 3));
tenAirports.push(Node('n3', 'SLC', 1, 1, 3));
tenAirports.push(Node('n4', 'DTW', 2, 0, 3));
tenAirports.push(Node('n5', 'KCI', 2, 1, 3));
tenAirports.push(Node('n6', 'ATL', 3, 2, 3));
tenAirports.push(Node('n7', 'BOS', 4, 0, 3));
tenAirports.push(Node('n8', 'RDU', 4, 1, 3));
tenAirports.push(Node('n9', 'MIA', 4, 3, 3));

// Fill adjacency matrix with 0s
for (let i = 0; i < 10; i++) {
    tenAirportsAdj[i] = new Array(10);
    for (let j = 0; j < 10; j++) {
        tenAirportsAdj[i][j] = 0;
    }
}

tenAirports.forEach(node => {
    let option = document.createElement('option');
    let textNode = document.createTextNode(`${node.label}`);
    option.appendChild(textNode);
    document.getElementById('ten-airport-select').appendChild(option);
    graph.addNode(node);
});


tenAirportsAdj[0][1] = 1;
tenAirportsAdj[0][8] = 1;
tenAirportsAdj[1][9] = 1;
tenAirportsAdj[2][3] = 1;
tenAirportsAdj[2][6] = 1;
tenAirportsAdj[2][9] = 1;
tenAirportsAdj[3][6] = 1;
tenAirportsAdj[4][6] = 1;
tenAirportsAdj[5][7] = 1;
tenAirportsAdj[6][7] = 1;
tenAirportsAdj[8][9] = 1;

// Create edges with the adjacency matrix
let edgeCount = 0;
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        if (tenAirportsAdj[i][j] === 1) {
            graph.addEdge(createEdge(tenAirports, `e${edgeCount}`, i, j));
            edgeCount++;
        }
    }
}
s1.refresh();

// Add the reverse of the edges
// to the adjacency matrix after
// rendering to avoid double lines
tenAirportsAdj[1][0] = 1;
tenAirportsAdj[8][0] = 1;
tenAirportsAdj[9][1] = 1;
tenAirportsAdj[3][2] = 1;
tenAirportsAdj[6][2] = 1;
tenAirportsAdj[9][2] = 1;
tenAirportsAdj[6][3] = 1;
tenAirportsAdj[6][4] = 1;
tenAirportsAdj[7][5] = 1;
tenAirportsAdj[7][6] = 1;
tenAirportsAdj[9][8] = 1;