// get the popup
var popup = document.getElementById('myModal');

// get the button that opens the popup
var btn = document.getElementById('myBtn');

// get the span element that closes the popup
var span = document.getElementsByClassName('close')[0];

// when the user clicks the GamepadButton, open the popup
btn.onclick = function () {
  popup.style.display = 'block';
};
// when the user clicks on span (x), close the popup
span.onclick = function() {
  popup.style.display = 'none';
};

// when the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === popup) {
    popup.style.display = 'none';
  }
};
