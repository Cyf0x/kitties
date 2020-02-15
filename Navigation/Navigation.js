import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ImageBackground} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator, DrawerNavigatorItems, DrawerView } from 'react-navigation-drawer';
import { MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import KittiesList from 'kitties/Components/KittiesList';
import NewKitties from 'kitties/Components/NewKitties';
import FindNewKitties from 'kitties/Components/FindNewKitties'
import Camera from 'kitties/Components/Camera'


const backgroundColor = "#FFB6E2"

class NavigationDrawerStructure extends Component {

  //Structure for the navigatin Drawer
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          {/*Donute Button Image */}
          <Image
            source={require('kitties/Images/drawer.png')}
            style={{ width: 25, height: 25, marginLeft: 15,}}
          />
        </TouchableOpacity>
      </View>
    );
  }
}


// Page d'acceuil de l'application avant connexion
const KittiesList_StackNavigator = createStackNavigator({

    KittiesList: {
    screen: KittiesList,
    navigationOptions: ({ navigation }) => ({
        title: 'KittiesList',
        headerLeft: () => <NavigationDrawerStructure navigationProps={navigation} />,
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTintColor: 'white',
      }),
  },
})

const NewKitties_StackNavigator = createStackNavigator({

  NewKitties: {
    screen: NewKitties,
    navigationOptions: ({ navigation }) => ({
        title: 'NewKitties',
        headerLeft: () => <NavigationDrawerStructure navigationProps={navigation} />,
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTintColor: 'white',
      }),
  },
  Camera: {
    screen: Camera,
    navigationOptions: {
      title: 'Take a picture',
      headerStyle: {
        backgroundColor: "white",
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: 'black',
    }
  },

})

const FindNewKitties_StackNavigator = createStackNavigator({
    FindNewKitties: {
      screen: FindNewKitties,
      navigationOptions: ({ navigation }) => ({
        title: 'God mode',
        headerLeft: () => <NavigationDrawerStructure navigationProps={navigation} />,
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTintColor: 'white',
      }),
    },
  })

const DrawerNavigatorExample = createDrawerNavigator({

  Screen1: {
    screen: KittiesList_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Portfolio',
      drawerIcon: () => (
        <MaterialIcons name="account-circle" size={25} color="#F7931A" />
      )
    },
  },
  Screen2: {
    screen: NewKitties_StackNavigator,
    navigationOptions: {
      drawerLabel: 'God mode',
      drawerIcon: () => (
        <MaterialIcons name="account-circle" size={25} color="#F7931A" />
      )
    },
  },
  Screen3: {
    screen: FindNewKitties_StackNavigator,
    navigationOptions: {
      drawerLabel: 'Adopts a cat',
      drawerIcon: () => (
        <MaterialIcons name="account-circle" size={25} color="#F7931A" />
      )
    },
  },
},

  {
  initialRouteName: 'Screen2',
  // unmountInactiveRoutes: true,
  contentComponent: props => <DrawerContent {...props} />,
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',
}
);

const DrawerContent = (props) => (
  <View>

    <View
      style={{
        backgroundColor: backgroundColor,
        height: 160,
        alignItems: 'center',

      }}>
        

    <ImageBackground source={require('kitties/Images/banner.png')} style={{position: 'absolute', bottom:0, width: 280, height: 100, bottom: 0, }} >
     
      </ImageBackground>
      <Text style={{
    position: "absolute",
    textAlign: "center",
    fontWeight: "bold",
    marginTop:27,
    fontSize: 35,
    color: "white"
    }}>Kitties Portfolio</Text>
    </View>

    <DrawerNavigatorItems {...props} />
  </View>
)


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    headerContainer: {
        height: 150,
    },
    headerText: {
        color: '#fff8f8',
    },
    screenContainer: {
        paddingTop: 20,
        width: '100%',
    },
    screenStyle: {
        height: 30,
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    screenTextStyle:{
        fontSize: 20,
        marginLeft: 20,
        textAlign: 'center'
    },
    selectedTextStyle: {
        fontWeight: 'bold',
        color: '#00adff'
    },
    activeBackgroundColor: {
        backgroundColor: 'grey'
    }
});

export default createAppContainer(
    createSwitchNavigator(
      {
        App: DrawerNavigatorExample,
      },
      {
        initialRouteName: 'App',
      }
    )
  );

