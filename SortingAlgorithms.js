var tableArray = []
var tableReference

const Node = () => {
    return {
        height: Math.ceil(Math.random() * 250),
        width: 0.5,
        backgroundColor: 'red',
    }
};

function applyCustomStyle(cell, node) {
    cell.style.width = node.width + 'px';
    cell.style.height = node.height + 'px';
    cell.style.backgroundColor = node.backgroundColor;
}


window.onload = function () {
    tableReference = document.getElementById("tableArrayGraph");
    tableArray = buildTableArray(tableReference)
    // makeEventsForClick(tableReference)
    // document.getElementById("chooseAlgorithm").addEventListener('change', putDescriptionForAlgorithm)
};

function buildTableArray(tableReference) {
    // fill in the array with nodes
    console.log("enter")
    for (var i = 0; i < 150; i++) {
        tableArray[i] = Node()
    }
    console.log("Fills the array with Nodes")
    console.log(tableArray)
    var arrayRow = tableReference.insertRow()
    console.log("Make the row")
    for (var i = 0; i < 150; i++) {
        var cell = arrayRow.insertCell()
        cell.setAttribute('id', `${i}`)
        applyCustomStyle(cell, tableArray[i])
        console.log("Make the cell")
    }

    return tableReference
}
