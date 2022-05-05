import { useEffect } from "react"
import Loading from "./Loading"
import * as Realm from 'realm-web'
import { useNavigate } from "react-router-dom"
import { isAnon } from "./utils"

function LogOut ({mongoContext: {app, setUser, setClient}}) {
    let navigate = useNavigate()

    if (isAnon()) {
        navigate("/")
    }

    useEffect(() => {
        async function logout () {
            await app.currentUser.logOut()
            //login anon user
            setUser(await app.logIn(Realm.Credentials.anonymous()))
            //set new client
            setClient(app.currentUser.mongoClient('mongodb-atlas'))
        }

        logout()
    }, [app, setClient, setUser])

    return (
        <Loading />
    )
}

export default LogOut