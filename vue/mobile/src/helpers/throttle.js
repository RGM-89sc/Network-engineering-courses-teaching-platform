const throttle = (function(){
  let timer = -1;
  return (cb, delay = 1000)=>{
    if(timer > 0){
      return;
    };
    delay = timer === -1 ? 0 : delay;
    timer = setTimeout(()=>{
      cb();
      timer = 0;
    }, delay)
  }
})();
export {
  throttle
};