var timeToChoose = 3;

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

function TextChoices(divId, friends, more) {

  this.div = d3.select(divId);
  this.friends = friends;
  this.more = more || 10;


  var template = _.template("<br><%= question %> <span class='choice choice-unknown choice-1'><%= choice1 %></span> or <span class='choice choice-unknown choice-2'><%= choice2 %></span>?<br>");

  this.choicePerson = function(person1, person2) {

    var that = this;

    var currentChoice = this.div.append("div")
      .attr("class", "text-choice")
      .html(template({
        question: "Would you rather save",
        choice1:  person1.name,
        choice2:  person2.name
      }));

    var choice1 = currentChoice.select(".choice-1");
    var choice2 = currentChoice.select(".choice-2");

    var chooseTimeout = window.setTimeout(function () {
      currentChoice.selectAll(".choice")
        .attr("class", "choice choice-dead");
      that.div.append("div")
        .html("Too late! Now both are dead...<br>");
      that.randomTwo();
    }, 1000 * timeToChoose);

    choice1.on("click", function () {
      if (choice1.classed("choice-unknown")) {
        choice1.attr("class", "choice choice-alive");
        choice2.attr("class", "choice choice-dead");
        window.clearTimeout(chooseTimeout);
        that.randomTwo();
      }
    });
    choice2.on("click", function () {
      if (choice2.classed("choice-unknown")) {
        choice2.attr("class", "choice choice-alive");
        choice1.attr("class", "choice choice-dead");
        window.clearTimeout(chooseTimeout);
        that.randomTwo();
      }
    });


  };

  this.randomTwo = function() {
    if (this.more > 0) {
      var twoPeople = _.sampleSize(this.friends, 2);
      this.choicePerson(twoPeople[0], twoPeople[1]);
      this.more -= 1;
    } else {
      this.endNote();
    }
  };

  this.endNote = function() {
    this.div.append("div")
      .html("<br>You've made your choices. Now try carrying them for the rest of your life... ");
  };

}
