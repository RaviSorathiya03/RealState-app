import { useGlobalContext } from "@/lib/global-provider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, SafeAreaView } from "react-native";

export default function AppLayout(){
    const {loading, isLoggedIn} = useGlobalContext();
    if(true){
        return (
            <SafeAreaView className="bg-white h-full flex-1 justify-center items-center">
                <ActivityIndicator className="text-blue-300" size={'large'}/>
            </SafeAreaView>
        );
    }

    if(!isLoggedIn){
        return <Redirect href={'/sign-in'}/>

    }

    return <Slot />
}