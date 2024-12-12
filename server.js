import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 })
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

wss.on('connection', (ws) => {
    if (player_data.player1.connected && player_data.player2.connected) {
        ws.close(1002, "The server is full!");
    }

    let id = player_data.player1.connected? player_data.player2.connected? "spectator" : "player2" : "player1";
    ws.send(JSON.stringify({ id: id }))
    player_data[id].connected = true;
    console.log(id,"connected.")

    ws.on('close', (cls) => {
        player_data[id].connected = false;
        console.log(id,"disconnected.")
    })

    ws.on('message', (msg) => {
        let data = JSON.parse(Buffer.from(msg).toString());

        let this_data = player_data[id];

        if (data.w_down) {
            this_data.y_pos -= 2;
        }
        if (data.s_down) {
            this_data.y_pos += 2;
        }

        if (player_data.player1.connected && player_data.player2.connected) {
            if (id == "player1") {
                let ball_x = player_data.ball.x_pos;
                let ball_y = player_data.ball.y_pos
                let ball_dir = player_data.ball.direction;
                let ball_r = player_data.ball.radius;
                let ball_slope = player_data.ball.slope;


                // COLLIDER CODE
                let next_y = ball_y + ball_slope;
                let next_x = ball_x + ball_dir;

                let ball_farthest_left = ball_x - ball_r;
                let ball_farthest_right = ball_x + ball_r;
                let ball_farthest_up = ball_y - ball_r;
                let ball_farthest_down = ball_y + ball_r;

                let y_offset = 40;
                let x_offset = 5;

                let p1_x = 25;
                let p2_x = 375;

                let p1_farthest_left = p1_x - x_offset;
                let p1_farthest_right = p1_x + x_offset;
                let p1_farthest_top = player_data.player1.y_pos - y_offset;
                let p1_farthest_down = player_data.player1.y_pos + y_offset;

                let p2_farthest_left = p2_x - x_offset;
                let p2_farthest_right = p2_x + x_offset;
                let p2_farthest_top = player_data.player2.y_pos - y_offset;
                let p2_farthest_down = player_data.player2.y_pos + y_offset;


                if (ball_farthest_down > 400 || ball_farthest_up < 0) {
                    console.log('hit top/bottom')
                    ball_slope = -ball_slope
                } 
                
                if (
                    ball_farthest_left < p1_farthest_right && 
                    ( (p1_farthest_top > ball_farthest_up && ball_farthest_up > p1_farthest_down) || 
                      (p1_farthest_down > ball_farthest_down && ball_farthest_down > p1_farthest_top) )
                ) { 
                    // Colliding with player 1
                    ball_dir = -ball_dir
                    //ball_slope = -ball_slope
                    console.log("Hit player 1")
                }
                if (
                    ball_farthest_right > p2_farthest_left && 
                    ( (p2_farthest_top > ball_farthest_up && ball_farthest_up > p2_farthest_down) || 
                      (p2_farthest_down > ball_farthest_down && ball_farthest_down > p2_farthest_top) )
                ) {
                    // Colliding with player 2
                    ball_dir = -ball_dir;
                    //ball_slope = -ball_slope;

                    console.log("Hit player 2")
                }

                next_y = ball_y - ball_slope;
                next_x = ball_x + ball_dir;

                player_data.ball.last_pos = [ball_x, ball_y];
                player_data.ball.x_pos = next_x;
                player_data.ball.y_pos = next_y;
                player_data.ball.direction = ball_dir;
                player_data.ball.slope = ball_slope;
            
            }
        }
        

        ws.send(JSON.stringify(player_data));
    })



})