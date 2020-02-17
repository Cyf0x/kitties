import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image,  TextInput, Keyboard, Animated, Dimensions, UIManager } from 'react-native'
import { ActionSheetCustom as ActionSheet } from 'react-native-custom-actionsheet'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Button } from "react-native-elements";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import * as SQLite from "expo-sqlite";
import { catPicture, color, colorInput} from 'kitties/Functions/function'

//Intialization of the database
const db = SQLite.openDatabase("db.db");

// Constant of dynamic management of the view/keyboard display
const { State: TextInputState } = TextInput;
const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4

// Constant initialization of the actionsheet element
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



class NewKitties extends React.Component {
  state = {
    selected: 1,
    shift: new Animated.Value(0),
    image: '',
    displayImage: false,
    color: null,
    namePlaceHolder: "What is the name of your cat ?",
    breedPlaceHolder: "Give information of your kitties breed",
    coatPlaceHolder: "What is coat color of your pet ?",
    biographyPlaceHolder: `Say a few words about your cat's main characteristics and introduce his passions.`,
    biography: '',
    name: '',
    breed: '',
    coat: '',
  }

  
  componentDidMount() {
    // dynamic management view and keyboard mounting
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }

  componentWillUnmount() {
    // dynamic management view and keyboard unmounting
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

/* #############################################################################
display & setstate of the selected image at the update of the global redux state
##############################################################################*/
  componentDidUpdate(previousProps) {
    // 
    const randomColor = color[Math.floor(Math.random() * color.length)];
    if (previousProps.imageUri[0] !== this.props.imageUri[0]) {
      this.setState({
        image: this.props.imageUri[0],
        color: randomColor,
        displayImage: true,
      })
      }
    }


/* #############################################################################
permission management of the camera element and redirect to the camera component
##############################################################################*/
getPermissionAsyncCamera = async () => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA);
  this.setState({ hasCameraPermission: status === 'granted' }, () => { this.props.navigation.navigate('Camera', {'navigation': 'NewKitties', 'methode': 'ADD_IMAGE'})});
}

/* #############################################################################
permission management of the pickler image element #############################
##############################################################################*/
getPermissionAsyncRoll = async () => {
  if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    } else {
      this._pickImage()
    }
  }
  this._pickImage()
}


/* #############################################################################
Search image function in the phone gallery #####################################
##############################################################################*/
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      color: "#696969"
    });

    if (!result.cancelled) {
      const action = { type: "ADD_IMAGE", value: result.uri }
      this.props.dispatch(action)
      this.props.navigation.navigate('NewKitties')
    }
  };

/* #############################################################################
display separator between elements in the render ###############################
##############################################################################*/
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
display management of choice window <actionsheet> ##############################
##############################################################################*/

  showActionSheet = () => this.actionSheet.show()
  getActionSheetRef = ref => (this.actionSheet = ref)


/* #############################################################################
management of choices make by the user to redirect to camera or ################
image selection in the gallery #################################################
##############################################################################*/
  handlePress = (index) => {
    if(index == 1){
      this.getPermissionAsyncCamera()

    } else if(index == 2){
      this.getPermissionAsyncRoll();

    } else if(index == 3) {
      const randomElement = catPicture[Math.floor(Math.random() * catPicture.length)];
      const randomColor = color[Math.floor(Math.random() * color.length)];
      const action = { type: "ADD_IMAGE", value: randomElement }
      this.props.dispatch(action)
      this.props.navigation.navigate('NewKitties')
    }
  }

/* #############################################################################
New image adding function conditioned by the presence or not of an image #######
##############################################################################*/
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
      <FontAwesome style={styles.FontAwesome} name="image" size={200} color="#709FED" />
    </TouchableOpacity>
    )
  }
  }


