function debounce(callback, interval) {
  let debounceTimeoutId;

  return function(...args) {
    clearTimeout(debounceTimeoutId);
    debounceTimeoutId = setTimeout(() => callback.apply(this, args), interval);
  };
}

export default{
    debounce
}