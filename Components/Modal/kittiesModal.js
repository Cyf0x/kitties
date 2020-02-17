import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, FlatList, TouchableOpacity} from 'react-native';
import * as SQLite from "expo-sqlite";
import { color } from 'kitties/Functions/function'


const db = SQLite.openDatabase("db.db");
const colorInput = "#35819a";

export default class KittiesModal extends Component {

  state = {
    user_data: "",
    data: [],
    color: null,
  }

  componentDidMount() {
    const randomColor = color[Math.floor(Math.random() * color.length)];
    this.setState({color: randomColor,})
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


/*##############################################################################
###################            AFFICHAGE            ############################
###################            HTLM/JSX             ############################
##############################################################################*/
  render() {
    const name= this.props.content[0].cat_name;
    const bio = this.props.content[0].cat_biography
    const avatar = this.props.content[0].cat_image;
    const breed = this.props.content[0].cat_breed
    const color = this.props.content[0].cat_coat
    const id = this.props.content[0].cat_id
    return (
      <View style={{flex:1}}>
        <View  style={[styles.header,{backgroundColor: this.state.color}]}>
        <Text style={styles.pseudo}>{name}</Text>
        <Image

          source={{uri : avatar}}
          style={{flex: 1}}>
        </Image>


        </View>


        <View style={styles.bodyheader}>
          <Text style={styles.description}>
            <Text style={{fontWeight: "bold"}}>ID </Text>
            <Text>#{id}  </Text>
            <Text style={{fontWeight: "bold"}}>Breed </Text>
            <Text>{breed}  </Text>
            <Text style={{fontWeight: "bold"}}>Coat </Text>
            <Text>{color}</Text>
          </Text>
          {this.FlatListItemSeparator()}
          <Text style={[styles.description, {fontWeight: "bold", marginTop: 10,}]}>Description </Text>
          <Text style={styles.description}>{bio}</Text>
        </View>
      </View>
 
    );
  }
}

/* #############################################################################
#####################    StyleSheet    #########################################
##############################################################################*/

const styles = StyleSheet.create({
  header:{
    flex: 1,

  },
  pseudo:{
    fontSize:28,
    color:"white",
    fontWeight:'600',
    textAlign: 'center'
  },
  bodyheader:{
    marginTop: 5,
  },

  description:{
    marginTop: 5,
    fontSize:15,
    color: "#4F4F4F",
    marginLeft: 22,
    marginRight: 15,
    textAlign:  'justify',
    marginBottom: 6
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
  justifyContent: 'center'
  },
});