/* #############################################################################
Inserts the new cat into the local base for persistence and redirection ########
to retrieve the full value of the database. ####################################
##############################################################################*/
insertUser() {
    let query =
      "INSERT INTO cat (cat_biography, cat_name, cat_breed, cat_coat, cat_image)VALUES(?,?,?,?,?)";
    let params = [
      this.state.biography,
      this.state.name,
      this.state.breed,
      this.state.coat,
      this.state.image,
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
        this._toggleFavorite(_array)
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
_toggleFavorite(_array) {
  const action = { 
    type: "ADD_CAT", 
      value: _array
    }
  this.props.dispatch(action)
  this.setState({
    image: "",
    biography: "",
    name: "",
    breed: "",
    coat: "",
    displayImage: false
  }, () => { })

} 



/* #############################################################################
Check that all fields are filled in before you can register a new chat #########
##############################################################################*/
  canBeSubmit() {
    const { biography, name, coat, breed } = this.state;
    return (
      biography.length > 0 &&
      name.length > 0 &&
      coat.length > 0 &&
      breed.length > 0
    );
}
/*##############################################################################
###################            DISPLAY              ############################
###################            HTLM/JSX             ############################
##############################################################################*/
  render() {
    const { shift } = this.state;
    const isEnabled = this.canBeSubmit()

    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        style={{flex: 1}}
        enableOnAndroid={true}
        scrollEnabled={true}
      >

        <Animated.View style={[styles.container, { transform: [{translateY: shift}] }]}>
          {this.addNewImage()}


          <View style={{flex: 1}}>
              <Text style = {styles.text}>Biography</Text>
              <TextInput 
                style = {styles.input}
                placeholder= {this.state.biographyPlaceHolder}
                maxLength={200}
                placeholderTextColor = {colorInput}
                multiline={true}
                autoCapitalize = "none"
                onChangeText={(summary) => this.setState({biography: summary})}
                value={this.state.biography}
                />
              {this.FlatListItemSeparator()}

              <Text style = {styles.text}>Name</Text>
              <TextInput 
                style = {styles.input}
                underlineColorAndroid = "transparent"
                placeholder= {this.state.namePlaceHolder}
                placeholderTextColor = {colorInput}
                autoCapitalize = "none"
                onChangeText = {(text) => this.setState({name: text})}
                value={this.state.name}
              />
              {this.FlatListItemSeparator()}

              <Text style = {styles.text}>Breed</Text>
              <TextInput style = {styles.input}
                underlineColorAndroid = "transparent"
                placeholder= {this.state.breedPlaceHolder}
                placeholderTextColor = {colorInput}
                autoCapitalize = "none"
                onChangeText = {(text) => this.setState({breed: text})}
                value={this.state.breed}
              />
              {this.FlatListItemSeparator()}

              <Text style = {styles.text}>Coat</Text>
              <TextInput style = {styles.input}
                underlineColorAndroid = "transparent"
                placeholder= {this.state.coatPlaceHolder}
                placeholderTextColor = {colorInput}
                autoCapitalize = "none"
                onChangeText = {(text) => this.setState({coat: text})}
                value={this.state.coat}
              />
              {this.FlatListItemSeparator()}
          </View>
          <View style={styles.footer}>
            <Button
              disabled={!isEnabled}
              title="Create new cat"
              buttonStyle={styles.button}
              onPress={() => {this.insertUser()}}
            />
          </View>
            
          <ActionSheet
            ref={this.getActionSheetRef}
            title={title}
            message="Creating a new cat requires passion. How do you want to proceed?"
            options={options}
            cancelButtonIndex={CANCEL_INDEX}
            destructiveButtonIndex={DESTRUCTIVE_INDEX}
            onPress={(index) => this.handlePress(index)}
          />
          </Animated.View>
      </KeyboardAwareScrollView>
    );
  }

/* #############################################################################
Keyboard display managementworks with </Animated.View> to leave space above the 
keyboard and see the field ####################################################
##############################################################################*/
  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
      if (gap >= 0) {
        return;
      }
      Animated.timing(
        this.state.shift,
        {
          toValue: gap,
          duration: 500,
          useNativeDriver: true,
        }
      ).start();
    });
  }

  handleKeyboardDidHide = () => {
    Animated.timing(
      this.state.shift,
      {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }
    ).start();
  }
}

/* #############################################################################
#####################    StyleSheet    #########################################
##############################################################################*/
const styles = StyleSheet.create({
  box_icone: {
    flex:1/2,
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
  bodyContainer: {
    flex: 1,

  },
  text: {
    marginLeft: 25,
    marginTop: 5,
    fontSize:18,
    paddingBottom: 8,
    fontWeight: "bold"
  },
  input: {
    marginLeft: 25,
    marginTop: 5,
    marginBottom: 10,
    fontSize:17,
    textAlignVertical: 'top',
    color: colorInput,
  },
  button: {
    alignSelf: 'center',
    width: '80%',
    backgroundColor: "#709FED",
    borderRadius:10,
    marginTop: 20,
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

export default connect(mapStateToProps)(NewKitties)