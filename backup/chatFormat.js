//Used to remove an array element

Array.remove = function(array, from, to) {

  //slice() returns selected elements (from but not including to)
  //Original array is not changed
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest)

}

//total # popups that can be displayed according to viewport width
  var total_popups = 0;

  //array of popups ids
  var popups = [];

  //To close a popup
  function close_popup(id){
    for(var iii = 0; iii < popups.length; iii++){
      if(id === popups[iii]){
        Array.remove(popups, iii);
        document.getElementById(id).style.display = "none";

        calculate_popups();
        return;
      }
    }
  };

  //Displays popups - based on max popups
  function display_popups(){

    var right = 220;
    var iii = 0;

    for(iii; iii < total_popups; iii++){
      if(popups[iii] != undefined){
        var element = document.getElementById(popups[iii]);
        element.style.right = right + "px";
        right = right + 320;
        element.style.display = "block";
      }
    }

    for(var jjj = iii; jjj < popups.length; jjj++){
      var element = document.getElementById(popups[jjj]);
      element.style.display = "none";
    }
  }

  //Creates markup for a new popup. Adds id to popups array
  function register_popup(id, name){

    for(var iii = 0; iii < popups.length; iii++){
      //if already registered, bring to front
      if(id === popups[iii]){
        Array.remove(popups, iii);
        //unshift() adds new items to beginning of array
        popups.unshift(id);
        calculate_popups();
        return;
      }
    }



    var element = "<div class='popup-box chat-popup' id ='"+id + "'>";
    element += "<div class='popup-head'>";
    element += "<div class='popup-head-left'>" + name + "</div>";
    element += "<div class='popup-head-right'><a href='javascript:close_popup(\""+ id + "\");'>&#10005;</a></div>";
    //CHECK ABOVE and BELOW if not working
    element += "<div style='clear: both'></div></div><div class='popup-messages'></div><input class='popup-bottom' id='txt' name=" + name + " placeholder='Type message'></div>";

    document.getElementsByTagName("body")[0].innerHTML += element;

    popups.unshift(id);
    calculate_popups();

  }

  //Calculates total # popups and initializes total_popups

  function calculate_popups() {
    var width = window.innerWidth;
    if(width < 540){
      total_popups = 0;
    }
    else {
      width = width - 200;
      total_popups = parseInt(width/320) //each popup is 320 px
    }
    display_popups();
  }

  //Recalculates if window is changed
  window.addEventListener('resize', calculate_popups);
  window.addEventListener('load', calculate_popups)
