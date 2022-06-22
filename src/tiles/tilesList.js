import Tile from "./Tile"
import { ROAD, CITY, FIELD } from "../constants"
import cityOneEdge from "../images/city_one_edge.jpeg"
import cityRoadTurnLeft from "../images/city_road_turn_left.jpeg"
import cityRoadTurnRight from "../images/city_road_turn_right.jpeg"
import cityTwoEdges from "../images/city_two_edges.jpeg"
import cityTwoEdgesAdj from "../images/city_two_edges_adj.jpeg"
import cityCorner from "../images/city_corner.jpeg"
import cityCornerRoad from "../images/city_corner_road.jpeg"
import cityPipe from "../images/city_pipe.jpeg"
import cityRoadThree from "../images/city_road_three.jpeg"
import cityThree from "../images/city_three.jpeg"
import cityThreeRoad from "../images/city_three_road.jpeg"
import roadFour from "../images/road_four.jpeg"
import roadThree from "../images/road_three.jpeg"
import roadStraight from "../images/road_straight.jpeg"
import roadTurn from "../images/road_turn.jpeg"
import church from "../images/church.jpeg"
import churchRoad from "../images/church_road.jpeg"

const tiles = [
    // fieldLeft and fieldRight are considered as if the road is in the bottom
    new Tile(                                               //  ___________
        { type: CITY, id: 1, surroundingFields: [2] },      // |\         /|
        { type: FIELD, id: 2 },                             // | \_______/ |
        { type: FIELD, id: 2 },                             // |           |
        { type: FIELD, id: 2 },                             // |           |
        cityOneEdge                                         // |___________|
    ),
    // new Tile(                     
    //     { type: CITY, id: 1, surroundingFields: [2] },    
    //     { type: FIELD, id: 2 },   
    //     { type: FIELD, id: 2 },   
    //     { type: FIELD, id: 2 },   
    //     cityOneEdge               
    // ),
    new Tile(                                                  //  ___________
        { type: CITY, id: 1, surroundingFields: [2] },         // |\         /|
        { type: FIELD, id: 2 },                                // | \_______/ | 
        { type: ROAD, id: 3, fieldLeft: 4, fieldRight: 2 },    // |_____      |    
        { type: ROAD, id: 3, fieldLeft: 2, fieldRight: 4 },    // |     |     |
        cityRoadTurnLeft                                       // |_____|_____|
    ),
    // new Tile(                                                  
    //     { type: CITY, id: 1, surroundingFields: [2] },                                 
    //     { type: FIELD, id: 2 },                                
    //     { type: ROAD, id: 3, fieldLeft: 4, fieldRight: 2 },    
    //     { type: ROAD, id: 3, fieldLeft: 2, fieldRight: 4 },    
    //     cityRoadTurnLeft                                       
    // ),
    new Tile(                                               //  ___________
        { type: CITY, id: 1, surroundingFields: [3] },      // |\         /|
        { type: ROAD, id: 2, fieldLeft: 4, fieldRight: 3 }, // | \_______/ | 
        { type: ROAD, id: 2, fieldLeft: 3, fieldRight: 4 }, // |      _____|    
        { type: FIELD, id: 3 },                             // |     |     |
        cityRoadTurnRight                                   // |_____|_____|
    ),
    // new Tile(
    //     { type: CITY, id: 1, surroundingFields: [3] },
    //     { type: ROAD, id: 2, fieldLeft: 4, fieldRight: 3 },
    //     { type: ROAD, id: 2, fieldLeft: 3, fieldRight: 4 },
    //     { type: FIELD, id: 3 },
    //     cityRoadTurnRight
    // ),
    new Tile(                                               //  ___________
        { type: CITY, id: 1, surroundingFields: [2] },      // |\         /|
        { type: FIELD, id: 2 },                             // | \_______/ | 
        { type: CITY, id: 3, surroundingFields: [2] },      // |  _______  |    
        { type: FIELD, id: 2 },                             // | /       \ |
        cityTwoEdges                                        // |/_________\|
    ),
    // new Tile(
    //     { type: CITY, id: 1, surroundingFields: [2] },
    //     { type: FIELD, id: 2 },
    //     { type: CITY, id: 3, surroundingFields: [2] },
    //     { type: FIELD, id: 2 },
    //     cityTwoEdges
    // ),
    new Tile(                                               //  ___________
        { type: ROAD, id: 1, fieldLeft: 6, fieldRight: 5 }, // |     |     |
        { type: ROAD, id: 2, fieldLeft: 7, fieldRight: 6 }, // |     |     | 
        { type: ROAD, id: 3, fieldLeft: 8, fieldRight: 7 }, // |_____|_____|    
        { type: ROAD, id: 4, fieldLeft: 5, fieldRight: 8 }, // |     |     |
        roadFour                                            // |_____|_____|
    ),
    new Tile(                                               //  ___________
        { type: FIELD, id: 1 },                             // |           |
        { type: ROAD, id: 2, fieldLeft: 5, fieldRight: 1 }, // |___________|    
        { type: ROAD, id: 3, fieldLeft: 6, fieldRight: 5 }, // |     |     |    
        { type: ROAD, id: 4, fieldLeft: 1, fieldRight: 6 }, // |     |     |
        roadThree                                           // |_____|_____|
    ),
    // new Tile(
    //     { type: FIELD, id: 1 }, 
    //     { type: ROAD, id: 2, fieldLeft: 5, fieldRight: 1 }, 
    //     { type: ROAD, id: 3, fieldLeft: 6, fieldRight: 5 }, 
    //     { type: ROAD, id: 4, fieldLeft: 1, fieldRight: 6 }, 
    //     roadThree
    // ),
    new Tile(                                               //  ___________
        { type: ROAD, id: 1, fieldLeft: 2, fieldRight: 3 }, // |     |     |
        { type: FIELD, id: 2 },                             // |     |     |
        { type: ROAD, id: 1, fieldLeft: 3, fieldRight: 2 }, // |     |     |    
        { type: FIELD, id: 3 },                             // |     |     |
        roadStraight                                        // |_____|_____|
    ),
    // new Tile(
    //     { type: ROAD, id: 1, fieldLeft: 2, fieldRight: 3 }, 
    //     { type: FIELD, id: 2 }, 
    //     { type: ROAD, id: 1, fieldLeft: 3, fieldRight: 2 }, 
    //     { type: FIELD, id: 3 }, 
    //     roadStraight
    // ),
    new Tile(                                               //  ___________
        { type: FIELD, id: 1 },                             // |           |
        { type: FIELD, id: 1 },                             // |_____      |
        { type: ROAD, id: 2, fieldLeft: 3, fieldRight: 1 }, // |     |     |    
        { type: ROAD, id: 2, fieldLeft: 1, fieldRight: 3 }, // |     |     |
        roadTurn                                            // |_____|_____|
    ),
    // new Tile(
    //     { type: FIELD, id: 1 }, 
    //     { type: FIELD, id: 1 }, 
    //     { type: ROAD, id: 2, fieldLeft: 3, fieldRight: 1 }, 
    //     { type: ROAD, id: 2, fieldLeft: 1, fieldRight: 3 }, 
    //     roadTurn
    // ),
    new Tile(                                           //  ___________
        { type: CITY, id: 1, surroundingFields: [2] },  // |         _/|
        { type: FIELD, id: 2 },                         // | CITY  _/  |
        { type: FIELD, id: 2 },                         // |     _/    |    
        { type: CITY, id: 1, surroundingFields: [2] },  // |  __/ field|
        cityCorner                                      // |_/_________|
    ),
    // new Tile(
    //     { type: CITY, id: 1, surroundingFields: [2] }, 
    //     { type: FIELD, id: 2 }, 
    //     { type: FIELD, id: 2 }, 
    //     { type: CITY, id: 1, surroundingFields: [2] }, 
    //     cityCorner
    // ),
    new Tile(                                                //  ___________
        { type: FIELD, id: 1 },                              // |           |
        { type: FIELD, id: 1 },                              // |           |
        { type: ROAD, id: 2, fieldLeft: 1, fieldRight: 1 },  // |     X     |    
        { type: FIELD, id: 1 },                              // |     |     |
        churchRoad, true                                     // |_____|_____|
    ),
    // new Tile(
    //     { type: FIELD, id: 1 }, 
    //     { type: FIELD, id: 1 }, 
    //     { type: ROAD, id: 2, fieldLeft: 1, fieldRight: 1 }, 
    //     { type: FIELD, id: 1 }, 
    //     churchRoad, true
    // ),
    new Tile(                   //  ___________
        { type: FIELD, id: 1 }, // |           |
        { type: FIELD, id: 1 }, // |           |
        { type: FIELD, id: 1 }, // |     X     |    
        { type: FIELD, id: 1 }, // |           |
        church, true            // |___________|
    ),
    // new Tile(
    //     { type: FIELD, id: 1 }, 
    //     { type: FIELD, id: 1 }, 
    //     { type: FIELD, id: 1 }, 
    //     { type: FIELD, id: 1 }, 
    //     church, true
    // ),
    new Tile(                                               //  ___________
        { type: CITY, id: 1, surroundingFields: [4] },      // |         _/|
        { type: ROAD, id: 2, fieldLeft: 3, fieldRight: 4 }, // | CITY  _/  |
        { type: ROAD, id: 2, fieldLeft: 4, fieldRight: 3 }, // |     _/   _|    
        { type: CITY, id: 1, surroundingFields: [2] },      // |  __/  __/ |
        cityCornerRoad                                      // |_/____/____|
    ),
    // new Tile(
    //     { type: CITY, id: 1, surroundingFields: [4] },
    //     { type: ROAD, id: 2, fieldLeft: 3, fieldRight: 4 },
    //     { type: ROAD, id: 2, fieldLeft: 4, fieldRight: 3 },
    //     { type: CITY, id: 1, surroundingFields: [2] },
    //     cityCornerRoad
    // ),
    new Tile(                                             //  ___________
        { type: FIELD, id: 1 },                           // |\_________/|
        { type: CITY, id: 2, surroundingFields: [1, 3] }, // |           | 
        { type: FIELD, id: 3 },                           // |   CITY    |    
        { type: CITY, id: 2, surroundingFields: [1, 3] }, // | _________ |
        cityPipe                                          // |/_________\|
    ),
    // new Tile(
    //     { type: FIELD, id: 1 },
    //     { type: CITY, id: 2, surroundingFields: [1, 3] },
    //     { type: FIELD, id: 3 },
    //     { type: CITY, id: 2, surroundingFields: [1, 3] },
    //     cityPipe
    // ),
    new Tile(                                                  //  ___________
        { type: CITY, id: 1, surroundingFields: [5] },         // |\         /|
        { type: ROAD, id: 2, fieldLeft: 6, fieldRight: 5 },    // | \_______/ | 
        { type: ROAD, id: 3, fieldLeft: 7, fieldRight: 6 },    // |_____ _____|    
        { type: ROAD, id: 4, fieldLeft: 5, fieldRight: 7 },    // |     |     |
        cityRoadThree                                          // |_____|_____|
    ),
    // new Tile(                                                  
    //     { type: CITY, id: 1, surroundingFields: [5] },
    //     { type: ROAD, id: 2, fieldLeft: 6, fieldRight: 5 },
    //     { type: ROAD, id: 3, fieldLeft: 7, fieldRight: 6 },
    //     { type: ROAD, id: 4, fieldLeft: 5, fieldRight: 7 },
    //     cityRoadThree                                       
    // ),
    new Tile(                                          //  ___________
        { type: CITY, id: 1, surroundingFields: [2] }, // |           |
        { type: CITY, id: 1, surroundingFields: [2] }, // |   CITY    | 
        { type: FIELD, id: 2 },                        // |   _____   |    
        { type: CITY, id: 1, surroundingFields: [2] }, // | / field \ |
        cityThree                                      // |/_________\|
    ),
    // new Tile(
    //     { type: CITY, id: 1, surroundingFields: [2] },
    //     { type: CITY, id: 1, surroundingFields: [2] },
    //     { type: FIELD, id: 2 },
    //     { type: CITY, id: 1, surroundingFields: [2] },
    //     cityThree
    // ),
    new Tile(                                               //  ___________
        { type: CITY, id: 1, surroundingFields: [3, 4] },   // |           |
        { type: CITY, id: 1, surroundingFields: [3, 4] },   // |   CITY    | 
        { type: ROAD, id: 2, fieldLeft: 3, fieldRight: 4 }, // |   _____   |    
        { type: CITY, id: 1, surroundingFields: [3, 4] },   // | /   |   \ |
        cityThreeRoad                                       // |/____|____\|
    ),
    // new Tile(
    //     { type: CITY, id: 1, surroundingFields: [3, 4] },
    //     { type: CITY, id: 1, surroundingFields: [3, 4] },
    //     { type: ROAD, id: 2, fieldLeft: 3, fieldRight: 4 },
    //     { type: CITY, id: 1, surroundingFields: [3, 4] },
    //     cityThreeRoad
    // ),
    new Tile(                                               //  ___________
        { type: CITY, id: 1, surroundingFields: [2] },      // |\_________/|
        { type: FIELD, id: 2 },                             // | |         | 
        { type: FIELD, id: 2 },                             // | |         |
        { type: CITY, id: 3, surroundingFields: [2] },      // | |         |    
        cityTwoEdgesAdj                                     // |/__________|
    ),
    // new Tile(
    //     { type: CITY, id: 1, surroundingFields: [2] },
    //     { type: FIELD, id: 2 },
    //     { type: FIELD, id: 2 },
    //     { type: CITY, id: 3, surroundingFields: [2] },
    //     cityTwoEdgesAdj
    // ),
]

const drawTiles = function () {
    let array = [...tiles];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default drawTiles;