$(document).ready(function(){
	App.init();
})



var App = {

	init: function(){

		// allow sign in
		$("#google-sign-in").click(function(){
			var provider = new firebase.auth.GoogleAuthProvider();
			firebase.auth().signInWithPopup(provider);
		});

		// allow sign out
		$("#google-sign-out").click(function(){
			firebase.auth().signOut();
		});

		// allow todo to be submitted
		$("#submit-new-todo").click(function(){
			App.submitTodo();
		});

		// listen for state changes
		firebase.auth().onAuthStateChanged(this.authStateHasChanged);

	},

	authStateHasChanged: function(userDetails){

		if (userDetails){
			$("#sign-in").hide();
			$("#app-main").show();

			// submit to firebase!
			App.submitUserToDB(
				userDetails.uid,
				userDetails.displayName,
				userDetails.email,
				userDetails.photoURL
			);

			// Send user data to view
			App.updateFrontend();

		}
		else
		{
			$("#sign-in").show();
			$("#app-main").hide();
		}
	},

	submitUserToDB: function(uid, name, email, photoURL){
		firebase.database().ref('users/' + uid).set({
			username: name,
			email: email,
			profilePicture : photoURL
		});
	},

	updateFrontend: function(){
		var currentUser = firebase.auth().currentUser;

		$(".image-field").html("<img src='" + currentUser.photoURL + "' width='100px'>");
		$(".name-field").html(currentUser.displayName);
	},

	submitTodo: function(){
		var text = $("#todo-text").val();

		if (text){

			var uid = firebase.auth().currentUser.uid;

			var todoPayload = {
				userId: uid,
				timeSubmited: Date.now(),
				text: text
			}

			// this hurts my brain in how firebase works

				// 1. Get a key for a new Post.
				var todoKey = firebase.database().ref().child('todo-posts').push().key;

				// 2. Write the new post's data simultaneously in the posts list and the user's post list.
  				var updates = {};
  					updates['/todo-posts/' + todoKey] = todoPayload;
  					updates['/user-todos/' + uid + '/' + todoKey] = todoPayload;

				var wat = firebase.database().ref().update(updates);

				console.log(wat);
		}
	}


}