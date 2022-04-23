import Tile from "./Tile"
import { ROAD, CITY, FIELD } from "../constants"
import cityOneEdge from "../images/city_one_edge.jpeg"
import cityRoadTurnLeft from "../images/city_road_turn_left.jpeg"
import cityRoadTurnRight from "../images/city_road_turn_right.jpeg"
import cityTwoEdges from "../images/city_two_edges.jpeg"
import roadFour from "../images/road_four.jpeg"
import roadThree from "../images/road_three.jpeg"
import roadStraight from "../images/road_straight.jpeg"
import roadTurn from "../images/road_turn.jpeg"

const tiles = [
    new Tile(CITY, FIELD, FIELD, FIELD, cityOneEdge),
    new Tile(CITY, FIELD, ROAD, ROAD, cityRoadTurnLeft),
    new Tile(CITY, ROAD, ROAD, FIELD, cityRoadTurnRight),
    new Tile(CITY, FIELD, CITY, FIELD, cityTwoEdges),
    new Tile(ROAD, ROAD, ROAD, ROAD, roadFour),
    new Tile(FIELD, ROAD, ROAD, ROAD, roadThree),
    new Tile(ROAD, FIELD, ROAD, FIELD, roadStraight),
    new Tile(FIELD, FIELD, ROAD, ROAD, roadTurn),
]

export default tiles;