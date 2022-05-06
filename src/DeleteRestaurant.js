import { BSON } from 'realm-web'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import Loading from './Loading'
import { isAnon } from './utils'

function DeleteRestaurant({mongoContext: {client, app, user}}) {
    const [loading, setLoading] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()

    if (isAnon(user)) {
        navigate('/')
    }

    function submitHandler () {
        console.log(BSON.ObjectID(app.currentUser.id))
        const rests = client.db('sample_restaurants').collection('restaurants') 
        rests.deleteOne({"_id": BSON.ObjectID(id)}
        ).then (() => navigate('/'))
            .catch ((err) => {
    			alert(err)
    			setLoading(false)
			})
    }

    return (
        <div>
            {loading && <Loading />}
                {!loading && (<div>
                    <h1>Are you sure you would like to delete?</h1>
                    <div className="text-center mt-2">
                        <button type='submit' onClick={submitHandler}>Yes</button>
                    </div>
                </div>)}
        </div>
    )
}

export default DeleteRestaurant