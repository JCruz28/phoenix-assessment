  import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom"
  import Home from "./Home"
  import { Container } from "react-bootstrap"
  import { useEffect, useState } from 'react'
  import * as Realm from 'realm-web'
  import MongoContext from './MongoContext'
  import Authentication from "./Authentication"
  import Navigation from "./Navigation"
  import LogOut from "./Logout" 
  import AddReview from "./AddReview"
  import DeleteRestaurant from "./DeleteRestaurant"
  import CreateRestaurant from "./CreateRestaurant"

  function App() {
    const [client, setClient] = useState(null)
    const [user, setUser] = useState(null)
    const [app, setApp] = useState(new Realm.App({id: process.env.REACT_APP_REALM_APP_ID}))

    useEffect(() => {
        async function init () {
            if (!user) {
                setUser(app.currentUser ? app.currentUser : await app.logIn(Realm.Credentials.anonymous()))
            }

            if (!client) {
                setClient(app.currentUser.mongoClient('mongodb-atlas'))
            }
        }

        init();
    }, [app, client, user])

    return (
      <Router>
          <Navigation user={user} />
          <MongoContext.Provider value={{app, client, user, setClient, setUser, setApp}}>
            <Container>
                <Routes>
                  <Route path="/signup" element={renderComponent(Authentication, {type: 'create'})} />
                  <Route path="/signin" element={renderComponent(Authentication)} />
                  <Route path="/logout" element={renderComponent(LogOut)} />
                  <Route path="/create" element={renderComponent(CreateRestaurant)} />
                  <Route path="/review/:id" element={renderComponent(AddReview)} />
                  <Route path="/delete/:id" element={renderComponent(DeleteRestaurant)} />
                  <Route path="/" element={renderComponent(Home)} />
                </Routes>
            </Container>
          </MongoContext.Provider>
      </Router>
    );
  }

  function renderComponent (Component, additionalProps = {}) {
    return <MongoContext.Consumer>{(mongoContext) => <Component mongoContext={mongoContext} {...additionalProps} />}</MongoContext.Consumer>
  }

  export default App;