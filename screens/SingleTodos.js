import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem, Button, Icon } from 'react-native-elements';

export class SingleTodos extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.name}'s todos`,
      headerLeft: (
        <Button
          onPress={() => navigation.goBack()}
          type="clear"
          icon={<Icon name="chevron-left" size={30} />}
        />
      ),
    };
  };
  render() {
    const todos = this.props.navigation.state.params.todos || [];
    console.log(todos);
    return (
      <View>
        {todos.length > 1 ? (
          todos.map((todo, idx) => {
            return (
              <ListItem
                key={idx}
                leftIcon={
                  todo.complete
                    ? {
                        name: 'check',
                        color: '#66cc66',
                        type: 'font-awesome',
                      }
                    : {
                        name: 'remove',
                        color: '#ff9933',
                        type: 'font-awesome',
                      }
                }
                title={todo.taskName}
                containerStyle={{ backgroundColor: '#fefcf5' }}
              />
            );
          })
        ) : (
          <Text
            style={{ fontSize: 30, fontFamily: 'Verdana', textAlign: 'center' }}
          >
            {' '}
            No todos yet!
          </Text>
        )}
      </View>
    );
  }
}

export default SingleTodos;
