function parse(lines) {
    lines = lines.split("\n");
    lines = lines.filter(line => line !== "")
    lines.push("Turn 0.0 Degrees Counterclockwise");
    //console.log(lines);
    let moves = [];
    let turns = [];
    // Clockwise turns are negative since they turn right on a cartesian plane.
    lines.forEach(line => {
        words = line.split(" ");
        if (words[0] === "Move") {
            moves.push(line);
        } else {
            turns.push(line);
        }
    });
    let moveVals = [];
    let turnVals = [];

    //console.log(moves);
    //console.log(turns);
    turns.forEach(line => {
        words = line.split(" ");
        if (words[3] === "Counterclockwise") {
            turnVals.push(parseFloat(words[1]));
        } else {
            turnVals.push(-parseFloat(words[1]));
        }
    });
    moves.forEach(line => {
        words = line.split(" ");
        val = parseFloat(words[1]) * 0.0254; // convert to meters
        moveVals.push(val);
    });
    //console.log(turnVals);
    //console.log(moveVals);
    return moveVals.map((e, i) => [e, turnVals[i]]);
}

function waypointsToCoe(waypoints) {
    let str = "Waypoint[] points = new Waypoint[] {";
    waypoints.forEach(waypoint => {
        str += `\n\tnew Waypoint(${waypoint[0]}, ${waypoint[1]}, ${waypoint[2]}),`
    });
    str = str.substring(0, str.length - 1);
    str += "\n};";
    return str;
}

function run () {
    let raw = document.getElementById("raw").value;
    //consoleslog(raw);
    let parses = parse(raw);
    console.log(parses);
    let waypoints = [[0, 0, 0]];

    let heading = 0;
    let cur = new Victor(0, 0);
    let tick = 0;
    //console.log("Waypoint " + tick + ":", cur.x, cur.y, heading);
    tick += 1;

    parses.forEach(set => {
        heading += set[1];
        cur.add(new Victor(set[0], 0).rotateDeg(heading));
        waypoints.push([cur.x, cur.y, heading]);
        //console.log("Waypoint " + tick + ":", cur.x, cur.y, heading);
        tick += 1;
    });

    document.getElementById("output").value = waypointsToCoe(waypoints);
}

document.getElementById("calc").addEventListener("click", run);