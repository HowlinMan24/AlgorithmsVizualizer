var START_NODE_ROW = 10
var START_NODE_COL = 10
var FINISH_NODE_ROW = 10
var FINISH_NODE_COL = 50
// Custom style object
const Node = (row, col) => {
    return {
        col: col,
        row: row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        //TODO make the ability to change the weighted so it can change the path
        weight: 1,
        distance: Infinity, // This is initially will increase with 1
        isVisited: false, // This used for the algorithms in the array
        isWall: false,
        previousNode: null // This is used for backtracking to find the shortest path
    }
};

// Function to apply custom style to an element
function applyCustomStyle(cell, node) {
    cell.dataset.col = node.col
    cell.dataset.row = node.row
}

// 2D array to hold table data
var tableMatrix;
var isMouseDown;
var tableReference;

window.onload = function () {
    tableReference = document.getElementById("tableGraph");
    tableMatrix = buildTableMatrix(tableReference)
    makeEventsForClick(tableReference)
    document.getElementById("chooseAlgorithm").addEventListener('change', putDescriptionForAlgorithm)
};

function buildTableMatrix(tableReference) {
    // Fill tableMatrix with CustomNode objects and create HTML table
    tableMatrix = []
    var cell, i, j
    for (i = 0; i < 20; i++) {
        var row = [];
        for (j = 0; j < 60; j++) {
            cell = Node(i, j); // Create CustomNode object for current cell
            // Set background color based on CustomNode properties
            row.push(cell);
        }
        // Push row to tableMatrix
        tableMatrix.push(row);
    }

    // Update HTML table with CustomNode properties
    for (i = 0; i < 20; i++) {
        var htmlRow = tableReference.insertRow();
        for (j = 0; j < 60; j++) {
            cell = htmlRow.insertCell();
            cell.setAttribute("id", `${i}-${j}`)
            if (tableMatrix[i][j].isStart) {
                cell.innerHTML = '<span style="font-size: 20px; font-weight: bold; justify-content: center;align-items: center;height: 100%;">S</span>';
                // cell.style.backgroundColor = 'red';
            } else if (tableMatrix[i][j].isFinish) {
                cell.innerHTML = '<span style="font-size: 20px; font-weight: bold; justify-content: center; align-items: center;height: 100%;">F</span>';
                // cell.style.backgroundColor = 'green';
            } else { // This is used when resetting the table
                cell.style.backgroundColor = 'white'
            }
            if (cell.isWall) cell.isWall = false
            // Apply the coordinates to the cell
            applyCustomStyle(cell, tableMatrix[i][j]);
            cell.classList.add('cell');
        }
    }

    return tableMatrix;
}

function makeEventsForClick(tableReference) {
    tableReference.addEventListener('mousedown', function (event) {
        if (event.target.classList.contains('cell')) {
            if (event.ctrlKey) {
                event.preventDefault();  // Prevent default action to avoid any other event impact
                changeWeightNode(event);
                event.stopPropagation(); // Stop the event from propagating to other handlers
            } else {
                handleMouseDown(event);
            }
        }
    });

    tableReference.addEventListener('mousemove', function (event) {
        if (event.target.classList.contains('cell') && isMouseDown && !event.ctrlKey) {
            handleMouseMove(event);
        }
    });

    tableReference.addEventListener('mouseup', function (event) {
        if (event.target.classList.contains('cell')) {
            handleMouseUp(event);
        }
    });

    tableReference.addEventListener('click', function (event) {
        if (event.target.classList.contains('cell') && !event.ctrlKey && event.button === 0) {
            toggleWall(event);
        }
    });
}


function disableEvents(tableReference) {
    tableReference.style.pointerEvents = "none";
}

function enableEvents(tableReference) {
    tableReference.style.pointerEvents = "auto";

}

function disableButtons() {
    var buttons = document.getElementsByTagName("button")
    for (var i = 0; i < buttons.length; i++)
        buttons[i].disabled = true
}

