import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import axios from "axios";
import Modal, { ModalContent, ModalTitle, ModalFooter, ModalButton, } from 'react-native-modals';
import KittiesModal from 'kitties/Components/Modal/kittiesModal.js'
import { Ionicons } from '@expo/vector-icons';

const appliColor = "#F7931A"

export default class FindNewKitties extends Component {

  state = {
      data: [],
      isLoading: false,
      ModalState: [],
      defaultKittiesModal: false,
  };

  componentDidMount() {
    this.requestApi()
  }


requestApi() {
  let url = `https://public.api.cryptokitties.co/v1/kitties?kittyId=2290-2312`
  let token = '9VN5Q1dK44pAAraqJJDTWabt6eaAsJm5a1JyeWnVCKQ'
  axios
  .get(url, {headers: { 'x-api-token': token }})
  .then(res => {
    if(res.status === 200){         
      this.setState({data: res.data.kitties}, () => { this.parsObject() })
    };
  })
  .catch(err => {
    console.log("erreur axios file kittieList.js", err)
  });
}

parsObject() {
  let dict = []
  for (const element of this.state.data) {
    const nameSplit = element.name.split(' ');
    const myCatName = [];
    if(nameSplit[0].length < 3){
      myCatName.push("Minou")
    } else {
      myCatName.push(nameSplit[0])
    }
    dict.push({"id": element.id,"name": myCatName[0], "bio": element.bio, "image": element.image_url_png, "color": element.color, "breed": element.enhanced_cattributes[0].description})
  }
  this.setState({
    data : dict,
    isLoading: true,
  })
}


/* #############################################################################
Viewing cats in the application from the state
##############################################################################*/
flatlistCrypto = () => {

  if (this.state.isLoading === true) {
  return (
    <View>
        <FlatList
        numColumns={2}
        data={this.state.data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => this.renderItem(item)}
        />
    </View>
  );
  } else {
    return(
      <View style={styles.ActivityIndicatorConteneur}>
          <ActivityIndicator
            color="#009688"
            size="large"
            style={styles.ActivityIndicatorStyle}
          />
      </View>
    )
  }
};

renderItem(item) {
  return (
    <TouchableOpacity  
             onPress={() => {this.modalKittiesInfos(item)}}
             style={styles.box_icone}>
            <TouchableOpacity style={styles.action} onPress={() => {this.alert()}}>
                <Ionicons name="ios-add-circle-outline" size={30} color="#696969" />
            </TouchableOpacity>
            <Image style={styles.catPicture}  source={{uri: item.image}}></Image>
            <Text style={styles.name}># {item.id} - {item.name} </Text>
    </TouchableOpacity>

)
};

alert(){
    return(
      Alert.alert(
        'Adopt a new cat ?',
        'If you confirm it will be automatically added and you will be able to find it and modify it in your portfolio !',      
        [
          {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      )
  
    )
  }


/* #############################################################################
################# modal management function  ###################################
##############################################################################*/

  // Récupération user.id dans le fichier de function et affichage modal profil
  modalKittiesInfos = (item) => {
    this.setState({
      modalState: item,
      defaultKittiesModal: true,
    });
  }

// Retrieving user.id from the function file and displaying modal profile
  unmountKittiesModal = () => {
    this.setState({
      user_interests: [],
      defaultKittiesModal: false
    })
  }

    render() {
        return (
            <View style={{flex:1}}>
              {this.flatlistCrypto()}


            <View style={{ flex: 1 }}>
            <Modal
              height={0.8}
              width={0.95}
              visible={this.state.defaultKittiesModal}
              rounded
              actionsBordered
              onTouchOutside={() => {
                this.unmountKittiesModal();
              }}

              footer={
                <ModalFooter>
                  <ModalButton
                    style={{height: 40}}
                    textStyle={{color: appliColor}}
                    text="Revenir à la page profil"
                    bordered
                    onPress={() => {
                      this.unmountKittiesModal();
                    }}
                    key="button-1"
                  />
                </ModalFooter>
              }
            >
              <ModalContent
                style={{ flex: 1, backgroundColor: '#fff' }}
              >
              <KittiesModal 
                content={[
                  this.state.modalState,
                  ]} />

              </ModalContent>
            </Modal>
            </View>

            </View>



            
        )
    }
}
const styles = StyleSheet.create({
  box_icone: {
    flex:1/2,
    backgroundColor: '#DCFAE1',
    borderRadius: 10,
    borderWidth: 4,
    borderColor: 'white',
  },
  action:{
    flex: 1,
    marginTop: 5,
    marginRight: 5,
    justifyContent: 'center', 
    alignItems: 'flex-end'
  },
  catPicture:{
    flex: 1, 
    width: 190,
    height: 190 ,
  },
  name:{
    position: 'absolute',
    left: 0, 
    right: 0, 
    bottom: 15,
    justifyContent: 'center',
    textAlign: 'center'
  },
  ActivityIndicatorStyle: {
    marginTop: '50%',
    justifyContent: 'center', 
    alignItems: 'center'
  }
})

