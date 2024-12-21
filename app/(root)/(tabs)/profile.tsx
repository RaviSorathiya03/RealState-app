import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import icons from '@/constants/icons'
import images from '@/constants/images'
import { settings } from '@/constants/data'
import { useGlobalContext } from '@/lib/global-provider'
import { logout } from '@/lib/appwrite'

interface SettingItemProp{
  icon: any
  title: string
  onPress?: ()=>void
  textStyle?: any
  showArrow?: boolean
}

const SettingItem = ({icon, title, onPress, textStyle, showArrow=true}:SettingItemProp)=>(
  <TouchableOpacity className='flex flex-row items-center justify-between py-3' onPress={onPress}>
    <View className='flex flex-row items-center gap-3'>
      <Image source={icon} className='size-6'/>
      <Text className={`text-lg font-rubik-medium text-black ${textStyle}`}>{title}</Text>
    </View>
    {showArrow && <Image source={icons.rightArrow} className='size-5'/>}
  </TouchableOpacity>
)

const Profile = () => {

  const {user, refetch} = useGlobalContext() 

  const handleLogout = async()=>{
    const result = await logout();

    if(result){
      Alert.alert('Success', 'You have been logged out successfully.');
      refetch();
    } else{
      Alert.alert('Error', 'Failed to log out.');
    }

  }

  return (
    <SafeAreaView className='h-full bg-white'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName='pb-32 px-7'
      >
        <View className='flex flex-row items-center justify-between mt-5'>
          <Text className='text-xl font-rubik-bold'>Profile</Text>
          <Image source={icons.bell} className='size-5'/>
        </View>
        <View className='flex-row justify-center flex mt-5'>
          <View className='flex flex-col items-center relative mt-5'>
            <Image source={{uri: user?.avatar}} className='size-44 relative rounded-full'/>
            <TouchableOpacity className='absolute bottom-12 right-2'>
              <Image source={icons.edit} className='size-9'/>
             
            </TouchableOpacity>
            <Text className='text-2xl font-rubik-bold mt-2'>
                  {user?.name}
              </Text>
          </View>
        </View>
        <View className='flex flex-col mt-10'>
          <SettingItem icon={icons.calendar} title='My Bookings'/>
          <SettingItem icon={icons.wallet} title='Payments'/>
        </View>
        <View className='flex flex-col mt-5 border-t pt-5 border-grey-100'>
          {settings.slice(2).map((item, index)=>{
            return (
              <SettingItem
                key={index}
                {...item}
              />
            );
          })}
        </View>
        <View className='flex flex-col mt-5 border-t pt-5 border-grey-300'>
          <SettingItem icon={icons.logout} title='Logout' textStyle={'text-danger'} showArrow={false} onPress={handleLogout}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile