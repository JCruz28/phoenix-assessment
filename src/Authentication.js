import { useFormik } from 'formik'
import * as yup from 'yup'
import { useState, useEffect } from 'react'
import Loading from './Loading'
import { useNavigate } from 'react-router-dom'
import { isAnon } from "./utils"
import * as Realm from 'realm-web'

const userSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(8)
})

function Authentication ({mongoContext: {app, user, setUser}, type = 'login'}) {
    let navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: userSchema,
        onSubmit: values => {
            console.log('Form data', values)
            submitHandler(values)
        }
    })

    useEffect(() => {	
        if (!isAnon(user)) {
            navigate("/")
        }
    }, [navigate, user])

    async function submitHandler (values) {
        setLoading(true)
        if (type === 'create') {
            //create
            await app.emailPasswordAuth.registerUser(values.email, values.password);
        }

        //login user and redirect to home
        const credentials = Realm.Credentials.emailPassword(values.email, values.password);
        setUser(await app.logIn(credentials))
        setLoading(false)
    }

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                {loading && <Loading />}
                {!loading && (<div>
                    <h1>{type === 'login' ? 'Login' : 'Sign Up'}</h1>
                    <label htmlFor="email">Email</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                    

                    <label htmlFor="password">Password</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />

                    <div className="text-center mt-2">
                        <button type='submit'>Submit</button>
                    </div>
                </div>)}
            </form>
        </div>
    )
}

export default Authentication