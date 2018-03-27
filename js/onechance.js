 if(window.localStorage.getItem('url')!='hjlo102'){
     window.localStorage.setItem('url','hjlo102')
  }else{
     window.location.href = document.referrer
     alert('抱歉，没有机会了')
  }