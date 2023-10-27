
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
export  const client=(loginToken) => new ApolloClient({
    link: new HttpLink({
      uri:  'http://cropfitindia.org/',
      headers: {
        authorization: loginToken, 
      },
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
    //   watchQuery: {
    //     fetchPolicy: 'no-cache',
    //     errorPolicy: 'ignore',
    //   },
    //   query: {
    //     fetchPolicy: 'no-cache',
    //     errorPolicy: 'all',
    //   },
    },
  })
 