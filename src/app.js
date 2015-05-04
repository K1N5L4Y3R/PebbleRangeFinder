var UI = require('ui');

//ToDo
//1. Get what is being measured (i.e. Face Height or Width, Body Height or Width, or other custom measures).
//2. Get MoAs.
//3. Calculate range and display it everytime fields change.
//4. Suggest "click adjustment"

var measurements = [
  {
    "name":"Face Height",
    "lengthInMeters": 0.25,
    "minMoAs":5,
    "maxMoAs":20,
    "moaIncrement":1
  },
  {
    "name":"Face Width",
    "lengthInMeters": 0.14,
    "minMoAs":3,
    "maxMoAs":10,
    "moaIncrement":1
  },
  {
    "name":"Body Height",
    "lengthInMeters": 1.65,
    "minMoAs":40,
    "maxMoAs":130,
    "moaIncrement":5
  },
  {
    "name":"Body Width",
    "lengthInMeters": 0.55,
    "minMoAs":10,
    "maxMoAs":45,
    "moaIncrement":5
  }
];

var clicks = [ //Needs real data
  {
    "min":0,
    "max":19,
    "adjustment":-4
  },
  {
    "min":20,
    "max":39,
    "adjustment":-2
  },
  {
    "min":40,
    "max":59,
    "adjustment":0
  },
  {
    "min":60,
    "max":79,
    "adjustment":2
  },
  {
    "min":80,
    "max":99,
    "adjustment":4
  },
  {
    "min":100,
    "max":1000,
    "adjustment":6
  }
];

var currentMeasurementIndex=0;

var menu = new UI.Menu({
  sections: [
    {items: [
    {
      title:"Measurement",
      subtitle:measurements[0].name //Initial value: First measurement
    },
    {
      title:"MoA",
      subtitle:measurements[0].minMoAs //Initial value: Minimum MoA for first measurement
    },
    {
      title:"Range",
      subtitle:"Initial"
    }
    ]}]
});

menu.on("select", function(e){
  if(e.itemIndex===0){ //Measurement Change
    currentMeasurementIndex++;
    menu.item(0,0,{title:"Measurement",subtitle: measurements[currentMeasurementIndex%measurements.length].name});
    menu.item(0,1,{title: "MoA",subtitle: measurements[currentMeasurementIndex%measurements.length].minMoAs });
  }
  else if (e.itemIndex===1){ //MoA Change
    var currentMoA = menu.item(0,e.itemIndex).subtitle;
    var currentMeasurement = currentMeasurementIndex%measurements.length;
    var increments =  measurements[currentMeasurement].moaIncrement;
    var nextMoA;
    if(currentMoA+1>measurements[currentMeasurement].maxMoAs){
        nextMoA = measurements[currentMeasurement].minMoAs;
    }
    else{
      nextMoA = currentMoA+increments;
    }
    menu.item(0,1,{title: "MoA",subtitle: nextMoA });
  }
  else{ //Range
    
  }
  calculate();
});

menu.show();

calculate();

function getAdjustment(range){
  for(var i = 0;i<clicks.length;i++){
    if(range >= clicks[i].min && range <= clicks[i].max){
      return clicks[i].adjustment;
    }
  }
}

function calculate(){
  var measurement = measurements[currentMeasurementIndex%measurements.length];
  var size = measurement.lengthInMeters;
  var moa = menu.item(0,1).subtitle;
  var range = Math.floor((size/moa)*3438);
  //var rangeFeet = Math.floor(range*3.28084);
  var adjustment = getAdjustment(range);
  menu.item(0,2, {title: "Range", subtitle : range+"mts. Adj."+adjustment});
}
