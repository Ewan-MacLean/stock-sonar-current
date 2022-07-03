import TinderCard from 'react-tinder-card'
import { useState } from 'react'
import ChatContainer from '../components/ChatContainer'

const Dashboard = () => {

  // turn this in to a GET request in final version
    const characters = [
        {
          name: 'Shopify',
          url: 'https://s3.tradingview.com/u/uF11geHv_mid.png'
        },
        {
          name: 'Good Natured Products',
          url: 'https://s3.tradingview.com/u/uF11geHv_mid.png'
        },
        {
          name: 'MindMed',
          url: 'https://s3.tradingview.com/u/uF11geHv_mid.png'
        },
        {
          name: 'Suncor',
          url: 'https://s3.tradingview.com/u/uF11geHv_mid.png'
        },
        {
          name: 'TD Bank',
          url: 'https://s3.tradingview.com/u/uF11geHv_mid.png'
        }
      ]

    

    // const characters = db 
    const [lastDirection, setLastDirection] = useState()
    
    const swiped = (direction, nameToDelete) => {
        console.log('removing ' + nameToDelete)
        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    return (
        <div className="dashboard">
            <ChatContainer/>
            <div className="swipe-container">
                <div className="card-container">
                {characters.map((character) =>
                <TinderCard 
                className='swipe' 
                key={character.name} 
                onSwipe={(dir) => swiped(dir, character.name)} 
                onCardLeftScreen={() => outOfFrame(character.name)}>
                    <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
                    <h3>{character.name}</h3>
                    </div>
                </TinderCard>
                )}

                <div className='swipe-info'>
                    {lastDirection ? <p>You swiped {lastDirection}!</p> : <p/>}
                </div>

                </div>
            </div>    
        </div>
    )
}

export default Dashboard