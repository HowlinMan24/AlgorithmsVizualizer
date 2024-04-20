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

var divArraySorting

window.onload = function () {
    divArraySorting = document.getElementById("divArrayGraph")
    fillUpDiv(divArraySorting)
};

function fillUpDiv(divReference) {
    for (var i = 0; i < 920; i++) {
        var divElement = document.createElement('div')
        setDivAttributes(divElement)
        divReference.appendChild(divElement)
    }
}

function setDivAttributes(divReference) {
    var height = Math.random() * 90
    var width = 1
    divReference.style.backgroundColor = 'red'
    divReference.style.width = width + 'px'
    divReference.style.height = height + 'vh'
    divReference.value = height
    divReference.style.alignSelf = 'flex-end'
}

