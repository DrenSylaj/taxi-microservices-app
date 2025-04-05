import React from 'react'
import { useParams } from 'react-router-dom';
import DriverMap from './DriverMap';
import RideMap from './RideMap';

const UserPage = () => {
    const { userId } = useParams(); 
    const userIdNumber = parseInt(userId, 10); 

  return (
    <>
    <h1>User ID: {userId}</h1>
    {userIdNumber === 2 || userIdNumber === 4 ? <DriverMap userId={userIdNumber}/> : <RideMap userId={userIdNumber}/>}
  </>  )
}

export default UserPage