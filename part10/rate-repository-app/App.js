import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Main from './src/components/Main';
import { NativeRouter } from 'react-router-native';
// import { ApolloProvider } from '@apollo/client';
import createApolloClient from './src/utils/apolloClient';
import { ApolloProvider } from '@apollo/client/react';
import AuthStorage from './src/utils/authStorage';
import AuthStorageContext from './src/contexts/AuthStorageContext';

console.log("StatusBar:", StatusBar);
console.log("Main:", Main);
console.log("NativeRouter:", NativeRouter);
console.log("ApolloProvider:", ApolloProvider);
console.log("createApolloClient:", createApolloClient);


const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);
//サーバーとの通信やキャッシュの保存・管理をすべて一手に引き受けている「司令塔

export default function App() {
  return (
    <>
        <StatusBar style="light" />
          <NativeRouter>
                  <ApolloProvider client={apolloClient}>
                              <AuthStorageContext.Provider value={authStorage}>

        <Main />
                  </AuthStorageContext.Provider>

              </ApolloProvider>

      </NativeRouter>
</>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
