// toolbar
const toolbar = document.getElementById("toolbar");
const listButton = document.getElementById("list");
const doodleButton = document.getElementById("doodle");
const clearDoodle = document.getElementById("clear-doodle");
const clearList = document.getElementById("clear-list");
const themeButton = document.getElementById("change-theme");

// sidebar
const sidebar = document.getElementById("sidebar");
const mainTitle = document.getElementById("main-title");
const subtitle = document.getElementById("subtitle");
const textForm = document.getElementById("story");
const footer = document.getElementById("footer");

// main-content
const mainContent = document.getElementById("main-content");
const mainlist = document.getElementById("main-content");

// canvas elements
const canvas = document.getElementById("drawing-board");
const context = canvas.getContext("2d");

// set the width and height of the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// canvas variables
let isDrawing = false;
let lineWidth = 1;
let startX;
let startY;

// offset for toolbar
let toolbarOffset = 60;

// variable for two modes to be toggled - list mode and doodle mode
let doodleMode = false;

// html 'to-doodles' code to be generated
var todoodles = "";

// array to store 'to-do' items
var to_do_items = [];

// colour themes
var themes = ["Pink and Blue", "White and Black", "Black and Green"];
var themeKey = 0;

// toolbar event listeners
toolbar.addEventListener("click", (e) => {
  if (e.target.id === "doodle") {
    doodleMode = true;
    toggleModes();
  } else if (e.target.id === "list") {
    doodleMode = false;
    toggleModes();
  } else if (e.target.id === "clear-doodle") {
    context.clearRect(0, 0, canvas.width, canvas.height);
  } else if (e.target.id === "clear-list") {
    localStorage.clear();
    mainlist.innerHTML = "";
    todoodles = "";
    to_do_items = [];
    textForm.focus();
  } else if (e.target.id === "change-theme") {
    themeKey++;
    changeTheme();
    toggleModes();
    let savedTheme = JSON.stringify(themeKey);
    window.localStorage.setItem("themeKey", savedTheme);
    addTodoodles();
  }
});

mainContent.addEventListener("click", (e) => {
  if (e.target.id == "itemdone") {
    // get item key (which is also the to-do item text) when the checkbox is clicked
    let itemKey = e.target.nextElementSibling.textContent;
    // then pass it into our 'check item' function
    checkItem(itemKey);
  }
});

// startup function
function startup() {
  // retrieve theme key from local storage
  let savedTheme = window.localStorage.getItem("themeKey");
  themeKey = JSON.parse(savedTheme);
  toggleModes();
  changeTheme();
  addTodoodles();
}

// toggle function
function toggleModes() {
  if (doodleMode) {
    // 'doodle' mode
    if (themes[themeKey] == "Pink and Blue") {
      // change toolbar styles as necessarry
      doodleButton.style.backgroundColor = "rgb(249, 206, 207)";
      doodleButton.style.color = "black";
      listButton.style.backgroundColor = "powderblue";
      listButton.style.color = "black";
    } else if (themes[themeKey] == "White and Black") {
      doodleButton.style.backgroundColor = "white";
      doodleButton.style.color = "black";
      listButton.style.backgroundColor = "lightgrey";
      listButton.style.color = "black";
    } else if (themes[themeKey] == "Black and Green") {
      doodleButton.style.backgroundColor = "black";
      doodleButton.style.color = "green";
      listButton.style.backgroundColor = "yellowgreen";
      listButton.style.color = "green";
    }
    clearDoodle.style.display = "block";
    clearList.style.display = "none";
    // push elements beneath canvas for doodling to work
    sidebar.style.zIndex = "-5";
    mainContent.style.zIndex = "-5";
    // disable the text enter form
    textForm.disabled = true;
  } else {
    // 'list' mode
    if (themes[themeKey] == "Pink and Blue") {
      listButton.style.backgroundColor = "rgb(249, 206, 207)";
      listButton.style.color = "black";
      doodleButton.style.backgroundColor = "powderblue";
      doodleButton.style.color = "black";
    } else if (themes[themeKey] == "White and Black") {
      listButton.style.backgroundColor = "white";
      listButton.style.color = "black";
      doodleButton.style.backgroundColor = "lightgrey";
      doodleButton.style.color = "black";
    } else if (themes[themeKey] == "Black and Green") {
      listButton.style.backgroundColor = "black";
      listButton.style.color = "green";
      doodleButton.style.backgroundColor = "yellowgreen";
      doodleButton.style.color = "green";
    }
    clearList.style.display = "block";
    clearDoodle.style.display = "none";
    // bring elements back to zero z-index
    sidebar.style.zIndex = "0";
    mainContent.style.zIndex = "0";
    // enable and focus the text form
    textForm.disabled = false;
    textForm.focus();
  }
}

// ** THEME FUNCTIONS ***

