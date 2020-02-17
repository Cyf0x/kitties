import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert, ImageBackground} from 'react-native';
import { connect } from 'react-redux'
import * as SQLite from "expo-sqlite";
import { Ionicons } from '@expo/vector-icons';
import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'
import Modal, { ModalContent, ModalFooter, ModalButton, } from 'react-native-modals';
import KittiesModal from 'kitties/Components/Modal/kittiesModal.js'
import { catPicture, color, colorInput} from 'kitties/Functions/function'

//Intialization of the database
const db = SQLite.openDatabase("db.db");

const appliColor = "#F7931A"

// Constant of dynamic management of the view/keyboard display
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4

// Constant initialization of the actionsheet element
const options = [
  'Cancel',
  {
    component: <Text style={{ color: 'orange', fontSize: 24 }}>Edit cat</Text>,
    height: 80,
  },
  {
    component: <Text style={{ color: 'orange', fontSize: 24 }}>abandons a cat</Text>,
    height: 80,
  },
]
const title = <Text style={{ color: 'crimson', fontSize: 18 }}>What action you want to take?</Text>


class KittiesList extends React.Component {

  state = {
    ModalState: [],
    defaultKittiesModal: false,
  };

/* #############################################################################
Recuperation of the local base when the component is mounted to initialize redux 
and the display of the different recorded chats ###############################
##############################################################################*/
  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists cat (cat_id integer primary key not null, cat_biography text,cat_name text,cat_breed text,cat_coat text, cat_image text);"
      );
    });
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
display management of choice window <actionsheet> ##############################
##############################################################################*/
showActionSheet = (item) => {
  this.setState({item: item})
  this.actionSheet.show(item)
} 

getActionSheetRef = ref => (this.actionSheet = ref)


/* #############################################################################
management of choices make by the user to redirect to edit or delete a cat from
user portfolio #################################################################
##############################################################################*/
handlePress = (index) => {
  if(index == 1){
    this.props.navigation.navigate('Editkitties', {'info': this.state.item})
  } else if(index == 2){
    this.deleteCat(this.state.item)
  }
}


/* #############################################################################
delete cat value into the local data-base  #####################################
##############################################################################*/
deleteCat(item) {
  let query = "DELETE FROM cat where cat_id=?";
  let params = [
    item.cat_id
  ];
  console.log(params)
  db.transaction(tx => {
    tx.executeSql(
      query,
      params,
      (tx, results) => {
        console.log("Success", results);
        this.recoverCat()
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
recoverCat() {
let query = "select * from cat";
let params = [];
db.transaction(tx => {
  tx.executeSql(
    query,
    params,
    (_, { rows: { _array } }) => {
      console.log(_array)
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
      user_interests: [],
      defaultKittiesModal: false
    })
  }


/* #############################################################################
Display different cat from the object initialized in the state by redux state ##
value  #########################################################################
##############################################################################*/
flatlistCat = () => {
    const reduxSaveCat = this.props.myCats[0]
    const randomElement = catPicture[Math.floor(Math.random() * catPicture.length)];
    if(reduxSaveCat.length > 0){
      return (
        <View>
            <FlatList
            numColumns={2}
            data={reduxSaveCat}
            keyExtractor={item => item.cat_id.toString()}
            renderItem={({ item }) => this.renderItem(item)}
            />
        </View>
      );
    } else {
      return(
        <View style={{alignItems: 'center'}}>
          <Text style={styles.noCatText}>No cat yet. Create a new cat or adopt a cat to see this section to be filled in.</Text>
          <ImageBackground style={styles.catPicture} source={{uri: 'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/1137672.png'}}></ImageBackground>
        </View>
      )
    }

    }

renderItem(item) {
  return (
    <TouchableOpacity  
            onPress={() => {this.modalKittiesInfos(item)}}
            style={styles.box_icone}>
            <TouchableOpacity style={styles.action} onPress={() => {this.showActionSheet(item)}}>
                <Ionicons name="ios-add-circle-outline" size={30} color="#696969" />
            </TouchableOpacity>
            <Image style={styles.catPicture}  source={{uri: item.cat_image}}></Image>
            <Text style={styles.name}># {item.cat_id} - {item.cat_name} </Text>
    </TouchableOpacity>
  )
};

/*##############################################################################
###################            DISPLAY              ############################
###################            HTLM/JSX             ############################
##############################################################################*/
  render() {
    console.log(this.props.myCats[0])
    return (
      <View>
        {this.flatlistCat()}
        <ActionSheet
          ref={this.getActionSheetRef}
          title={title}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={(index) => {this.handlePress(index)}}
        />
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
                text="back to portfolio"
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
            <KittiesModal content={[ this.state.modalState]} />
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
    nocatPicture:{
    width: 500,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noCatText:{
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 25,
    fontSize: 20,

    marginBottom: 25,
  },
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
    flex : 1,
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 15,
  },
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
  
  export default connect(mapStateToProps)(KittiesList)