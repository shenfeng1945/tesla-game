var o = {
      canvas: null,
      ctx: null,
      canvas2: null,
      ctx2: null,
      canvas3:null,
      ctx3:null,
      model:{
        hubString:'<li><img class="animated" src="http://p68cy51nt.bkt.clouddn.com/hub.png" /></li>',
        halfHubString:'<li><img class="halfImg animated" src="http://p68cy51nt.bkt.clouddn.com/hubover.png" /></li>'
      },
      colors: {
        sky: "#D4F5FE",
        mountains: "#83CACE",
        ground: "#8FC04C",
        groundDark: "#73B043",
        // road: "#606a7c",
        road:'rgba(255,255,255,.79)',
        // roadLine: "#FFF",
        roadLine:'#606a7c',
        hud: "#FFF"
      },
      settings: {
        fps: 60,
        skySize: 0,
        ground: {
          size: 450,//中间线长度
          // min:4,
          min: 14,//哪里出头
          max: 180
          //max:220//(原来的是220，最初的是120)
         
        },
        distance:0,//当前行驶公里数
        remain:30.0,//剩余公里数
        all:30.0,//总路程
        road: {
          // min: 76,
          // max: 700,
          min:76,
          max:700
        },
        hub:10//轮毂生命
      },
      state: {
        bgpos: 0,
        offset: 0,
        startDark: true,
        curve: 0,
        currentCurve: 0,
        turn: 1,
        speed: 0,//初速
        xpos: 0,
        section: 50,
        isHinder:false,//我要生成路障吗
        stopCountTime:false,
        car: {
          maxSpeed: 50,
          friction: 0.4,//默认减速
          // friction: 0,
          acc: 1,//与速度挂钩，越大加速越快
          deAcc: 0.5,
          brake:1.4,
          effectiveSpeed:38,//该速度通过时才不扣分
          deductPoint:true,//该阶段是否扣过分，扣过了不再重复扣,
          goodJob:true//提示完美通过
        },
        keypress: {
          up: false,
          // left: false,
          // right: false,
          down: false
        },
        times:{
          minute:'01', //起始分
          second:'30',//起始秒
          ms:'00',//起始毫秒
          time:9000,//起始计数时间ms
          useTime:0,//毫秒数
          hubtime:0,
        }
      },
      storage: {
        bg: null,
        hinder:{'x':-32,'y':-180,'hinder':1,'width':375,'height':180},//障碍物
        finish:{'x':0,'y':0,'isFinish':false,'width':303,'height':38},
        roadLine:{"x":181.75},
        y:100,//障碍物到此位置判断速度
        y1:250,//路障远离此位置
        endY:600,//当障碍物的y大于500时,就别绘制了
        endFinishY:450,//终点到车尾的距离
        radomNumber:[],
        hinderMsg:true,//路障提醒
        phoneShake:true,//手机开始震动
        canIShake:true,
        colck:null//尾气的定时器
      }
    };
    // var openid = url.split('&')[0]
    // var headimgurl = url.split('&')[1]
    // var nickname = url.split('&')[2]
    var audio1 = document.querySelector('#audio1')
    var audio2 = document.querySelector('#audio2')
    var audio3 = document.querySelector('#audio3')
    o.canvas = document.querySelector('#myCar')
    o.ctx = o.canvas.getContext('2d')
    o.canvas2 = document.createElement('canvas')
    o.canvas2.width = o.canvas.width
    o.canvas2.height = o.canvas.height-100
    o.ctx2 = o.canvas2.getContext('2d')
    o.canvas3 = document.querySelector('#hinder')
    o.ctx3 = o.canvas3.getContext('2d')
   insertHub() 
   function moveEvent(){
    $('.accelerates').on('touchstart',accelerateStay)
    $('.accelerates').on('touchend',accelerateLeave)
    $('.brakes').on('touchstart',brakeStay)
    $('.brakes').on('touchend',brakeLeave)
    $('.blur,.bottomBackground,.carImg').on('touchstart',function(e){
        e.preventDefault()
    })
   }
   function offEvent(){
    $('.accelerates').unbind('touchstart',accelerateStay)
    $('.accelerates').unbind('touchend',accelerateLeave)
    $('.brakes').unbind('touchstart',brakeStay)
    $('.brakes').unbind('touchend',brakeLeave)
    o.state.car.acc = -50//立即停止
    o.state.car.friction = 50//立即停止
    // o.state.speed = 0
    //加速和刹车按钮回到初始状态
    $('.brakes').removeClass('active')
    $('.accelerates').removeClass('active')
   }
   var winHeight = $(window).height(); // 针对安卓input无法弹出。 
          $(window).resize(function() {  
            $('.page').css({
              "height":winHeight
            })
            $('.beginBackGroundImg').css({
              "height":winHeight
            })
          }); 
   $(window).load(function(){
     $('#button').on('click',function(){
       audio1.play()
     })
    draw()
    createradom()
    // o.storage.canIShake = "vibrate" in navigator
    console.log(o.storage.radomNumber)
  setTimeout(function(){
    $('.msgImg .readyGoImg').removeClass('active')
    $('.msgImg .go').addClass('active')
    // $('#button').trigger('click')
    audioAutoPlay()
    moveEvent()
    setTimeout(function(){
       $('.msgImg .go').removeClass('active')
       o.state.speed = 5
       computeTime(o.state.times.minute,o.state.times.second,o.state.times.ms,o.state.times.time)
    },800)
  },2000)
   })
      var img = document.querySelector('.hinder')
      var img1 = document.querySelector('.finish')
      var img2 = document.querySelector('.roadLine')
      var img3 = document.querySelector('.roadLine1')
      o.storage.hinder.width = document.documentElement.clientWidth//障碍物的宽度
      o.storage.hinder.height = 180/375*o.storage.hinder.width//障碍物的高度
      o.storage.endFinishY = 400/375*o.storage.hinder.width//终点线最终放在哪里
      o.storage.y = 100/504*document.documentElement.clientHeight
      o.storage.y1 = 250/504*document.documentElement.clientHeight
      o.storage.hinder.x = -35/375*o.storage.hinder.width
  function audioAutoPlay(){
        audio1.play();
        document.addEventListener("WeixinJSBridgeReady", function () {
                audio1.play();
        }, false);
        
    }
   function draw(){
      setTimeout(function(){
        calcSpeed()
         o.state.offset += o.state.speed * 0.05;
         if(o.state.offset > o.settings.ground.min) {
          o.state.offset = o.settings.ground.min - o.state.offset;
          o.state.startDark = !o.state.startDark;
        }
        drawGround(o.ctx2, o.state.offset, o.colors.roadLine, o.colors.road, o.canvas.width);
        // drawRoad(3, 24, 0, o.ctx.createPattern(o.canvas2, 'repeat'));
        drawRoadLine(154,0,12,400,o.ctx.createPattern(o.canvas2, 'repeat'))

        // console.log(o.storage.hinder.y)
        // setInterval(function(){
        //   o.storage.hinder.y = 100
        // },5000)
        shouldBrake(o.storage.hinder.y,o.storage.y,o.state.speed,o.state.car.effectiveSpeed)
        requestAnimationFrame(draw);
        // o.settings.distance += o.state.speed*1000/o.settings.fps/10000 //米
        o.settings.distance += o.state.speed*1000/o.settings.fps/84300 //米(全速跑时10km需26s)
        drawHinder(o.storage.hinder.x,o.storage.hinder.y,o.storage.hinder.width,o.storage.hinder.height)
        drawFinish()
       shouldCreateHinder(o.settings.distance,o.storage.radomNumber,o.settings.all)
       if(o.state.speed==0){
        audio3.pause()
        }
      },1000/o.settings.fps)
    }
    function shouldCreateHinder(distance,radomNumber,all){
      //参数：行驶距离，随机生成的数组，以及描绘路障的四个参数
      var remain = Number(all-distance).toFixed(1)
      if(remain<=0){remain = 0}
     $('.remain-distance').html(remain)//70秒跑完了
        if(Number(distance).toFixed(1)==Number(radomNumber[0]-0.1).toFixed(1)){
          if(o.storage.hinderMsg){
            $('.hinderCome').addClass('active slideInDown')
            o.storage.hinderMsg=false
            setTimeout(function(){
              $('.hinderCome').removeClass('active slideInDown')
            },1100)
         }
        }
        if(Number(distance).toFixed(1)==radomNumber[0]){
          o.state.isHinder = true//路障你可以出来了
          o.state.car.deductPoint = true//可以计算是否扣分了
          radomNumber.shift()
        }
        // if(Number(distance).toFixed(1)==30){
        // }
    }
    
    function createradom(){
      var start = 0
      for(var i=0;i<10;i++){
         var nums = Number(Math.random()*2.5+start).toFixed(1)
       if(nums<=0.5 && i===0){nums=(Number(nums)+Number(0.8)).toFixed(1)}//最开始时不要立马出现路障
         start +=3
         o.storage.radomNumber.push(nums) 
      }

    }
    function changeBackgroundImg(speed){//车动时，改变背景图和是否加载音乐和灯光
      if(speed ===0){
        $('.beginBackGroundImg').show()
        $('.slowBackGroundImg').hide()
        $('.runningBackGroundImg').hide()
        $('.carImg .car').show()
        $('.carImg .car1').hide()
        // audio.pause()
      }else if(speed<20 && speed >0){
        $('.beginBackGroundImg').hide()
        $('.slowBackGroundImg').show()
        $('.runningBackGroundImg').hide()
        // audio.play()
      }else{
        $('.beginBackGroundImg').hide()
        $('.slowBackGroundImg').hide()
        $('.runningBackGroundImg').show()
        $('.carImg .car').hide()
        $('.carImg .car1').show()
        // audio.play()
      }
    }
    function shouldBrake(currentY,normalY,currentSpeed,effectSpeed){
      if(currentY>normalY){
        // navigator.vibrate(300);
        if(o.state.car.deductPoint){
           deductPoint(currentSpeed,effectSpeed)//判断是否扣分
        }
      }

    }
    function deductPoint(currentSpeed,effectSpeed){//扣分
      // console.log(currentSpeed,effectSpeed)
       if(currentSpeed>effectSpeed && o.state.isHinder){
         var randomPoint = Math.floor((Math.random()*10+1)/2)+5//随机扣5-10分
         o.settings.hub -=1
        //  o.state.car.acc -=0.1//轮毂生命少了，速度相应要低
         $('.msg .reducePoint span').html(randomPoint)
         $('.msg .reducePoint').addClass('active')
         o.state.times.hubtime += randomPoint
         if(o.settings.hub===0){
           o.state.stopCountTime = true
           $('.msgImg .hubMsg').addClass('active')
           //轮毂损坏变车灯
           $('.carImg .runLight').removeClass('active')
           $('.carImg .endLight').addClass('active')
           offEvent()
           setTimeout(function(){
             $('.msgImg .hubMsg').removeClass('active')
             $('.msgImg .gameOver').addClass('active swing')
             setTimeout(function(){
               window.location.href = document.referrer
             },800)
           },1000)
         }
         setTimeout(function(){
            $('.msg .reducePoint').removeClass('active')
         },800)
         o.state.car.deductPoint = false//该阶段扣过一次，就别扣了
         insertHub()
       }else{
         if(o.state.car.goodJob && o.storage.hinder.y>o.storage.y1){
            $('.msg .goodJob').addClass('active')
            o.state.car.goodJob = false
            setTimeout(function(){
              $('.msg .goodJob').removeClass('active')
            },800)
         }
       }

    }
