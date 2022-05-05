import { useFormik } from 'formik'
import * as yup from 'yup'
import { BSON } from 'realm-web'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import Loading from './Loading'
import { isAnon } from './utils'

const reviewSchema = yup.object().shape({
    review: yup.number().required()
})

function AddReview({mongoContext: {client, app, user}}) {
    const [loading, setLoading] = useState(false)
    const formik = useFormik({
        initialValues: {
            review: 0
        },
        validationSchema: reviewSchema,
        onSubmit: values => {
            console.log('Form data', values)
            submitHandler(values)
        }
    })
    const { id } = useParams()
    const navigate = useNavigate()

    if (isAnon(user)) {
        navigate('/')
    }

    function submitHandler (values) {
        console.log(BSON.ObjectID(app.currentUser.id))
        const rests = client.db('sample_restaurants').collection('restaurants') 
        rests.updateOne({"_id": BSON.ObjectID(id)}, {"$push": {"grades": {
            date: new Date(),
            score: values.review,
            user_id: BSON.ObjectID(app.currentUser.id)
        }}}).then (() => navigate('/'))
            .catch ((err) => {
    			alert(err)
    			setLoading(false)
			})
    }

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
            {loading && <Loading />}
                {!loading && (<div>
                    <h1>Submit Review</h1>
                    <label htmlFor="review">Review Score</label>
                    <input
                        type='number'
                        id='review'
                        name='review'
                        onChange={formik.handleChange}
                        value={formik.values.review}
                    />

                    <div className="text-center mt-2">
                        <button type='submit'>Submit</button>
                    </div>
                </div>)}
            </form>
        </div>
    )
}

export default AddReview