import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, FlatList, TouchableOpacity} from 'react-native';
import * as SQLite from "expo-sqlite";


const db = SQLite.openDatabase("db.db");
const colorInput = "#35819a";

export default class KittiesModal extends Component {

  state = {
    user_data: "",
    data: [],
  }

  componentDidMount() {
    console.log(this.props.content)
    
  }


  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          marginLeft: 25,
          width: "87%",
          backgroundColor: "#D8D8D8",
        }}
      />
    );
  }

  /* #############################################################################
Affichage de la liste de tag dans l'application à partir du state initialisé
dans la fonction precedente
##############################################################################*/
flatlistCrypto = (user_interests, isLoading) => {
  if (isLoading === true) {
  return (
    <View>
    </View>
  );
  } else {
    return(
        <View>
        <ActivityIndicator
          color="#009688"
          size="large"
          style={styles.ActivityIndicatorStyle}
        />
    </View>
    )
  } 
}

/*##############################################################################
###################            AFFICHAGE            ############################
###################            HTLM/JSX             ############################
##############################################################################*/
  render() {
    const user_firstname = this.props.content[0].name;
    const bio = this.props.content[0].bio
    const avatar = this.props.content[0].image;
    const breed = this.props.content[0].ragamuffin
    const color = this.props.content[0]. color
    const id = this.props.content[0].id
    return (
      <View style={{flex:1}}>
        <ImageBackground
          source={{uri : this.props.content[0].image}}
          style={styles.header}>
          <Text style={styles.pseudo}>{user_firstname}</Text>
        </ImageBackground>


            <View style={styles.bodyheader}>
              <Text style={styles.description}>{bio}
             </Text>
            </View>
        </View>
 
    );
  }
}

/* #############################################################################
#####################    Feuille de style    ################################### 
##############################################################################*/

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#00BFFF",
    height:300,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 63,
    borderWidth: 4,
    paddingBottom: 5,
    backgroundColor: 'white',
    borderColor: "white",
    alignSelf:'flex-start',
    position: 'absolute',
    marginTop:15,
    marginLeft: 18
  },
  pseudo:{
    fontSize:28,
    color:"white",
    fontWeight:'600',
  },
  bodyheader:{

    marginTop: 5,
  },
  logo:{
    alignSelf:'flex-start',    paddingBottom: 5,
    position: 'absolute',
    marginTop: 29,
    marginLeft: 18
  },
  description:{
    fontSize:14,
    color: "#696969",
    marginLeft: 22,
    marginRight: 15,
    textAlign:  'justify',
    marginBottom: 6
  },
  tag: {
    flex: 1,
    marginTop: 6,
    fontSize:17,
    justifyContent: 'center',
    color: colorInput,
  },
  flatTrue: {
    backgroundColor: '#F48C30',
    padding: 20,
    marginVertical: 3,
    marginHorizontal: 5,
    width: 100,
    borderRadius:7,
    elevation:5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  FlatFalse: {
    backgroundColor: '#C0BFBF',
    padding: 20,
    marginVertical: 3,
    marginHorizontal: 5,
    width: 100,
    borderRadius:7,
    elevation:5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  itemTitle: {
    textAlign: 'center',
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold'
  },
  progress: {
  marginTop: 25,
  alignItems: 'center',
  },
});
