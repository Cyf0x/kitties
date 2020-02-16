import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import { connect } from 'react-redux'
import * as SQLite from "expo-sqlite";
import { Ionicons } from '@expo/vector-icons';
import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'
import Modal, { ModalContent, ModalTitle, ModalFooter, ModalButton, } from 'react-native-modals';
import KittiesModal from 'kitties/Components/Modal/kittiesModal.js'

const db = SQLite.openDatabase("db.db");

const appliColor = "#F7931A"
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4
const options = [
  'Cancel',
  {
    component: <Text style={{ color: 'orange', fontSize: 24 }}>Edit</Text>,
    height: 80,
  },
  {
    component: <Text style={{ color: 'orange', fontSize: 24 }}>Abandon</Text>,
    height: 80,
  },
]
const title = <Text style={{ color: 'crimson', fontSize: 18 }}>What action you want to take?</Text>


class KittiesList extends React.Component {

  state = {
    ModalState: [],
    defaultKittiesModal: false,
  };

  componentDidMount() {
    let query = "select * from cat";
    let params = [];
    db.transaction(tx => {
      tx.executeSql(
        query,
        params,
        (_, { rows: { _array } }) => {
          this._toggleFavorite(_array)
        },
        function(tx, err) {
          console.log("Erreur" + err);
        }
      );
    });
  }

showActionSheet = () => this.actionSheet.show()

getActionSheetRef = ref => (this.actionSheet = ref)

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

  _toggleFavorite(_array) {
    const action = { 
      type: "ADD_CAT", 
        value: _array
      }
    this.props.dispatch(action)
  }

 
  /* #############################################################################
Viewing cats in the application from the state
##############################################################################*/
flatlistCrypto = () => {

    const reduxSaveCat = this.props.myCats[0]
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
    }

renderItem(item) {
  return (
    <TouchableOpacity  
            onPress={() => {console.log(item)}}
            style={styles.box_icone}>
            <TouchableOpacity style={styles.action} onPress={() => {this.showActionSheet()}}>
                <Ionicons name="ios-add-circle-outline" size={30} color="#696969" />
            </TouchableOpacity>
            <Image style={styles.catPicture}  source={{uri: item.cat_image}}></Image>
            <Text style={styles.name}># {item.cat_id} - {item.cat_name} </Text>
    </TouchableOpacity>
  )
};
  
    render() {
        return (
            <View>
                {this.flatlistCrypto()}
                <ActionSheet
                  ref={this.getActionSheetRef}
                  title={title}
                  options={options}
                  cancelButtonIndex={CANCEL_INDEX}
                  destructiveButtonIndex={DESTRUCTIVE_INDEX}
                  onPress={(index) => console.log(index)}
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
    flex : 1,
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 15,
  },
})


const mapStateToProps = (state) => {
    return {
      imageUri: state.imageUri,
      myCats: state.myCats
    }
  }
  
  export default connect(mapStateToProps)(KittiesList)