import Card from 'react-bootstrap/Card'
import CardBody from 'react-bootstrap/Card'
import { Link } from 'react-router-dom';
import { isAnon } from './utils';


function RestaurantCard ({restaurant, user}) {
    //get average of grades
    let sum = 0;
    restaurant.grades.forEach(element => {
        sum += element.score
    });
    const avg = Math.round(sum / (restaurant.grades.length))

    return (
        <Card classname="m-3">
            <CardBody>
                {!isAnon(user) && <Card.Title>{restaurant.name}<Card.Text>{avg}</Card.Text></Card.Title>}
                {!isAnon(user) && <Link to={`/review/${restaurant._id}`} className="card-link">Add Review</Link>}
                {!isAnon(user) && <Link to={`/delete/${restaurant._id}`} className="card-link">Delete Restaurant</Link>}
            </CardBody>
        </Card>
    )
}

export default RestaurantCard