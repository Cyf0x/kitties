import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import axios from "axios";
import Modal, { ModalContent, ModalTitle, ModalFooter, ModalButton, } from 'react-native-modals';
import KittiesModal from 'kitties/Components/Modal/kittiesModal.js'
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux'
import * as SQLite from "expo-sqlite";

//Intialization of the database
const db = SQLite.openDatabase("db.db");

const appliColor = "#F7931A"

class FindNewKitties extends React.Component {

  state = {
      data: [],
      isLoading: false,
      ModalState: [],
      defaultKittiesModal: false,
  };

  componentDidMount() {
    this.requestApi()
  }

/* #############################################################################
Requets of the cryptokitties API to find new kitties to adopt. Part that needs #
to be checked regularly because it is sensitive in case of a change of  ########
external rules #################################################################
##############################################################################*/
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

/* #############################################################################
Parsing of the element returned by the api to adapt it to the format requested #
by the <Flatlist> object #######################################################
##############################################################################*/
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
      dict.push({"cat_id": element.id,"cat_name": myCatName[0], "cat_biography": element.bio, "cat_image": element.image_url_png, "cat_coat": element.color, "cat_breed": element.enhanced_cattributes[0].description})
    }
    this.setState({
      data : dict,
      isLoading: true,
    })
  }


/* #############################################################################
Display different cat from the object initialized in the state by the ##########
parsobject() function ##########################################################
##############################################################################*/
  flatlistCrypto = () => {
//display of chat if api returns object otherwise display of circular progress
    if (this.state.isLoading === true) {
    return (
      <View>
          <FlatList
          numColumns={2}
          data={this.state.data}
          keyExtractor={item => item.cat_id.toString()}
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
              <TouchableOpacity style={styles.action} onPress={() => {this.alert(item)}}>
                  <Ionicons name="ios-add-circle-outline" size={30} color="#696969" />
              </TouchableOpacity>
              <Image style={styles.catPicture}  source={{uri: item.cat_image}}></Image>
              <Text style={styles.name}># {item.cat_id} - {item.cat_name} </Text>
      </TouchableOpacity>

  )
  };

/* #############################################################################
Alert is triggered when the user wants to adopt a new cat ######################
##############################################################################*/ 
alert(item){
  console.log(item)
    return(
      Alert.alert(
        'Adopt a new cat ?',
        `are you really sure you want to adopt a new cat? Small cat doesn't mean small responsibility !`,      
        [
          {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => {this.insertNewCat(item)}},
        ],
        {cancelable: false},
      )
  
    )
  }


/* #############################################################################
Inserts the new cat into the local base for persistence and redirection ########
to retrieve the full value of the database. ####################################
##############################################################################*/
insertNewCat(item) {
  let query =
    "INSERT INTO cat (cat_biography, cat_name, cat_breed, cat_coat, cat_image)VALUES(?,?,?,?,?)";
  let params = [
    item.cat_biography, 
    item.cat_name,
    item.cat_breed,
    item.cat_coat,
    item.cat_image,
  ];
  db.transaction(tx => {
    tx.executeSql(
      query,
      params,
      (tx, results) => {
        console.log("Success", results);
        this.recoverUser()
      },
      function(tx, err) {
        console.log("Erreur" + err);
      }
    );
  });
}

/* #############################################################################
retrieve the entire database and redirect to the global redux state ############
initialization function ########################################################
##############################################################################*/
recoverUser() {
let query = "select * from cat";
let params = [];
db.transaction(tx => {
  tx.executeSql(
    query,
    params,
    (_, { rows: { _array } }) => {
      this.addCatToRedux(_array)
    },
    function(tx, err) {
      console.log("Erreur" + err);
    }
  );
});
}

/* #############################################################################
initialization function of the global redux state ##############################
##############################################################################*/
addCatToRedux(_array) {
console.log('#######################################',_array)
const action = { 
  type: "ADD_CAT", 
    value: _array
  }
this.props.dispatch(action)
} 


/* #############################################################################
################# modal management function  ###################################
##############################################################################*/

// modal mounting with parameter passing
  modalKittiesInfos = (item) => {
    this.setState({
      modalState: item,
      defaultKittiesModal: true,
    });
  }

// modal unmounting with parameter passing
  unmountKittiesModal = () => {
    this.setState({
      defaultKittiesModal: false
    })
  }

/*##############################################################################
###################            DISPLAY              ############################
###################            HTLM/JSX             ############################
##############################################################################*/

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
              <ModalContent style={{ flex: 1, backgroundColor: '#fff' }}>
                <KittiesModal content={[ this.state.modalState ]} />
              </ModalContent>
            </Modal>
          </View>
        </View>
    )
  }
}

/* #############################################################################
#####################    StyleSheet    #########################################
##############################################################################*/
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

/* #############################################################################
Connect to redux ###############################################################
##############################################################################*/
const mapStateToProps = (state) => {
  return {
    imageUri: state.imageUri,
    myCats: state.myCats
  }
}

export default connect(mapStateToProps)(FindNewKitties)