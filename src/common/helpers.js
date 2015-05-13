angular.module('cms.helpers', [])
  .service('formatScheduleMilitary', function() {

    function getTime(date) {
      var hours = date.getHours() * 100;
      var minutes = date.getMinutes();

      return hours + minutes;
    }

    function formatScheduleMilitary(scheduleData) {
      var formatted = [];

      angular.forEach(scheduleData, function(range) {
        var formattedRange = {
          day: range.day,
          startTime: getTime(range.startTime),
          endTime: getTime(range.endTime)
        };

        formatted.push(formattedRange);
      });

      return formatted;
    }

    return formatScheduleMilitary;
  })
  .service('formatScheduleDate', function(){

    function formatScheduleDate(scheduleData) {
      var formatted = [];

      angular.forEach(scheduleData, function(range) {
        var startTime = new Date();
        var endTime = new Date();

        var startTimeHours = Math.floor(range.startTime/100);
        var startTimeMinutes = range.startTime % 100;
        var endTimeHours = Math.floor(range.endTime/100);
        var endTimeMinutes = range.endTime % 100;

        startTime.setHours(startTimeHours);
        startTime.setMinutes(startTimeMinutes);
        endTime.setHours(endTimeHours);
        endTime.setMinutes(endTimeMinutes);
        
        var formattedRange = {
          day: range.day,
          startTime: startTime,
          endTime: endTime
        };

        formatted.push(formattedRange);
      });

      return formatted;
    }

    return formatScheduleDate;
  })
  .service('mapProp', function() {

    function mapProp(input, prop) {

      var output = [];

      angular.forEach(input, function(item){
        output.push(item[prop]);
      });

      return output;
    }

    return mapProp;
  });