import React, { Component } from "react";
import { StyleSheet, Text, View } from 'react-native';
import Navigation from 'kitties/Navigation/Navigation';
import 'react-native-gesture-handler'; 
import { Provider } from 'react-redux'
import Store from 'kitties/Reducers/Store/configureStore.js'
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

export default class App extends Component {
  state = {
    RecoverIdisEnable: true,

  };

/* #############################################################################
creation of the cat data-base for presitence implementation ####################
##############################################################################*/
  componentDidMount() {
      db.transaction(tx => {
        tx.executeSql(
          "create table if not exists cat (cat_id integer primary key not null, cat_biography text,cat_name text,cat_breed text,cat_coat text, cat_image text);"
        );
      });
  }


  render() {
    return (
      <Provider store={Store}>
        <Navigation  />
      </Provider>
    );
  }

}

/* #############################################################################
#####################    StyleSheet    #########################################
##############################################################################*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
