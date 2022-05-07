import { useFormik } from 'formik'
import * as yup from 'yup'
import { BSON } from 'realm-web'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import Loading from './Loading'
import { isAnon } from './utils'

const reviewSchema = yup.object().shape({
    name: yup.string().required()
})

function CreateRestaurant({mongoContext: {client, app, user}}) {
    const [loading, setLoading] = useState(false)
    const formik = useFormik({
        initialValues: {
            _id: new BSON.ObjectID(),
            address: null,
            borough: "N/A",
            cuisine: "N/A",
            grades: [{date: new Date(),
                grade: "A",
                score: 10}],
            name: '',
            restaurant_id: "12345678"
        },
        validationSchema: reviewSchema,
        onSubmit: values => {
            console.log('Form data', values)
            submitHandler(values)
        }
    })
    const navigate = useNavigate()

    if (isAnon(user)) {
        navigate('/')
    }

    function submitHandler (values) {
        console.log(BSON.ObjectID(app.currentUser.id))
        const rests = client.db('sample_restaurants').collection('restaurants') 
        rests.findOne({name: values.name}).then(result => {
            if(result) {
              console.log(`Successfully found document: ${result}.`);
            } else {
              console.log("No document matches the provided query.");
              rests.insertOne(values).then (() => navigate('/'))
              .catch ((err) => {
                  alert(err)
                  setLoading(false)
              })
            }
        })
    }

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
            {loading && <Loading />}
                {!loading && (<div>
                    <h1>Create Restaurant</h1>
                    <label htmlFor="name">Name</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />

                    <div className="text-center mt-2">
                        <button type='submit'>Submit</button>
                    </div>
                </div>)}
            </form>
        </div>
    )
}

export default CreateRestaurant