function computeTime(minute,second,ms,time){
  var lastMinute,lastSecond
  var clock = setInterval(function(){
    if(time<100){
      second='00'
      ms = (time<10)?('0'+time):time
    }else{
      minute = Math.floor((time/100/60===0)?'00':time/100/60)
      second = Math.floor(time/100 - minute*60)
      ms = (''+time).match(/\d{2}$/)[0]
      if(minute<10){
        minute ='0'+minute
      }
      if(second<10){
        second = '0'+second
      }
    }
     o.state.times.minute =minute//改时间
     o.state.times.second =second//改时间
     o.state.times.ms =ms//改时间
    // $(container).html(minute+"'"+second+"\""+ms)
    if(lastMinute !== minute){
      $('.use-time .minute').html(minute)
    }
    if(lastSecond !== second){
      $('.use-time .second').html(second)
    }
    $('.use-time .ms').html(ms)
    //记录上一次的时间
     lastMinute = minute
     lastSecond = second
     time -= 1
     //时间到
     if(time==-1){
        clearInterval(clock)
        offEvent()
        $('.msgImg .timeover').addClass('active')
        //时间到，变车灯
        $('.carImg .runLight').removeClass('active')
        $('.carImg .endLight').addClass('active')
        setTimeout(function(){
           $('.msgImg .timeover').removeClass('active')
           $('.msgImg .gameOver').addClass('active swing')
           setTimeout(function(){
             window.location.href = document.referrer 
           },800)
        },1000)
     }
     if(o.state.stopCountTime){
        clearInterval(clock)
     }
     //当距离过了车尾后，停止时间计算
     if(o.storage.finish.isFinish && Number(o.storage.finish.y).toFixed(1)>=o.storage.endFinishY){

        clearInterval(clock)
        offEvent()
        o.state.times.useTime =Number((o.state.times.time-time-1)/100).toFixed(2)//过完终点所有时间
        $('.submitMsg').on('click',sendData)
        setTimeout(function(){
          var time = ((Number(o.state.times.useTime)+Number(o.state.times.hubtime)).toFixed(2).replace('.','"'))
          $('.allPoints .point').html(time)
          $('.popover-wrapper').addClass('active')
          $('.loser img').addClass('flash')//图片闪一闪
          audio.pause()
          setTimeout(function(){
            $('.winner img').addClass('bounceInRight')
            $('.loser').removeClass('active')//换图片
            audio2.pause()
          },1000)
        },800)
     }
   },10)
}
//游戏完成发送我的数据
function sendData(){
  // if($('.carNumber').val()===''){
    // $.toptip('请填写车牌号','error')
    // return;
  // }
  var carNumber = $('.ul_input span').eq(0).html()+$('.ul_input span').eq(1).html()+$('.ul_input span').eq(2).html()+$('.ul_input span').eq(3).html()+$('.ul_input span').eq(4).html()+$('.ul_input span').eq(5).html()+$('.ul_input span').eq(6).html()
  if($('.ul_input span').eq(0).html()===''){
    $.toptip('请填写车牌号','error')
    return;
  }
  if($('.ul_input span').eq(1).html()===''||$('.ul_input span').eq(2).html()===''||$('.ul_input span').eq(3).html()===''||$('.ul_input span').eq(4).html()===''||$('.ul_input span').eq(5).html()===''||$('.ul_input span').eq(6).html()===''){
    $.toptip('请填写完整车牌号','error')
    return;
  }
      $.ajax({
        dataType:'json',
        url:"/user/player/save",
        data:{openid:openid,headimgurl:headimgurl,nickname:nickname,usetime:Number(o.state.times.useTime)+Number(o.state.times.hubtime),fittingtime:o.state.times.useTime,hubtime:o.state.times.hubtime,carnumber:carNumber},
        async:false,
        type:"post",
        success : function(data){
          $.toptip('提交成功!','success')
          $('.popover-wrapper').removeClass('active')
          setTimeout(function(){
            window.location.href = document.referrer
          },800)
        },
        error:function(error){
        }
      })
 }
