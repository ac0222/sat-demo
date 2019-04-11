!function(t){var e={};function s(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)s.d(i,r,function(e){return t[e]}.bind(null,r));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=0)}([function(t,e,s){"use strict";s.r(e);var i=class{constructor(t){this.leftPressed=!1,this.rightPressed=!1,this.upPressed=!1,this.downPressed=!1,this.rotateClockwise=!1,this.rotateAntiClockwise=!1;let e=this;t.addEventListener("keydown",function(t){e.keyDownHandler(t)}),t.addEventListener("keyup",function(t){e.keyUpHandler(t)})}keyDownHandler(t){37==t.keyCode&&(this.leftPressed=!0),38==t.keyCode&&(this.upPressed=!0),39==t.keyCode&&(this.rightPressed=!0),40==t.keyCode&&(this.downPressed=!0),90==t.keyCode&&(this.rotateAntiClockwise=!0),88==t.keyCode&&(this.rotateClockwise=!0)}keyUpHandler(t){37==t.keyCode&&(this.leftPressed=!1),38==t.keyCode&&(this.upPressed=!1),39==t.keyCode&&(this.rightPressed=!1),40==t.keyCode&&(this.downPressed=!1),90==t.keyCode&&(this.rotateAntiClockwise=!1),88==t.keyCode&&(this.rotateClockwise=!1)}};const r=1e-8;class a{constructor(t,e,s){"polar"==s?(this.r=t,this.theta=e,[this.x1,this.x2]=this.toCartesian(),this.theta=this.computeTheta()):(this.x1=t,this.x2=e,[this.r,this.theta]=this.toPolar())}toPolar(){return[this.magnitude(),this.computeTheta()]}toCartesian(){return[this.r*Math.cos(this.theta),this.r*Math.sin(this.theta)]}isZero(){return Math.abs(this.x1)<r&&Math.abs(this.x2)<r}reflectAcross(t){let e=t.getUnitVector(),s=2*this.dotProduct(e);return this.subtract(e.scalarMultiply(s))}equals(t){return this.subtract(t).isZero()}computeTheta(){let t=null,e=null;return 0==this.x1||0==this.x2?e=0==this.x1&&0!=this.x2?this.x2>0?Math.PI/2:-Math.PI/2:0!=this.x1&&0==this.x2?this.x1>0?0:Math.PI:0:(t=Math.atan(Math.abs(this.x2)/Math.abs(this.x1)),this.x1>0&&this.x2>0?e=t:this.x1<0&&this.x2>0?e=Math.PI-t:this.x1<0&&this.x2<0?e=-Math.PI+t:this.x1>0&&this.x2<0&&(e=-t)),e}add(t){let e=this.x1+t.x1,s=this.x2+t.x2;return new a(e,s,"cartesian")}subtract(t){let e=this.x1-t.x1,s=this.x2-t.x2;return new a(e,s,"cartesian")}extend(t){return new a(this.r+Math.abs(t),this.theta,"polar")}withdraw(t){return this.add(new a(t,this.theta,"polar").rotateVector(Math.PI))}scalarMultiply(t){return new a(this.x1*t,this.x2*t,"cartesian")}dotProduct(t){return this.x1*t.x1+this.x2*t.x2}magnitude(){return Math.sqrt(this.x1*this.x1+this.x2*this.x2)}rotateVector(t){return new a(this.r,this.theta+t,"polar")}getUnitVector(){let t=this.magnitude();return new a(this.x1/t,this.x2/t,"cartesian")}vectorProjection(t){var e=this.scalarProjection(t);return t.getUnitVector().scalarMultiply(e)}scalarProjection(t){return this.dotProduct(t.getUnitVector())}toPoint(){return new h(this.x1,this.x2)}}var n=a;var h=class{constructor(t,e){this.x=t,this.y=e}getDistance(t){let e=this.x-t.x,s=this.y-t.y;return Math.sqrt(e*e+s*s)}toVector(){return new n(this.x,this.y,"cartesian")}equals(t){return Math.abs(this.x-t.x)<r&&Math.abs(this.y-t.y)<r}};var l=class{constructor(t,e){this.lo=t,this.hi=e,this.hi<this.lo&&console.log("interval error!")}getOverlapInfo(t){let e={};return this.lo<t.lo&&this.hi>t.hi?(e.otype="container",e.osize=t.hi-t.lo):t.lo<this.lo&&t.hi>this.hi?(e.otype="contained",e.osize=this.hi-this.lo):this.hi>t.lo&&this.hi<t.hi?(e.otype="right",e.osize=this.hi-t.lo):t.lo<this.lo&&t.hi>this.lo?(e.otype="left",e.osize=t.hi-this.lo):e=null,e}};class o{constructor(t,e,s,i,r,a,n,h){this.centre=t,this.rotation=e,this.c1=s,this.c2=i,this.activeColour=this.c1,this.shapeType=r,this.tvelocity=a,this.rspeed=n,this.collisionType=h,this.hitCounter=0,this.destroyFlag=!1,this.destructable=!0}equals(t){return!!this.centre.equals(t.centre)&&(!(Math.abs(this.rotation-t.rotation)>r)&&(this.c1==t.c1&&this.c2==t.c2&&(this.shapeType==t.shapeType&&(!!this.tvelocity.equals(t.tvelocity)&&(!(Math.abs(this.rspeed-t.rspeed)>r)&&this.collisionType==t.collisionType)))))}setIndestructable(){this.destructable=!1}enterCollisionState(){this.activeColour=this.c2}exitCollisionState(){this.activeColour=this.c1}isActive(){return 0==this.tvelocity.isZero()||0!=this.rspeed}move(t){this.centre.x+=this.tvelocity.x1*(t/1e3),this.centre.y+=this.tvelocity.x2*(t/1e3),this.rotation+=this.rspeed*(t/1e3)}update(t){this.isActive()&&this.move(t)}reactToCollision(t,e){"bounce"==this.collisionType?(this.centre=this.centre.toVector().add(t.scalarMultiply(2)).toPoint(),this.tvelocity=this.tvelocity.reflectAcross(t)):"stick"==this.collisionType?this.centre=this.centre.toVector().add(t).toPoint():"static"==this.collisionType||console.log("unrecognized collision type of shape"),this.destroyFlag=e,this.hitCounter++}static getEdgeVectors(t){let e=[],s=0;for(;s<t.length-1;)e[s]=t[s+1].subtract(t[s]),s++;return e[s]=t[0].subtract(t[s]),e}static getEdgeOrthogonals(t){let e=o.getEdgeVectors(t),s=[];for(let t=0;t<e.length;t++)s[t]=e[t].rotateVector(-Math.PI/2);return s}static renderPolygon(t,e,s){e.beginPath(),e.moveTo(t[0].x1,t[0].x2);for(let s=1;s<t.length;s++)e.lineTo(t[s].x1,t[s].x2);e.lineTo(t[0].x1,t[0].x2),e.fillStyle=s,e.fill(),e.closePath()}static renderCircle(t,e,s,i){s.beginPath(),s.arc(e.x,e.y,t,0,2*Math.PI),s.fillStyle=i,s.fill(),s.closePath()}static projectShapeFromPoint(t,e,s){let i=[];if("circle"==t.shapeType){let r=new n(t.centre.x,t.centre.y,"cartesian").subtract(e);i.push(r.scalarProjection(s)-t.radius),i.push(r.scalarProjection(s)+t.radius)}else if("polygon"==t.shapeType){let r=[],a=t.getVertices();for(let t=0;t<a.length;t++)r[t]=a[t].subtract(e);for(let t=0;t<r.length;t++)i.push(r[t].scalarProjection(s))}else console.log("unrecognized shape type"),i=null;return i}static ppCollisionDetection(t,e){for(var s=t.centre.toVector(),i=e.centre.toVector(),r=s.subtract(i).magnitude(),a=t.getVertices(),n=e.getVertices(),h=o.getEdgeOrthogonals(a).concat(o.getEdgeOrthogonals(n)),c=null,u=Number.MAX_VALUE,p=-1,d=null,y=[],g=[],f=null,v=null,x=null,w=0;w<h.length;w++){if(f=h[w],y=o.projectShapeFromPoint(t,s,f),g=o.projectShapeFromPoint(e,s,f),v=new l(Math.min.apply(Math,y),Math.max.apply(Math,y)),x=new l(Math.min.apply(Math,g),Math.max.apply(Math,g)),null==(c=v.getOverlapInfo(x)))return null;c.osize<u&&(u=c.osize,p=w)}return d=h[p].getUnitVector().scalarMultiply(u),s.add(d).subtract(i).magnitude()>r?d:d.scalarMultiply(-1)}static pcCollisionDetection(t,e){for(var s=t.getVertices(),i=t.centre.toVector(),r=e.centre.toVector(),a=o.getEdgeOrthogonals(s),n=r.subtract(i),h=[],c=0;c<s.length;c++)h[c]=r.subtract(s[c]).magnitude();var u=h.indexOf(Math.max.apply(Math,h));a.push(r.subtract(s[u]));var p=null,d=Number.MAX_VALUE,y=-1,g=null,f=null,v=null,x=[],w=[];for(c=0;c<a.length;c++){if(x=o.projectShapeFromPoint(t,i,a[c]),w=o.projectShapeFromPoint(e,i,a[c]),f=new l(Math.min.apply(Math,x),Math.max.apply(Math,x)),v=new l(Math.min.apply(Math,w),Math.max.apply(Math,w)),null==(p=f.getOverlapInfo(v)))return null;p.osize<d&&(d=p.osize,y=c)}return g=a[y].getUnitVector().scalarMultiply(d),i.add(g).subtract(r).magnitude()>n.magnitude()?g:g.scalarMultiply(-1)}static ccCollisionDetection(t,e){var s=t.centre.toVector(),i=e.centre.toVector(),r=i.subtract(s),a=t.radius+e.radius-r.magnitude(),n=null;return a>0?(n=r.getUnitVector().scalarMultiply(a),s.add(n).subtract(i).magnitude>r.magnitude()?n:n.scalarMultiply(-1)):null}}var c=o;var u=class extends c{constructor(t,e,s,i,r,a,n,h,l){super(s,i,h,l,"polygon",r,a,n),this.halfWidth=t,this.halfHeight=e}getVertices(){var t=[],e=new n(this.halfWidth,this.rotation,"polar"),s=new n(this.halfHeight,this.rotation+Math.PI/2,"polar"),i=new n(this.centre.x,this.centre.y,"cartesian");return t[0]=i.add(e).add(s),t[1]=i.subtract(e).add(s),t[2]=i.subtract(e).subtract(s),t[3]=i.add(e).subtract(s),t}render(t){c.renderPolygon(this.getVertices(),t,this.activeColour)}equals(t){return!(!c.prototype.equals.call(this,t)||Math.abs(this.halfwidth-t.halfWidth)>r||Math.abs(this.halfHeight-t.halfHeight)>r)}};var p=class extends c{constructor(t,e,s,i,r,a,n,h){super(e,s,n,h,"circle",i,r,a),this.radius=t}render(t){c.renderCircle(this.radius,this.centre,t,this.activeColour)}equals(t){return!(!c.prototype.equals.call(this,t)||Math.abs(this.radius-t.radius)>r)}};var d=class extends c{constructor(t,e,s,i,r,a,n,h){super(e,s,n,h,"polygon",i,r,a),this.halfDistance=t}getVertices(){var t=[],e=new n(this.halfDistance,this.rotation,"polar"),s=new n(this.halfDistance,this.rotation+2/3*Math.PI,"polar"),i=new n(this.halfDistance,this.rotation+4/3*Math.PI,"polar"),r=new n(this.centre.x,this.centre.y,"cartesian");return t[0]=r.add(e),t[1]=r.add(s),t[2]=r.add(i),t}render(t){c.renderPolygon(this.getVertices(),t,this.activeColour)}equals(t){return!(!c.prototype.equals.call(this,t)||Math.abs(this.halfDistance-t.halfDistance)>r)}};var y=class{constructor(t,e,s,i){this.shape=t,this.tspeed=e,this.rspeed=s,this.pic=i}update(t){1==this.pic.leftPressed&&(this.shape.centre.x-=Math.abs(this.tspeed)*(t/1e3)),1==this.pic.rightPressed&&(this.shape.centre.x+=Math.abs(this.tspeed)*(t/1e3)),1==this.pic.upPressed&&(this.shape.centre.y-=Math.abs(this.tspeed)*(t/1e3)),1==this.pic.downPressed&&(this.shape.centre.y+=Math.abs(this.tspeed)*(t/1e3)),1==this.pic.rotateClockwise&&(this.shape.rotation+=Math.abs(this.rspeed)*(t/1e3)),1==this.pic.rotateAntiClockwise&&(this.shape.rotation-=Math.abs(this.rspeed)*(t/1e3))}render(t){this.shape.render(t)}};const g=60,f=500,v=400,x=1,w=2,m=3;var b=class{constructor(t){this.pic=t,this.player=null,this.shapes=null,this.movingShapes=null,this.freedomWall=null,this.deathWall=null,this.init()}update(t){this.player.update(t);for(let e=0;e<this.shapes.length;e++)this.shapes[e].update(t);return this.handleCollisions(),this.removeDestroyedShapes(),this.checkGameOver()}handleCollisions(){let t=null,e=null,s={},i=null;for(let i=0;i<this.movingShapes.length;i++){t=this.movingShapes[i];for(let i=0;i<this.shapes.length;i++){let r=null;if(e=this.shapes[i],!t.equals(e)&&null!=(r="circle"==t.shapeType?"circle"==e.shapeType?c.ccCollisionDetection(e,t):c.pcCollisionDetection(e,t):"circle"==e.shapeType?c.pcCollisionDetection(t,e):c.ppCollisionDetection(t,e))){let i={};"circle"==t.shapeType?(i.s1=e,i.s2=t):(i.s1=t,i.s2=e),i.mtv=r;let a=JSON.stringify(i.s1)+JSON.stringify(i.s2),n=JSON.stringify(i.s2)+JSON.stringify(i.s1);a in s||n in s||(s[a]=i)}}}for(let t in s){let e=null;e=!(i=s[t]).s1.equals(this.player.shape)&&!i.s2.equals(this.player.shape),i.s1.reactToCollision(i.mtv.scalarMultiply(1),e),i.s2.reactToCollision(i.mtv.scalarMultiply(-1),e)}}removeDestroyedShapes(){let t=null;for(let e=this.shapes.length-1;e>=0;e--)(t=this.shapes[e]).destructable&&t.destroyFlag&&this.shapes.splice(e,1)}checkGameOver(){return this.freedomWall.destroyFlag?x:this.deathWall.destroyFlag?w:m}displayWinScreen(t){let e=t.getContext("2d");e.clearRect(0,0,v,f),e.font="16px Arial",e.fillStyle="#0095DD",e.fillText("YOU DEFEATED",v/2,f/2)}displayLossScreen(t){let e=t.getContext("2d");e.clearRect(0,0,v,f),e.font="16px Arial",e.fillStyle="#0095DD",e.fillText("YOU DIED",v/2,f/2)}render(t){var e=t.getContext("2d");e.clearRect(0,0,t.width,t.height),this.player.render(e);for(var s=0;s<this.shapes.length;s++)this.shapes[s].render(e)}init(){this.shapes=[],this.movingShapes=[],this.initWalls(),this.initStaticShapes(),this.initMovingShapes(),this.initPlayers()}initPlayers(){var t=new u(50,5,new h(200,450),0,new n(0,0,"cartesian"),0,"stick","green","red");t.setIndestructable(),this.player=new y(t,150,2.5,this.pic),this.shapes.push(this.player.shape),this.movingShapes.push(this.player.shape)}initMovingShapes(){var t=new p(10,new h(200,400),0,new n(180,180,"cartesian"),0,"bounce","green","red");t.setIndestructable(),this.movingShapes.push(t);for(var e=0;e<this.movingShapes.length;e++)this.shapes.push(this.movingShapes[e])}initStaticShapes(){for(var t=0;t<10;t++)for(var e=0;e<5;e++)t*e%3==0?this.shapes.push(new u(15,30,new h(50*t,50*e),2*Math.random()*Math.PI,new n(0,0,"cartesian"),0,"static","green","red")):t*e%3==1?this.shapes.push(new d(30,new h(50*t,50*e),2*Math.random()*Math.PI,new n(0,0,"cartesian"),0,"static","green","red")):this.shapes.push(new p(30,new h(50*t,50*e),0,new n(0,0,"cartesian"),0,"static","green","red"))}initWalls(){let t=new u(5,f/2,new h(0,f/2),0,new n(0,0,"cartesian"),0,"static","black","black");t.setIndestructable();let e=new u(5,f/2,new h(v,f/2),0,new n(0,0,"cartesian"),0,"static","black","black");e.setIndestructable();let s=new u(v/2,5,new h(v/2,0),0,new n(0,0,"cartesian"),0,"static","black","black");s.setIndestructable();let i=new u(v/2,5,new h(v/2,f),0,new n(0,0,"cartesian"),0,"static","black","black");i.setIndestructable(),this.shapes.push(t),this.shapes.push(e),this.shapes.push(s),this.shapes.push(i),this.freedomWall=s,this.deathWall=i}};var M=class{constructor(t,e){this.intervalID=null,this.world=t,this.canvas=e}runGame(){var t=this,e=performance.now(),s=null,i=null;this.intervalID=setInterval(function(){s=performance.now()-e,e=performance.now(),(i=t.processFrame(s))==x&&(clearInterval(t.intervalID),t.world.displayWinScreen(t.canvas)),i==w&&(clearInterval(t.intervalID),t.world.displayLossScreen(t.canvas))},1/g*1e3)}processFrame(t){var e;return e=this.world.update(t),this.world.render(this.canvas),e}stopGame(){clearInterval(this.intervalID)}resetGame(){clearInterval(this.intervalID),this.world.init(),this.world.render(this.canvas)}};window.onload=function(){var t=document.getElementById("breakout_canvas"),e=new i(document),s=new b(e),r=new M(s,t),a=document.getElementById("start_game_btn"),n=document.getElementById("stop_game_btn"),h=document.getElementById("reset_game_btn");a.addEventListener("click",function(){r.runGame()}),n.addEventListener("click",function(){r.stopGame()}),h.addEventListener("click",function(){r.resetGame()}),window.addEventListener("keydown",function(t){[37,38,39,40].indexOf(t.keyCode)>-1&&t.preventDefault()},!1)}}]);