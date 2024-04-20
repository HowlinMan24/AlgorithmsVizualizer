// var tableArray = []
// var tableReference
//
// const Node = () => {
//     return {
//         height: Math.ceil(Math.random() * 250),
//         width: 0.5,
//         backgroundColor: 'red',
//     }
// };
//
// function applyCustomStyle(cell, node) {
//     cell.style.width = node.width + 'px';
//     cell.style.height = node.height + 'px';
//     cell.style.backgroundColor = node.backgroundColor;
// }

var divArraySorting

window.onload = function () {
    divArraySorting = document.getElementById("divArrayGraph")
    fillUpDiv(divArraySorting)
};

function fillUpDiv(divReference) {
    for (let i = 0; i < 900; i++) {
        let divElement = document.createElement('div');
        setDivAttributes(divElement)
        divReference.appendChild(divElement)
    }
}

function setDivAttributes(divReference) {
    let height = (Math.random() * 90) + (Math.random() * 2);
    let width = 1.2;
    divReference.style.backgroundColor = 'red'
    divReference.style.width = width + 'px'
    divReference.style.height = height + 'vh'
    divReference.value = height
    divReference.style.alignSelf = 'flex-end'
}

function clearTable() {
    let childrenTable = divArraySorting.children;
    console.log(childrenTable)
    for (let i = childrenTable.length - 1; i >= 0; i--) {
        divArraySorting.removeChild(childrenTable[i])
    }
    console.log("Fill up after clear")
    fillUpDiv(divArraySorting)
}

function startSort() {
    // Bubble sort for start then expand
    let children = Array.from(divArraySorting.children);
    let length = children.length;
    let i = 0;
    const interval = setInterval(() => {
        let swapped = false;
        for (let j = 0; j < length - i - 1; j++) {
            let height1 = parseFloat(getComputedStyle(children[j]).height);
            let height2 = parseFloat(getComputedStyle(children[j + 1]).height);
            if (height1 > height2) {
                swap(children[j], children[j + 1]);
                swapped = true;
            }
            console.log("sorting")
        }
        if (!swapped) {
            clearInterval(interval);
        }
        i++;
    }, 100);
}


function swap(element1, element2) {
    const parent = element1.parentNode;
    const nextSibling = element2.nextSibling;
    parent.insertBefore(element2, element1);
    parent.insertBefore(element1, nextSibling);
}
