import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from './Loading'
import RestaurantCard from './RestaurantCard'
import { isAnon } from './utils'

function Home ({mongoContext: {client, user}}) {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getData () {
      const rests = client.db('sample_restaurants').collection('restaurants')
      setRestaurants((await rests.find()).slice(-20).reverse())
      setLoading(false)
    }

    console.log(client)
    console.log(user)

    if (loading && user && client) {
      getData();
    }
  }, [client, loading, user])

  return (
    <div className="mt-3">
      {loading && (
        <div className="text-center">
          <Loading />
        </div>
      )}
      {!loading && !isAnon(user) && <Link to={`/create`} className="card-link">Create Restaurant</Link>}
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant._id} restaurant={restaurant} user={user}/>
      ))}
    </div>
  )
}

export default Home