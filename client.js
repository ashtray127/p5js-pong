// RUN INSIDE p5js

const socket = new WebSocket("ws://localhost:8080")

const p1_x_pos = 25;
const p2_x_pos = 375;

const y_offset = 40;
const x_offset = 5;

var player_data = {
    player1: {
        connected: false,
        y_pos: 200
      },
      player2: {
        connected: false,
        y_pos: 200
      },
      ball: {
        x_pos: 200,
        y_pos: 200,
        direction: 1 ,
        slope: 1,
        radius: 10
      }
}
var id = ""

socket.addEventListener('message', (msg) => {
  let data = JSON.parse(msg.data);
  
  if (Object.keys(data).includes('id')) {
    id = data.id;
    console.log('ID:', id)
  } else {
    player_data = JSON.parse(msg.data);
  }
});

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0)
  
  if (id !== "spectator") {
    let w_down = keyIsDown(87);
    let s_down = keyIsDown(83);

    socket.send(JSON.stringify({
      w_down: w_down,
      s_down: s_down
    }));
  }
  
  
  if (id == "player1") fill(0,255,0)
  else fill(255,255,255);
  
   
  let p1_y_pos = player_data.player1.y_pos
  let p1_point1 = [p1_x_pos-x_offset, p1_y_pos-y_offset]
  let p1_point2 = [p1_x_pos-x_offset, p1_y_pos+y_offset]
  let p1_point3 = [p1_x_pos+x_offset, p1_y_pos+y_offset]
  let p1_point4 = [p1_x_pos+x_offset, p1_y_pos-y_offset]
  
  quad(...p1_point1, ...p1_point2, ...p1_point3, ...p1_point4)
  
  if (id == "player2") fill(0,255,0)
  else fill(255,255,255);
  
  let p2_y_pos = player_data.player2.y_pos
  let p2_point1 = [p2_x_pos-x_offset, p2_y_pos-y_offset]
  let p2_point2 = [p2_x_pos-x_offset, p2_y_pos+y_offset]
  let p2_point3 = [p2_x_pos+x_offset, p2_y_pos+y_offset]
  let p2_point4 = [p2_x_pos+x_offset, p2_y_pos-y_offset]

  quad(...p2_point1, ...p2_point2, ...p2_point3, ...p2_point4)
  
  console.log(player_data)
  let ball_x = player_data.ball.x_pos;
  let ball_y = player_data.ball.y_pos;
  let ball_r = player_data.ball.radius;
  
  fill(255,255,255);
  circle(ball_x, ball_y, ball_r);
    
}
