import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { ListItem, Button, CheckBox, Input, Icon as Test } from 'react-native-elements';
import { createNewTodo } from '../store/todos';
import { connect } from 'react-redux';
import { fetchSingleTrip } from '../store/trip';
import MultiSelect from 'react-native-multiple-select';

class NewTodo extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Add a todo',
      headerLeft:(
        <Button
        onPress={() => navigation.goBack()}
        type="clear"
        icon={<Test name='chevron-left' size={30} />}
        />
    ),
    };
  };
  constructor() {
    super();
    this.state = {
      todo: '',
      completed: false,
      selectedItems: [],
    };
    this.onSelectedItemsChange = this.onSelectedItemsChange.bind(this);
  }
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
    const { selectedItems } = this.state;
    return (
      <View style={{flex: 1, alignContent: 'center'}}>
        <View style={{ marginTop: 40 }}>
          <TextInput
            placeholder="New Todo..."
            style={{fontSize: 24, marginLeft: 10}}
            onChangeText={todo => this.setState({ todo })}
            value={this.state.todo}
          />
        </View>
        <View style={{marginLeft: 10, marginRight: 10, marginTop: 15}}>
        <MultiSelect
          hideTags
          items={users}
          uniqueKey="id"
          fontSize={16}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={selectedItems}
          selectText="Assigned to"
          searchInputPlaceholderText="Search your pack..."
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
        </View>
        <View>
          {this.state.todo && this.state.selectedItems.length ? (
            <Button
            buttonStyle={{
              backgroundColor: '#ff9933',
              borderRadius: 50,
              width: 120,
              marginTop: 40,
              marginLeft: 10,
            }}
            onPress={() => this.handleOnPress(location, todos)}
            title="Add Todo"
          />
          ) : (
            <Button
            buttonStyle={{
              backgroundColor: '#ff9933',
              borderRadius: 50,
              width: 120,
              marginTop: 40,
              marginLeft: 10,
            }}
            title="Add Todo"
          />
          )}

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
