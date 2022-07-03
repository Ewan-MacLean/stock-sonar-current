const Nav = ({authToken , setShowModal , showModal , setIsSignUp}) => {

    const handleClick = () => {
        setShowModal(true)
        setIsSignUp(false)
    }

    return (
        <nav>
            <div className="logo-container">
                <img className="logo" src="https://img.freepik.com/free-vector/green-radar-navy-submarine-sonar-with-aims-navigation-screen-illustration_53562-8136.jpg?w=2000" />
            </div>

            {!authToken && <button 
                className="nav-button"
                onClick={handleClick}
                disabled={showModal}    
            > Log in </button>}
        </nav>
    )
}

export default Nav