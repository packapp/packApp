import React, {Component} from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ListItem, Button, CheckBox, Input } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import {fetchTodos} from '../store/todos'
import Icon from 'react-native-vector-icons/FontAwesome';

export class Todos extends Component {
  constructor() {
    super()
    this.state = {
      checked: false
    }
  }
  componentDidMount() {
    // this.props.getTodos(userId, 'Bora Bora')
  }
  render(){
    const userId = this.props.navigation.state.params.userId
    const {todos} = this.props.navigation.state.params
    const user = this.props.user

    const todoFilter = (todosObj, userId) => {
      const todosPerPerson = [];
      const todoKeys = Object.keys(todosObj);
      todoKeys.forEach(key => {
          todosObj[key].forEach(obj => {
            if(obj.userId === userId) {
              todosPerPerson.push(key)
              if (obj.completed === true && !this.state[key]) {
                this.state[key] = true
              } else if (!this.state[key]) {
                this.state[key] = false
              }
            }
          })
        })
        return todosPerPerson;
    };
    console.log(this.state)
    const keys = todos ? Object.keys(todos) : ''
    return(
      <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
        <ScrollView>
          <View>
          <Text style={{marginTop: 30, marginLeft: 20, marginBottom: 5, fontSize: 24, fontWeight: 'bold'}}>Pack Todos</Text>
            {keys ? keys.map((elem, idx) => (
              <ListItem key={idx}
                leftIcon={{name: 'check', color: 'orange', type: 'font-awesome'}}
                title={elem}
                containerStyle={{backgroundColor: '#fefcf5'}}
                subtitle={ todos ? todos[elem].filter((elem) => (
                  elem.completed === false
                )).length + ' people need to complete this task' : <Text>All done</Text>}
                />
            )) : <Text>No todos</Text>}
          </View>
          <Text style={{marginTop: 30, marginLeft: 20, marginBottom: 2, fontSize: 24, fontWeight: 'bold'}}>Your Todos</Text>
          {todoFilter(todos, userId).map((elem, idx) => (
            <CheckBox
              key={idx}
              title={elem}
              checked={this.state[elem]}
              checkedColor="#66cc66"
              containerStyle={{backgroundColor: '#fefcf5'}}
          />
          ))}
          <View style={{marginLeft: 135, backgroundColor: '#66cc66', borderRadius: 50, width: 150, marginTop: 10}}>
            <Input
              placeholder=' Add Todo'
              containerStyle={{justifyContent: 'center', height: 35, borderWidth: 0}}
              inputContainerStyle={{borderBottomWidth: 0}}
              leftIcon={
                <Icon
                  name='plus'
                  size={18}
                  color='white'
                />
              }
            />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-chatbubbles" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Howl', { user })}/>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-home" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Dashboard')}/>
          <Button style={styles.navBtns} type="clear" icon={<Ionicons name="ios-person" size={30} color="#aaaaaa"/>} onPress={() => this.props.navigation.navigate('Profile', { user })}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  navBtns: {
    paddingLeft: 30,
    paddingRight: 30,
  },
});

const mapState = state => {
  return {
    user: state.user.user,
    todos: state.todos.todos
  };
};

const mapDispatch = dispatch => {
  return {
    getTodos: (userId, tripName) => dispatch(fetchTodos(userId, tripName))
  }
}
export default connect(
  mapState,
  mapDispatch
)(Todos);
