import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { colors, fonts, images } from '../core';
import { AuthContext } from '../components/AuthContext';
import Loading from '../components/Loading';
import LanguageSelectionComponent from '../components/LanguageSelectionComponent';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const CONTINENT_QUERY = gql`
query { 
    getLanguages{ 
      Id 
      Name 
      Code 
      ImageURL
    } 
  } 
`;

const LanguageListScreen = ({ navigation, route }) => {

  const [languagesList, setLanguagesList] = React.useState([]);
  const [isFetch, setIsFetch] = React.useState(true);

  const {
    setLanguageList,
  } = useContext(AuthContext);
  useEffect(() => {

  }, [])

  const updateList = (list) => {
    console.log('listlistlistlistlist', list)
    setIsFetch(false);
    setLanguagesList(list.getLanguages);
    setLanguageList(list.getLanguages);
  }
  const updateValue = () => {

  }
  const onPressBackClick = () => {
    navigation.goBack();
  }
  const updateLanguageId = (languageId, language) => {
    var params = {
      languageId: languageId,
      language: language,
    }
    route.params.onReturn(params);
    navigation.goBack();
  }
  return (
    <View style={styles.container}>
      {(isFetch) && (
        <Query query={CONTINENT_QUERY}>
          {({ loading, error, data }) => {
            { console.log('datadatadatadata ---- ', data) }
            if (loading) {
              return <Loading />;
            }
            if (error) {
              setTimeout(async () => {
                setIsFetch(false);
              }, 100);
              return (
                <View />
              );
            }
            if (!data) {
              setTimeout(async () => {
                setIsFetch(false);
              }, 100);
              return <View />;
            }
            setTimeout(async () => {
              updateList(data);
            }, 100);
            return <View />;
          }}
        </Query>
      )}
      {(languagesList.length != 0) && (
        <LanguageSelectionComponent
          languageArray={languagesList}
          isEnterNumber={route?.params?.isEnterNumber}
          onPressBackClick={onPressBackClick}
          onPressContinue={updateLanguageId} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  view_inner: {
    width: '100%',
    height: '85%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'red',
  },

});

export default LanguageListScreen;

