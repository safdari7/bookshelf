import React from 'react'
import {createRoot} from 'react-dom/client'
import {Logo} from 'components/logo'
import {Dialog} from '@reach/dialog'
import '@reach/dialog/styles.css'

function LoginForm({onSubmit, buttonText}) {
  function submitHandler(event) {
    event.preventDefault()
    const {username, password} = event.target.elements
    onSubmit({
      username: username.value,
      password: password.value,
    })
  }

  return (
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </div>
      <button type="submit">{buttonText}</button>
    </form>
  )
}

function App() {
  const [openDialog, setOpenDialog] = React.useState('none')

  function login(formData) {
    console.log(formData)
  }

  function register(formData) {
    console.log(formData)
  }
  return (
    <>
      <Dialog
        aria-label="Login form"
        isOpen={openDialog === 'login'}
        onDismiss={() => setOpenDialog('none')}
      >
        <button className="close-button" onClick={() => setOpenDialog('none')}>
          <span aria-hidden>Close</span>
        </button>
        <h3>Login</h3>
        <LoginForm onSubmit={login} buttonText="Login" />
      </Dialog>
      <Dialog
        aria-label="Login form"
        isOpen={openDialog === 'register'}
        onDismiss={() => setOpenDialog('none')}
      >
        <button className="close-button" onClick={() => setOpenDialog('none')}>
          <span aria-hidden>Close</span>
        </button>
        <h3>Register</h3>
        <LoginForm onSubmit={register} buttonText="Register" />
      </Dialog>
      <Logo />
      <h1>Bookshelf</h1>
      <div>
        <button onClick={() => setOpenDialog('login')}>Login</button>
      </div>
      <div>
        <button onClick={() => setOpenDialog('register')}>Register</button>
      </div>
    </>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