//插入轮毂
function insertHub(){
  var nums = Math.floor(o.settings.hub/2)
  $('.life>.life-nums>li').remove()
  for(var i=0;i<nums;i++){
     $('.life>.life-nums').append(o.model.hubString)
  }
  if(o.settings.hub %2 !==0){
     $('.life>.life-nums').append(o.model.halfHubString)
  }
  $('.life-nums img').addClass('jello')
}
//加速 
function accelerateStay(e){
  e.preventDefault()
  $('.accelerates').addClass('active')
  //车辆启动变车灯
  $('.carImg .endLight').removeClass('active')
  $('.carImg .runLight').addClass('active')
  //加速出尾灯
  $('.carImg .blow1').addClass('active fadeIn')
  // $('.carImg .blow2').removeClass('fadeOut')
  o.storage.colck = setTimeout(function(){
     $('.carImg .blow1').removeClass('active fadeIn')
     $('.carImg .blow2').addClass('active')
  },1000)
  o.state.keypress.up = true
  audio.play()
  audio2.play()
}
function accelerateLeave(){
  $('.accelerates').removeClass('active')
  o.state.keypress.up = false
  clearTimeout(o.storage.colck)
  // $('.carImg .blow2').fadeOut('slow')
  $('.carImg .blow1').removeClass('active fadeIn')
  $('.carImg .blow2').removeClass('active')
  audio.pause()
}
//减速
function brakeStay(e){
  e.preventDefault()
  $('.brakes').addClass('active')
  $('.carImg .taillightBack').show()
  $('.carImg .taillight').show()
  o.state.keypress.down = true
  audio3.play()
 if(o.state.speed==0){
    audio3.pause()
    console.log(1)
 }
}
function brakeLeave(){
  $('.brakes').removeClass('active')
  o.state.keypress.down = false
  $('.carImg .taillightBack').hide()
  $('.carImg .taillight').hide()
  audio3.pause()
  o.state.speed = 5
}
function drawHinder(x,y,width,height){//生成障碍物
 if(o.storage.hinder.hinder===1 && o.state.isHinder){
    // o.ctx3.clearRect(x,0,width,y)
    // o.ctx3.fillStyle = 'red'
    // o.ctx3.fillRect(x,y,width,height)
    // setInterval(function(){
        o.ctx3.clearRect(0,0,o.storage.hinder.width,600)
        o.ctx3.drawImage(img,o.storage.hinder.x,o.storage.hinder.y,o.storage.hinder.width,o.storage.hinder.height)
      // },16)
      // if(o.storage.hinderMsg){
      //    $('.hinderCome').addClass('active slideInDown')
      //    o.storage.hinderMsg=false
      //    setTimeout(function(){
      //      $('.hinderCome').removeClass('active slideInDown')
      //    },800)
      // }
 }
 if(y>170 && y<180 && o.storage.phoneShake && o.storage.canIShake){
    // navigator.vibrate(800);
    // o.storage.phoneShake = false
 }
//  if(y>330){
 if(y>(o.storage.y1)){
   o.state.isHinder = false
   o.state.car.goodJob = true
   o.storage.hinderMsg=true
   o.storage.phoneShake = true 
   o.ctx3.clearRect(0,0,o.storage.hinder.width,600)
   o.storage.hinder.y = -180
 }
}
function drawFinish(){
  if(Number(o.settings.distance).toFixed(1)>=30){
    o.storage.finish.isFinish = true
    // var colck = setInterval(function(){
      o.ctx3.clearRect(0,0,375,600)
      o.ctx3.drawImage(img1,o.storage.finish.x,o.storage.finish.y,o.storage.finish.width,o.storage.finish.height)
    // },16)
    // if(Number(o.storage.finish.y).toFixed(1)>=900){
    //   clearInterval(colck)
    //   offEvent()
    // }
  }
}
function drawRoadLine(x,y,width,height,color){
  o.ctx.fillStyle = color
  o.ctx.fillRect(x,y,width,height)
}
// function drawRoad(min,max,squishFactor,color){
//    var basePos = o.canvas.width
//    o.ctx.fillStyle = color
//    o.ctx.beginPath()
//    o.ctx.moveTo(((basePos + min) / 2) - (o.state.currentCurve * 3), o.settings.skySize)
//    o.ctx.quadraticCurveTo((((basePos / 2) + min)) + (o.state.currentCurve / 3) + squishFactor, o.settings.skySize + 52, (basePos + max) / 2, o.canvas.height)
//    o.ctx.lineTo((basePos - max) / 2, o.canvas.height);
//    o.ctx.quadraticCurveTo((((basePos / 2) - min)) + (o.state.currentCurve / 3) - squishFactor, o.settings.skySize + 52, ((basePos - min) / 2) - (o.state.currentCurve * 3), o.settings.skySize);
//    o.ctx.closePath();
//    o.ctx.fill();
// }
function drawGround(ctx, offset, lightColor, darkColor, width) {
  var pos = (o.settings.skySize - o.settings.ground.min) + offset, stepSize = 10, drawDark = o.state.startDark, firstRow = true;
  // ctx.fillStyle = lightColor;
  // ctx.fillRect(0, 0, width, o.settings.ground.size);
  ctx.clearRect(0,0,375,400)
  if(o.state.speed==0){
     ctx.drawImage(img2,100,0,100,400)
  }else{
     ctx.drawImage(img3,150,0,20,400)
  }
  ctx.fillStyle = darkColor;
  while(pos <= o.canvas.height) {
    stepSize = norm(pos, o.settings.skySize, o.canvas.height) * o.settings.ground.max;
    if(stepSize < o.settings.ground.min) {
      stepSize = o.settings.ground.min;
      // console.log(stepSize,'2')
        // console.log(Number(pos).toFixed(0),Number(stepSize).toFixed(0),'2')
    }
    // pos+=5
    // stepSize +=
    if(drawDark) {
      if(firstRow) {
        // ctx.fillRect(0, o.settings.skySize, width, stepSize - (offset > o.settings.ground.min ? o.settings.ground.min : o.settings.ground.min - offset));
        ctx.fillRect(0, -30, width, stepSize - (offset > o.settings.ground.min ? o.settings.ground.min : o.settings.ground.min - offset));
      } else {
          // ctx.fillRect(0, pos < o.settings.skySize ? o.settings.skySize : pos, width, stepSize);
        ctx.fillRect(0,pos-55 , width, stepSize);
      }
    }
    firstRow = false;
    pos += stepSize;
    drawDark = !drawDark;
  }
}
function calcSpeed(){
  if(o.state.keypress.up){
    o.state.speed += o.state.car.acc - (o.state.speed*0.015)
  }else if(o.state.speed >0){
    if(o.state.speed<5 && !o.state.keypress.down){
       o.state.speed = 5
     }
    o.state.speed -= o.state.car.friction
  }
  if(o.state.keypress.down && o.state.speed>0){
    o.state.speed -= o.state.car.brake
  }
  if(o.state.speed<0){
    o.state.speed = 0
  }
  changeBackgroundImg(o.state.speed)
  if(o.storage.hinder.y<o.storage.endY && o.state.isHinder){
     o.storage.hinder.y += o.state.speed/4.1
  }else{
    //  o.storage.hinder.y =680 
  }
  if(o.storage.finish.y<950 && o.storage.finish.isFinish){
     o.storage.finish.y += o.state.speed/4.1
  }
}
function norm(value, min, max) {
  return (value - min) / (max - min);
}
