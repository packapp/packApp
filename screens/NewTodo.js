import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ListItem, Button, CheckBox, Input } from 'react-native-elements'
import {createNewTodo} from '../store/todos'
import { connect } from 'react-redux';
import {fetchSingleTrip } from '../store/trip'

class NewTodo extends Component {
  constructor() {
    super()
    this.state = {
      todo: '',
      completed: false
    }
  }
  static navigationOptions = {
    title: 'Add a Todo',
  }
  handleOnPress(userId, location, todos) {
    this.props.createTodo({...this.state, userId, location, todos})

    this.props.fetchSingleTrip(location)
    this.props.navigation.navigate('SingleTrip');
  }
  render(){
    const userId = this.props.navigation.state.params.userId
    const location = this.props.navigation.state.params.location
    const todos = this.props.navigation.state.params.todos
    return(
      <View style={{marginTop: 50}}>
        <Input
          placeholder='todo'
          onChangeText={todo => this.setState({todo})}
          value={this.state.todo}
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
          onPress={() => this.handleOnPress(userId, location, todos)}
          title="Add Todo"
        />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createTodo: (todo) => dispatch(createNewTodo(todo)),
    fetchSingleTrip: (location) => dispatch(fetchSingleTrip(location))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(NewTodo);
