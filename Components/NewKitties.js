import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = [
  'Cancel',
  {
    component: <Text style={{ color: 'orange', fontSize: 24 }}>Camera</Text>,
    height: 80,
  },
  {
    component: <Text style={{ color: 'orange', fontSize: 24 }}>Browser</Text>,
    height: 80,
  },
  {
    component: <Text style={{ color: 'orange', fontSize: 24 }}>Random Cat</Text>,
    height: 80,
  },
]
const title = <Text style={{ color: 'crimson', fontSize: 18 }}>Which one do you like?</Text>
const catPicture = [
'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1137652.png',
'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1137662.png',
'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1137672.png',
'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1835993.png',
'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1836001.png',
'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1825688.png',
'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/221.png',
'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1825314.png',
'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1338265.png',
'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1143336.png',
'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1180980.png',
]

const color = [
  '#ED8970',
  '#EDB970',
  '#EDEA70',
  '#A2ED70',
  '#73ED70',
  '#70EDA1',
  '#70EDE0',
  '#70BFED',
  '#70A5ED',
  '#707BED',
  '#9D70ED',
  '#DB70ED',
  '#ED70E1',
  '#ED70AB',
  '#ED708C',
]

export default class NewKitties extends Component {
  state = {
    selected: 1,
    image: 'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1180980.png',
    displayImage: false,
    color: null,
  }

  componentDidMount() {
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      color: "#696969"
    });

    console.log(result);

    if (!result.cancelled) {
      console.log('uri : ', result.uri)
      this.setState({image: result.uri }, () => {this.props.navigation.navigate('NewKitties', ({image: this.state.image}))});
    }
  };

  showActionSheet = () => this.actionSheet.show()

  getActionSheetRef = ref => (this.actionSheet = ref)

  handlePress = (index) => {
    console.log(index)
    console.log(typeof index)
    if(index == 1){
      this.props.navigation.navigate('Camera')

    } else if(index == 2){
      this.getPermissionAsync();
      this._pickImage()

    } else {
      console.log('randomCat')
      const randomElement = catPicture[Math.floor(Math.random() * catPicture.length)];
      const randomColor = color[Math.floor(Math.random() * color.length)];
      this.setState({
        image: randomElement,
        color: randomColor,
        displayImage: true})

    }

  }

  addNewImage() {

      if(this.state.displayImage === true){
        return(
        <TouchableOpacity  
          onPress={() => {this.showActionSheet()}}
          style={[styles.box_icone, {backgroundColor: this.state.color}]}>
        <Ionicons style={styles.action} name="ios-add-circle-outline" size={40} color={"#696969"} />
        <Image style={styles.image}  source={{uri: this.state.image}}></Image>
      </TouchableOpacity>
      ) 
      
    } else {
    return(
      <TouchableOpacity  
        onPress={() => {this.showActionSheet()}}
        style={styles.box_icone}>
      <Ionicons style={styles.action} name="ios-add-circle-outline" size={40} color="#696969" />
      <FontAwesome style={styles.FontAwesome} name="image" size={200} color="#70B0ED" />
    </TouchableOpacity>
    )
  }
  }

  render() {
    const { selected } = this.state
    const selectedText = options[selected].component || options[selected]

    return (
      <View style={{flex: 1}}>
        {this.addNewImage()}




        <ActionSheet
          ref={this.getActionSheetRef}
          title={title}
          message="Creating a new cat requires passion. How do you want to proceed?"
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={(index) => this.handlePress(index)}
        />
      </View>
    )
  }
}



const styles = StyleSheet.create({
    box_icone: {
    flex:1/3,
    margin: 6,
    backgroundColor: '#E2E0E2',
    borderRadius: 10,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  action:{
    position: "absolute",
    top: 5,
    right: 5,
  },
  image:{
    flex: 1, 
    width: 280,
    height: 280 ,
  },
  button: {
      backgroundColor: "#235566",
      marginTop: 50,
      borderRadius:10,
    },
})

