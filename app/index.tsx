import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router';

const index = () => {
    const isSignedIn=false;
    if(!isSignedIn){
        return <Redirect href="/(auth)/signup"/>
    }else
  return  <Redirect href="/(root)/book_ride"/>
  
}

export default index