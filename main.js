var timeToChoose = 3;


// Only works after `FB.init` is called
function myFacebookLogin() {
  FB.login(getFriends, {scope: 'user_friends'});
};

d3.select("#login-button").on("click", myFacebookLogin);

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
      // var textChoices = new TextChoices("#text-choices", friends);
      // textChoices.randomTwo();
      var trolleyChoices = new TrolleyChoices("#game", friends);
      trolleyChoices.init();
      trolleyChoices.randomTwo();
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

function TrolleyChoices(svgId, friends) {

  this.svg = d3.select(svgId);
  this.friends = friends;

  this.init = function() {
    this.svg.append("image")
      .attr("xlink:href", "img/all_1v1.png")
      .attr("height", 420)
      .attr("width", 800);

    this.svg.append("text")
      .attr("class", "question")
      .attr("x", 470)
      .attr("y", 50)
      .text("Whom do you love more?");

    this.choiceUp = this.svg.append("g")
      .attr("transform", "translate(640, 90)");
    this.choiceDown = this.svg.append("g")
      .attr("transform", "translate(570, 230)");

    this.choiceUp.append("image")
      .attr("class", "face-choice")
      .attr("clip-path", "url(#circle-shape)")
      .attr("height", 50)
      .attr("width", 50);

    this.choiceUp.append("text")
      .attr("class", "name name-first")
      .attr("x", 60)
      .attr("y", 20);

    this.choiceUp.append("text")
      .attr("class", "name name-last")
      .attr("x", 60)
      .attr("y", 40);
    this.choiceUp.append("rect")
      .attr("class", "clickbox")
      .attr("x", -40)
      .attr("height", 120)
      .attr("width", 220)
      .attr("onclick","alert('now the second one is dead')");

    this.choiceDown.append("image")
      .attr("class", "face-choice")
      .attr("clip-path", "url(#circle-shape)")
      .attr("height", 50)
      .attr("width", 50);

    this.choiceDown.append("text")
      .attr("class", "name name-first")
      .attr("x", 60)
      .attr("y", 20);

    this.choiceDown.append("text")
      .attr("class", "name name-last")
      .attr("x", 60)
      .attr("y", 40);

    this.choiceDown.append("rect")
      .attr("class", "clickbox")
      .attr("x", -50)
      .attr("height", 120)
      .attr("width", 240)
      .attr("onclick","alert('now the first one is dead')");
  };

  this.randomTwo = function() {
    var twoPeople = _.sampleSize(this.friends, 2);
    this.choicePerson(twoPeople[0], twoPeople[1]);
  }

  this.choicePerson = function(person1, person2) {
    this.choiceUp.select("image")
      .attr("xlink:href", person1.picture.data.url);
    this.choiceUp.select(".name-first")
      .text(person1.first_name);
    this.choiceUp.select(".name-last")
      .text(person1.last_name);

    this.choiceDown.select("image")
      .attr("xlink:href", person2.picture.data.url);
    this.choiceDown.select(".name-first")
      .text(person2.first_name);
    this.choiceDown.select(".name-last")
      .text(person2.last_name);
  }

}
