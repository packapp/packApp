import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';

export class SingleTodos extends Component {
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
                        color: 'orange',
                        type: 'font-awesome',
                      }
                    : {
                        name: 'remove',
                        color: 'green',
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
