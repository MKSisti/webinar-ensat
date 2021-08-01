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
  dateTime.date = sda.split(" ")[0].split("/")[2] + "/" + sda.split(" ")[0].split("/")[1] + "/" + sda.split(" ")[0].split("/")[0];
  dateTime.time = sda.split(" ")[1].split(":")[0] + ":" + sda.split(" ")[1].split(":")[1];
  return dateTime;
}

export {
  debounce,
  getAbbreviation,
  formatDate,
};
