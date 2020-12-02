let visited;
let tenAirports;
let tenAirportsAdjPriceMat;
let twentyAirports;
let twentyAirportsAdjPriceMat;
let possibleFlights = [];

document.getElementById('airport-selection-form').reset();

function Node(id, label, x, y, size) {
    this.id = id;
    this.label = label;
    this.x = x;
    this.y = y;
    this.size = size;
    return { id: id, label: label, x: x, y: y, size: size };
}

function createEdge(airportArr, airportAdjPriceMat, id, i, j) {
    let src = airportArr[i].id;
    let target = airportArr[j].id;
    return { id: id, source: src, target: target, label: `$${airportAdjPriceMat[i][j]}` };
}

function getNodePrice(node) {
    return parseInt(node.label.split("$")[1]);
}


function DFS(src, dest, airports, adjPriceMatrix, pathStr, price) {
    let current = src;
    visited[current] = true;
    pathStr += airports[current].label + " -> ";
    if (current === dest) {
        pathStr = pathStr.substring(0, pathStr.lastIndexOf(" -> "));
        possibleFlights.push({ 'path': pathStr, 'price': price });
        return;
    }
    for (let i = 0; i < adjPriceMatrix.length; i++) {
        if (!visited[i] && adjPriceMatrix[current][i] !== 0) {
            price += adjPriceMatrix[current][i];
            DFS(i, dest, airports, adjPriceMatrix, pathStr, price);
            visited[i] = false;
            price -= adjPriceMatrix[current][i];
        }
    }
}

function findBestPath(airportType) {
    if (airportType === 10) {
        let src = parseInt(document.getElementById('ten-airport-departure-select').value);
        let dst = parseInt(document.getElementById('ten-airport-arrival-select').value);
        DFS(src, dst, tenAirports, tenAirportsAdjPriceMat, "", 0);

    } else {
        let src = parseInt(document.getElementById('twenty-airport-departure-select').value);
        let dst = parseInt(document.getElementById('twenty-airport-arrival-select').value);
        DFS(src, dst, twentyAirports, twentyAirportsAdjPriceMat, "", 0);
    }

    if (possibleFlights.length === 0) {
        $('#result').text('There are no possible flight paths for the selected airports');
        return;
    }
    let minPriceIndex = 0;
    let minStopsIndex = 0;
    for (let i = 1; i < possibleFlights.length; i++) {
        if (possibleFlights[i].price < possibleFlights[minPriceIndex].price) {
            minPriceIndex = i;
        }
        if (possibleFlights[i].path.split(" -> ").length < possibleFlights[minStopsIndex].path.split(" -> ").length) {
            minStopsIndex = i;
        }
    }
    let cheapestFlightPath = possibleFlights[minPriceIndex];
    let leastStopsFlightPath = possibleFlights[minStopsIndex];
    let result = `The cheapest flight path is: ${cheapestFlightPath.path} which costs $${cheapestFlightPath.price}. The flight path with the least number of stops is: ${leastStopsFlightPath.path} which costs $${leastStopsFlightPath.price}.`;
    $('#result').text(result);
}

function resetApplication(size) {
    // reset visited
    visited = new Array(size);
    for (let i = 0; i < visited.length; i++) {
        visited[i] = false;
    }
    // reset possible flights
    possibleFlights = [];
}

