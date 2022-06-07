import Tile from "./Tile"
import { ROAD, CITY, FIELD } from "../constants"
import cityOneEdge from "../images/city_one_edge.jpeg"
import cityRoadTurnLeft from "../images/city_road_turn_left.jpeg"
import cityRoadTurnRight from "../images/city_road_turn_right.jpeg"
import cityTwoEdges from "../images/city_two_edges.jpeg"
import cityCorner from "../images/city_corner.jpeg"
import roadFour from "../images/road_four.jpeg"
import roadThree from "../images/road_three.jpeg"
import roadStraight from "../images/road_straight.jpeg"
import roadTurn from "../images/road_turn.jpeg"
import church from "../images/church.jpeg"
import churchRoad from "../images/church_road.jpeg"

const tiles = [
    new Tile(CITY, 1, FIELD, 2, FIELD, 2, FIELD, 2, cityOneEdge),
    new Tile(CITY, 1, FIELD, 2, ROAD, 3, ROAD, 3, cityRoadTurnLeft),
    new Tile(CITY, 1, ROAD, 2, ROAD, 2, FIELD, 3, cityRoadTurnRight),
    new Tile(CITY, 1, FIELD, 2, CITY, 3, FIELD, 2, cityTwoEdges),
    new Tile(ROAD, 1, ROAD, 2, ROAD, 3, ROAD, 4, roadFour),
    new Tile(FIELD, 1, ROAD, 2, ROAD, 3, ROAD, 4, roadThree),
    new Tile(ROAD, 1, FIELD, 2, ROAD, 1, FIELD, 3, roadStraight),
    new Tile(FIELD, 1, FIELD, 1, ROAD, 2, ROAD, 2, roadTurn),
    new Tile(CITY, 1, FIELD, 2, FIELD, 2, CITY, 1, cityCorner),
    new Tile(FIELD, 1, FIELD, 1, ROAD, 2, FIELD, 1, churchRoad, true),
    new Tile(FIELD, 1, FIELD, 1, FIELD, 1, FIELD, 1, church, true),
]

const drawTiles = function() {
    let array = [...tiles];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default drawTiles;