function enableButtons() {
    console.log("The buttons are enabled")
    var buttons = document.getElementsByTagName("button")
    for (var i = 0; i < buttons.length; i++)
        buttons[i].disabled = false
}

function handleMouseDown(event) {
    isMouseDown = true;
    toggleWall(event);
}


function handleMouseMove(event) {
    if (isMouseDown) {
        toggleWall(event);
    }
}

function handleMouseUp(event) {
    isMouseDown = false;
}

function toggleWall(event) {
    const nodeReference = getNode(event.target);
    if (nodeReference && !nodeReference.isStart && !nodeReference.isFinish) {
        if (event.type === 'mousedown' || (isMouseDown && event.type === 'mousemove') && !event.ctrlKey) {
            event.target.style.transition = "background-color 0.7s";
            if (!nodeReference.isWall) {
                event.target.style.backgroundColor = "black";
                nodeReference.isWall = true;
            } else {
                event.target.style.backgroundColor = "white";
                nodeReference.isWall = false;
            }
        }
    }
}

function getNode(node) {
    var row = parseInt(node.dataset.row);
    var col = parseInt(node.dataset.col);
    // console.log(row + "<-- row col -->" + col + "\n")
    if (!isNaN(row) && !isNaN(col))
        return tableMatrix[row][col];
    return null;
}

function DijkstraAlgorithm(tableMatrix, startNode, endNode) {
    const visitedNodesOrdered = [];
    startNode.distance = 0;
    let unvisitedNodes = getNodes(tableMatrix, startNode, endNode);
    disableEvents(tableReference);
    disableButtons();
    // clearTable()
    const intervalId = setInterval(() => {
        if (!unvisitedNodes.length) {
            clearInterval(intervalId);
            enableButtons();
            return
        }

        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        // console.log("inside")
        if (!closestNode.isWall) {
            if (closestNode.distance === Infinity) {
                clearInterval(intervalId);
                enableButtons()
                return
            }

            closestNode.isVisited = true;
            markVisited(closestNode);
            visitedNodesOrdered.push(closestNode);

            if (closestNode === endNode) {
                clearInterval(intervalId);
                getNodesInShortestPathOrder(endNode);
                enableButtons()
                return
            }
            updateUnvisitedNeighbors(closestNode, tableMatrix);
        }
    }, 5); // Adjust the interval duration as needed
    // enableButtons()
    // enableEvents(tableReference)
}


function updateUnvisitedNeighbors(node, tableMatrix) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, tableMatrix);
    for (const neighbor of unvisitedNeighbors) {
        /*
        TODO currently the graph is weighted by +1, need to add weighted node as well with maybe +10
         */
        neighbor.distance = node.distance + node.weight;
        neighbor.previousNode = node;
    }
}

function getUnvisitedNeighbors(node, tableMatrix) {
    var neighbors = [];
    if (node.row > 0) // Up
        neighbors.push(tableMatrix[node.row - 1][node.col]);
    if (node.row < tableMatrix.length - 1) // Down
        neighbors.push(tableMatrix[node.row + 1][node.col]);
    if (node.col < tableMatrix[0].length - 1) // Right
        neighbors.push(tableMatrix[node.row][node.col + 1]);
    if (node.col > 0) // Left
        neighbors.push(tableMatrix[node.row][node.col - 1]);
    return neighbors.filter((neighbor) => !neighbor.isVisited);
}


function markVisited(node) {
    let elementId = `${node.row}-${node.col}`;
    let cell = document.getElementById(elementId);
    if (cell) {
        if (!(node.isStart || node.isFinish)) {
            cell.style.backgroundColor = 'hsl(200, 100%, 80%)'; // Light blue color
            animateColorDinamiclly(cell);
        }
    } else {
        console.error(`Element with ID '${elementId}' not found.`);
    }
}


