import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ListItem, Button, CheckBox, Input } from 'react-native-elements';
import { createNewTodo } from '../store/todos';
import { connect } from 'react-redux';
import { fetchSingleTrip } from '../store/trip';
import MultiSelect from 'react-native-multiple-select';

class NewTodo extends Component {
  constructor() {
    super();
    this.state = {
      todo: '',
      completed: false,
      selectedItems: [],
    };
    this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
  }
  static navigationOptions = {
    title: 'Add a Todo',
  };
  handleOnPress(location, todos) {
    this.props.createTodo({ ...this.state, location, todos });

    this.props.fetchSingleTrip(location);
    this.props.navigation.navigate('SingleTrip');
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
  };

  render() {
    const userId = this.props.navigation.state.params.userId;
    const location = this.props.navigation.state.params.location;
    const todos = this.props.navigation.state.params.todos;
    const users = this.props.navigation.state.params.users.map(user => {
      if (user.userId === userId) {
        return { name: 'Me', id: userId };
      } else {
        return { name: `${user.firstName} ${user.lastName}`, id: user.userId };
      }
    });
    console.log(users);
    const { selectedItems } = this.state;
    return (
      <View>
        <View style={{ marginTop: 50 }}>
          <Input
            placeholder="todo"
            onChangeText={todo => this.setState({ todo })}
            value={this.state.todo}
            leftIcon={<Icon name="check" size={24} color="#66cc66" />}
          />
        </View>
        <MultiSelect
          hideTags
          items={users}
          uniqueKey="id"
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={selectedItems}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          onChangeInput={text => console.log(text)}
          altFontFamily="ProximaNova-Light"
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />
        <View>
          <Button
            buttonStyle={{
              backgroundColor: '#ff9933',
              borderRadius: 50,
              width: 120,
              marginTop: 50,
              marginLeft: 20,
            }}
            onPress={() => this.handleOnPress(location, todos)}
            title="Add Todo"
          />
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createTodo: todo => dispatch(createNewTodo(todo)),
    fetchSingleTrip: location => dispatch(fetchSingleTrip(location)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(NewTodo);
