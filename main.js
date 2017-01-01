// Only works after `FB.init` is called
function myFacebookLogin() {
  FB.login(getFriends, {scope: 'user_friends'});
};

var friends = [];

function getFriends() {
  FB.api('/me/friends?fields=picture,name,first_name,last_name', function(response) {
    console.log(response);
    if (response.data) {
      // listFriends(response.data, "#friend-list-users");
    } else {
      console.log("No user_friends response.");
      console.log(response);
    }
  });
  FB.api('/me/invitable_friends?fields=picture,name,first_name,last_name', function(response) {
    if (response.data) {
      // listFriends(response.data, "#friend-list-invitable");
      friends = response.data;
      var textChoices = new TextChoices("#text-choices", friends);
      textChoices.randomTwo();
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

function TextChoices(divId, friends) {

  this.div = d3.select(divId);
  this.friends = friends;

  var template = _.template("<%= question %> <span class='choice choice-1'><%= choice1 %></span> or <span class='choice choice-2'><%= choice2 %></span>?");

  this.choicePerson = function(person1, person2) {
    this.div.append("div")
      .attr("class", "text-choice")
      .html(template({
        question: "Would you rather save",
        choice1:  person1.name,
        choice2:  person2.name
      }));
  };

  this.randomTwo = function() {
    var twoPeople = _.sampleSize(this.friends, 2);
    this.choicePerson(twoPeople[0], twoPeople[1]);
  }

}
