var chart;

$(document).ready(function() {
        
    populateTable();
    $('#btnAddActivity').on('click', addActivity);
    $('#activityList table tbody').on('click', 'td span.deleteActivity', deleteActivity);
   
    var ctx = $("#myChart");
    
    populateChart(ctx);
});


// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/fitnessTracker/workouts', function( data ) {
    // For each item in our JSON, add a table row and cells to the content string

      $.each(data, function(){
        tableContent += '<tr>';
        tableContent += '<td>'+this.activityType+'</td>';
        tableContent += '<td>'+this.activityTime+'</td>';
          
        addData(chart, this.activityDate, this.activityTime);
          
        tableContent += '<td>'+this.activityDate+'</td>';
        tableContent += '<td><span class="deleteActivity glyphicon glyphicon-trash" name="'+this._id+'"></span></td>'
        tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#activityList table tbody').html(tableContent);
  });
    
};

// Add Activity
function addActivity(event) {
    
    if($('#inputActivityDate').val()=="") {
        return;
    }

    // If it is, compile all user info into one object
    var newActivity = {
      'activityType': $('#inputActivityType').val(),
      'activityTime': $('#inputActivityTime').val(),
      'activityDate': $('#inputActivityDate').val(),
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newActivity,
      url: '/fitnessTracker/addWorkout',
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {
        // Update the table
        populateTable();

      }
      else {
        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      }
    });
};

// Delete Activity
function deleteActivity(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this activity?');

  // Check and make sure the user confirmed
  if (confirmation === true) {      
      
    // If they did, do our delete
    $.ajax({
        type: 'DELETE',
        url: '/fitnessTracker/deleteWorkout/' + $(this).attr('name')
    }).done(function( response ) {
      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
          alert('Error: ' + response.msg);
      }
      
    populateChart($('#myChart'));

      // Update the table
      populateTable();

    });

  }
  else {
      return false;
  }

};

function updateTextInput(val) {
    document.getElementById('rangeValue').innerHTML=val; 
}

function populateChart(ctx) {    
    chart = new Chart(ctx, {
    type: 'line',
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
    
    
    
    chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Activity time (minutes)',
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ]
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
        
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}



