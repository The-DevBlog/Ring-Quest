//Pop-up Help Tab

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


//Feedback Form Submission
function formSubmission() {

  var form = document.getElementById('form');

  function handleFormSubmit(event) {
    event.preventDefault();
    var name = event.target.name.value;
    var email = event.target.email.value;
    var feedback = event.target.feedback.value;
    console.log(name + ', ' + email + ', ' + feedback);
    // I need to check for all feedback in local storage, and add the new feedback to the old ones, and store in local Storage
    var feedbacks = [name, email, feedback];
    //adding user data to local storage
    var stringifiedFeedbacks = JSON.stringify(feedbacks);
    localStorage.setItem('data', stringifiedFeedbacks);
    var nameEl = document.getElementById('name');
    nameEl.value = '';
  }
  //event listener
  form.addEventListener('submit', handleFormSubmit);
}

formSubmission();
