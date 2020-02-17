import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ImageBackground} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator, DrawerNavigatorItems, DrawerView } from 'react-navigation-drawer';
import { MaterialIcons } from '@expo/vector-icons';
import KittiesList from 'kitties/Components/KittiesList';
import Editkitties from 'kitties/Components/Editkitties';
import NewKitties from 'kitties/Components/NewKitties';
import FindNewKitties from 'kitties/Components/FindNewKitties'
import Camera from 'kitties/Components/Camera'


const backgroundColor = "#F4A3D4"

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


/*##############################################################################
###################         STACKNAVIGATOR          ############################
###################                                 ############################
##############################################################################*/
const KittiesList_StackNavigator = createStackNavigator({
  KittiesList: {
    screen: KittiesList,
    navigationOptions: ({ navigation }) => ({
      title: 'Portfolio',
      headerLeft: () => <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: backgroundColor,
      },
      headerTintColor: 'white',
    }),
  },
  Editkitties: {
    screen: Editkitties,
    navigationOptions: {
      title: 'Edit cat mode',
      headerStyle: {
        backgroundColor: "white",
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: 'black',
    }
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

const NewKitties_StackNavigator = createStackNavigator({
  NewKitties: {
    screen: NewKitties,
    navigationOptions: ({ navigation }) => ({
        title: 'Create a new cat',
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
        title: 'Adopt a cat',
        headerLeft: () => <NavigationDrawerStructure navigationProps={navigation} />,
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTintColor: 'white',
      }),
    },
  })


/*##############################################################################
###################         DRAWERNAVIGATOR          ###########################
###################                                 ############################
##############################################################################*/  
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
      drawerLabel: 'Create a cat',
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
    initialRouteName: 'Screen1',
    contentComponent: props => <DrawerContent {...props} />,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
  }
);

/* #############################################################################
Style of the drawernavigatore header ###########################################
##############################################################################*/ 
const DrawerContent = (props) => (
  <View>
    <View
      style={{
        backgroundColor: backgroundColor,
        height: 160,
        alignItems: 'center',
      }}>     
      <ImageBackground source={require('kitties/Images/banner.png')} style={{position: 'absolute', bottom:0, width: 280, height: 100, bottom: 0, }}></ImageBackground>
      <Text style={{
        position: "absolute",
        textAlign: "center",
        fontWeight: "bold",
        marginTop:27,
        fontSize: 35,
        color: "white"}}>
          Kitties Portfolio
      </Text>
    </View>
    <DrawerNavigatorItems {...props} />
  </View>
)

/* #############################################################################
#####################    StyleSheet    #########################################
##############################################################################*/
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

/*##############################################################################
###################   SWITCHNAVIGATOR && Routing    ############################
###################                                 ############################
##############################################################################*/  
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