function initTenAirportGraph() {
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

    tenAirports = [];
    tenAirportsAdjPriceMat = new Array(10); // Adjacency Price Matrix
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
        tenAirportsAdjPriceMat[i] = new Array(10);
        for (let j = 0; j < 10; j++) {
            tenAirportsAdjPriceMat[i][j] = 0;
        }
    }

    tenAirports.forEach((node, i) => {
        // Fill the select options with the airports
        let option = document.createElement('option');
        option.value = `${i}`;
        let option2 = document.createElement('option');
        option2.value = `${i}`;
        let textNode = document.createTextNode(`${node.label}`);
        let textNode2 = document.createTextNode(`${node.label}`);
        option.appendChild(textNode);
        option2.appendChild(textNode2);
        document.getElementById('ten-airport-departure-select').appendChild(option);
        document.getElementById('ten-airport-arrival-select').appendChild(option2);
        // Add node to graph
        graph.addNode(node);
    });


    // Populate the adjacency price matrix
    tenAirportsAdjPriceMat[0][1] = 250;
    tenAirportsAdjPriceMat[0][8] = 230;
    tenAirportsAdjPriceMat[1][9] = 275;
    tenAirportsAdjPriceMat[2][3] = 325;
    tenAirportsAdjPriceMat[2][6] = 450;
    tenAirportsAdjPriceMat[2][9] = 500;
    tenAirportsAdjPriceMat[3][6] = 200;
    tenAirportsAdjPriceMat[4][6] = 295;
    tenAirportsAdjPriceMat[5][7] = 271;
    tenAirportsAdjPriceMat[6][7] = 335;
    tenAirportsAdjPriceMat[8][9] = 348;

    // Create edges with the adjacency matrix
    let edgeCount = 0;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (tenAirportsAdjPriceMat[i][j] !== 0) {
                graph.addEdge(createEdge(tenAirports, tenAirportsAdjPriceMat, `e${edgeCount}`, i, j));
                edgeCount++;
            }
        }
    }
    s1.refresh();

    // Add the reverse of the edges
    // to the adjacency price matrix after
    // rendering to avoid double lines
    tenAirportsAdjPriceMat[1][0] = 250;
    tenAirportsAdjPriceMat[8][0] = 230;
    tenAirportsAdjPriceMat[9][1] = 275;
    tenAirportsAdjPriceMat[3][2] = 325;
    tenAirportsAdjPriceMat[6][2] = 450;
    tenAirportsAdjPriceMat[9][2] = 500;
    tenAirportsAdjPriceMat[6][3] = 200;
    tenAirportsAdjPriceMat[6][4] = 295;
    tenAirportsAdjPriceMat[7][5] = 271;
    tenAirportsAdjPriceMat[7][6] = 335;
    tenAirportsAdjPriceMat[9][8] = 348;
}

