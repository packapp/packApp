import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ListItem, Button, CheckBox, Input } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { fetchTodos, markAsComplete } from '../store/todos';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Icon as Test} from 'react-native-elements'
import firebase from '../server/config';

export class Todos extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Todos',
      headerLeft:(
        <Button
        onPress={() => navigation.goBack()}
        type="clear"
        icon={<Test name='chevron-left' size={30} />}
        />
    ),
    };
  };
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('trips');
    this.unsubscribe = null;
    this.state = {
      checked: false,
      todos: [],
    };
  }
  componentDidMount() {
    const newTodos = this.props.navigation.state.params.todos;
    this.setState({ todos: newTodos });
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = async querySnapshot => {
    let todos = {};
    const location = this.props.navigation.state.params.location;
    await querySnapshot.forEach(doc => {
      if (doc.id === location) {
        todos = doc.data().todos;
      }
    });
    this.setState({
      todos: todos,
    });
  };

  render() {
    const userId = this.props.navigation.state.params.userId;
    const todos = this.state.todos;
    const user = this.props.user;
    const location = this.props.navigation.state.params.location;

    const todoFilter = (todosObj, userId) => {
      const todosPerPerson = [];
      const todoKeys = Object.keys(todosObj);
      todoKeys.forEach(key => {
        todosObj[key].forEach(obj => {
          if (obj.userId === userId) {
            todosPerPerson.push({ task: key, completed: obj.completed });
          }
        });
      });
      return todosPerPerson;
    };
    const keys = todos ? Object.keys(todos) : '';
    return (
      <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
        <ScrollView>
          <View>
            <Text
              style={{
                marginTop: 30,
                marginLeft: 20,
                marginBottom: 5,
                fontSize: 24,
                fontWeight: 'bold',
              }}
            >
              Pack Todos
            </Text>
            {keys ? (
              keys.map((elem, idx) => (
                <ListItem
                  key={idx}
                  leftIcon={{
                    name: 'check',
                    color: 'orange',
                    type: 'font-awesome',
                  }}
                  title={elem}
                  containerStyle={{ backgroundColor: '#fefcf5' }}
                  subtitle={
                    todos ? (
                      todos[elem].filter(elem => elem.completed === false)
                        .length + ' people need to complete this task'
                    ) : (
                      <Text>All done</Text>
                    )
                  }
                />
              ))
            ) : (
              <Text>No todos</Text>
            )}
          </View>
          <Text
            style={{
              marginTop: 30,
              marginLeft: 20,
              marginBottom: 2,
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            Your Todos
          </Text>
          {todoFilter(todos, userId).map((elem, idx) => (
            <CheckBox
              key={idx}
              title={elem.task}
              checked={elem.completed}
              checkedColor="#66cc66"
              containerStyle={{ backgroundColor: '#fefcf5' }}
              onPress={() =>
                this.props.markAsComplete(location, userId, elem.task, todos)
              }
            />
          ))}
          <View
            style={{
              marginLeft: 135,
              backgroundColor: '#66cc66',
              borderRadius: 50,
              width: 150,
              marginTop: 10,
            }}
          >
            <Button
              buttonStyle={{ backgroundColor: '#66cc66', borderRadius: 50 }}
              onPress={() =>
                this.props.navigation.navigate('NewTodo', {
                  userId: userId,
                  location: this.props.navigation.state.params.location,
                  todos: this.props.navigation.state.params.todos,
                  users: this.props.navigation.state.params.users,
                })
              }
              icon={<Icon name="check" size={15} color="white" />}
              title="Add Todo"
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapState = state => {
  return {
    user: state.user.user,
    todos: state.todos.todos,
  };
};

const mapDispatch = dispatch => {
  return {
    getTodos: (userId, tripName) => dispatch(fetchTodos(userId, tripName)),
    markAsComplete: (location, userId, task, todos) =>
      dispatch(markAsComplete(location, userId, task, todos)),
  };
};
export default connect(
  mapState,
  mapDispatch
)(Todos);
