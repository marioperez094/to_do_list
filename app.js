var serverID = 216

//Background and Header
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

$(document).ready (function () {
  setTimeofDay(currentTime().slice(10, 12))
  listOutTasks()
})

 //Changes background color and greeting
var setTimeofDay = function (time) {
  var backgroundColor = {
    5: 'Morning',
    12: 'Afternoon',
    17: 'Evening',
    19: 'Night',
  }

  if (time > 4 && time < 12) {
    $('body').addClass(backgroundColor[5])
    $('#greeting').text(backgroundColor[5])
    $('#sun').css('bottom', '-75px')
    $('#sun').css('left', '30%')
  }
  else if (time > 11 && time < 17) {
    $('body').addClass(backgroundColor[12])
    $('#greeting').text(backgroundColor[12])
    $('#sun').css('bottom', '-30px')
    $('#sun').css('left', '48%')
  }
  else if (time > 16 && time < 19) {
    $('body').addClass(backgroundColor[17])
    $('#greeting').text(backgroundColor[17])
    $('#sun').css('bottom', '-75px')
    $('#sun').css('left', '70%')
  }
  else {

    $('body').addClass(backgroundColor[19])
    $('#greeting').text(backgroundColor[19])
    $('#sun').css('bottom', '-75px')
    $('#sun').css('left', '48%')
    $('#sun').css('background-color', 'white')
  }
}

var updateTime = function (date) {
  var hour = parseFloat(date.slice(10, 12))

  $('.date').text(date)

  switch(hour) {
    case 5:
    case 12:
    case 17:
    case 19:
      setTimeofDay(hour)
  }
}

setInterval(currentTime, 5000)

//Add Tasks
var addTask = function (arr, id, due, status) {

  $('<tr></tr>').appendTo('tbody')
  $('<td></td>', {
    html: '<input class="checkbox" type="checkbox" value="' + id + '"' + status +'/>',
  }).appendTo('tbody tr:last-child')

  $('<td></td>', {
    html: arr[0],
  }).appendTo('tbody tr:last-child')

  $('<td></td>', {
    html: arr[1],
  }).appendTo('tbody tr:last-child')

  $('<td></td>', {
    html: due,
  }).appendTo('tbody tr:last-child')

  $('<td></td>', {
    'class': 'ms-5',
    html: arr[2] + '<button class="trash-button ms-5" value="' + id + '"><i class="fa-solid fa-trash"></i></button>',
  }).appendTo('tbody tr:last-child')
}

 //API implementation
var listOutTasks = function () {
  $.ajax({
    type: 'GET',
    url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=' + serverID,
    dataType: 'json',
    success: function (response, textStatus) {
      console.log(response.tasks)
      
      response.tasks.forEach(function (task) {
        var arr = task.content.split(' / ')
        if (task.completed) { addTask(arr, task.id, task.due, 'checked') }
        else { addTask(arr, task.id, task.due) }

      });
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}

$('#add-task').on('submit', function (e) {
  e.preventDefault();
  var name = $(this).children('[name=task-name]').val();
  var tags = $(this).children('[name=tags-name]').val();
  var dueDate = $(this).children('[name=due-date]').val();

  $.ajax({
    type: 'POST',
    url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=' + serverID,
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      task: {
        content: name + ' / ' + tags + ' / ' + currentTime(),
        due: dueDate,
      }
    }),
    success: function (response, textStatus) {
      addTask(response.task.content.split(' / '), response.task.id, response.task.due);
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }

  });

  $(this).children('[name=task-name]').val('');
  $(this).children('[name=tags-name]').val('');
  $(this).children('[name=due-date]').val('');
})

$(document).on('click', '.trash-button', function (e) {
  var id = $(this).val()
  var row = $(this).closest('tr')
  $.ajax({
    type: 'DELETE',
    url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=' + serverID,
    success: function (response, textStatus) {
      if (response.success) {
        row.remove()
      }
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });

})

$(document).on('change', '.checkbox', function (e) {
  var id = $(this).val()
  var row = $(this).closest('tr')
  var isComplete;
  $.ajax({
    type: 'GET',
    url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=' + serverID,
    dataType: 'json',
    success: function (response, textStatus) {
      console.log(response.task.completed);
      if (response.task.completed) { isComplete = 'mark_active' }
      else { isComplete = 'mark_complete' }
      updateCheckmark(id, row, isComplete)
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
});

var updateCheckmark = function (id, row, isComplete) {
  $.ajax({
    type: 'PUT',
    url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/' + isComplete + '?api_key=' + serverID,
    success: function (response, textStatus) {
      console.log(response)
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}