// Twenty Airports
function initTwentyAirportGraph() {
    let s1 = new sigma({
        renderer: {
            container: document.getElementById('twenty-node-container'),
            type: 'canvas'
        },
        settings: {
            edgeColor: 'default',
            defaultEdgeColor: '#999',
            sideMargin: 0.1,
            defaultEdgeLabelColor: '#c00',
            defaultEdgeLabelSize: 17,
            font: 'Roboto'
        }
    });
    let graph = s1.graph;

    twentyAirports = [];
    twentyAirportsAdjPriceMat = new Array(20); // Adjacency Price Matrix
    twentyAirports.push(Node('n0', 'SEA', 0, 0, 3));
    twentyAirports.push(Node('n1', 'SFO', 0, 3, 3));
    twentyAirports.push(Node('n2', 'LAX', 0, 5, 3));
    twentyAirports.push(Node('n3', 'BOI', 1, 1, 3));
    twentyAirports.push(Node('n4', 'SLC', 1, 3, 3));
    twentyAirports.push(Node('n5', 'PHX', 1, 5, 3));
    twentyAirports.push(Node('n6', 'BIS', 2, 0, 3));
    twentyAirports.push(Node('n7', 'WBW', 2, 2, 3));
    twentyAirports.push(Node('n8', 'DEN', 2, 4, 3));
    twentyAirports.push(Node('n9', 'HOU', 2, 6, 3));
    twentyAirports.push(Node('n10', 'MSP', 3, 1, 3));
    twentyAirports.push(Node('n11', 'KCI', 3, 3, 3));
    twentyAirports.push(Node('n12', 'AEX', 3, 6, 3));
    twentyAirports.push(Node('n13', 'DTW', 4, 0, 3));
    twentyAirports.push(Node('n14', 'CAK', 4, 2, 3));
    twentyAirports.push(Node('n15', 'CHA', 4, 4, 3));
    twentyAirports.push(Node('n16', 'ATL', 4, 5, 3));
    twentyAirports.push(Node('n17', 'BOS', 5, 0, 3));
    twentyAirports.push(Node('n18', 'RDU', 5, 3, 3));
    twentyAirports.push(Node('n19', 'MIA', 5, 6, 3));

    // Fill adjacency matrix with 0s
    for (let i = 0; i < 20; i++) {
        twentyAirportsAdjPriceMat[i] = new Array(20);
        for (let j = 0; j < 20; j++) {
            twentyAirportsAdjPriceMat[i][j] = 0;
        }
    }

    twentyAirports.forEach((node, i) => {
        // Fill the select options with the airports
        let option = document.createElement('option');
        option.value = `${i}`;
        let option2 = document.createElement('option');
        option2.value = `${i}`;
        let textNode = document.createTextNode(`${node.label}`);
        let textNode2 = document.createTextNode(`${node.label}`);
        option.appendChild(textNode);
        option2.appendChild(textNode2);
        document.getElementById('twenty-airport-departure-select').appendChild(option);
        document.getElementById('twenty-airport-arrival-select').appendChild(option2);
        // Add node to graph
        graph.addNode(node);
    });

    // Populate the adjacency price matrix
    twentyAirportsAdjPriceMat[0][16] = 520;
    twentyAirportsAdjPriceMat[1][6] = 501;
    twentyAirportsAdjPriceMat[1][9] = 515;
    twentyAirportsAdjPriceMat[2][3] = 529;
    twentyAirportsAdjPriceMat[2][10] = 348;
    twentyAirportsAdjPriceMat[3][4] = 232;
    twentyAirportsAdjPriceMat[4][5] = 425;
    twentyAirportsAdjPriceMat[7][9] = 229;
    twentyAirportsAdjPriceMat[8][13] = 481;
    twentyAirportsAdjPriceMat[9][18] = 495;
    twentyAirportsAdjPriceMat[10][14] = 445;
    twentyAirportsAdjPriceMat[11][12] = 283;
    twentyAirportsAdjPriceMat[12][16] = 296;
    twentyAirportsAdjPriceMat[13][17] = 414;
    twentyAirportsAdjPriceMat[14][15] = 316;
    twentyAirportsAdjPriceMat[14][17] = 248;
    twentyAirportsAdjPriceMat[16][2] = 467;
    twentyAirportsAdjPriceMat[16][19] = 318;
    twentyAirportsAdjPriceMat[18][19] = 243;
    twentyAirportsAdjPriceMat[0][10] = 262;

    // Create edges with the adjacency price matrix
    let edgeCount = 0;
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            if (twentyAirportsAdjPriceMat[i][j] !== 0) {
                graph.addEdge(createEdge(twentyAirports, twentyAirportsAdjPriceMat, `e${edgeCount}`, i, j));
                edgeCount++;
            }
        }
    }
    s1.refresh();

    // Add the reverse of the edges
    // to the adjacency price matrix after
    // rendering to avoid double lines
    twentyAirportsAdjPriceMat[16][0] = 520;
    twentyAirportsAdjPriceMat[6][1] = 501;
    twentyAirportsAdjPriceMat[9][1] = 515;
    twentyAirportsAdjPriceMat[3][2] = 529;
    twentyAirportsAdjPriceMat[10][2] = 348;
    twentyAirportsAdjPriceMat[4][3] = 232;
    twentyAirportsAdjPriceMat[5][4] = 425;
    twentyAirportsAdjPriceMat[9][7] = 229;
    twentyAirportsAdjPriceMat[13][8] = 481;
    twentyAirportsAdjPriceMat[18][9] = 495;
    twentyAirportsAdjPriceMat[14][10] = 445;
    twentyAirportsAdjPriceMat[12][11] = 283;
    twentyAirportsAdjPriceMat[16][12] = 296;
    twentyAirportsAdjPriceMat[17][13] = 414;
    twentyAirportsAdjPriceMat[15][14] = 316;
    twentyAirportsAdjPriceMat[17][14] = 248;
    twentyAirportsAdjPriceMat[2][16] = 467;
    twentyAirportsAdjPriceMat[19][16] = 318;
    twentyAirportsAdjPriceMat[19][18] = 243;
    twentyAirportsAdjPriceMat[10][0] = 262;
}


resetApplication(10);
initTenAirportGraph();
initTwentyAirportGraph();

// Event handlers

$('#submitBtn').click(function(event) {
    event.preventDefault();
    let selectedAirport = parseInt($('input[name=airport-radio]:checked').val());
    findBestPath(selectedAirport);
    resetApplication(selectedAirport);
});

$('input[name=airport-radio]').click(function(event) {
    let selectedAirport = parseInt($('input[name=airport-radio]:checked').val());
    resetApplication(selectedAirport);
    if (selectedAirport === 10) {
        $('#twenty-node-container').css('z-index', '500');
        $('#twenty-airport-departure-select').hide();
        $('#twenty-airport-arrival-select').hide();

        $('#ten-node-container').css('z-index', '1000');
        $('#ten-airport-departure-select').show();
        $('#ten-airport-arrival-select').show();
    } else {
        $('#ten-node-container').css('z-index', '500');
        $('#ten-airport-departure-select').hide();
        $('#ten-airport-arrival-select').hide();

        $('#twenty-node-container').css('z-index', '1000');
        $('#twenty-airport-departure-select').show();
        $('#twenty-airport-arrival-select').show();
    }
});