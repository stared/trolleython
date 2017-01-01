// Only works after `FB.init` is called
function myFacebookLogin() {
  FB.login(function(){}, {scope: 'user_friends'});
};

function getFriends() {
  FB.api('/me/invitable_friends', function(response) {
    if (response.data) {
      listFriends(response.data);
    } else {
      console.log("No invitable_friends response.");
      console.log(response);
    }
  });
};

function listFriends(friends) {
  var friends = d3.select("#friend-list")
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
