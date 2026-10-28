import { View, StyleSheet, Pressable,Text,ScrollView, Button } from 'react-native';
import Constants from 'expo-constants';
import { Link } from 'react-router-native'; // ← ① 追加する
import useAuthStorage from '../hooks/useAuthStorage';
import { ME } from '../graphql/queries'; 
import { useQuery,useApolloClient} from '@apollo/client/react';


const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
backgroundColor: '#24292e'
},
tab: {
    padding: 15,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const AppBar = () => {
const authStorage = useAuthStorage();  // ...
const apolloClient = useApolloClient();

// const token = authStorage.getAccessToken()

const { data } = useQuery(ME, {
    fetchPolicy: 'cache-and-network', // 🔥 指示にあったキャッシュ対策のポリシー
  }); //ヘッダー情報の付与が必要

const isSignIn = Boolean(data?.me)

const handleSignOut = async ()=>{
await authStorage.removeAccessToken()
await apolloClient.resetStore();
} 

  return(
  <View style={styles.container}>
          <ScrollView horizontal>
    <Link to="/" component={Pressable} style={styles.tab}>
<Text style={styles.text}>Repositories</Text>
</Link>
  
{isSignIn ? (<Pressable onPress={handleSignOut} style={styles.tab}>
<Text style={styles.text}>SignOut</Text>
</Pressable>
):(<Link to="/signin" component={Pressable} style={styles.tab}>
<Text style={styles.text}>SignIn</Text>
</Link>)}



  </ScrollView>

  </View>
  );
};

export default AppBar;