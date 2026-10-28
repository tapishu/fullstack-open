import { useState, useEffect } from 'react';

import { useQuery } from '@apollo/client/react';
import { GET_REPOSITORIES } from '../graphql/queries'; 

const useRepositories = () => {

console.log("useQuery function:", useQuery);
  console.log("GET_REPOSITORIES:", GET_REPOSITORIES);

const { data, loading, error, refetch } = useQuery(GET_REPOSITORIES, {
    fetchPolicy: 'cache-and-network', // 🔥 指示にあったキャッシュ対策のポリシー
  });
return {
    repositories: data ? data.repositories : undefined,
    loading,
    refetch,
  };
  // const [repositories, setRepositories] = useState();
  // const [loading, setLoading] = useState(false);

  // const fetchRepositories = async () => {
  //   setLoading(true);

  //   // Replace the IP address part with your own IP address!
  //   const response = await fetch('http://192.168.1.33:5000/api/repositories');
  //   const json = await response.json();

  //   setLoading(false);
  //   setRepositories(json);
  // };

  // useEffect(() => {
  //   fetchRepositories();
  // }, []);

  // return { repositories, loading, refetch: fetchRepositories };
};

export default useRepositories;