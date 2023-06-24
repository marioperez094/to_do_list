//Global Variables
var serverID = 216
var taskArr = [];

//Background and Header


//Gets Time
var currentTime = function () {
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

  $('.date').text(dateFormat)

  switch (d.getHours()) {
    case 5:
    case 12:
    case 17:
    case 19:
      setTimeofDay(d.getHours())
  }
  return dateFormat;
}

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
//Updates the clock every 5 seconds
setInterval(currentTime, 5000);

//Add Tasks
var addTask = function (arr, id, due, status) {
  $('<tr></tr>').appendTo('tbody')
  $('<td></td>', {
    html: '<input class="checkbox" type="checkbox" value="' + id + '"' + status + '/>',
  }).appendTo('tbody tr:last-child');

  $('<td></td>', {
    html: arr[0],
  }).appendTo('tbody tr:last-child');

  $('<td></td>', {
    html: arr[1].split(',').join(', '),
  }).appendTo('tbody tr:last-child');

  $('<td></td>', {
    html: due,
  }).appendTo('tbody tr:last-child');

  $('<td></td>', {
    html: arr[2],
  }).appendTo('tbody tr:last-child');

  $('<td></td>', {
    html: '<button class="trash-button ms-5" value="' + id + '"><i class="fa-solid fa-trash"></i></button>',
  }).appendTo('tbody tr:last-child');
}

//API Implementation 

var setTasks = function () {
  $.ajax({
    type: 'GET',
    url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=' + serverID,
    dataType: 'json',
    success: function (response, textStatus) {
      response.tasks.forEach(function (task) {
        taskArr.push(task)
        var arr = task.content.split(' / ')
        if (task.completed) { addTask(arr, task.id, task.due, 'checked') }
        else { addTask(arr, task.id, task.due) }
      })
      setTags()
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}

var setTags = function () {
  var taskTags = [];
  $('select').remove()
  $('<select></select>', {
    'class': 'tag-select rounded-pill text-center',
    'name': 'tags'
  }).appendTo('.selector')
  var tagList = taskArr.map(function (tag) {
    return tag.content.split(' / ')[1].split(',')
  });

  tagList = tagList.join(',').split(',')

  tagList.forEach(function (item) {
    if (taskTags.indexOf(item) > -1) { return }
    else { taskTags.push(item) }
  })

  taskTags.forEach(function (tag) {
    $('<option></option>', {
      html: tag,
      'value': tag,
    }).appendTo('.tag-select')
  })
  $('<option></option>', {
    html: 'All',
    'value': 'All',
    'selected': true,
  }).appendTo('.tag-select')
}

var updateCheckmark = function (id, isComplete) {
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

$('#add-task').on('submit', function (e) {
  e.preventDefault();
  var name = $(this).children('[name=task-name]').val();
  var tags = $(this).children('[name=tags-name]').val().split(', ');
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
      taskArr.push(response.task)
      setTags()
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }

  });

  $(this).children('[name=task-name]').val('');
  $(this).children('[name=tags-name]').val('');
  $(this).children('[name=due-date]').val('');
})


//Waits for Document to Load
$(document).ready(function () {
  setTimeofDay(currentTime().slice(10, 12));
  setTasks()
})

$(document).on('click', '.trash-button', function (e) {
  var id = $(this).val()
  var row = $(this).closest('tr')



  $.ajax({
    type: 'DELETE',
    url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=' + serverID,
    success: function (response, textStatus) {
      if (response.success) {
        taskArr.forEach(function (item, i) {
          if (parseFloat(id) === parseFloat(item.id)) {
            taskArr = taskArr.slice(0, i).concat(taskArr.slice(i + 1))
          }
        })
        setTags()
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
  var isComplete;
  taskArr.forEach(function (item, i) {
    if (parseFloat(id) === parseFloat(item.id)) {
      item.completed = !item.completed;
    }
  })

  $.ajax({
    type: 'GET',
    url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=' + serverID,
    dataType: 'json',
    success: function (response, textStatus) {
      console.log(response.task.completed);
      if (response.task.completed) { isComplete = 'mark_active' }
      else { isComplete = 'mark_complete' }
      updateCheckmark(id, isComplete)
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
});

$(document).on('click', '.active-list', function () {
  $('.active-list').addClass('active-btn');
  $('.completed-list').removeClass('active-btn');
  $('.all-list').removeClass('active-btn');
  var activeItems = taskArr.filter(function (item) {
    return item.completed === false;
  })

  if (activeItems.length < 1) { return $('tbody').remove(); }
  $('tbody').remove();
  $('table').append('<tbody></tbody>');
  activeItems.forEach(function (task) {
    var arr = task.content.split(' / ')
    addTask(arr, task.id, task.due)

  });
})

$(document).on('click', '.completed-list', function () {
  $('.active-list').removeClass('active-btn');
  $('.completed-list').addClass('active-btn');
  $('.all-list').removeClass('active-btn');
  var completedItems = taskArr.filter(function (item) {
    return item.completed === true;
  })
  displayFilter(completedItems);
})

$(document).on('click', '.all-list', function () {
  $('.active-list').removeClass('active-btn');
  $('.completed-list').removeClass('active-btn');
  $('.all-list').addClass('active-btn');
  displayFilter(taskArr);
});

$(document).on('change', '.tag-select', function () {
  $('.active-list').removeClass('active-btn');
  $('.completed-list').removeClass('active-btn');
  $('.all-list').removeClass('active-btn');
  var filterTag = $(this).val()
  if (filterTag === 'All') { filteredItems = taskArr }
  else {
    var filteredItems = taskArr.filter(function (item) {
      return item.content.split(' / ')[1].split(',').indexOf(filterTag) > -1;
    });
  }
  displayFilter(filteredItems);
})

var displayFilter = function (arr) {
  if (arr.length < 1) { return $('tbody').remove(); }
  $('tbody').remove();
  $('table').append('<tbody></tbody>');
  arr.forEach(function (task) {
    var array = task.content.split(' / ')
    if (task.completed) { addTask(array, task.id, task.due, 'checked') }
    else { addTask(array, task.id, task.due) }
  });
}