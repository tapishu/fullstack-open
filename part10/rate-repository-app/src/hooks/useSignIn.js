import { useState, useEffect } from 'react';

import { useMutation,useApolloClient } from '@apollo/client/react';
import { USERLOGIN } from '../graphql/queries'; 
// import { useContext } from 'react';
// import AuthStorageContext from '../contexts/AuthStorageContext';

import useAuthStorage from '../hooks/useAuthStorage';

const useSignIn = () => {
    // const authStorage = useContext(AuthStorageContext);  // ...
//上記だと冗長になるから別でフック関数を作成
  const authStorage = useAuthStorage();  // ...
const apolloClient = useApolloClient(); // 

  const [mutate, result] = useMutation(USERLOGIN);

  const signIn = async ({ username, password }) => {
const response = await mutate({
  variables: { username, password },
})
const {data} = response
await authStorage.setAccessToken(data.authenticate.accessToken);
await apolloClient.resetStore();

return response;
  };

  return [signIn, result];
};


export default useSignIn;