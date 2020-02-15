import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { connect } from 'react-redux'

class KittiesList extends React.Component {

  state = {
  };

  textUri(){
        return(
            <Text>{this.props.imageUri}</Text>
        )
  }



    render() {
        return (
            <View>
                {this.textUri()}
            </View>
        )
    }
}
const styles = StyleSheet.create({

})


const mapStateToProps = (state) => {
    return {
      imageUri: state.imageUri
    }
  }
  
  export default connect(mapStateToProps)(KittiesList)