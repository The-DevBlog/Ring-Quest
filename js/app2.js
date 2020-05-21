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
var oldFeedbacks = [];
function formSubmission() {
  var form = document.getElementById('form');
  function handleFormSubmit(event) {
    event.preventDefault();
    var name = event.target.name.value;
    var email = event.target.email.value;
    var feedback = event.target.feedback.value;
    var feedbacks = [name, email, feedback];
    oldFeedbacks.push(feedbacks);
    //adding user data to local storage
    var stringifiedFeedbacks = JSON.stringify(oldFeedbacks);
    localStorage.setItem('data', stringifiedFeedbacks);
    //Clearing the form after user submits it:
    var nameEl = document.getElementById('name');
    nameEl.value = '';
    var emailEl = document.getElementById('email');
    emailEl.value = '';
    var feedbackEl = document.getElementById('feedback');
    feedbackEl.value = '';
  }
  //event listener
  form.addEventListener('submit', handleFormSubmit);
}
formSubmission();