function changeTheme() {
  // loop key back round to zero if it exceeds the array of themes
  if (themeKey > themes.length - 1) {
    themeKey = 0;
  }
  // handy switch function for setting styles based on theme
  switch (themes[themeKey]) {
    case "Pink and Blue":
      document.body.style.backgroundColor = "rgb(249, 206, 207)";
      toolbar.style.backgroundColor = "powderblue";
      toolbar.style.border = "2px dashed black";
      clearDoodle.style.backgroundColor = "rgb(249, 206, 207)";
      clearList.style.backgroundColor = "powderblue";
      clearDoodle.style.backgroundColor = "powderblue";
      themeButton.style.backgroundColor = "powderblue";
      clearList.style.color = "black";
      clearDoodle.style.color = "black";
      themeButton.style.color = "black";
      mainTitle.style.color = "black";
      subtitle.style.color = "black";
      textForm.style.backgroundColor = "rgb(249, 206, 207)";
      textForm.style.border = "2px dashed cadetblue";
      textForm.style.color = "black";
      mainContent.style.backgroundColor = "rgb(249, 206, 207)";
      mainContent.style.border = "2px dashed cadetblue";
      footer.style.color = "rgb(252, 182, 183)";
      context.strokeStyle = "cadetblue";
      break;
    case "White and Black":
      document.body.style.backgroundColor = "white";
      toolbar.style.backgroundColor = "lightgrey";
      toolbar.style.border = "2px dashed black";
      clearList.style.backgroundColor = "lightgrey";
      clearDoodle.style.backgroundColor = "lightgrey";
      themeButton.style.backgroundColor = "lightgrey";
      clearList.style.color = "black";
      clearDoodle.style.color = "black";
      themeButton.style.color = "black";
      mainTitle.style.color = "black";
      subtitle.style.color = "black";
      textForm.style.backgroundColor = "white";
      textForm.style.border = "2px dashed darkgrey";
      textForm.style.color = "black";
      mainContent.style.backgroundColor = "white";
      mainContent.style.border = "2px dashed darkgrey";
      footer.style.color = "rgb(241, 241, 241)";
      context.strokeStyle = "darkgrey";
      break;
    case "Black and Green":
      document.body.style.backgroundColor = "black";
      toolbar.style.backgroundColor = "yellowgreen";
      toolbar.style.border = "2px dashed green";
      clearList.style.backgroundColor = "yellowgreen";
      clearDoodle.style.backgroundColor = "yellowgreen";
      themeButton.style.backgroundColor = "yellowgreen";
      clearList.style.color = "green";
      clearDoodle.style.color = "green";
      themeButton.style.color = "green";
      mainTitle.style.color = "green";
      subtitle.style.color = "green";
      textForm.style.backgroundColor = "black";
      textForm.style.border = "2px dashed darkgreen";
      textForm.style.color = "green";
      mainContent.style.backgroundColor = "black";
      mainContent.style.border = "2px dashed darkgreen";
      footer.style.color = "rgb(40, 40, 40)";
      context.strokeStyle = "darkgreen";
      // reload the list in the case of the green theme - as all text must now be green
      addTodoodles();
      break;
  }
}

// *** TO-DOODLE FUNCTIONS ***

function addTodoodles() {
  // clear the current html of the list
  mainlist.innerHTML = "";

  // clear current 'todoodles' html
  todoodles = "";

  let mainText = "";

  // set list text color
  if (themes[themeKey] == "Black and Green") {
    mainText = 'style="color:green;"';
  } else {
    mainText = 'style="color:black;"';
  }

  // retrieve to_do_items from local storage
  to_do_items = JSON.parse(localStorage.getItem("to_do_items") || "[]");

  // loop through local storage
  for (let i = 0; i < to_do_items.length; i++) {
    // retrieve keys
    let key = Object.keys(to_do_items[i]);

    if (to_do_items[i][key] == true) {
      // if item is 'true' (i.e. done/checked) ...
      todoodles +=
        '<div class="textBlock"' +
        mainText +
        ">" +
        "<label>" +
        '<input type="checkbox" checked="checked" id="itemdone" class="strikethrough" value="0">' +
        "<span>" +
        key +
        "</span>" +
        "</label>" +
        "</div>";
    } else {
      // otherwise set unchecked ...
      todoodles +=
        '<div class="textBlock"' +
        mainText +
        ">" +
        "<label>" +
        '<input type="checkbox" id="itemdone" class="strikethrough" value="0">' +
        "<span>" +
        key +
        "</span>" +
        "</label>" +
        "</div>";
    }
  }

  // populate list html with new 'todoodles' html
  mainlist.innerHTML = todoodles;
}

function checkItem(key) {
  // true/false variable corresponds to whether the item is checked/unchecked
  // iterate through the to_do_items array with a for loop
  for (let i = 0; i < to_do_items.length; i++) {
    let exisitingKey = Object.keys(to_do_items[i]);
    // if key matches existing key of item in array
    if (key == exisitingKey) {
      // if true set false
      if (to_do_items[i][key] == true) {
        to_do_items[i][key] = false;
      }
      // or if false set true
      else {
        to_do_items[i][key] = true;
      }
      // save the array in localStorage via JSON stringify
      localStorage.setItem("to_do_items", JSON.stringify(to_do_items));
    }
  }
}

textForm.addEventListener("keypress", function (e) {
  // on Enter pressed - if NOT in doodle mode
  if (e.key === "Enter" && !doodleMode) {
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

// *** DOODLE FUNCTIONS ***

// draw function
const draw = (e) => {
  if (!isDrawing) {
    return;
  }
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  // minus toolbarOffset!
  context.lineTo(e.clientX, e.clientY - toolbarOffset);
  // stroke displays line while user is still drawing
  context.stroke();
};

// canvas event listeners
canvas.addEventListener("mousedown", (e) => {
  if (doodleMode) {
    isDrawing = true;
    // clientX and clientY hold the x and y coordinates of the mouse
    startX = e.clientX;
    startY = e.clientY;
  }
});

canvas.addEventListener("mouseup", (e) => {
  if (doodleMode) {
    isDrawing = false;
    context.stroke();
    // begin path closes the path
    context.beginPath();
    textForm.focus();
  }
});

canvas.addEventListener("mousemove", draw);
