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


export {
  debounce,
  getAbbreviation
};
