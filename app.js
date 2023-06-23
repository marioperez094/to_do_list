serverID = 216

var currentTime = function() {
  var d = new Date();
  var date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
  var time = [d.getHours(), d.getMinutes()];
  var dateFormat = date.join('-') + 'T' + time.map(function
    (num) {
      if (num < 10) {
        return '0' + num;
      }
      else { return num };
    }).join(':');
  
  updateTime(dateFormat);
  return dateFormat;
}

window.addEventListener('load', function() {
  setTimeofDay(currentTime().slice(10, 12))
})

//Changes background color and greeting
var setTimeofDay = function (time) {
  var htmlSky = document.querySelector('body');
  var htmlGreeting = document.querySelector('#greeting');
  var htmlSun = document.querySelector('#sun');
  var backgroundColor = {
    5: 'Morning',
    12: 'Afternoon',
    17: 'Evening',
    19: 'Night',
  }
  if (time > 4 && time < 12) {
    htmlSky.className = backgroundColor[5];
    htmlGreeting.innerHTML = backgroundColor[5];
    htmlSun.style.bottom = '-75px';
    htmlSun.style.left = '30%';
  }
  else if (time > 11 && time < 17) {
    htmlSky.className = backgroundColor[12];
    htmlGreeting.innerHTML = backgroundColor[12];
    htmlSun.style.bottom = '-30px';
    htmlSun.style.left = '48%';
  }
  else if (time > 16 && time < 19) {
    htmlSky.className = backgroundColor[17];
    htmlGreeting.innerHTML = backgroundColor[17];
    htmlSun.style.bottom = '-75px';
    htmlSun.style.left = '70%';
  }
  else {
    htmlSky.className = backgroundColor[19];
    htmlGreeting.innerHTML = backgroundColor[19];
    htmlSun.style.bottom = '-75px';
    htmlSun.style.left = '48%';
    htmlSun.style.backgroundColor = 'white';
  }
}

var updateTime = function (date) {
  var htmlDate = document.querySelector('.date');
  var hour = parseFloat(date.slice(10, 12))

  htmlDate.innerHTML = date;

  switch(hour) {
    case 5:
    case 12:
    case 17:
    case 19:
      setTimeofDay(hour)
  }
}

setInterval(currentTime, 5000)

document.body.addEventListener('click', function(e) {
  if(e.target.matches('.add-task')) {
    e.preventDefault();
    var newRow = document.createElement('tr');
    var submit = document.querySelector('#add-task');
    var taskName = submit.childNodes[1].value;
    var taskTags = submit.childNodes[3].value;
    var taskDueDate = submit.childNodes[5].value;

    if(!taskName) { return alert('No Task Added')};

    document.querySelector('tbody').appendChild(newRow);
    var newInput = document.createElement('input');
    newInput.type = "checkbox";
    addTaskElement('td');
    var td = document.querySelectorAll('td');
    td[td.length - 1].appendChild(newInput);
    

    addTaskElement('td', taskName);
    addTaskElement('td', taskTags);
    addTaskElement('td', currentTime());
    addTaskElement('td', taskDueDate);

    submit.childNodes[1].value = '';
    submit.childNodes[3].value = '';

  }
})

var addTaskElement = function (ele, text) {
  var row = document.querySelectorAll('tr');
  var newElement = document.createElement(ele)

  if(text) {
    var newTextNode = document.createTextNode(text);
    newElement.appendChild(newTextNode);
  };

  row[row.length - 1].appendChild(newElement);
}