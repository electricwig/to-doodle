// toolbar contains the mode buttons
const toolbar = document.getElementById('toolbar');
// sidebar
const sidebar = document.getElementById('sidebar');
// main-content
const mainContent = document.getElementById('main-content');
// list button
const listButton = document.getElementById('list');
// doodle button
const doodleButton = document.getElementById('doodle');
// clear doodle button
const clearDoodle = document.getElementById('clear-doodle');
// clear list button
const clearList = document.getElementById('clear-list');
// main 'to-do' list
const mainlist = document.getElementById('main-content');
// text form
const textForm = document.getElementById('story');

// canvas elements
const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');
const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 1;
let startX;
let startY;
let toolbarOffset = 60;

// variable for two modes to be toggled - list mode and doodle mode
let doodleMode = false;

// html 'to-doodles' code to be generated
var todoodles = "";

// array to store 'to-do' items
var to_do_items = [];

// toggle between modes on click
toolbar.addEventListener('click', e => {
    if (e.target.id === 'doodle') {
        doodleMode = true;
        toggleModes();
    }
    else if (e.target.id === 'list') {
        doodleMode = false;
        toggleModes();
    }
    else if (e.target.id === 'clear-doodle') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    else if (e.target.id === 'clear-list') {
        localStorage.clear();
        mainlist.innerHTML = '';
        todoodles = "";
        to_do_items = [];
        textForm.focus();
    }
});

mainContent.addEventListener('click', e=> {

    if (e.target.id == 'itemdone') {
        // get item key (which is also the to-do item text) when the checkbox is clicked
        let itemKey = e.target.nextElementSibling.textContent;
        // then pass it into our 'check item' function
        checkItem(itemKey);
    }

});

// toggle function
function toggleModes () {
    if (doodleMode) {
        console.log('doodle mode active!');
        // 'doodle' mode
        doodleButton.style.backgroundColor = "rgb(249, 206, 207)";
        listButton.style.backgroundColor = "powderblue";
        clearDoodle.style.display = "block";
        clearList.style.display = "none";
        sidebar.style.zIndex = "-5";
        mainContent.style.zIndex = "-5";
        textForm.disabled = true;
    }
    else {
        console.log('list mode active!');
        // 'list' mode
        listButton.style.backgroundColor = "rgb(249, 206, 207)";
        doodleButton.style.backgroundColor = "powderblue";
        clearList.style.display = "block";
        clearDoodle.style.display = "none";
        sidebar.style.zIndex = "0";
        mainContent.style.zIndex = "0";
        textForm.disabled = false;
        textForm.focus();
    }
    addTodoodles();
  }


// *** DOODLE FUNCTIONS ***

ctx.strokeStyle = "cadetblue";

const draw = (e) => {
    if (!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - toolbarOffset);
    ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {

    if (doodleMode) {
        isPainting = true;
        startX = e.clientX;
        startY = e.clientY;
    }
});

canvas.addEventListener('mouseup', e => {

    if (doodleMode) {
        isPainting = false;
        ctx.stroke();
        ctx.beginPath();
        textForm.focus();
    }
});

canvas.addEventListener('mousemove', draw);


// *** TO-DO FUNCTIONS ***

function addTodoodles() {
    // clear the current html of the list
    mainlist.innerHTML = '';

    // clear current 'todoodles' html
    todoodles = "";

    // retrieve to_do_items from local storage
    to_do_items = JSON.parse(localStorage.getItem("to_do_items") || "[]");

    // loop through local storage
    for(let i=0; i<to_do_items.length; i++) {
        // retrieve keys
        let key = Object.keys(to_do_items[i]);

        if (to_do_items[i][key] == true) {
            // set todoodles html to ... 
            todoodles +=
            '<div class="textBlock">' +
                '<label>' +
                '<input type="checkbox" checked="checked" id="itemdone" class="strikethrough" value="0">' +
                '<span>' + key + "</span>" +
                "</label>" +
            "</div>";
        }
        else {
            // set todoodles html to ... 
            todoodles +=
            '<div class="textBlock">' +
                '<label>' +
                '<input type="checkbox" id="itemdone" class="strikethrough" value="0">' +
                '<span>' + key + "</span>" +
                "</label>" +
            "</div>";
        }

        
        }

        // populate list html with new 'todoodles' html
        mainlist.innerHTML = todoodles;
}


function checkItem(key) {
    // loop through the to_do_items array
    for(let i=0; i<to_do_items.length; i++) {

        let exisitingKey = Object.keys(to_do_items[i]);
        if (key == exisitingKey) {
            if (to_do_items[i][key] == true) {
                to_do_items[i][key] = false;
            }
            else {
                to_do_items[i][key] = true;
            }
            // save the array in localStorage via JSON stringify 
            localStorage.setItem("to_do_items", JSON.stringify(to_do_items));
        }

    }
    //console.log(key);
}


textForm.addEventListener('keypress', function (e) {

    // on Enter pressed - if NOT in doodle mode
    if (e.key === 'Enter' && !doodleMode) {
        // prevent adding in extra \n by stopping default enter function
        e.preventDefault();
        // declare an 'item' variable
        let item = textForm.value;
        // declare a 'dict' variable
        var dict = {};
        // set the dict to {value: false}
        dict[item] = false;
        // add the dict to array
        to_do_items.push(dict);
        // save the array in localStorage via JSON stringify 
        localStorage.setItem("to_do_items", JSON.stringify(to_do_items));
        // clear text form
        textForm.value = "";
        // retrieve list from local storage and update html
        addTodoodles();
    }

    // focus the text submit form again
    textForm.focus();
});

//radioButtonText = $('input[name=itemdone].itemdone-selector:checked');

//var label_value = radioButtonText.closest('label').find('span').html();