function animateColorDinamiclly(cell) {
    var currentColor = 20; // Starts with light blue
    var targetColor = 70; // Ends with dark blue
    var interval = setInterval(() => {
        if (currentColor >= targetColor) {
            clearInterval(interval)
        } else {
            cell.style.backgroundColor = `hsl(200,100%,${currentColor}%)`;
            // --currentColor;
            ++currentColor;
        }
    }, 25);
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((x, y) => x.distance - y.distance);
}

function getNodes(tableMatrix, startNode, endNode) {
    let nodes = [];
    for (let row of tableMatrix) {
        for (let node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

function getNodesInShortestPathOrder(endNode) {
    var nodesInShortestPathOrder = []
    var currentNode = endNode.previousNode;
    while (currentNode.previousNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode)
        currentNode = currentNode.previousNode;
    }
    console.log("enters")
    changeColorPath(nodesInShortestPathOrder);
}

function changeColorPath(nodes) {
    var currentColor = 70;
    var i = 0;
    var delay = 50; // Adjust the delay between cells as needed
    while (i < nodes.length) {
        let elementId = `${nodes[i].row}-${nodes[i].col}`;
        let cell = document.getElementById(elementId);
        if (cell) {
            setTimeout(() => {
                animateColorChange(cell, currentColor);
            }, delay * (i));
        }
        i++;
    }
}

function animateColorChange(cell, targetColor) {
    var currentColor = 20; // Starts with light blue
    var interval = setInterval(() => {
        if (currentColor >= targetColor) {
            clearInterval(interval);
        } else {
            cell.style.backgroundColor = `hsl(60, 100%, ${currentColor}%)`;
            ++currentColor;
        }
    }, 50); // Adjust the interval duration as needed
}

function BFSAlgorithm(tableMatrix, startNode, endNode) {
    const visitedNodesInOrder = [];
    const queue = [];
    queue.push(startNode);
    startNode.isVisited = true;
    disableEvents(tableReference)
    // disableButtons();
    const intervalId = setInterval(() => {
        if (queue.length === 0) {
            clearInterval(intervalId);
            enableButtons();
            return;
        }

        const currentNode = queue.shift();

        if (!currentNode.isWall) {
            visitedNodesInOrder.push(currentNode);
            markVisited(currentNode);
            if (currentNode === endNode) {
                clearInterval(intervalId);
                getNodesInShortestPathOrder(endNode);
                enableButtons();
                return;
            }

            const neighbors = getUnvisitedNeighbors(currentNode, tableMatrix);
            for (const neighbor of neighbors) {
                neighbor.isVisited = true;
                neighbor.previousNode = currentNode;
                queue.push(neighbor);
            }
        }
    }, 25); // Adjust the interval duration as needed
    queue.push(startNode)
    startNode.isVisited = true
    enableButtons()
    // enableEvents(tableReference)
}

function DFSAlgorithm(tableMatrix, startNode, endNode) {
    const visitedNodesInOrder = [];
    const stack = [];
    disableEvents(tableReference)
    // disableButtons();
    const intervalId = setInterval(() => {
        if (stack.length === 0) {
            clearInterval(intervalId);
            enableButtons();
            return;
        }

        const currentNode = stack.pop();
        if (!currentNode.isWall) {
            visitedNodesInOrder.push(currentNode);
            markVisited(currentNode);

            if (currentNode === endNode) {
                clearInterval(intervalId);
                getNodesInShortestPathOrder(endNode);
                enableButtons();
                return;
            }

            const neighbors = getUnvisitedNeighbors(currentNode, tableMatrix);
            for (const neighbor of neighbors) {
                neighbor.isVisited = true;
                neighbor.previousNode = currentNode;
                stack.push(neighbor);
            }
        }
    }, 25); // Adjust the interval duration as needed
    stack.push(startNode);
    startNode.isVisited = true;
    enableButtons()
    // enableEvents(tableReference)
}


// function getNeighbors(node, grid) { // Toooo slowww
//     const neighbors = [];
//     const {row, col} = node;
//     if (row > 0) neighbors.push(grid[row - 1][col]);
//     if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
//     if (col > 0) neighbors.push(grid[row][col - 1]);
//     if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
//     return neighbors;
// }

function clearTable() {
    if (tableReference) {
        tableReference.innerHTML = ""
        tableMatrix = buildTableMatrix(tableReference);
    }
    enableEvents(tableReference)
}

// function clearWalls() {
//     // Update HTML table with CustomNode properties
//     for (var i = 0; i < 20; i++) {
//         for (var j = 0; j < 60; j++) {
//             var cell = document.getElementById(`${i}-${j}`)
//             if (tableMatrix[i][j].isWall) {
//                 tableMatrix[i][j].isWall = false
//                 cell.isWall = false
//                 cell.style.backgroundColor = 'transparent'
//             }
//         }
//     }
// }

function changeWeightNode(event) {
    var targetNode = getNode(event.target)
    var newValue = prompt("Change the weight of the node")
    console.log(targetNode.weight)
    targetNode.weight = parseInt(newValue)
    console.log(targetNode.weight)
}

function showPath() {
    var option = findSelectedAlgorithm()
    console.log(option)
    if (option === "Dijkstra's algorithm") {
        DijkstraAlgorithm(tableMatrix, tableMatrix[START_NODE_ROW][START_NODE_COL], tableMatrix[FINISH_NODE_ROW][FINISH_NODE_COL])
    } else if (option === "Breadth First Search") {
        BFSAlgorithm(tableMatrix, tableMatrix[START_NODE_ROW][START_NODE_COL], tableMatrix[FINISH_NODE_ROW][FINISH_NODE_COL])
    } else if (option === "Depth First Search") {
        DFSAlgorithm(tableMatrix, tableMatrix[START_NODE_ROW][START_NODE_COL], tableMatrix[FINISH_NODE_ROW][FINISH_NODE_COL])
    }
}

function findSelectedAlgorithm() {
    var options = document.getElementById('chooseAlgorithm')
    var selectedIndex = options.selectedIndex
    return options.options[selectedIndex].text
}

function putDescriptionForAlgorithm() {
    var nameAlgorithm = findSelectedAlgorithm()
    if (nameAlgorithm === "Dijkstra's algorithm") {
        document.getElementById('makeDescription').innerText = "Dijkstra's algorithm is a weighted algorithm and guarantees the shortest path"
    } else if (nameAlgorithm === "Breadth First Search") {
        document.getElementById('makeDescription').innerText = "Breath First Search is not a weighted algorithm and does not guarantee the shortest path"
    } else if (nameAlgorithm === "Depth First Search") {
        document.getElementById('makeDescription').innerText = "Depth First Search is not a weighted algorithm and does not guarantee the shortest path"
    } else {
        document.getElementById('makeDescription').innerText = ""
    }
}

function turnOffTutorial(ref) {
    document.getElementById("tutorialPage").remove()
}

function nextPage() {
    var p = document.getElementById("paragraphTutorial");
    p.innerHTML = "At the top of the page there is a navigation bar from where you can either" +
        "can either go to the home page or go to the sorting algorithms page(WIP).<br> After that you have the option " +
        "to choose an algorithm that you would like to try.<br>" +
        "You also have a legend from which you can see the " +
        "different possibilities of nodes within the grid.<br>" +
        "As well as you can click and click-drag to create walls and click on them to remove them.<br>" +
        "You can change the weight of any node with holding ctrl + leftclick on any node.";
    var button = document.createElement("button");
    button.textContent = "Close";
    button.setAttribute('onclick', 'turnOffTutorial(this)')
    button.className = 'btn2'
    var tutorialPage = document.getElementById("tutorialPage");
    tutorialPage.appendChild(button);
}


