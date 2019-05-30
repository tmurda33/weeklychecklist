Date.prototype.getWeek = function(dowOffset) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

  dowOffset = typeof dowOffset == "int" ? dowOffset : 0; //default dowOffset to zero
  var newYear = new Date(this.getFullYear(), 0, 1);
  var day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = day >= 0 ? day : day + 7;
  var daynum =
    Math.floor(
      (this.getTime() -
        newYear.getTime() -
        (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
        86400000
    ) + 1;
  var weeknum;
  //if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      nYear = new Date(this.getFullYear() + 1, 0, 1);
      nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
                  the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};

var emptyWeek = `
<div class="headings">
<div class="box checklist">Checklist</div>
<div class="box sunday">Sunday</div>
<div class="box monday">Monday</div>
<div class="box tuesday">Tuesday</div>
<div class="box wednesday">Wednesday</div>
<div class="box thursday">Thursday</div>
<div class="box friday">Friday</div>
<div class="box saturday">Saturday</div>
</div>
<div class="week customtext">
<div class="box checklistName">To Do</div>
<div class="box sunday"><textarea id="item1"></textarea></div>
<div class="box monday"><textarea id="item2"></textarea></div>
<div class="box tuesday"><textarea id="item3"></textarea></div>
<div class="box wednesday"><textarea id="item4"></textarea></div>
<div class="box thursday"><textarea id="item5"></textarea></div>
<div class="box friday"><textarea id="item6"></textarea></div>
<div class="box saturday"><textarea id="item7"></textarea></div>
</div>`;

var today = new Date();
var week = today.getWeek();
var currentState = {
  dailyItems: [],
  checkBoxes: "",
  weeklyItems: []
};
$("#currentWeek").html(getDateRangeOfWeek(week, 2019));
if (localStorage.getItem(week)) {
  var retrieveData = JSON.parse(localStorage.getItem(week));
  currentState = retrieveData;
  $(".calendar").html(currentState.checkBoxes);
  for (var i = 1; i <= 7; i++) {
    $(`#item${i}`).val(currentState.dailyItems[i - 1]);
  }
  for (var i = 1; i <= currentState.weeklyItems.length; i++) {
    $(`#weeklyItems${i}`).val(currentState.weeklyItems[i - 1]);
  }
}

$(".fa-edit").click(function() {
  $(this)
    .siblings()
    .show();
});
$(".calendar").click(function() {
  savingFunction();
});
$("textarea").focusout(function() {
  savingFunction();
});

$(".add").click(function() {
  currentState.weeklyItems.push("");
  console.log(currentState.weeklyItems);
  $(".calendar").append(`
      <div class="newWeeklyItem">
        <div class="box newItem">
            <textarea id ="weeklyItems${
              currentState.weeklyItems.length
            }"></textarea>
        </div>
        <div onclick="checkbox(this)" class="box sunday"><img src="Checkmark.png" alt=""></div>
        <div  onclick="checkbox(this)" class="box monday"><img src="Checkmark.png" alt=""></div>
        <div  onclick="checkbox(this)" class="box tuesday"><img src="Checkmark.png" alt=""></div>
        <div  onclick="checkbox(this)" class="box wednesday"><img src="Checkmark.png" alt=""></div>
        <div  onclick="checkbox(this)" class="box thursday"><img src="Checkmark.png" alt=""></div>
        <div  onclick="checkbox(this)" class="box friday"><img src="Checkmark.png" alt=""></div>
        <div  onclick="checkbox(this)" class="box saturday"><img src="Checkmark.png" alt=""></div>
    </div>
  `);
});

$(".btn-danger").click(function() {
  localStorage.clear();
  location.reload();
});
$("#previous").click(function() {
  week--;
  $("#currentWeek").html(getDateRangeOfWeek(week, 2019));
  if (localStorage.getItem(week) === null) {
    var retrieveData = {
      dailyItems: ["", "", "", "", "", "", "", ""],
      checkBoxes: emptyWeek,
      weeklyItems: []
    };
  } else {
    var retrieveData = JSON.parse(localStorage.getItem(week));
  }
  currentState = retrieveData;
  console.log(week);
  $(".calendar").html(currentState.checkBoxes);
  for (var i = 1; i <= 7; i++) {
    $(`#item${i}`).val(currentState.dailyItems[i - 1]);
  }
  for (var i = 1; i <= currentState.weeklyItems.length; i++) {
    $(`#weeklyItems${i}`).val(currentState.weeklyItems[i - 1]);
  }
});
$("#next").click(function() {
  week++;
  $("#currentWeek").html(getDateRangeOfWeek(week, 2019));
  if (localStorage.getItem(week) === null) {
    var retrieveData = {
      dailyItems: ["", "", "", "", "", "", "", ""],
      checkBoxes: emptyWeek,
      weeklyItems: []
    };
  } else {
    var retrieveData = JSON.parse(localStorage.getItem(week));
  }
  $("#currentWeek").html(week);
  currentState = retrieveData;
  console.log(week);
  $(".calendar").html(currentState.checkBoxes);
  for (var i = 1; i <= 7; i++) {
    $(`#item${i}`).val(currentState.dailyItems[i - 1]);
  }
  for (var i = 1; i <= currentState.weeklyItems.length; i++) {
    $(`#weeklyItems${i}`).val(currentState.weeklyItems[i - 1]);
  }
});
function checkbox(that) {
  if (!$(that).hasClass("active")) {
    $(that).addClass("active");
  } else {
    $(that).removeClass("active");
  }
}

function savingFunction() {
  var dailyItems = [];
  var weeklyItems = [];
  for (var i = 1; i <= currentState.weeklyItems.length; i++) {
    weeklyItems.push($(`#weeklyItems${i}`).val());
  }
  for (var i = 1; i <= 7; i++) {
    dailyItems.push($(`#item${i}`).val());
  }
  currentState.dailyItems = dailyItems;
  currentState.weeklyItems = weeklyItems;
  console.log(currentState.weeklyItems);
  currentState.checkBoxes = $(".calendar").html();
  localStorage.setItem(week, JSON.stringify(currentState));
}

function getDateRangeOfWeek(weekNo, y) {
  var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
  d1 = new Date("" + y + "");
  numOfdaysPastSinceLastMonday = d1.getDay() - 1;
  d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
  d1.setDate(d1.getDate() + 7 * (weekNo - d1.getWeek()));
  rangeIsFrom = d1.getMonth() + 1 + "-" + d1.getDate() + "-" + d1.getFullYear();
  d1.setDate(d1.getDate() + 6);
  rangeIsTo = d1.getMonth() + 1 + "-" + d1.getDate() + "-" + d1.getFullYear();
  return rangeIsFrom + " to " + rangeIsTo;
}
