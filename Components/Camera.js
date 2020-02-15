import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import { Button } from "react-native-elements";

export default class UseCamera extends Component {

  state = {
  };

  async componentDidMount() {
      console.log('update camera')
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === 'granted' });
    }

    snap = async () => {
        if (this.camera) {
          let photo = await this.camera.takePictureAsync(
            {
              skipProcessing: true,
              fixOrientation: false,
              quality: 0.5,
              exif: true,
               },
          );
          photo.exif.newPosition = this.state.position
          this.setState({imageuri: photo.uri }, () => {this.props.navigation.navigate('NewKitties', ({imageuri: this.state.imageuri}))});
          };
      }
  

    render() {


    
        /* En fonction de l'etat de la camera declenche des actions
        (null, false, true) */
        const { hasCameraPermission } = this.state;
        const { position } = this.state;
    
        if (hasCameraPermission === null) {
          return <View />;
        } else if (hasCameraPermission === false) {
          return <Text>No access to camera</Text>;
        } else {
          if (position === 'PORTRAIT_UP' || position === 'PORTRAIT_DOWN') {
          return (
            /* ## Balise principal */
            <View style={styles.container}>
    
            <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
              <Camera
                style={styles.cameraview}
                type={this.state.type}
                ratio={this.state.ratio}
                ref={ref => { this.camera = ref; }}>
    
    
                    {/* Boutton prise de photo declenche la fonction snap */}
    
                  <View style={styles.bottombutton}>
                    <TouchableOpacity
                      onPress={() => this.snap(
                      )}>
                      <Ionicons name="ios-radio-button-on" size={80} color="white" />
                    </TouchableOpacity>
                  </View>
              </Camera>
            </View>
            );
          } else {
            return(
              <View style={styles.container}>
    
              <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
                <Camera
                  style={styles.cameraview}
                  type={this.state.type}
                  ratio={this.state.ratio}
                  ref={ref => { this.camera = ref; }}>
    
    
                      {/* Boutton prise de photo declenche la fonction snap */}
    
                    <View style={styles.bottombutton}>
                      <TouchableOpacity
                        onPress={() => this.snap()}>
                        <Ionicons name="ios-radio-button-on" size={80} color="white" />
                      </TouchableOpacity>
                    </View>
                </Camera>
              </View>
            )
          }
          }
        }
}
const styles = StyleSheet.create({
    statusBar: {
      backgroundColor: "#C2185B",
      height: Constants.statusBarHeight,
    },
    container:  {
      flex: 1,
    },
  
    cameraview: {
      flex: 1,
    },
  
    bottombutton: {
      flex: 1,
      marginBottom: 15,
      justifyContent: 'flex-end',
      alignItems: 'center',
    }
  });
  
