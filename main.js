// Only works after `FB.init` is called
function myFacebookLogin() {
  FB.login(function(){}, {scope: 'user_friends'});
};

function getFriends() {
  FB.api('/me/friends', function(response) {
    if (response.data) {
      listFriends(response.data, "#friend-list-users");
    } else {
      console.log("No user_friends response.");
      console.log(response);
    }
  });
  FB.api('/me/invitable_friends', function(response) {
    if (response.data) {
      listFriends(response.data, "#friend-list-invitable");
    } else {
      console.log("No invitable_friends response.");
      console.log(response);
    }
  });
};

function listFriends(friends, divId) {
  var friends = d3.select(divId)
    .selectAll(".friend")
    .data(friends)
    .enter().append("div")
      .attr("class", "friend");

  friends.append("img")
    .attr("class", "friend-face")
    .attr("src", function (d) {
      return d.picture.data.url;
    });

  friends.append("div")
    .attr("class", "friend-name")
    .html(function (d) {
      return d.name;
    });
}
