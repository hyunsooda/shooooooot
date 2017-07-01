import Matter from 'matter-js';
import parse from 'parse-svg-path';
import scale from 'scale-svg-path';
import serialize from 'serialize-svg-path';

// basic settings

window.WebFontConfig = {
    google : {
        families: ['Indie Flower','Poiret One']
    }
};

( function () {
    const wf = document.createElement('script');
    wf.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();


let stageCnt = 0;

const entireWidth = document.documentElement.clientWidth ,
      entireHeight = document.documentElement.clientHeight,
      C = 'images/C.png',
      L = 'images/L.png',
      E = 'images/E.png',
      A = 'images/A.png',
      R = 'images/R.png';

let clearFlag = false;

// module aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Composites = Matter.Composites,
      Composite = Matter.Composite,
      Events = Matter.Events,
      Constraint = Matter.Constraint,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Vertices = Matter.Vertices,
      Common = Matter.Common,
      Svg = Matter.Svg;

// create an engine
const engine = Engine.create(),
      world = engine.world;

const render = Render.create({
    element: document.body,
    engine: engine,
    options : {
        width : entireWidth,
        height : entireHeight,
        //showAngleIndicator : true,
        //showVelocity : true,
        wireframes : false // for sprite
    },
});
const runner = Runner.create();

Render.run(render);
Runner.run(runner,engine);

const mouse = Mouse.create(render.canvas);
let mouseConstraint = MouseConstraint.create(engine, {
          mouse : mouse,
          constraint : {
              stiffness : 0.05
          }
      });
let group = Body.nextGroup(true);

World.add(world,[mouseConstraint]);

let ball_img = 'images/ball1.png';
let ball_locs = [];
let ball_locs_num = 0;

ball1.addEventListener('click',(e) => {
    ball_img = 'images/ball1.png';
    ball = reGenerationBall(ball, ...ball_locs[ball_locs_num] );
});

ball2.addEventListener('click',(e) => {
    ball_img = 'images/ball2.png';
    ball = reGenerationBall(ball, ...ball_locs[ball_locs_num] );
});

ball3.addEventListener('click',(e) => {
    ball_img = 'images/ball3.png';
    ball = reGenerationBall(ball, ...ball_locs[ball_locs_num] );
});

ball4.addEventListener('click',(e) => {
    ball_img = 'images/ball4.png';
    ball = reGenerationBall(ball, ...ball_locs[ball_locs_num] );
});

window.addEventListener('click', (e) => {
        if(isStop && e.clientX < 300) {
            isStop = false;
            Runner.run(runner,engine);
        }
},false);


function reGenerationBall(t,x,y,r) {
    World.remove(world,t);

    let new_ball = Bodies.circle(x,y,r,{
        render : {
            sprite : {
                texture : ball_img
            }
        }
    });

    elastic.bodyB = new_ball;
    World.add(world,new_ball);

    return new_ball;
}

class Create {
    static ball(x,y,r,num,restitution = 0,notadd,density = 0.001) {
        if(!notadd)
            ball_locs.push([x,y,r]);
        ball_locs_num = num || ball_locs_num;
        return Bodies.circle(x,y,r,{
            density : density,
            restitution : restitution,
            render : {
                sprite : {
                    texture : ball_img
                }
            }
        });
    }
    static elastic(x,y,body,visible = true) {
        return Constraint.create({
            pointA : { x : x, y : y },
            bodyB : body,
            stiffness : 0.05,
            render : {
                visible : visible
            }
        });
    }
    static target(x,y,r) {
        return Bodies.circle(x,y,r, {
            density : 0.0000000000000000000000001,
            render : {
                sprite : {
                    texture : 'images/bomb.png'
                }
            }
        })
    }
    static ground() {
        return Bodies.rectangle(100,entireHeight,5000,50, { isStatic : true });
    }
    static stage(x,y,w,h) {
        return Bodies.rectangle(x,y,w,h,{
            render : {
                fillStyle : render.context.fillStyle
            }
        })
    }
    static collision(e) {
        for(let i=0; i<e.pairs.length; i++) {
            if(!nextStageEnable && (e.pairs[i].bodyA === target || e.pairs[i].bodyB === target ) ) {
                
                if(breakFlag) {
                    let cnt = 1;
                    let rope = Create.rope();
                    breakFlag = false;
                    nextStageEnable = true;

                    ( Bodies => {
                            let x = target.position.x,
                                y = target.position.y;

                            World.remove(world,target);

                            const id = window.setInterval( () => {
                            
                            let bodies = Composite.allBodies(engine.world);

                            for(let i=0; i<bodies.length; i++) {
                                if(bodies[i].id === `fire${cnt-1}`) 
                                    World.remove(world,bodies[i]);
                            }
        
                            if(cnt === 18) {
                                window.clearInterval(id);                
                                World.add(world,rope.rope);
                                window.setTimeout( () => {
                                    World.remove(world,Composite.allBodies(engine.world));
                                    Events.off(engine,'beforeUpdate',beforeUpdateCallback);
                                    Events.off(engine,'mousedown');
                                    
                                    Events.off(engine,'afterUpdate');
                                    Events.off(engine,'collisionStart');
                                    Events.off(mouseConstraint,'mousedown');

                                    window.setTimeout( () => {
                                        Composite.remove(rope.rope,rope.ropeConstraint); 
                                        window.setTimeout( () => {
                                            World.remove(world,Composite.allConstraints(engine.world))
                                            stageCnt++;
                                            stages[stageCnt](); 
                                        },2500);
                                    },2500);
                                },3000);
                                return;
                            }

                            let fire = Bodies.rectangle(x,y,90,90, {
                                render : {
                                    sprite : {
                                        texture : `images/fire${cnt}.png`
                                    }
                                }
                            });
                            fire.id = `fire${cnt}`;

                            World.add(world,fire);

                            cnt++;

                        },50)
                    })(Bodies)
                }
             }
        }   
    }
    static rope() {
        let ropeArr = [R,A,E,L,C];
        const rope = Composites.stack(1000, 100, 5, 1, 10, 10, function(x, y) {
            return Bodies.circle(x, y, 30, { 
                render : {
                    sprite : {
                        texture : ropeArr.pop()
                    }
                },
                collisionFilter: { 
                    group: group
                }
            });
        });
        const ropeConstraint = Constraint.create({
            bodyB: rope.bodies[0],
            pointB: { x: -20, y: 0 },
            pointA: { x: 1000, y: 125 },
            stiffness: 0.5
        });
            
        Composites.chain(rope, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2 });
        Composite.add(rope,ropeConstraint);

        return {
            rope : rope,
            ropeConstraint : ropeConstraint
        }
    }
    static shoot(speed,limit1,limit2,restitution = 0,density) {
        if(mouseConstraint.mouse.button === 0)  isStartFlag = true;
        if(target.speed > speed && isStartFlag)    breakFlag = true;
        else breakFlag = false;
        
        if(mouseConstraint.mouse.button === -1 && (ball.position.x > limit1 || ball.position.y < limit2) ) {
            previousBall = ball;
            ball = Create.ball(...ball_locs[ball_locs_num],ball_locs_num,restitution,true,density);
            elastic.bodyB = ball;
            World.add(world,ball);
        }
    }
    static mouseDownLimit(e,limit) {
        if(e.mouse.position.x > limit && !target.isStatic) {
            for(let i=0; i<targetStack.bodies.length; i++) {
                Body.setStatic(targetStack.bodies[i],true)
            }
            Body.setStatic(target,true);
        } else if(e.mouse.position.x < limit && target.isStatic) {
            for(let i=0; i<targetStack.bodies.length; i++) {
                Body.setStatic(targetStack.bodies[i],false)
            }
            Body.setStatic(target,false);
        }
    }
    static stageBoxAnimation(e) {
        let py = 300 + 100 * Math.sin(engine.timing.timestamp * 0.002);
        let py2;

        if(stage.position.x > entireWidth-200) {
            stage.position.x-=0.01;
        }

        Body.setPosition(stage,{
            x : stage.position.x,
            y : py
        });

        const stageGradient = render.context.createLinearGradient(stage.position.x,0,stage.position.x+40,0);
        stageGradient.addColorStop("0","magenta");
        stageGradient.addColorStop("0.5","blue");
        stageGradient.addColorStop("1.0","red");
        render.context.font = '21px Verdana';
        render.context.fillStyle = stageGradient;
        render.context.fillText('stage1',stage.position.x-30,py+25);
    }
}




////////////////////////////////////////////////////////////////////////////////////////////////////////

//global variables ----

let isStop = false;
let breakFlag = false;
let isStartFlag = false;
let nextStageEnable = false;
let previousBall = null;
let mouseFlag = false;


let ball = Create.ball(200,850,25,0);
let elastic = Create.elastic(200,850,ball);
let target = Create.target(1025,650,25);
let ground = Create.ground();
let stage = Create.stage(entireWidth-200,100,100,50);
let targetStack = Composites.stack(1000,675,1,7,5,5, (x,y) => {
        let random = Common.choose([1,2,3,4]);

        return Bodies.rectangle(x,y,70,50,{
            restitution : 0,
            render : {
                sprite : {
                    texture : `images/box${random}.jpg`
                }
            }
        })
    });

let beforeUpdateCallback = (e) => {
    Create.stageBoxAnimation(e);
}

//global variables ----




// stage1 //

function one() {
    World.add(world,[ground,targetStack,stage,target,elastic,ball]);

    Events.on(engine, 'afterUpdate', (e) => { 
        Create.shoot(7,220,830);  
    });
    
    Events.on(engine, 'collisionStart' , (e) => {
        Create.collision(e);    
    });

    Events.on(mouseConstraint,'mousedown', (e) => {
        Create.mouseDownLimit(e,600);
    });

    Events.on(engine, 'beforeUpdate',beforeUpdateCallback);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// stage2 //
let changeButtonFlag = false;

function two() {
    isStartFlag = false;
    nextStageEnable = false;

    const wall = Bodies.rectangle(550,680,200,700, {
        isStatic : true,
        render : {
            sprite : {
                texture : 'images/wall.jpg'
            }
        }
    });
    ball = Create.ball(150,770,25,1,0.5);
    elastic = Create.elastic(150,770,ball);

    const airBlock = Bodies.rectangle(1300,200,200,50, {
        isStatic : true,
        render : {
            sprite : {
                texture : 'images/bricks.jpg'
            }
        }
    });
    let sw = Bodies.rectangle(1480,270,100,50, {
        isSensor : true,
        isStatic : true,
        render : {
            sprite : {
                texture : 'images/btn.png'
            }
        }
    });
    const swCopy = Bodies.rectangle(1480,270,100,50,{  // isSensor값에 true를 주면 isStatic이 효과없어져서 isStatic효과를 보존하기위해 똑같은자리에 하나더 생성함.
        isStatic : true,
        render : {
            visible : false
        }
    });
    const bigBall = Bodies.circle(1050,150,50, {
        density : 100,
        render : {
            sprite : {
                texture : 'images/bigBall.png'
            }
        }
    });
    const blgBallElastic = Create.elastic(1050,0,bigBall,false); 

    const leverOnBlock = Bodies.rectangle(850,950,400,50);
    const leverBlowBlock = Bodies.rectangle(leverOnBlock.position.x-175, leverOnBlock.position.y+50, 50, 45, {
        isStatic : true,
        render : {
            fillStyle : '#004d3b'
        }
    });
    
    const lever1 = Constraint.create( {
        bodyA : leverOnBlock,
        pointB : {
            x : 830,
            y : ground.position.y - 25
        }
    });
    const lever2 = Constraint.create({
        bodyA : leverOnBlock,
        pointB : {
            x : 870,
            y : ground.position.y - 25
        }
    });
    // 길이길게해서 위치재조정. (처음에 static으로잡아주고 빅볼이떨어질때 static풀어주기)
    const orangeBoxes = Composites.stack(leverOnBlock.position.x-200,805,1,3,0,0, (x,y) => {
        return Bodies.rectangle(x,y,50,40,{
            isStatic : true,
            density : 0.000001,
            restitution : 0.25,
            render : {
                sprite : {
                    texture : 'images/orangeBox.jpg'
                }
            }
        });
    })
    const desk = Bodies.rectangle(1200,950,80,20, {
        isStatic : true
    });
    const sw2Head = Bodies.circle(1320,985,4,{
        isStatic : true,
        render : {
            fillStyle : '#008040'
        }
    });
    const sw2Body = Bodies.rectangle(1325,1010,10,40,{
        isStatic : true,
        render : {
            fillStyle : '#99ffcc'
        }
    });
    const sw2BodyCopy = Bodies.rectangle(1325,1010,10,40, {
        isStatic : true,
        isSensor : true, 
        render : {
            visible : false
        }
    })
    const groundCopy = Bodies.rectangle(ground.position.x,ground.position.y,5000,50,{
        isStatic : true,
        render : {
            visible : false
        }
    });
    Body.rotate(sw2Body,-0.2);
    Body.rotate(sw2BodyCopy,-0.2);

    World.add(world,[
        mouseConstraint,
        ground,
        ball,
        elastic,
        wall,
        airBlock,
        sw,
        swCopy,
        bigBall,
        blgBallElastic,
        leverOnBlock,
        leverBlowBlock,
        lever1,
        lever2,
        orangeBoxes,
        desk,
        sw2Head,
        sw2Body,
        sw2BodyCopy,
        groundCopy
    ]);

    Events.on(engine,'afterUpdate', (e) => {
        Create.shoot(7,170,750,0.5);  // x,y,r,restitution

        render.context.save();
        render.context.strokeStyle = '#008080';
        render.context.beginPath();
        render.context.setLineDash([5,20]); // interval of lines are 15.

        render.context.moveTo(1050,0);
        render.context.lineTo(bigBall.position.x,bigBall.position.y);
        render.context.stroke();
        render.context.restore();
    });
    
    Events.on(engine,'collisionStart', (e) => {  
        breakFlag = true;
        Create.collision(e);
        for(let i=0; i<e.pairs.length; i++) {
            if(e.pairs[i].bodyA === sw) {
                if(!changeButtonFlag) {
                    World.remove(world,sw);
                    World.remove(world,swCopy);
                    sw = Bodies.rectangle(sw.position.x,sw.position.y,100,20, {
                        isStatic : true,
                        render : {
                            sprite : {
                                texture : 'images/btn-minimal3.png'
                            }
                        }
                    });
                    
                    World.add(world,sw);
                    changeButtonFlag = !changeButtonFlag;
                    Events.off(engine,'afterUpdate');
                    World.remove(world,blgBallElastic);
                }
            } else if(e.pairs[i].bodyB === sw) {
                if(!changeButtonFlag) {
                    World.remove(world,sw);
                    World.remove(world,swCopy);
                    sw = Bodies.rectangle(sw.position.x,sw.position.y,100,20,{
                        isStatic : true,
                        render : {
                            sprite : {
                                texture : 'images/btn-minimal3.png'
                            }
                        }
                    });
                    World.add(world,sw);
                    changeButtonFlag = !changeButtonFlag;
                    Events.off(engine,'afterUpdate');
                    World.remove(world,blgBallElastic);
                }
            }

            if(e.pairs[i].bodyA === leverOnBlock && e.pairs[i].bodyB === bigBall)  {
                for(let i=0; i<orangeBoxes.bodies.length; i++)
                    Body.setStatic(orangeBoxes.bodies[i],false);
            } else if(e.pairs[i].bodyB === leverOnBlock && e.pairs[i].bodyA === bigBall) {
                for(let i=0; i<orangeBoxes.bodies.length; i++)
                    Body.setStatic(orangeBoxes.bodies[i],false);
            }

            if(e.pairs[i].bodyA === orangeBoxes.bodies[2] && e.pairs[i].bodyB === sw2BodyCopy) {
                Body.rotate(sw2Body,0.4);
                World.remove(world,sw2Head);
                World.remove(world,sw2BodyCopy);
                World.add(world,Bodies.circle(sw2Head.position.x+10,sw2Head.position.y,4,{
                    isStatic : true,
                    render : {
                        fillStyle : '#008040'
                    }
                }));
                target = Create.target(1700,100,25);
                let targetElastic = Create.elastic(1700,0,target, {
                    render : {
                        strokeStyle : '#c6538c'
                    }
                });
                World.add(world,[target,targetElastic]);
                window.setTimeout( () => {
                    World.remove(world,targetElastic);
                },1000);
            } else if(e.pairs[i].bodyB === orangeBoxes.bodies[2] && e.pairs[i].bodyA === sw2BodyCopy) {
                Body.rotate(sw2Body,0.4);
                World.remove(world,sw2Head);
                World.remove(world,sw2BodyCopy);
                Wolrd.add(world,Bodies.circle(sw2Head.position.x+10,sw2Head.position.y,4,{
                    isStatic : true,
                    render : {
                        fillStyle : '#008040'
                    }
                }))
                target = Create.target(1700,100,25);
                let targetElastic = Create.elastic(1700,0,target,{
                    render : {
                        strokeStyle : '#c6538c'
                    }
                });
                World.add(world,[target,targetElastic])
            }
        }
    });

    Events.on(mouseConstraint,'mousedown',(e) => { 
        if(e.mouse.position.x > 500) {
            Runner.stop(runner);
            isStop = true;
        } 
    });
}

function three() {
    let st;
    let collisionFlag = false;
    let explosion = false;

    isStartFlag = false;
    nextStageEnable = false;

    render.options.showCollisions = true;

    ball = Create.ball(150,800,25,2);
    elastic = Create.elastic(150,800,ball);
    target = Create.target(1350,850,25);
    target.density = 0.5;

    const wall = Bodies.rectangle(900,200,100,400,{
        isStatic : true,
        render : {
            sprite : {
                texture : 'images/stage3_wall.jpg'
            }
        }
    });

    const wall2 = Bodies.rectangle(900,830,100,400, {
        isStatic : true,
        render : {
            sprite : {
                texture : 'images/stage3_wall.jpg'
            }
        }
    })
    
    const wall3 = Bodies.rectangle(0,0,1700,15,{
        isStatic : true
    })

    const slide = Bodies.rectangle(950,570,25,700,{
        isStatic : true,
        chamfer: { radius: [15, 15, 15, 15] },
        render : {
            fillStyle : '#4d4d33'
        }
    });

    const bombBlock = Bodies.rectangle(1350,900,150,25,{
        isStatic : true,
        render : {
            fillStyle : '#99ffe6'
        }
    });

    const bombBlock2 = Bodies.rectangle(1900,900,150,25,{
        isStatic : true,
        render : {
            fillStyle : '#99ffe6'
        }
    });
    Body.rotate(slide,-0.9);

    const bridge = Composites.stack(1435,950,7,1,5,5,(x,y) => {
        return Bodies.rectangle(x,y,45,15,{
            collisionFilter : {
                group : group
            }
        });
    });

    Composites.chain(bridge,0.5,0,-0.5,0, {
        stiffness : 0.9
    });

    World.add(world,[
        mouseConstraint,
        ground,
        ball,
        elastic,
        wall,
        wall2,
        wall3,
        slide,
        bombBlock,
        bombBlock2,
        bridge,
        target,
        Constraint.create({pointA : { x : 1425, y : 900 }, bodyB : bridge.bodies[0], pointB : { x : -13, y : 0}}),
        Constraint.create({pointA : { x : 1825, y : 900 }, bodyB : bridge.bodies[6], pointB : { x : 13, y : 0}}),
    ]);
    
    Events.on(engine,'afterUpdate',(e) => {
        Create.shoot(7,170,780);
    });
    
    Events.on(engine,'collisionStart',(e) => {
        for(let i=0; i<e.pairs.length; i++) {
            switch(e.pairs[i].bodyB) {
                case bridge.bodies[0] : 
                case bridge.bodies[1] : 
                case bridge.bodies[2] : 
                case bridge.bodies[3] : 
                case bridge.bodies[4] : 
                case bridge.bodies[5] : 
                case bridge.bodies[6] : 
                st = +new Date;
                collisionFlag = true;
                break;
            }            
        }
    });

    Events.on(engine,'collisionEnd',(e) => {
        if(explosion) Create.collision(e);
    })

    Events.on(engine,'afterUpdate',(e) => {
        if(collisionFlag) {
            Events.off(engine,'collisionStart');
            window.setTimeout( () => {
                if( +new Date - st < 3500) {
                    target.position.y -= 0.4;
                } else {
                    collisionFlag = false;                    
                    explosion = true;
                    window.setTimeout( () => {
                        World.remove(world,bridge);
                    },2500);
                }                    
            },1500);
        }
    });

    Events.on(mouseConstraint,'mousedown',(e) => { 
        if(e.mouse.position.x > 500) {
            Runner.stop(runner);
            isStop = true;
        } 
    });
}

function four() {
    isStartFlag = false;
    nextStageEnable = false;
    mouseConstraint.constraint.stiffness = 0.09;
    render.options.showCollisions = true;

    ball = Create.ball(200,700,25,3,0.5,undefined,1); // 테스트중일떄만 1로설정  x,y,r,num,restitution = 0,notadd,density = 0.001)
    elastic = Create.elastic(200,700,ball);
    target = Create.target(1150,850,25);

    const wall = Bodies.rectangle(800,400,10,800,{
        isStatic : true,
        render : {
            sprite : {
                texture : 'images/fourWallOne.jpg'
            }
        }
    })

    const wall2 = Bodies.rectangle(950,900,25,265,{
        isStatic : true,
        render : {
            sprite : {
                texture : 'images/fourWallTwo.jpg'
            }
        }
    });

    const wall3 = Bodies.rectangle(1000,0,2500,25,{
        isStatic : true
    })

    const wall4 = Bodies.rectangle(0,1000,25,2000,{
        isStatic : true
    });

    const point = Bodies.circle(430,5,5,{
        isStatic : true,
        render : {
            fillStyle : 'white'
        }
    });

    const jumpingBox = Bodies.rectangle(720,1005,200,50, {
        isStatic : true,
        chamfer: { radius: [15, 15, 15, 15] },
        render : {
            fillStyle : '#ffcc99'
        }
    });

    const bombBlock = Bodies.rectangle(1100,900,150,25,{
        isStatic : true,
        render : {
            sprite : {
                texture : 'images/fourBombBox.jpg'
            }
        }
    })

    World.add(world,[
        mouseConstraint,
        ball,
        elastic,
        ground,
        wall,
        wall2,
        wall3,
        wall4,
        point,
        jumpingBox,
        bombBlock,
        target
    ]);

    Events.on(engine,'afterUpdate',(e) => {
        Create.shoot(7,220,680 ,0.5 ,1);
    });

    Events.on(engine,'beforeUpdate',(e) => {
        const ctx = render.context;  
        
        if(previousBall) {
            if(jumpingBox.position.y - previousBall.position.y < 100) {
                if(previousBall.position.x > 620 && previousBall.position.x < 820)
                    previousBall.restitution = 1;
            }
        }
        if(mouseFlag) {
            ctx.save();
            ctx.moveTo(200,700);
            ctx.lineTo( 200- ball.position.x + 200 + Math.abs(200-ball.position.x) * 3, 700 - ball.position.y + 700 - Math.abs(700-ball.position.y) * 3);
            ctx.strokeStyle = 'gray';
            ctx.stroke();
            ctx.restore();
        } 

        ctx.save();
        ctx.font= "30px Poiret One";
        ctx.fillStyle = 'white';
        ctx.fillText("Jumping",670,1015);
        ctx.restore();
    });

    Events.on(mouseConstraint,'startdrag',(e) => {
        mouseFlag = true;
    })

    Events.on(mouseConstraint,'enddrag',(e) => {
        mouseFlag = false;   
    });

    Events.on(engine,'collisionStart',(e) => {
        Create.collision(e);
    });

    Events.on(mouseConstraint,'mousedown',(e) => { 
        if(e.mouse.position.x > 500) {
            Runner.stop(runner);
            isStop = true;
            console.log('stop!');
        } 
    });
}

function five() {
    Events.off(engine,'beforeUpdate');    // 테스트중일떄만 주석처리.
    
    isStartFlag = false;
    nextStageEnable = false;
    
    target = Create.target(1700,950,25);
    ball = Create.ball(250,750,25,4); // 테스트중일떄만 1로설정  x,y,r,num,restitution = 0,notadd,density = 0.001)
    elastic = Create.elastic(250,750,ball);
    mouseConstraint = MouseConstraint.create(engine, {
          mouse : mouse,
          constraint : {
              stiffness : 0.05
          }
    });

    render.options.showCollisions = false;

    const gradient = render.context.createLinearGradient(1500,0,2000,0);
    gradient.addColorStop("0","magenta");
    gradient.addColorStop("0.3","#3399ff");
    gradient.addColorStop("0.5","blue");
    gradient.addColorStop("1.0","red");

    const httpRequest = new XMLHttpRequest();
    const topStatic = Bodies.rectangle(1000,0,2100,25,{isStatic:true});
    const rightStatic = Bodies.rectangle(2050,500,25,1100,{isStatic:true});   
    const renderOption = {
        fillStyle : gradient,
        lineWidth : 0
    };

    let verticalSet = [],
        verticalSet2 = [],
        horizontalSet = [];
    
    let verticleSet = [];
    let changeButtonFlag = false;


    for(let i=0; i<3; i++) {
        verticalSet.push(Bodies.rectangle(1500,i*250+430,50,200,{
            isStatic : true,
            render : {
                sprite : {
                    texture : 'images/stage5_wall1.jpg'
                }
            }
        }));
        verticalSet2.push(Bodies.rectangle(1900,i*250+430,50,200,{
            isStatic : true,
            render : {
                sprite : {
                    texture : 'images/stage5_wall1.jpg'
                }
            }
        }));
        horizontalSet.push(Bodies.rectangle(1700,i*250+305,450,50,{
            isStatic : true,
            render : {
                fillStyle : gradient
            }
        }));
    }
    let sw = Bodies.rectangle(1975,1010,100,50, {
        isSensor : true,
        isStatic : true,
        render : {
            sprite : {
                texture : 'images/btn.png'
            }
        }
    });
    const swCopy = Bodies.rectangle(1975,1010,100,50,{  // isSensor값에 true를 주면 isStatic이 효과없어져서 isStatic효과를 보존하기위해 똑같은자리에 하나더 생성함.
        isStatic : true,
        render : {
            visible : false
        }
    });

    const bigBall = Bodies.circle(1700,100,100,{
                            render : {
                                sprite : {
                                    texture : 'images/stage5_bigball.png'
                                }
                            }
                        });

    const shadowBox1 = Bodies.fromVertices(1590,300,Vertices.fromPath('0 0 220 0 230 20 220 30 230 40 220 50 0 50'),renderOption,false);
    const shadowBox2 = Bodies.fromVertices(1813,300,Vertices.fromPath('0 0 10 20 0 30 10 40 0 50 225 50 225 0'),renderOption,false);
    const shadowBox3 = Bodies.fromVertices(1590,500,Vertices.fromPath('0 0 220 0 230 20 220 30 230 40 220 50 0 50'),renderOption,false);
    const shadowBox4 = Bodies.fromVertices(1813,500,Vertices.fromPath('0 0 10 20 0 30 10 40 0 50 225 50 225 0'),renderOption,false);
    const shadowBox5 = Bodies.fromVertices(1590,800,Vertices.fromPath('0 0 220 0 230 20 220 30 230 40 220 50 0 50'),renderOption,false);
    const shadowBox6 = Bodies.fromVertices(1813,800,Vertices.fromPath('0 0 10 20 0 30 10 40 0 50 225 50 225 0'),renderOption,false); 

    const obstruction = Bodies.circle(1000,200,75,{
        strokeStyle : 'orange'
    });

    World.add(world,[
        mouseConstraint,
        ground,
        ball,
        elastic,
        obstruction,
        ...verticalSet,
        ...verticalSet2,
        ...horizontalSet,
        topStatic,
        rightStatic,
        sw,
        swCopy,
        target,
        
    ]);

    Events.on(engine,'afterUpdate',backAndForth.bind(obstruction));

    Events.on(engine,'collisionStart',(e) => {
        for(let i=0; i<e.pairs.length; i++) {
            if(e.pairs[i].bodyA === sw || e.pairs[i].bodyB === sw) {
                    if(!changeButtonFlag) {
                        World.remove(world,sw);
                        World.remove(world,swCopy);
                        sw = Bodies.rectangle(sw.position.x,sw.position.y,100,20, {
                            isStatic : true,
                            render : {
                                sprite : {
                                    texture : 'images/btn-minimal3.png'
                                }
                            }
                        });
                        
                        World.add(world,sw);
                        changeButtonFlag = !changeButtonFlag;

                        World.add(world,bigBall);
                    }
            }

            if(e.pairs[i].bodyA === horizontalSet[0] && e.pairs[i].bodyB === bigBall) {
                Body.setStatic(verticalSet[0],false);
                Body.setStatic(verticalSet2[0],false);
                World.remove(world,horizontalSet[0]);
                World.add(world,[shadowBox1,shadowBox2]);
            }
            if(e.pairs[i].bodyA === horizontalSet[1] && e.pairs[i].bodyB === bigBall) {
                Body.setStatic(verticalSet[1],false);
                Body.setStatic(verticalSet2[1],false);
                World.remove(world,horizontalSet[1]);
                World.add(world,[shadowBox3,shadowBox4]);
            }
            if(e.pairs[i].bodyA === horizontalSet[2] && e.pairs[i].bodyB === bigBall) {
                Body.setStatic(verticalSet[2],false);
                Body.setStatic(verticalSet2[2],false);
                World.remove(world,horizontalSet[2]);
                World.add(world,[shadowBox5,shadowBox6]);
            }
        }

        Create.collision(e);
    });

    Events.on(mouseConstraint,'mousedown',(e)=>{});

    function backAndForth() {
        const py = 200 + 150 * Math.sin(engine.timing.timestamp * 0.002);
        const py2 = 180 + 150 * Math.sin(engine.timing.timestamp * 0.002);
        const ctx = render.context;
        
        if(this.position.x > 1000)
            this.position.x-= 0.01;

        Body.setPosition(this,{
            x : this.position.x,
            y : py
        });

        ctx.save();
        ctx.strokeRect(this.position.x - 45,py2,25,25);
        ctx.strokeRect(this.position.x + 20,py2,25,25);
        ctx.moveTo(this.position.x - 20, py+30);
        ctx.bezierCurveTo(this.position.x - 20, py+70, this.position.x + 20, py+70, this.position.x + 20, py+30 );
        ctx.stroke();
        ctx.restore();

        Create.shoot(7,270,730);
    }


    /*
    httpRequest.open('GET','/images/iconmonstr-download-2.svg');
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
        let doc,path,points;
        if(httpRequest.readyState === 4 && httpRequest.status === 200) {
            doc = httpRequest.responseXML;
            path = doc.childNodes[1].childNodes[1];
            path.setAttribute( 'd', serialize( scale( parse(path.id), 2, 2 ) ) );
            points = Svg.pathToVertices(path,30);
            verticleSet.push(points);

            World.add(world,Bodies.fromVertices(500,300,verticleSet,{},true));
        }            
    }
    */
}


function final() {
    render.options.showCollisions = true;

    const centerBall = Bodies.circle(300,860,100,{
        density : 0.0001
    });
    const leftLegBall = Bodies.circle(250,1000,50,{
        density : 1,
        friction : 0.001
    });
    const rightLegBall = Bodies.circle(355,1000,50,{
        density : 1,
        friction : 0.001
    });

    const leftElastic = Constraint.create({
        bodyA : centerBall,
        bodyB : leftLegBall,
        stiffness : 0.05,
        render : {
            visible : false
        }
    });
    const rightElastic = Constraint.create({
        bodyA : centerBall,
        bodyB : rightLegBall,
        stiffness : 0.05,
        render : {
            visible : false    
        }
    });

    const leftRope = Composites.stack(400,100,1,7,20,20,(x,y) => {
        return Bodies.polygon(x, y, 3, 40, { 
            chamfer: { radius: [20, 0, 20] },
            collisionFilter : group
        });
    });
    const leftRopeConstraint = Constraint.create({
        bodyB: leftRope.bodies[0],
        pointA: { x: 500, y: 0 },
        pointB: { x: -100, y: 0 },
        stiffness: 0.5,
        length : 10,
        render : {
            visible : false
        }
    })
    Composites.chain(leftRope, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2 });
    Composite.addConstraint(leftRope,leftRopeConstraint);

    const rightRope = Composites.stack(1100,100,1,7,10,10,(x,y) => {
        return Bodies.polygon(x, y, 3, 40, { 
            chamfer: { radius: [20, 0, 20] },
            collisionFilter : group
        });
    });
     const rightRopeConstraint = Constraint.create({
        bodyB: rightRope.bodies[0],
        pointA: { x: 1200, y: 0 },
        pointB: { x: -100, y: 0 },
        stiffness: 0.5,
        length : 10,
        render : {
            visible : false
        }
    })
    Composites.chain(rightRope, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2 });
    Composite.addConstraint(rightRope,rightRopeConstraint);

    const greet = Bodies.rectangle(800,400,400,200, { 
        collisionFilter : group,
        chamfer : { radius : [20,20,20,20] }
    });
    const greetLeftConstraint = Constraint.create({
        bodyA : leftRope.bodies[6],
        bodyB : greet,
        length : 250,
        render : { visible : false }
    });
    const greetRightConstraint = Constraint.create({
        bodyA : rightRope.bodies[6],
        bodyB : greet,
        length : 250,
        render : { visible : false }
    });
    

    for(let i=0; i<7; i++) {
        Body.rotate(leftRope.bodies[i],Math.PI/180*(-90));
        Body.rotate(rightRope.bodies[i],Math.PI/180*(-90));
    }
    
    const cannon = Composite.create({ lable : 'cannon' });
    const center = Bodies.rectangle(350,700,350,125,{
        density : 0.001,
        render : {
            fillStyle : '#18181d'
        }
    }); 
    const bowl = Bodies.fromVertices(350,800,Vertices.fromPath('0 0 0 200 400 200 400 0 390 0 390 190 10 190 10 0 '),{
        render : {
            fillStyle : '#ffffff'
        }
    },false); 
    const topBowl = Bodies.fromVertices(348,600,Vertices.fromPath('0 0 400 0 400 10 0 10'),{
        firiction : 10,
        collisionFilter : {group},
        render : {
            fillStyle : '#ffffff'
        }
    },false);
    const bowlConstraint = Constraint.create({
        bodyA : bowl,
        pointA : {x : 25, y : -70},
        bodyB : topBowl,
        render : {
            visible : true
        },
        length : 85
    });

    let wheelArr = [],
        axelArr = [],
        wheelRangeArr = [],
        overArr = [],
        x = center.position.x - 175,
        y = center.position.y,
        tmpX = 0,
        isFull = false,
        takeOff = false,
        overChain = [],
        fake = false,
        tScale = 1,
        stop = false,
        stopX = [],
        stopY = [],
        overImgs = ['FR','FE','FV','FO'];
    
    window.setTimeout( () => {
        takeOff = !takeOff;
    },1500);

    Composite.addBody(cannon, bowl);
    Composite.addBody(cannon, topBowl);
    Composite.addConstraint(cannon,bowlConstraint);  // add 해도상관없음. add()로 할경우 추가되는강체가 body이던 constraint이던 composite이던 알아서 추가함.

    for(let i=0; i<4; i++) {
        overArr.push(Bodies.circle(200+i*100,700,35,{
            restitution : 1,
            render : {
                sprite : {
                    texture : `images/${overImgs.pop()}.png`,
                }
            }
        }));
        Composite.addBody(cannon,overArr[i]);

        wheelArr.push(
            Bodies.circle(200+i*100,900,35,{
                collisionFilter : {group}
            })
        );

        axelArr.push(
            Constraint.create({
                bodyA : bowl,
                bodyB : wheelArr[i],
                render : {
                    visible : true
                },
                density : 0.00001,
                friction : 0.8
            })
        )

        Composite.addBody(cannon,wheelArr[i]);
        Composite.addConstraint(cannon,axelArr[i]);

        wheelRangeArr[i] = { x1 : 0 };

        overChain[i] = false;
    }

    World.add(world,[
        ground,
        cannon,
        Bodies.rectangle(900,0,2300,25,{isStatic : true}), // top
        Bodies.rectangle(0,550,25,1100,{isStatic : true}), // left
        Bodies.rectangle(2050,300,25,600,{isStatic : true}), // right
    ]);

    Events.on(engine,'beforeUpdate',(e) => {        
        let ctx = render.context,
              x = bowl.position.x - 175,
              y = bowl.position.y;
  
        for(let i=0; i<4; i++) {
            let tmp = {};

            x-=20;
            tmp.x1 = x, tmp.y1 = y;
            //ctx.moveTo(x,y); // 30
            //ctx.lineTo(x,y+300);
            x+=90;
            tmp.x2 = x, tmp.y2 = y; 
            //ctx.moveTo(x,y);
            //ctx.lineTo(x,y+300); // 60
            x+= (i==1) ? 50 : 20;
            //ctx.stroke();         
            
            if(wheelRangeArr[i]) {
                if(Math.floor(wheelRangeArr[i].x1) !== Math.floor(tmp.x1)) {
                    wheelRangeArr[i] = tmp;
                    if(i === 3) isFull = true;
                }
            }

            if(isFull) {
                // 각 공의 범위를 못넘어가게끔
                for(let j=0; j<4; j++) {
                    const lpos = wheelArr[i].position.x - 35;
                    const rpos = wheelArr[i].position.x + 35;
                    const x1 = wheelRangeArr[i].x1;
                    const x2 = wheelRangeArr[i].x2;

                    if(lpos < x1 || rpos < x1) 
                        wheelArr[i].position.x += 0.1;
                    else if(lpos > x2 || rpos > x2) 
                        wheelArr[i].position.x -= 0.1;

                    if(takeOff) {
                        if(Math.floor(wheelArr[i].position.y) > 995)
                            wheelArr[i].position.y -=0.1;
                        else if(Math.floor(wheelArr[i].position.y) < 995)
                            wheelArr[i].position.y +=0.1;
                    }
                }   
            }            
        }

        if(fake) {
            ctx.font = '20px Poiret One';
            ctx.fillStyle = 'white';
            ctx.fillText('This game, made by Eat2go was over and,',greet.position.x-200,greet.position.y-50);
            ctx.fillText('I will appreciate you, if visit to my blog or git',greet.position.x-200,greet.position.y-25);
            ctx.fillText('http://eat2go.tistory.com/ or ',greet.position.x-200,greet.position.y+25);
            ctx.fillText('https://github.com/hyunsooda',greet.position.x-200,greet.position.y+50); 

            ctx.moveTo(leftRope.bodies[6].position.x-10,leftRope.bodies[6].position.y+25);
            ctx.bezierCurveTo(leftRope.bodies[6].position.x,leftRope.bodies[6].position.y+50, leftRope.bodies[6].position.x,leftRope.bodies[6].position.y+100, leftRope.bodies[6].position.x+25,leftRope.bodies[6].position.y+100);
            ctx.moveTo(rightRope.bodies[6].position.x+10,rightRope.bodies[6].position.y+25);
            ctx.bezierCurveTo(rightRope.bodies[6].position.x,rightRope.bodies[6].position.y+50, rightRope.bodies[6].position.x,rightRope.bodies[6].position.y+100, rightRope.bodies[6].position.x-25,rightRope.bodies[6].position.y+100);
            ctx.stroke();  
        }
    });
    
    Events.on(engine,'afterUpdate',(e) => {    
        const ctx = render.context;
        let y

        engine.timing.timeScale += (tScale - engine.timing.timeScale) * 0.05;
    
        if(takeOff) {
           for(let i=0; i<4; i++) {
              wheelArr[i].position.x+=0.12;             
              
              if(!overChain[i]) {
               Body.applyForce(overArr[i], overArr[i].position, {
                 x: 1*0.007,
                 y: -0.2
               });
               ( (i) => {
                    window.setTimeout( () => {
                        tScale = 0.09;
                        Body.applyForce(overArr[i], overArr[i].position, {
                            x: 1 * 0.007,
                            y: -0.5
                        }); 

                        window.setTimeout( () => {
                            if(!stop) {
                                stop = !stop;
                                tScale = 1;

                                for(let i=0; i<4; i++) {
                                    stopX.push(overArr[i].position.x);
                                    stopY.push(overArr[i].position.y);
                                }
                                World.add(world,[
                                    leftRope,
                                    rightRope,
                                    greet,
                                    greetLeftConstraint,
                                    greetRightConstraint,
                                ]);

                                window.setTimeout( () => {
                                    fake = !fake;
                                },7000);
                            }
                        },5000);
                    },8000);
                })(i);
                overChain[i] = !overChain[i];
              }

               if( !(overArr[i].position.y - (bowl.position.y-100) > 1 && overArr[i].position.y > 0)) {
                    Composite.remove(cannon,topBowl);
                    Composite.remove(cannon,bowlConstraint);
               }

               if(stop) {
                   overArr[i].position.x = stopX[i];
                   overArr[i].position.y = stopY[i];
               }
        
            }            
           
        }
    });
    
}

const stages = [one,two,three,four,five,final];

export default stages;