import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ListItem, Button, CheckBox, Input } from 'react-native-elements'

export default class NewTodo extends Component {
  static navigationOptions = {
    title: 'Todos'
  }
  render(){
    return(
      <View style={{marginTop: 50}}>
        <Input
          placeholder=' Describe this todo'
          leftIcon={
            <Icon
              name='check'
              size={24}
              color='#66cc66'
            />
          }
        />
        <Button
          buttonStyle={{backgroundColor:'#ff9933', borderRadius: 50, width: 120, marginTop: 50, marginLeft: 20}}
          // onPress={() => this.props.navigation.navigate('NewTodo')}
          title="Add Todo"
        />
      </View>
    );
  }
}
