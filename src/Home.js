import { useEffect, useState } from 'react'
import Loading from './Loading'
import RestaurantCard from './RestaurantCard'

function Home ({mongoContext: {client, user}}) {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getData () {
      const rests = client.db('sample_restaurants').collection('restaurants')
      setRestaurants((await rests.find()).slice(0, 10))
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
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant._id} restaurant={restaurant} user={user}/>
      ))}
    </div>
  )
}

export default Home