import React from 'react'
import { useParams } from 'react-router-dom';
import DriverMap from './components/map/DriverMap';
import RideMap from './components/map/RideMap';

const UserPage = () => {
    const { userId } = useParams(); 
    const userIdNumber = parseInt(userId, 10); 

  return (
    <>
    {userIdNumber === 2 || userIdNumber === 4 ? <DriverMap userId={userIdNumber}/> : <RideMap userId={userIdNumber}/>}
  </>  )
}

export default UserPage