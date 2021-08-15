function debounce(func, wait, immediate) {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;

    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

function getAbbreviation(text) {
  if (typeof text != 'string' || !text) {
    return text;
  }

  if(text.includes(' ')){
    text = text.replaceAll(/ De| des| du| la| le| les| un| une/ig,'');

    const acronym = text
      .match(/[\p{Alpha}\p{Nd}]+/gu)
      .reduce((previous, next) => previous + ((+next === 0 || parseInt(next)) ? parseInt(next): next[0] || ''), '')
      .toUpperCase()
    return acronym;
  }
  else{
    return text.toUpperCase();
  }
  
}

function formatDate(d){
  var sda = new Date(d).toJSON();
  sda = sda.split("T")[0].replaceAll("-", "/") + " " + sda.split("T")[1].split(".")[0];
  let dateTime = {};

  sda = sda.split(" ");
  dateTime.date = sda[0].split("/");
  dateTime.date = dateTime.date[2] + "/" + dateTime.date[1] + "/" + dateTime.date[0];

  dateTime.time = sda[1].split(":");
  dateTime.time = dateTime.time[0] + ":" + dateTime.time[1];

  return dateTime;
}

// //given an element, set it's height to 0 if element has a height above 0, set it to original height otherwise (height of all children)
// function toggleExpand(e,dim,state) {

//   if(!e) 
//     return setTimeout(() => { toggleExpand(e,dim,state) },150);

//   const dimention = dim == 'h' ? e.offsetHeight : e.offsetWidth;

//   if(!e.originalDim || (e.originalDim != dimention && dimention != 0)) e.originalDim = dimention;

//   if (state) { 
//       e.style.height = e.originalDim + "px";
//   } else {
//       e.style.height = '0px';
//   }
//   console.log('dim changed')
// }

export {
  debounce,
  getAbbreviation,
  formatDate,
  // toggleExpand,
};
