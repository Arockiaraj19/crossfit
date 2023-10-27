import { useLazyQuery } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';

export const fetchDataFromServer = (fetchQuery) => {
 const [getData,{ loading, error, data }] = useLazyQuery(fetchQuery)
 return {getData, loading, error, data}
}

export const sendDataToServer = (query) => {
    const [uploadData, { loading, error, data }] = useMutation(query)
    return {uploadData, loading, error, data}
}
